# import math
# from datetime import timedelta
# from decimal import Decimal
# from django.db import transaction
# from django.utils import timezone
# from Itinerary.mapboxlogic import generate_and_save_safari_map

# # Models
# from Itinerary.models import (
#     MainDayByDayItinerary,
#     SelectedDayRoom,
#     ItineraryPricingSnapshot,
#     ItineraryPricingBreakdownItem,
# )
# from Activities.models import Activity
# from Meal.models import OptionalMeal
# from Accommodation.models import AccommodationSeason, RoomRate
# from Destinations.models import DestinationSeason, DestinationFee
# from Clients.models import ClientRequestInformation
# from Configuration.models import ConfigurationData

# from Clients.utils.residency import is_eac_country, determine_residency


# # ==========================================
# # CONSTANTS
# # ==========================================
# EAC_COUNTRIES = [
#     "Democratic Republic of the Congo", "Tanzania", "Uganda",
#     "South Sudan", "Somalia", "Kenya", "Rwanda", "Burundi"
# ]

# SORT_ORDER_MAP = {
#     "ACCOMMODATION": 1,
#     "CONCESSION": 2,
#     "PARK_FEE": 3,
#     "ACTIVITY": 4,
#     "OPTIONAL_MEAL": 5,
#     "VEHICLE": 1,
#     "COMMISSION": 2,
# }


# # ==========================================
# # HELPER FUNCTIONS
# # ==========================================

# def _get_total_travellers(client_request):
#     """Jumla ya travellers (ADULT + CHILD tu, INFANT haingii)"""
#     return sum(
#         t.number for t in client_request.travellers.all()
#         if t.age_category != "INFANT"
#     )


# def _get_total_adults(client_request):
#     return sum(
#         t.number for t in client_request.travellers.all()
#         if t.age_category == "ADULT"
#     )


# def _get_total_children(client_request):
#     return sum(
#         t.number for t in client_request.travellers.all()
#         if t.age_category == "CHILD"
#     )


# def _get_residency_label(client_request):
#     """
#     Amua residency ya mteja:
#     - RESIDENT: kama is_resident=True kwenye traveller
#     - EAC_MEMBER: kama country iko kwenye EAC list
#     - NON_RESIDENT: vinginevyo
#     """
#     country = getattr(client_request.client_requested, "country", "") or ""
    
#     # Kama traveller yeyote ana is_resident=True
#     has_resident = client_request.travellers.filter(is_resident=True).exists()
#     if has_resident:
#         return "RESIDENT"
    
#     # Kama country iko kwenye EAC
#     if any(c.lower() in country.lower() for c in EAC_COUNTRIES):
#         return "EAC_MEMBER"
    
#     return "NON_RESIDENT"


# def _determine_accommodation_season(accommodation, tour_date):
#     """Tafuta season ya accommodation kulingana na tarehe"""
#     if not tour_date or not accommodation:
#         return None

#     t_month = tour_date.month
#     t_day = tour_date.day
#     tour_md = (t_month, t_day)

#     seasons = AccommodationSeason.objects.filter(accommodation=accommodation)
#     for season in seasons:
#         start_md = (season.start_month, season.start_day)
#         end_md = (season.end_month, season.end_day)

#         if start_md <= end_md:
#             if start_md <= tour_md <= end_md:
#                 return season
#         else:
#             # Season inayovuka mwaka (e.g., Nov-Feb)
#             if tour_md >= start_md or tour_md <= end_md:
#                 return season
#     return None


# def _determine_destination_season(destination, tour_date):
#     """Tafuta season ya destination kulingana na tarehe"""
#     if not tour_date or not destination:
#         return None

#     t_month = tour_date.month
#     t_day = tour_date.day
#     tour_md = (t_month, t_day)

#     seasons = DestinationSeason.objects.filter(destination=destination)
#     for season in seasons:
#         if None in (season.start_month, season.start_day, season.end_month, season.end_day):
#             continue
#         start_md = (season.start_month, season.start_day)
#         end_md = (season.end_month, season.end_day)

#         if start_md <= end_md:
#             if start_md <= tour_md <= end_md:
#                 return season
#         else:
#             if tour_md >= start_md or tour_md <= end_md:
#                 return season
#     return None


# def _get_room_rate(room_type, season):
#     """Pata rate ya chumba kulingana na season (au all-year rate)"""
#     rates = RoomRate.objects.filter(room_type=room_type)
    
#     if season:
#         matched = rates.filter(season=season).first()
#         if matched:
#             return matched
#     # Fallback: all-year rate (season is null)
#     return rates.filter(season__isnull=True).first() or rates.first()


# def _format_date_display(start_date, day_number, nights):
#     """
#     Format date display kwa breakdown item.
#     Mfano: '15 Oct 2026' au '15-17 Oct 2026'
#     """
#     if not start_date:
#         return ""
    
#     day_date = start_date + timedelta(days=day_number - 1)
    
#     if nights <= 1:
#         return day_date.strftime("%d %b %Y")
#     else:
#         end_date = day_date + timedelta(days=nights - 1)
#         if day_date.month == end_date.month:
#             return f"{day_date.day}-{end_date.day} {day_date.strftime('%b %Y')}"
#         else:
#             return f"{day_date.strftime('%d %b')} - {end_date.strftime('%d %b %Y')}"


# def _get_vehicle_daily_rate():
#     """Pata bei ya kodi ya gari kutoka Configuration"""
#     try:
#         config = ConfigurationData.objects.first()
#         if config and config.vehicle_rent_pricing:
#             return Decimal(str(config.vehicle_rent_pricing))
#     except Exception:
#         pass
#     return Decimal("250.00")


# # ==========================================
# # MAIN PRICING ENGINE
# # ==========================================

# def calculate_and_save_pricing_snapshot(itinerary_version, commission_percentage=0, current_user=None):

#     client_request = itinerary_version.client_request

#     commission_pct = Decimal(str(commission_percentage or 0))
#     tour_start_date = client_request.tour_start_date
#     total_travellers = _get_total_travellers(client_request)
#     total_adults = _get_total_adults(client_request)
#     total_children = _get_total_children(client_request)
#     residency = _get_residency_label(client_request)

#     # Running totals
#     sum_accommodation = Decimal("0.00")
#     sum_park_fees = Decimal("0.00")
#     sum_concession = Decimal("0.00")
#     sum_activities = Decimal("0.00")
#     sum_meals = Decimal("0.00")

#     # Collect all breakdown items
#     breakdown_items = []

#     # Calculate TRUE total days from itinerary
#     days = MainDayByDayItinerary.objects.filter(
#         version=itinerary_version 
#     ).select_related(
#         "destination", "accommodation"
#     ).prefetch_related(
#         "selected_rooms__room_type",
#         "day_activities",
#         "day_optionals_meal"
#     ).order_by("day_number")

#     # Calculate total tour days (for vehicle rental)
#     total_tour_days = 0
#     for day in days:
#         end_span = day.day_number + day.nights_number - 1
#         if end_span > total_tour_days:
#             total_tour_days = end_span

#     # ==========================================
#     # LOOP: Process Each Day
#     # ==========================================
#     for day in days:
#         day_num = day.day_number
#         nights = day.nights_number
#         destination = day.destination
#         accommodation = day.accommodation
#         date_display = _format_date_display(tour_start_date, day_num, nights)

#         # Tour date for this day (used for season detection)
#         day_date = tour_start_date + timedelta(days=day_num - 1) if tour_start_date else None

#         # --- A. ACCOMMODATION COST ---
#         if accommodation:
#             acc_season = _determine_accommodation_season(accommodation, day_date)
#             season_name = acc_season.name if acc_season else "All Year"
            
#             selected_rooms = day.selected_rooms.all()
#             for sr in selected_rooms:
#                 rate_obj = _get_room_rate(sr.room_type, acc_season)
#                 if rate_obj:
#                     unit_price = Decimal(str(rate_obj.price_per_night))
#                     qty = Decimal(str(sr.quantity))
#                     line_total = unit_price * qty * Decimal(str(nights))

#                     sum_accommodation += line_total

#                     meal_plan_display = rate_obj.get_meal_plan_display() if hasattr(rate_obj, 'get_meal_plan_display') else rate_obj.meal_plan
                    
#                     breakdown_items.append({
#                         "day_number": day_num,
#                         "date_display": date_display,
#                         "category": "ACCOMMODATION",
#                         "item_title": f"{accommodation.name} — {sr.room_type.name}",
#                         "item_description": f"{meal_plan_display} | {season_name} | {nights} night{'s' if nights > 1 else ''}",
#                         "unit_price": unit_price,
#                         "quantity": qty * Decimal(str(nights)),
#                         "unit_label": "room-night" if nights > 1 else "room",
#                         "line_total": line_total,
#                         "sort_order": SORT_ORDER_MAP["ACCOMMODATION"],
#                     })

#             # --- B. CONCESSION FEE (Inside Park) ---
#             if accommodation.park_status == "InsidePark":
#                 # Adult concession
#                 if total_adults > 0:
#                     if residency in ("RESIDENT", "EAC_MEMBER"):
#                         adult_rate = Decimal(str(accommodation.concession_fee_adult_resident or 0))
#                     else:
#                         adult_rate = Decimal(str(accommodation.concession_fee_adult_non_resident or 0))

#                     if adult_rate > 0:
#                         conc_total = adult_rate * Decimal(str(total_adults)) * Decimal(str(nights))
#                         sum_concession += conc_total
#                         breakdown_items.append({
#                             "day_number": day_num,
#                             "date_display": date_display,
#                             "category": "CONCESSION",
#                             "item_title": f"{accommodation.name} — Adult Concession",
#                             "item_description": f"Inside Park | {residency.replace('_', ' ')} | {nights} night{'s' if nights > 1 else ''}",
#                             "unit_price": adult_rate,
#                             "quantity": Decimal(str(total_adults * nights)),
#                             "unit_label": "pax-night",
#                             "line_total": conc_total,
#                             "sort_order": SORT_ORDER_MAP["CONCESSION"],
#                         })

#                 # Child concession
#                 if total_children > 0:
#                     if residency in ("RESIDENT", "EAC_MEMBER"):
#                         child_rate = Decimal(str(accommodation.concession_fee_child_resident or 0))
#                     else:
#                         child_rate = Decimal(str(accommodation.concession_fee_child_non_resident or 0))

#                     if child_rate > 0:
#                         conc_total = child_rate * Decimal(str(total_children)) * Decimal(str(nights))
#                         sum_concession += conc_total
#                         breakdown_items.append({
#                             "day_number": day_num,
#                             "date_display": date_display,
#                             "category": "CONCESSION",
#                             "item_title": f"{accommodation.name} — Child Concession",
#                             "item_description": f"Inside Park | {residency.replace('_', ' ')} | {nights} night{'s' if nights > 1 else ''}",
#                             "unit_price": child_rate,
#                             "quantity": Decimal(str(total_children * nights)),
#                             "unit_label": "pax-night",
#                             "line_total": conc_total,
#                             "sort_order": SORT_ORDER_MAP["CONCESSION"],
#                         })

#         # --- C. PARK / RESCUE FEES ---
#         if destination and destination.destination_type in ("Park", "Mountain"):
#             dest_season = _determine_destination_season(destination, day_date)
#             season_name = dest_season.season_name if dest_season else "All Year"

#             # Map residency to DestinationFee label
#             fee_residency = residency
#             if residency == "EAC_MEMBER":
#                 fee_residency = "EAC_MEMBER"

#             for fee_category, cat_label in [("ParkFee", "Park Entry Fee"), ("RescueFee", "Rescue Fee")]:
#                 # Try to find fee for specific season first, then ALL_YEAR
#                 fee_obj = None
#                 if dest_season:
#                     fee_obj = DestinationFee.objects.filter(
#                         destination=destination,
#                         seasons=dest_season,
#                         fee_category=fee_category,
#                         residency_label=fee_residency
#                     ).first()
                
#                 if not fee_obj:
#                     fee_obj = DestinationFee.objects.filter(
#                         destination=destination,
#                         seasons__season_name__iexact="ALL_YEAR",
#                         fee_category=fee_category,
#                         residency_label=fee_residency
#                     ).first()

#                 if fee_obj:
#                     # Adult fee
#                     if total_adults > 0 and fee_obj.adult_fee:
#                         adult_fee = Decimal(str(fee_obj.adult_fee))
#                         fee_total = adult_fee * Decimal(str(total_adults)) * Decimal(str(nights))
#                         sum_park_fees += fee_total
#                         breakdown_items.append({
#                             "day_number": day_num,
#                             "date_display": date_display,
#                             "category": "PARK_FEE",
#                             "item_title": f"{destination.name} — Adult {cat_label}",
#                             "item_description": f"{season_name} | {residency.replace('_', ' ')} | {nights} night{'s' if nights > 1 else ''}",
#                             "unit_price": adult_fee,
#                             "quantity": Decimal(str(total_adults * nights)),
#                             "unit_label": "pax-night",
#                             "line_total": fee_total,
#                             "sort_order": SORT_ORDER_MAP["PARK_FEE"],
#                         })

#                     # Child fee
#                     if total_children > 0 and fee_obj.child_fee:
#                         child_fee = Decimal(str(fee_obj.child_fee))
#                         fee_total = child_fee * Decimal(str(total_children)) * Decimal(str(nights))
#                         sum_park_fees += fee_total
#                         breakdown_items.append({
#                             "day_number": day_num,
#                             "date_display": date_display,
#                             "category": "PARK_FEE",
#                             "item_title": f"{destination.name} — Child {cat_label}",
#                             "item_description": f"{season_name} | {residency.replace('_', ' ')} | {nights} night{'s' if nights > 1 else ''}",
#                             "unit_price": child_fee,
#                             "quantity": Decimal(str(total_children * nights)),
#                             "unit_label": "pax-night",
#                             "line_total": fee_total,
#                             "sort_order": SORT_ORDER_MAP["PARK_FEE"],
#                         })

#         # --- D. ACTIVITIES (Optional + Transit) ---
#         activities = day.day_activities.all()
#         for act in activities:
#             act_title = act.activity_type.title if act.activity_type else "Activity"

#             # Optional activity price
#             if act.is_optional and act.optional_activity_price:
#                 opt_price = Decimal(str(act.optional_activity_price))
#                 sum_activities += opt_price
#                 breakdown_items.append({
#                     "day_number": day_num,
#                     "date_display": date_display,
#                     "category": "ACTIVITY",
#                     "item_title": f"{act_title} (Optional)",
#                     "item_description": f"{act.get_moment_display() if hasattr(act, 'get_moment_display') else act.moment} | {act.price_per or 'Per Group'}",
#                     "unit_price": opt_price,
#                     "quantity": Decimal("1"),
#                     "unit_label": "total",
#                     "line_total": opt_price,
#                     "sort_order": SORT_ORDER_MAP["ACTIVITY"],
#                 })

#             # Transit fee
#             if act.transit_fee_included and act.transit_fee:
#                 transit = Decimal(str(act.transit_fee))
#                 sum_activities += transit
#                 breakdown_items.append({
#                     "day_number": day_num,
#                     "date_display": date_display,
#                     "category": "ACTIVITY",
#                     "item_title": f"{act_title} — Transit Fee",
#                     "item_description": f"{act.transit_fee_per or 'Per Group'}",
#                     "unit_price": transit,
#                     "quantity": Decimal("1"),
#                     "unit_label": "total",
#                     "line_total": transit,
#                     "sort_order": SORT_ORDER_MAP["ACTIVITY"],
#                 })

#         # --- E. OPTIONAL MEALS ---
#         optional_meals = day.day_optionals_meal.all()
#         for meal in optional_meals:
#             if meal.is_optional and meal.price:
#                 meal_price = Decimal(str(meal.price))
#                 meal_total = meal_price * Decimal(str(total_travellers))
#                 sum_meals += meal_total
#                 meal_name = meal.meal.name if meal.meal else "Optional Meal"
#                 breakdown_items.append({
#                     "day_number": day_num,
#                     "date_display": date_display,
#                     "category": "OPTIONAL_MEAL",
#                     "item_title": meal_name,
#                     "item_description": f"Optional meal for {total_travellers} pax",
#                     "unit_price": meal_price,
#                     "quantity": Decimal(str(total_travellers)),
#                     "unit_label": "pax",
#                     "line_total": meal_total,
#                     "sort_order": SORT_ORDER_MAP["OPTIONAL_MEAL"],
#                 })

#     # ==========================================
#     # VEHICLE RENTAL (All Days)
#     # ==========================================
#     vehicles_needed = max(1, math.ceil(total_travellers / 6)) if total_travellers > 0 else 1
#     daily_rate = _get_vehicle_daily_rate()
#     vehicle_total = Decimal(str(vehicles_needed)) * Decimal(str(total_tour_days)) * daily_rate

#     breakdown_items.append({
#         "day_number": 0,
#         "date_display": f"All {total_tour_days} Days",
#         "category": "VEHICLE",
#         "item_title": f"4WD Safari Vehicle (Land Cruiser)",
#         "item_description": f"{vehicles_needed} vehicle{'s' if vehicles_needed > 1 else ''} × {total_tour_days} days",
#         "unit_price": daily_rate,
#         "quantity": Decimal(str(vehicles_needed * total_tour_days)),
#         "unit_label": "vehicle-day",
#         "line_total": vehicle_total,
#         "sort_order": SORT_ORDER_MAP["VEHICLE"],
#     })

#     # ==========================================
#     # CALCULATE TOTALS
#     # ==========================================
#     subtotal_net = (
#         sum_accommodation + sum_park_fees + sum_concession +
#         vehicle_total + sum_activities + sum_meals
#     )

#     commission_amount = (subtotal_net * commission_pct) / Decimal("100")
#     grand_total = subtotal_net + commission_amount
#     price_per_person = (grand_total / Decimal(str(total_travellers))) if total_travellers > 0 else Decimal("0.00")

#     # ==========================================
#     # SAVE TO DATABASE (Atomic)
#     # ==========================================
#     with transaction.atomic():
#         # 1. Delete old snapshot (Overwrite - no versioning)
#         ItineraryPricingSnapshot.objects.filter(version=itinerary_version).delete()

#         # 2. Create new snapshot
#         snapshot = ItineraryPricingSnapshot.objects.create(
#             version=itinerary_version,
#             total_accommodation=sum_accommodation,
#             total_park_fees=sum_park_fees,
#             total_concession_fees=sum_concession,
#             total_transport_vehicle=vehicle_total,
#             total_activities=sum_activities,
#             total_optional_meals=sum_meals,
#             subtotal_net=subtotal_net,
#             commission_percentage=commission_pct,
#             commission_amount=commission_amount,
#             grand_total=grand_total,
#             price_per_person=price_per_person,
#             generated_by=current_user,
#         )

#         # 3. Create breakdown items in bulk
#         items_to_create = []
#         for item_data in breakdown_items:
#             items_to_create.append(
#                 ItineraryPricingBreakdownItem(snapshot=snapshot, **item_data)
#             )
        
#         if items_to_create:
#             ItineraryPricingBreakdownItem.objects.bulk_create(items_to_create)


#         day_queryset = MainDayByDayItinerary.objects.filter(
#             version=itinerary_version
#         ).select_related("destination").order_by("day_number")

#         map_success = generate_and_save_safari_map(snapshot=snapshot, days_queryset=day_queryset)

#         if map_success:
#             print("✅ Safari map generated and saved!")
#         else:
#             print("⚠️ Map generation failed, but itinerary saved successfully")

#         # 4. Update ClientRequestInformation summary fields
#         client_request.safari_grand_total = grand_total
#         client_request.price_per_personal = price_per_person
#         client_request.save(update_fields=["safari_grand_total", "price_per_personal"])

#     return snapshot








import math
from datetime import timedelta
from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from Itinerary.mapboxlogic import generate_and_save_safari_map

from Itinerary.models import (
    MainDayByDayItinerary,
    SelectedDayRoom,
    ItineraryPricingSnapshot,
    ItineraryPricingBreakdownItem,
)
from Activities.models import Activity
from Meal.models import OptionalMeal
from Accommodation.models import AccommodationSeason, RoomRate
from Destinations.models import DestinationSeason, DestinationFee
from Clients.models import ClientRequestInformation
from Configuration.models import ConfigurationData

from Clients.utils.residency import is_eac_country, determine_residency


SORT_ORDER_MAP = {
    "ACCOMMODATION": 1, "CONCESSION": 2, "PARK_FEE": 3,
    "ACTIVITY": 4, "OPTIONAL_MEAL": 5,
    "VEHICLE": 1, "COMMISSION": 2,
}


# ==========================================
# HELPERS (badilisha zote kutumia per-traveller)
# ==========================================

def _get_traveller_totals(client_request):
    """Return (total, adults, children) — INFANT excluded."""
    total = 0
    adults = 0
    children = 0
    for t in client_request.travellers.all():
        if t.age_category == "INFANT":
            continue
        n = getattr(t, "number", 1) or 1
        total += n
        if t.age_category == "ADULT":
            adults += n
        elif t.age_category == "CHILD":
            children += n
    return total, adults, children


def _get_vehicles_needed(total_travellers):
    if total_travellers <= 0:
        return 1
    return max(1, math.ceil(total_travellers / 6))


def _determine_accommodation_season(accommodation, tour_date):
    if not tour_date or not accommodation:
        return None
    tour_md = (tour_date.month, tour_date.day)
    for season in AccommodationSeason.objects.filter(accommodation=accommodation):
        start = (season.start_month, season.start_day)
        end = (season.end_month, season.end_day)
        if start <= end:
            if start <= tour_md <= end:
                return season
        else:
            if tour_md >= start or tour_md <= end:
                return season
    return None


def _determine_destination_season(destination, tour_date):
    if not tour_date or not destination:
        return None
    tour_md = (tour_date.month, tour_date.day)
    for season in DestinationSeason.objects.filter(destination=destination):
        if None in (season.start_month, season.start_day, season.end_month, season.end_day):
            continue
        start = (season.start_month, season.start_day)
        end = (season.end_month, season.end_day)
        if start <= end:
            if start <= tour_md <= end:
                return season
        else:
            if tour_md >= start or tour_md <= end:
                return season
    return None


def _get_room_rate(room_type, season):
    rates = RoomRate.objects.filter(room_type=room_type)
    if season:
        matched = rates.filter(season=season).first()
        if matched:
            return matched
    return rates.filter(season__isnull=True).first() or rates.first()


def _format_date_display(start_date, day_number, nights):
    if not start_date:
        return ""
    day_date = start_date + timedelta(days=day_number - 1)
    if nights <= 1:
        return day_date.strftime("%d %b %Y")
    end_date = day_date + timedelta(days=nights - 1)
    if day_date.month == end_date.month:
        return f"{day_date.day}-{end_date.day} {day_date.strftime('%b %Y')}"
    return f"{day_date.strftime('%d %b')} - {end_date.strftime('%d %b %Y')}"


def _get_vehicle_daily_rate(client_request=None):
    """
    Tumia SAME source ya frontend:
      1. client_request.vehicle_rent_pricing (kama ipo per-client)
      2. ConfigurationData fallback
    """
    # Kama client ana vehicle_rent_pricing specific — itumie (kama frontend)
    if client_request and hasattr(client_request, "vehicle_rent_pricing"):
        per_client = getattr(client_request.vehicle_rent_pricing, "vehicle_rent_pricing", None)
        if per_client:
            return Decimal(str(per_client))
    try:
        config = ConfigurationData.objects.first()
        if config and config.vehicle_rent_pricing:
            return Decimal(str(config.vehicle_rent_pricing))
    except Exception:
        pass
    return Decimal("250.00")


# ==========================================
# ACTIVITY PRICE ENGINE (matches frontend)
# ==========================================

def _compute_activity_line_total(act, total_travellers, vehicles_needed):
    """
    Activity total = base_price × multiplier_by_price_per
    Matches frontend logic exactly.
    """
    base = Decimal("0")
    if act.is_optional and act.optional_activity_price:
        base = Decimal(str(act.optional_activity_price))
    elif act.optional_activity_price:
        base = Decimal(str(act.optional_activity_price))

    if base <= 0:
        return Decimal("0"), ""

    per = (act.price_per or "PerGroup")
    if per == "PerPersonal":
        multiplier = Decimal(str(total_travellers))
    elif per == "PerVehicle":
        multiplier = Decimal(str(vehicles_needed))
    else:  # PerGroup
        multiplier = Decimal("1")

    return base * multiplier, f"{per} × {int(multiplier)}"


def _compute_transit_line_total(act, total_travellers, vehicles_needed):
    if not (act.transit_fee_included and act.transit_fee):
        return Decimal("0"), ""

    base = Decimal(str(act.transit_fee))
    per = (act.transit_fee_per or "Pax")

    if per == "Pax":
        multiplier = Decimal(str(total_travellers))
    elif per == "Vehicle":
        multiplier = Decimal(str(vehicles_needed))
    else:  # Group
        multiplier = Decimal("1")

    return base * multiplier, f"{per} × {int(multiplier)}"


# ==========================================
# MAIN ENGINE
# ==========================================

def calculate_and_save_pricing_snapshot(itinerary_version, commission_percentage=0, current_user=None):

    client_request = itinerary_version.client_request
    commission_pct = Decimal(str(commission_percentage or 0))
    tour_start_date = client_request.tour_start_date

    total_travellers, total_adults, total_children = _get_traveller_totals(client_request)
    vehicles_needed = _get_vehicles_needed(total_travellers)

    # Totals (per-traveller-aware)
    sum_accommodation = Decimal("0.00")
    sum_park_fees = Decimal("0.00")
    sum_concession = Decimal("0.00")
    sum_activities = Decimal("0.00")
    sum_meals = Decimal("0.00")
    breakdown_items = []

    # Fetch days
    days = MainDayByDayItinerary.objects.filter(
        version=itinerary_version
    ).select_related(
        "destination", "accommodation"
    ).prefetch_related(
        "selected_rooms__room_type",
        "day_activities",
        "day_optionals_meal",
    ).order_by("day_number")

    # Total tour days (for vehicle)
    total_tour_days = 0
    for day in days:
        end_span = day.day_number + day.nights_number - 1
        if end_span > total_tour_days:
            total_tour_days = end_span

    # Split travellers by residency for park/concession
    traveller_buckets = {"RESIDENT": {"adults": 0, "children": 0, "travellers": []},
                         "EAC_MEMBER": {"adults": 0, "children": 0, "travellers": []},
                         "NON_RESIDENT": {"adults": 0, "children": 0, "travellers": []}}

    for t in client_request.travellers.all():
        if t.age_category == "INFANT":
            continue
        n = getattr(t, "number", 1) or 1
        residency = determine_residency(t, client_request)
        if residency not in traveller_buckets:
            residency = "NON_RESIDENT"
        if t.age_category == "ADULT":
            traveller_buckets[residency]["adults"] += n
        elif t.age_category == "CHILD":
            traveller_buckets[residency]["children"] += n

    # -------------------------------------
    # LOOP
    # -------------------------------------
    for day in days:
        day_num = day.day_number
        nights = day.nights_number
        destination = day.destination
        accommodation = day.accommodation
        date_display = _format_date_display(tour_start_date, day_num, nights)
        day_date = (tour_start_date + timedelta(days=day_num - 1)) if tour_start_date else None

        # --- A. ACCOMMODATION ---
        if accommodation:
            acc_season = _determine_accommodation_season(accommodation, day_date)
            season_name = acc_season.name if acc_season else "All Year"

            for sr in day.selected_rooms.all():
                rate_obj = _get_room_rate(sr.room_type, acc_season)
                if not rate_obj:
                    continue
                unit_price = Decimal(str(rate_obj.price_per_night))
                qty = Decimal(str(sr.quantity))
                line_total = unit_price * qty * Decimal(str(nights))
                sum_accommodation += line_total

                meal_plan = (
                    rate_obj.get_meal_plan_display()
                    if hasattr(rate_obj, "get_meal_plan_display")
                    else rate_obj.meal_plan
                )
                breakdown_items.append({
                    "day_number": day_num,
                    "date_display": date_display,
                    "category": "ACCOMMODATION",
                    "item_title": f"{accommodation.name} — {sr.room_type.name}",
                    "item_description": f"{meal_plan} | {season_name} | {nights} night{'s' if nights > 1 else ''}",
                    "unit_price": unit_price,
                    "quantity": qty * Decimal(str(nights)),
                    "unit_label": "room-night" if nights > 1 else "room",
                    "line_total": line_total,
                    "sort_order": SORT_ORDER_MAP["ACCOMMODATION"],
                })

            # --- B. CONCESSION (per residency bucket) ---
            if accommodation.park_status == "InsidePark":
                for residency_label, bucket in traveller_buckets.items():
                    is_resident_rate = residency_label in ("RESIDENT", "EAC_MEMBER")
                    adult_rate = Decimal(str(
                        (accommodation.concession_fee_adult_resident if is_resident_rate
                         else accommodation.concession_fee_adult_non_resident) or 0
                    ))
                    child_rate = Decimal(str(
                        (accommodation.concession_fee_child_resident if is_resident_rate
                         else accommodation.concession_fee_child_non_resident) or 0
                    ))

                    if bucket["adults"] > 0 and adult_rate > 0:
                        conc = adult_rate * Decimal(str(bucket["adults"])) * Decimal(str(nights))
                        sum_concession += conc
                        breakdown_items.append({
                            "day_number": day_num, "date_display": date_display,
                            "category": "CONCESSION",
                            "item_title": f"{accommodation.name} — Adult Concession",
                            "item_description": f"Inside Park | {residency_label} | {nights} night{'s' if nights > 1 else ''}",
                            "unit_price": adult_rate,
                            "quantity": Decimal(str(bucket["adults"] * nights)),
                            "unit_label": "pax-night",
                            "line_total": conc,
                            "sort_order": SORT_ORDER_MAP["CONCESSION"],
                        })

                    if bucket["children"] > 0 and child_rate > 0:
                        conc = child_rate * Decimal(str(bucket["children"])) * Decimal(str(nights))
                        sum_concession += conc
                        breakdown_items.append({
                            "day_number": day_num, "date_display": date_display,
                            "category": "CONCESSION",
                            "item_title": f"{accommodation.name} — Child Concession",
                            "item_description": f"Inside Park | {residency_label} | {nights} night{'s' if nights > 1 else ''}",
                            "unit_price": child_rate,
                            "quantity": Decimal(str(bucket["children"] * nights)),
                            "unit_label": "pax-night",
                            "line_total": conc,
                            "sort_order": SORT_ORDER_MAP["CONCESSION"],
                        })

        # --- C. PARK / RESCUE FEES ---
        if destination and destination.destination_type in ("Park", "Mountain"):
            dest_season = _determine_destination_season(destination, day_date)
            season_name = dest_season.season_name if dest_season else "All Year"

            for fee_category, cat_label in [("ParkFee", "Park Entry Fee"), ("RescueFee", "Rescue Fee")]:
                for residency_label, bucket in traveller_buckets.items():
                    if bucket["adults"] == 0 and bucket["children"] == 0:
                        continue

                    # Find fee obj — specific season, fallback to ALL_YEAR
                    fee_obj = None
                    if dest_season:
                        fee_obj = DestinationFee.objects.filter(
                            destination=destination,
                            seasons=dest_season,
                            fee_category=fee_category,
                            residency_label=residency_label,
                        ).first()
                    if not fee_obj:
                        fee_obj = DestinationFee.objects.filter(
                            destination=destination,
                            seasons__season_name__iexact="ALL_YEAR",
                            fee_category=fee_category,
                            residency_label=residency_label,
                        ).first()
                    if not fee_obj:
                        continue

                    if bucket["adults"] > 0 and fee_obj.adult_fee:
                        adult_fee = Decimal(str(fee_obj.adult_fee))
                        fee_total = adult_fee * Decimal(str(bucket["adults"])) * Decimal(str(nights))
                        sum_park_fees += fee_total
                        breakdown_items.append({
                            "day_number": day_num, "date_display": date_display,
                            "category": "PARK_FEE",
                            "item_title": f"{destination.name} — Adult {cat_label}",
                            "item_description": f"{season_name} | {residency_label} | {nights} night{'s' if nights > 1 else ''}",
                            "unit_price": adult_fee,
                            "quantity": Decimal(str(bucket["adults"] * nights)),
                            "unit_label": "pax-night",
                            "line_total": fee_total,
                            "sort_order": SORT_ORDER_MAP["PARK_FEE"],
                        })

                    if bucket["children"] > 0 and fee_obj.child_fee:
                        child_fee = Decimal(str(fee_obj.child_fee))
                        fee_total = child_fee * Decimal(str(bucket["children"])) * Decimal(str(nights))
                        sum_park_fees += fee_total
                        breakdown_items.append({
                            "day_number": day_num, "date_display": date_display,
                            "category": "PARK_FEE",
                            "item_title": f"{destination.name} — Child {cat_label}",
                            "item_description": f"{season_name} | {residency_label} | {nights} night{'s' if nights > 1 else ''}",
                            "unit_price": child_fee,
                            "quantity": Decimal(str(bucket["children"] * nights)),
                            "unit_label": "pax-night",
                            "line_total": fee_total,
                            "sort_order": SORT_ORDER_MAP["PARK_FEE"],
                        })

        # --- D. ACTIVITIES ---
        for act in day.day_activities.all():
            act_title = act.activity_type.title if act.activity_type else "Activity"

            # Optional activity — WITH price_per multiplier
            if act.is_optional and act.optional_activity_price:
                line_total, per_desc = _compute_activity_line_total(
                    act, total_travellers, vehicles_needed
                )
                if line_total > 0:
                    sum_activities += line_total
                    breakdown_items.append({
                        "day_number": day_num, "date_display": date_display,
                        "category": "ACTIVITY",
                        "item_title": f"{act_title} (Optional)",
                        "item_description": f"{act.get_moment_display() if hasattr(act, 'get_moment_display') else act.moment} | {per_desc}",
                        "unit_price": Decimal(str(act.optional_activity_price)),
                        "quantity": Decimal(str(int(line_total / Decimal(str(act.optional_activity_price))))) if act.optional_activity_price else Decimal("1"),
                        "unit_label": "total",
                        "line_total": line_total,
                        "sort_order": SORT_ORDER_MAP["ACTIVITY"],
                    })

            # Transit — WITH transit_fee_per multiplier
            if act.transit_fee_included and act.transit_fee:
                line_total, per_desc = _compute_transit_line_total(
                    act, total_travellers, vehicles_needed
                )
                if line_total > 0:
                    sum_activities += line_total
                    breakdown_items.append({
                        "day_number": day_num, "date_display": date_display,
                        "category": "ACTIVITY",
                        "item_title": f"{act_title} — Transit Fee",
                        "item_description": per_desc,
                        "unit_price": Decimal(str(act.transit_fee)),
                        "quantity": Decimal(str(int(line_total / Decimal(str(act.transit_fee))))) if act.transit_fee else Decimal("1"),
                        "unit_label": "total",
                        "line_total": line_total,
                        "sort_order": SORT_ORDER_MAP["ACTIVITY"],
                    })

        # --- E. OPTIONAL MEALS ---
        for meal in day.day_optionals_meal.all():
            if not (meal.is_optional and meal.price):
                continue
            meal_price = Decimal(str(meal.price))
            meal_total = meal_price * Decimal(str(total_travellers))
            sum_meals += meal_total
            meal_name = meal.meal.name if meal.meal else "Optional Meal"
            breakdown_items.append({
                "day_number": day_num, "date_display": date_display,
                "category": "OPTIONAL_MEAL",
                "item_title": meal_name,
                "item_description": f"Optional meal for {total_travellers} pax",
                "unit_price": meal_price,
                "quantity": Decimal(str(total_travellers)),
                "unit_label": "pax",
                "line_total": meal_total,
                "sort_order": SORT_ORDER_MAP["OPTIONAL_MEAL"],
            })

    # ==========================================
    # VEHICLE (all days)
    # ==========================================
    daily_rate = _get_vehicle_daily_rate(client_request)   # ← same source as frontend
    vehicle_total = (
        Decimal(str(vehicles_needed))
        * Decimal(str(total_tour_days))
        * daily_rate
    )
    breakdown_items.append({
        "day_number": 0,
        "date_display": f"All {total_tour_days} Days",
        "category": "VEHICLE",
        "item_title": "4WD Safari Vehicle (Land Cruiser)",
        "item_description": f"{vehicles_needed} vehicle{'s' if vehicles_needed > 1 else ''} × {total_tour_days} days",
        "unit_price": daily_rate,
        "quantity": Decimal(str(vehicles_needed * total_tour_days)),
        "unit_label": "vehicle-day",
        "line_total": vehicle_total,
        "sort_order": SORT_ORDER_MAP["VEHICLE"],
    })

    # ==========================================
    # TOTALS
    # ==========================================
    subtotal_net = (
        sum_accommodation + sum_park_fees + sum_concession
        + vehicle_total + sum_activities + sum_meals
    )
    commission_amount = (subtotal_net * commission_pct) / Decimal("100")
    grand_total = subtotal_net + commission_amount
    price_per_person = (
        (grand_total / Decimal(str(total_travellers)))
        if total_travellers > 0 else Decimal("0.00")
    )

    # ==========================================
    # SAVE (atomic)
    # ==========================================
    with transaction.atomic():
        ItineraryPricingSnapshot.objects.filter(version=itinerary_version).delete()

        snapshot = ItineraryPricingSnapshot.objects.create(
            version=itinerary_version,
            total_accommodation=sum_accommodation,
            total_park_fees=sum_park_fees,
            total_concession_fees=sum_concession,
            total_transport_vehicle=vehicle_total,
            total_activities=sum_activities,
            total_optional_meals=sum_meals,
            subtotal_net=subtotal_net,
            commission_percentage=commission_pct,
            commission_amount=commission_amount,
            grand_total=grand_total,
            price_per_person=price_per_person,
            generated_by=current_user,
        )

        if breakdown_items:
            ItineraryPricingBreakdownItem.objects.bulk_create([
                ItineraryPricingBreakdownItem(snapshot=snapshot, **item)
                for item in breakdown_items
            ])

        day_queryset = MainDayByDayItinerary.objects.filter(
            version=itinerary_version
        ).select_related("destination").order_by("day_number")

        try:
            generate_and_save_safari_map(snapshot=snapshot, days_queryset=day_queryset)
        except Exception as e:
            print(f"⚠️ Map generation failed: {e}")

        client_request.safari_grand_total = grand_total
        client_request.price_per_personal = price_per_person
        client_request.save(update_fields=["safari_grand_total", "price_per_personal"])

    return snapshot

