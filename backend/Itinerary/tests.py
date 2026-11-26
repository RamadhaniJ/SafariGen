"""
Characterisation tests for the pricing engine (Itinerary/pricing.py).

These tests pin down what calculate_and_save_pricing_snapshot() returns TODAY,
including behaviour we already know is questionable (marked "CURRENT
BEHAVIOUR"). They are a safety net: when pricing is changed on purpose, the
affected test should be updated in the same change, with the reason.

Run with:
    cd backend && .venv/bin/python manage.py test Itinerary.tests
"""

from datetime import date
from decimal import Decimal
from unittest.mock import patch

from django.test import TestCase

from Accommodation.models import (
    Accommodation,
    AccommodationRoomType,
    AccommodationSeason,
    RoomRate,
)
from Activities.models import Activity, ActivityType
from Clients.models import ClientInformation, ClientRequestInformation, Traveller
from Clients.utils.residency import determine_residency, is_eac_country
from Configuration.models import ConfigurationData
from Destinations.models import Destination, DestinationFee, DestinationSeason
from Itinerary.models import (
    ItineraryPricingSnapshot,
    ItineraryVersion,
    MainDayByDayItinerary,
    SelectedDayRoom,
)
from Itinerary.pricing import calculate_and_save_pricing_snapshot
from Meal.models import MealPlan, OptionalMeal

D = Decimal


# ---------------------------------------------------------------------------
# Small builders so each test only states what matters to it
# ---------------------------------------------------------------------------

_counter = {"n": 0}


def _uid():
    _counter["n"] += 1
    return _counter["n"]


def make_client_request(country="United States", start=date(2026, 7, 10), travellers=()):
    """travellers: iterable of (age_category, number, is_resident)."""
    client = ClientInformation.objects.create(
        email=f"guest{_uid()}@example.com",
        salutation="Mr",
        first_name="Test",
        last_name="Guest",
        country=country,
    )
    req = ClientRequestInformation.objects.create(
        client_requested=client,
        tour_title="Test Safari",
        tour_type="Private",
        country_visited="Tanzania",
        tour_start_date=start,
    )
    for age, number, resident in travellers:
        Traveller.objects.create(request=req, age_category=age, number=number, is_resident=resident)
    return req


def make_version(client_request):
    return ItineraryVersion.objects.create(client_request=client_request, version_number=1)


def make_destination(name, kind):
    return Destination.objects.create(name=name, destination_type=kind, featured_img="x.jpg")


def make_accommodation(name, inside_park=False, conc=(0, 0, 0, 0), destination=None):
    """conc = (adult_non_resident, child_non_resident, adult_resident, child_resident)."""
    kwargs = {}
    if inside_park:
        kwargs = dict(
            concession_fee_adult_non_resident=conc[0],
            concession_fee_child_non_resident=conc[1],
            concession_fee_adult_resident=conc[2],
            concession_fee_child_resident=conc[3],
        )
    return Accommodation.objects.create(
        name=name,
        destination=destination,
        tag_label="Lodge",
        park_status="InsidePark" if inside_park else "OutsidePark",
        featured_image="x.jpg",
        **kwargs,
    )


def make_acc_season(acc, name, start, end):
    """start/end are (day, month)."""
    return AccommodationSeason.objects.create(
        accommodation=acc, name=name,
        start_day=start[0], start_month=start[1],
        end_day=end[0], end_month=end[1],
    )


def make_room(acc, name, rates):
    """rates: iterable of (season_or_None, price)."""
    room = AccommodationRoomType.objects.create(accommodation=acc, name=name)
    for season, price in rates:
        RoomRate.objects.create(room_type=room, season=season, meal_plan="FB", price_per_night=price)
    return room


def make_dest_season(dest, name, start=None, end=None):
    return DestinationSeason.objects.create(
        destination=dest, season_name=name,
        start_day=start[0] if start else None, start_month=start[1] if start else None,
        end_day=end[0] if end else None, end_month=end[1] if end else None,
    )


def make_fee(dest, season, category, residency, adult, child=None):
    return DestinationFee.objects.create(
        destination=dest, seasons=season, fee_category=category,
        residency_label=residency, adult_fee=adult, child_fee=child,
    )


def make_day(version, day_number, nights=1, destination=None, accommodation=None, rooms=()):
    day = MainDayByDayItinerary.objects.create(
        version=version, day_number=day_number, nights_number=nights,
        destination=destination, accommodation=accommodation,
    )
    for room, qty in rooms:
        SelectedDayRoom.objects.create(day_itinerary=day, room_type=room, quantity=qty)
    return day


_activity_type = {}


def make_activity(day, title="Game Drive", **kwargs):
    if title not in _activity_type or not ActivityType.objects.filter(pk=_activity_type[title].pk).exists():
        _activity_type[title] = ActivityType.objects.create(title=title)
    kwargs.setdefault("moment", "5_FULL_DAY")
    return Activity.objects.create(day_itinerary=day, activity_type=_activity_type[title], **kwargs)


def make_meal(day, name="Bush Dinner", is_optional=True, price=0):
    plan = MealPlan.objects.create(name=name)
    return OptionalMeal.objects.create(day_optional_meal=day, meal=plan, is_optional=is_optional, price=price)


class PricingTestCase(TestCase):
    """Base class: never call Mapbox from tests."""

    def setUp(self):
        patcher = patch("Itinerary.pricing.generate_and_save_safari_map", return_value=True)
        self.mock_map = patcher.start()
        self.addCleanup(patcher.stop)

    def price(self, version, commission=0):
        snap = calculate_and_save_pricing_snapshot(version, commission_percentage=commission)
        snap.refresh_from_db()  # read back the stored, rounded values
        return snap

    def items(self, snap, category=None):
        qs = snap.breakdown_items.all()
        if category:
            qs = qs.filter(category=category)
        return list(qs)


# ---------------------------------------------------------------------------
# 1. A complete safari, totals checked line by line
# ---------------------------------------------------------------------------

class FullItineraryTests(PricingTestCase):
    """
    3 paying guests (2 adults + 1 child, non-resident, US) + 1 infant (free).
    Day 1   Arusha (City)       Hotel outside park, Double x1, 1 night
    Day 2-3 Serengeti (Park)    Lodge inside park, Double x1 + Single x1, 2 nights,
                                activities and meals
    Day 4   Arusha (City)       no accommodation (departure)
    Vehicle rate from ConfigurationData = 300/day, 10% commission.
    """

    def setUp(self):
        super().setUp()
        ConfigurationData.objects.create(vehicle_rent_pricing=D("300"))

        req = make_client_request(travellers=[
            ("ADULT", 2, False), ("CHILD", 1, False), ("INFANT", 1, False),
        ])
        self.req = req
        self.version = make_version(req)

        arusha = make_destination("Arusha", "City")
        serengeti = make_destination("Serengeti", "Park")

        hotel = make_accommodation("Arusha Hotel")
        hotel_double = make_room(hotel, "Double", [(None, D("120"))])

        lodge = make_accommodation("Serengeti Lodge", inside_park=True, conc=(70, 20, 10, 5))
        high = make_acc_season(lodge, "High", (1, 6), (31, 10))
        lodge_double = make_room(lodge, "Double", [(high, D("400")), (None, D("300"))])
        lodge_single = make_room(lodge, "Single", [(high, D("250"))])

        s_high = make_dest_season(serengeti, "High", (1, 7), (30, 9))
        s_all = make_dest_season(serengeti, "ALL_YEAR")
        make_fee(serengeti, s_high, "ParkFee", "NON_RESIDENT", D("82"), D("23.60"))
        make_fee(serengeti, s_all, "ParkFee", "NON_RESIDENT", D("70"), D("20"))   # not used: High wins
        make_fee(serengeti, s_all, "RescueFee", "NON_RESIDENT", D("1"), D("1"))   # fallback to ALL_YEAR

        make_day(self.version, 1, 1, arusha, hotel, rooms=[(hotel_double, 1)])
        day2 = make_day(self.version, 2, 2, serengeti, lodge, rooms=[(lodge_double, 1), (lodge_single, 1)])
        make_day(self.version, 4, 1, arusha, None)

        make_activity(day2, "Game Drive", is_optional=True, optional_activity_price=50, price_per="PerPersonal")
        make_activity(day2, "Balloon", is_optional=True, optional_activity_price=600, price_per="PerVehicle")
        make_activity(day2, "Included Walk", is_optional=False, optional_activity_price=99, price_per="PerPersonal")
        make_activity(day2, "Transfer", transit_fee_included=True, transit_fee=30, transit_fee_per="Pax")
        make_activity(day2, "Crater Transit", transit_fee_included=True, transit_fee=15, transit_fee_per="Vehicle")
        make_meal(day2, "Bush Dinner", is_optional=True, price=45)
        make_meal(day2, "Included Lunch", is_optional=False, price=10)

        self.snap = self.price(self.version, commission=10)

    def test_category_totals(self):
        s = self.snap
        self.assertEqual(s.total_accommodation, D("1420.00"))   # 120 + (400 + 250) x 2
        self.assertEqual(s.total_concession_fees, D("320.00"))  # (70x2 + 20x1) x 2 nights
        self.assertEqual(s.total_park_fees, D("381.20"))        # park (82x2 + 23.60) x2 + rescue (1x3) x2
        self.assertEqual(s.total_activities, D("855.00"))       # 50x3 + 600x1 + 30x3 + 15x1
        self.assertEqual(s.total_optional_meals, D("135.00"))   # 45 x 3
        self.assertEqual(s.total_transport_vehicle, D("1200.00"))  # 1 vehicle x 4 days x 300

    def test_grand_totals(self):
        s = self.snap
        self.assertEqual(s.subtotal_net, D("4311.20"))
        self.assertEqual(s.commission_percentage, D("10.00"))
        self.assertEqual(s.commission_amount, D("431.12"))
        self.assertEqual(s.grand_total, D("4742.32"))
        self.assertEqual(s.price_per_person, D("1580.77"))  # infant not counted

    def test_client_request_summary_updated(self):
        self.req.refresh_from_db()
        self.assertEqual(self.req.safari_grand_total, D("4742.32"))
        self.assertEqual(self.req.price_per_personal, D("1580.77"))

    def test_breakdown_lines(self):
        lines = [
            (i.day_number, i.category, i.item_title, i.unit_price, i.quantity, i.line_total)
            for i in self.items(self.snap)
        ]
        self.assertCountEqual(lines, [
            (0, "VEHICLE", "4WD Safari Vehicle (Land Cruiser)", D("300"), D("4"), D("1200")),
            (1, "ACCOMMODATION", "Arusha Hotel — Double", D("120"), D("1"), D("120")),
            (2, "ACCOMMODATION", "Serengeti Lodge — Double", D("400"), D("2"), D("800")),
            (2, "ACCOMMODATION", "Serengeti Lodge — Single", D("250"), D("2"), D("500")),
            (2, "CONCESSION", "Serengeti Lodge — Adult Concession", D("70"), D("4"), D("280")),
            (2, "CONCESSION", "Serengeti Lodge — Child Concession", D("20"), D("2"), D("40")),
            (2, "PARK_FEE", "Serengeti — Adult Park Entry Fee", D("82"), D("4"), D("328")),
            (2, "PARK_FEE", "Serengeti — Child Park Entry Fee", D("23.60"), D("2"), D("47.20")),
            (2, "PARK_FEE", "Serengeti — Adult Rescue Fee", D("1"), D("4"), D("4")),
            (2, "PARK_FEE", "Serengeti — Child Rescue Fee", D("1"), D("2"), D("2")),
            (2, "ACTIVITY", "Game Drive (Optional)", D("50"), D("3"), D("150")),
            (2, "ACTIVITY", "Balloon (Optional)", D("600"), D("1"), D("600")),
            (2, "ACTIVITY", "Transfer — Transit Fee", D("30"), D("3"), D("90")),
            (2, "ACTIVITY", "Crater Transit — Transit Fee", D("15"), D("1"), D("15")),
            (2, "OPTIONAL_MEAL", "Bush Dinner", D("45"), D("3"), D("135")),
        ])

    def test_descriptions_and_dates(self):
        by_title = {i.item_title: i for i in self.items(self.snap)}
        self.assertEqual(by_title["Arusha Hotel — Double"].date_display, "10 Jul 2026")
        self.assertEqual(by_title["Arusha Hotel — Double"].item_description, "Full Board (Breakfast, Lunch, Dinner) | All Year | 1 night")
        self.assertEqual(by_title["Arusha Hotel — Double"].unit_label, "room")
        dbl = by_title["Serengeti Lodge — Double"]
        self.assertEqual(dbl.date_display, "11-12 Jul 2026")
        self.assertEqual(dbl.item_description, "Full Board (Breakfast, Lunch, Dinner) | High | 2 nights")
        self.assertEqual(dbl.unit_label, "room-night")
        self.assertEqual(by_title["Serengeti — Adult Park Entry Fee"].item_description, "High | NON_RESIDENT | 2 nights")
        self.assertEqual(by_title["Serengeti Lodge — Adult Concession"].item_description, "Inside Park | NON_RESIDENT | 2 nights")
        self.assertEqual(by_title["Game Drive (Optional)"].item_description, "Full Day | PerPersonal × 3")
        veh = by_title["4WD Safari Vehicle (Land Cruiser)"]
        self.assertEqual(veh.date_display, "All 4 Days")
        self.assertEqual(veh.item_description, "1 vehicle × 4 days")

    def test_recalculating_replaces_the_snapshot(self):
        self.price(self.version, commission=0)
        self.assertEqual(ItineraryPricingSnapshot.objects.filter(version=self.version).count(), 1)
        snap = ItineraryPricingSnapshot.objects.get(version=self.version)
        self.assertEqual(snap.grand_total, D("4311.20"))
        self.assertEqual(snap.breakdown_items.count(), 15)

    def test_map_generation_is_attempted(self):
        self.assertTrue(self.mock_map.called)


# ---------------------------------------------------------------------------
# 2. Travellers, vehicles, commission
# ---------------------------------------------------------------------------

class TravellerAndVehicleTests(PricingTestCase):

    def _vehicle_only(self, travellers, commission=0, config_rate="100"):
        if config_rate is not None:
            ConfigurationData.objects.create(vehicle_rent_pricing=D(config_rate))
        version = make_version(make_client_request(travellers=travellers))
        make_day(version, 1, 2)
        return self.price(version, commission)

    def test_one_vehicle_per_six_paying_travellers(self):
        snap = self._vehicle_only([("ADULT", 6, False)])
        self.assertEqual(snap.total_transport_vehicle, D("200.00"))  # 1 x 2 days x 100
        snap = self._vehicle_only([("ADULT", 7, False)], config_rate=None)
        self.assertEqual(snap.total_transport_vehicle, D("400.00"))  # 2 x 2 x 100 (first config row)

    def test_infants_do_not_count_for_vehicles_or_per_person(self):
        snap = self._vehicle_only([("ADULT", 6, False), ("INFANT", 3, False)])
        self.assertEqual(snap.total_transport_vehicle, D("200.00"))
        self.assertEqual(snap.price_per_person, D("33.33"))  # 200 / 6

    def test_only_infants_gives_one_vehicle_and_zero_per_person(self):
        snap = self._vehicle_only([("INFANT", 2, False)])
        self.assertEqual(snap.total_transport_vehicle, D("200.00"))
        self.assertEqual(snap.price_per_person, D("0.00"))

    def test_no_vehicle_price_configured_falls_back_to_250(self):
        # CURRENT BEHAVIOUR (review issue 4): a hard-coded $250/day is used
        # silently when no ConfigurationData row exists.
        snap = self._vehicle_only([("ADULT", 2, False)], config_rate=None)
        self.assertEqual(snap.total_transport_vehicle, D("500.00"))

    def test_first_configuration_row_wins(self):
        # CURRENT BEHAVIOUR (review issue 6): one global row, shared by all companies.
        ConfigurationData.objects.create(vehicle_rent_pricing=D("180"))
        ConfigurationData.objects.create(vehicle_rent_pricing=D("999"))
        snap = self._vehicle_only([("ADULT", 2, False)], config_rate=None)
        self.assertEqual(snap.total_transport_vehicle, D("360.00"))

    def test_vehicle_days_use_furthest_day_reached(self):
        ConfigurationData.objects.create(vehicle_rent_pricing=D("100"))
        version = make_version(make_client_request(travellers=[("ADULT", 2, False)]))
        make_day(version, 1, 3)  # days 1-3
        make_day(version, 4, 2)  # days 4-5
        snap = self.price(version)
        self.assertEqual(snap.total_transport_vehicle, D("500.00"))

    def test_commission_rounding(self):
        snap = self._vehicle_only([("ADULT", 3, False)], commission="12.5", config_rate="33.33")
        self.assertEqual(snap.subtotal_net, D("66.66"))
        self.assertEqual(snap.commission_amount, D("8.33"))   # 8.3325 stored as 8.33
        self.assertEqual(snap.grand_total, D("74.99"))        # 74.9925
        self.assertEqual(snap.price_per_person, D("25.00"))   # 24.9975

    def test_no_days_still_creates_snapshot(self):
        version = make_version(make_client_request(travellers=[("ADULT", 2, False)]))
        snap = self.price(version)
        self.assertEqual(snap.total_transport_vehicle, D("0.00"))
        self.assertEqual(snap.grand_total, D("0.00"))
        self.assertEqual([i.date_display for i in self.items(snap, "VEHICLE")], ["All 0 Days"])


# ---------------------------------------------------------------------------
# 3. Accommodation rates and seasons
# ---------------------------------------------------------------------------

class AccommodationRateTests(PricingTestCase):

    def setUp(self):
        super().setUp()
        ConfigurationData.objects.create(vehicle_rent_pricing=D("0.01"))
        self.acc = make_accommodation("Camp")

    def _room_price(self, start, room, nights=1, day_number=1):
        version = make_version(make_client_request(start=start, travellers=[("ADULT", 2, False)]))
        make_day(version, day_number, nights, None, self.acc, rooms=[(room, 1)])
        snap = self.price(version)
        return snap.total_accommodation, self.items(snap, "ACCOMMODATION")

    def test_season_that_wraps_over_new_year(self):
        peak = make_acc_season(self.acc, "Peak", (15, 12), (15, 3))
        room = make_room(self.acc, "Tent", [(peak, D("500")), (None, D("200"))])
        self.assertEqual(self._room_price(date(2027, 1, 5), room)[0], D("500.00"))
        self.assertEqual(self._room_price(date(2026, 12, 20), room)[0], D("500.00"))
        self.assertEqual(self._room_price(date(2026, 6, 1), room)[0], D("200.00"))

    def test_season_boundaries_are_inclusive(self):
        high = make_acc_season(self.acc, "High", (1, 7), (31, 8))
        room = make_room(self.acc, "Tent", [(high, D("500")), (None, D("200"))])
        self.assertEqual(self._room_price(date(2026, 7, 1), room)[0], D("500.00"))
        self.assertEqual(self._room_price(date(2026, 8, 31), room)[0], D("500.00"))
        self.assertEqual(self._room_price(date(2026, 9, 1), room)[0], D("200.00"))

    def test_season_is_picked_by_first_night_of_the_stay(self):
        # Stay starts 30 Jun (Low) and runs into July (High): whole stay at the first night's rate.
        high = make_acc_season(self.acc, "High", (1, 7), (31, 8))
        room = make_room(self.acc, "Tent", [(high, D("500")), (None, D("200"))])
        self.assertEqual(self._room_price(date(2026, 6, 30), room, nights=3)[0], D("600.00"))

    def test_season_uses_the_day_date_not_the_tour_start(self):
        high = make_acc_season(self.acc, "High", (1, 7), (31, 8))
        room = make_room(self.acc, "Tent", [(high, D("500")), (None, D("200"))])
        # tour starts 28 Jun, this accommodation is on day 4 = 1 Jul
        self.assertEqual(self._room_price(date(2026, 6, 28), room, day_number=4)[0], D("500.00"))

    def test_no_matching_season_uses_all_year_rate(self):
        high = make_acc_season(self.acc, "High", (1, 7), (31, 8))
        room = make_room(self.acc, "Tent", [(high, D("500")), (None, D("200"))])
        total, items = self._room_price(date(2026, 2, 1), room)
        self.assertEqual(total, D("200.00"))
        self.assertIn("| All Year |", items[0].item_description)

    def test_no_matching_season_and_no_all_year_rate_uses_any_rate(self):
        # CURRENT BEHAVIOUR (review issue 4): silently charges some other
        # season's rate (whichever RoomRate was created first).
        high = make_acc_season(self.acc, "High", (1, 7), (31, 8))
        peak = make_acc_season(self.acc, "Peak", (20, 12), (5, 1))
        room = make_room(self.acc, "Tent", [(high, D("500")), (peak, D("900"))])
        total, items = self._room_price(date(2026, 2, 1), room)
        self.assertEqual(total, D("500.00"))
        self.assertIn("| All Year |", items[0].item_description)

    def test_season_matched_but_room_has_no_rate_for_it(self):
        # CURRENT BEHAVIOUR: falls back to all-year rate, but the line still says "High".
        make_acc_season(self.acc, "High", (1, 7), (31, 8))
        room = make_room(self.acc, "Tent", [(None, D("200"))])
        total, items = self._room_price(date(2026, 7, 10), room)
        self.assertEqual(total, D("200.00"))
        self.assertIn("| High |", items[0].item_description)

    def test_room_with_no_rates_is_skipped(self):
        room = make_room(self.acc, "Tent", [])
        total, items = self._room_price(date(2026, 7, 10), room)
        self.assertEqual(total, D("0.00"))
        self.assertEqual(items, [])

    def test_overlapping_seasons_pick_lowest_start_day(self):
        # CURRENT BEHAVIOUR: AccommodationSeason is ordered by (start_day, start_month),
        # so with overlaps the season whose start DAY-OF-MONTH is smallest wins.
        a = make_acc_season(self.acc, "Long", (10, 6), (31, 10))
        b = make_acc_season(self.acc, "Short", (5, 7), (20, 7))
        room = make_room(self.acc, "Tent", [(a, D("300")), (b, D("700"))])
        self.assertEqual(self._room_price(date(2026, 7, 10), room)[0], D("700.00"))

    def test_seasons_ignore_the_year(self):
        # CURRENT BEHAVIOUR (review issue 5): seasons have no year, so the same
        # rate applies in 2026 and 2027.
        high = make_acc_season(self.acc, "High", (1, 7), (31, 8))
        room = make_room(self.acc, "Tent", [(high, D("500")), (None, D("200"))])
        self.assertEqual(self._room_price(date(2026, 7, 10), room)[0], D("500.00"))
        self.assertEqual(self._room_price(date(2027, 7, 10), room)[0], D("500.00"))

    def test_quantity_and_nights_multiply(self):
        room = make_room(self.acc, "Tent", [(None, D("150"))])
        version = make_version(make_client_request(travellers=[("ADULT", 6, False)]))
        make_day(version, 1, 3, None, self.acc, rooms=[(room, 3)])
        snap = self.price(version)
        self.assertEqual(snap.total_accommodation, D("1350.00"))


# ---------------------------------------------------------------------------
# 4. Residency, concession fees, park and rescue fees
# ---------------------------------------------------------------------------

class ResidencyAndFeeTests(PricingTestCase):

    def setUp(self):
        super().setUp()
        ConfigurationData.objects.create(vehicle_rent_pricing=D("0.01"))
        self.park = make_destination("Tarangire", "Park")
        self.all_year = make_dest_season(self.park, "ALL_YEAR")
        for residency, adult, child in [("NON_RESIDENT", 60, 20), ("EAC_MEMBER", 10, 5), ("RESIDENT", 4, 2)]:
            make_fee(self.park, self.all_year, "ParkFee", residency, D(adult), D(child))
        self.lodge = make_accommodation("Tree Lodge", inside_park=True, conc=(50, 15, 8, 3))

    def _price(self, country, travellers, destination=None, accommodation=None, start=date(2026, 3, 1)):
        version = make_version(make_client_request(country=country, start=start, travellers=travellers))
        make_day(version, 1, 1, destination, accommodation)
        return self.price(version)

    def test_non_resident(self):
        snap = self._price("Germany", [("ADULT", 2, False), ("CHILD", 1, False)], self.park, self.lodge)
        self.assertEqual(snap.total_park_fees, D("140.00"))      # 60x2 + 20
        self.assertEqual(snap.total_concession_fees, D("115.00"))  # 50x2 + 15

    def test_eac_country_uses_eac_park_fee_and_resident_concession(self):
        snap = self._price("Kenya", [("ADULT", 2, False)], self.park, self.lodge)
        self.assertEqual(snap.total_park_fees, D("20.00"))
        self.assertEqual(snap.total_concession_fees, D("16.00"))

    def test_resident_flag_wins_over_country(self):
        snap = self._price("Germany", [("ADULT", 1, True), ("ADULT", 1, False)], self.park, self.lodge)
        self.assertEqual(snap.total_park_fees, D("64.00"))         # 4 + 60
        self.assertEqual(snap.total_concession_fees, D("58.00"))   # 8 + 50
        labels = sorted(i.item_description.split(" | ")[1] for i in self.items(snap, "PARK_FEE"))
        self.assertEqual(labels, ["NON_RESIDENT", "RESIDENT"])

    def test_city_and_beach_have_no_park_fees(self):
        for kind in ("City", "Beach"):
            dest = make_destination(f"Somewhere {kind}", kind)
            season = make_dest_season(dest, "ALL_YEAR")
            make_fee(dest, season, "ParkFee", "NON_RESIDENT", D("60"), D("20"))
            snap = self._price("Germany", [("ADULT", 2, False)], dest)
            self.assertEqual(snap.total_park_fees, D("0.00"))

    def test_mountain_is_charged_like_a_park(self):
        mountain = make_destination("Kilimanjaro", "Mountain")
        make_fee(mountain, make_dest_season(mountain, "all_year"), "RescueFee", "NON_RESIDENT", D("20"), D("10"))
        snap = self._price("Germany", [("ADULT", 2, False)], mountain)
        self.assertEqual(snap.total_park_fees, D("40.00"))  # ALL_YEAR match is case-insensitive

    def test_seasonal_park_fee_beats_all_year(self):
        high = make_dest_season(self.park, "High", (1, 7), (31, 10))
        make_fee(self.park, high, "ParkFee", "NON_RESIDENT", D("80"), D("25"))
        self.assertEqual(self._price("Germany", [("ADULT", 1, False)], self.park, start=date(2026, 8, 1)).total_park_fees, D("80.00"))
        self.assertEqual(self._price("Germany", [("ADULT", 1, False)], self.park, start=date(2026, 3, 1)).total_park_fees, D("60.00"))

    def test_missing_fee_for_a_residency_charges_nothing(self):
        park = make_destination("Mikumi", "Park")
        make_fee(park, make_dest_season(park, "ALL_YEAR"), "ParkFee", "NON_RESIDENT", D("30"), D("10"))
        snap = self._price("Kenya", [("ADULT", 2, False)], park)
        self.assertEqual(snap.total_park_fees, D("0.00"))

    def test_empty_child_fee_charges_nothing_for_children(self):
        park = make_destination("Ruaha", "Park")
        make_fee(park, make_dest_season(park, "ALL_YEAR"), "ParkFee", "NON_RESIDENT", D("30"), None)
        snap = self._price("Germany", [("ADULT", 1, False), ("CHILD", 2, False)], park)
        self.assertEqual(snap.total_park_fees, D("30.00"))

    def test_concession_only_inside_park_and_per_night(self):
        outside = make_accommodation("Town Lodge")
        self.assertEqual(self._price("Germany", [("ADULT", 2, False)], None, outside).total_concession_fees, D("0.00"))
        version = make_version(make_client_request(country="Germany", travellers=[("ADULT", 2, False)]))
        make_day(version, 1, 3, None, self.lodge)
        self.assertEqual(self.price(version).total_concession_fees, D("300.00"))  # 50 x 2 x 3

    def test_park_fee_charged_per_night_not_per_day(self):
        version = make_version(make_client_request(country="Germany", travellers=[("ADULT", 1, False)]))
        make_day(version, 1, 3, self.park)
        self.assertEqual(self.price(version).total_park_fees, D("180.00"))  # 60 x 3 nights

    def test_infants_pay_no_fees(self):
        snap = self._price("Germany", [("ADULT", 1, False), ("INFANT", 2, False)], self.park, self.lodge)
        self.assertEqual(snap.total_park_fees, D("60.00"))
        self.assertEqual(snap.total_concession_fees, D("50.00"))


class ResidencyHelperTests(TestCase):

    def test_eac_countries(self):
        for country in ["Tanzania", "kenya", " Uganda ", "🇷🇼 Rwanda", "Democratic Republic of the Congo"]:
            self.assertTrue(is_eac_country(country), country)
        for country in ["Germany", "United States", "", None]:
            self.assertFalse(is_eac_country(country), country)

    def test_substring_matching_quirks(self):
        # CURRENT BEHAVIOUR: matching is by substring, so these non-EAC
        # countries are treated as EAC members and get EAC park fees.
        self.assertTrue(is_eac_country("Sudan"))   # inside "south sudan"
        self.assertTrue(is_eac_country("Congo"))   # inside "democratic republic of the congo"

    def test_determine_residency(self):
        req = make_client_request(country="Kenya")
        resident = Traveller(request=req, age_category="ADULT", number=1, is_resident=True)
        visitor = Traveller(request=req, age_category="ADULT", number=1, is_resident=False)
        self.assertEqual(determine_residency(resident, req), "RESIDENT")
        self.assertEqual(determine_residency(visitor, req), "EAC_MEMBER")
        req.client_requested.country = "France"
        self.assertEqual(determine_residency(visitor, req), "NON_RESIDENT")


# ---------------------------------------------------------------------------
# 5. Activities and optional meals
# ---------------------------------------------------------------------------

class ActivityAndMealTests(PricingTestCase):

    def setUp(self):
        super().setUp()
        ConfigurationData.objects.create(vehicle_rent_pricing=D("0.01"))
        # 8 paying travellers -> 2 vehicles
        self.version = make_version(make_client_request(travellers=[("ADULT", 7, False), ("CHILD", 1, False), ("INFANT", 1, False)]))
        self.day = make_day(self.version, 1, 2)  # 2 nights must NOT multiply activities or meals

    def total(self):
        return self.price(self.version).total_activities

    def test_optional_activity_price_per(self):
        cases = [("PerPersonal", D("80.00")), ("PerVehicle", D("20.00")), ("PerGroup", D("10.00")), (None, D("10.00"))]
        for per, expected in cases:
            with self.subTest(price_per=per):
                self.day.day_activities.all().delete()
                make_activity(self.day, is_optional=True, optional_activity_price=10, price_per=per)
                self.assertEqual(self.total(), expected)

    def test_activity_not_optional_is_free_even_with_a_price(self):
        make_activity(self.day, is_optional=False, optional_activity_price=500, price_per="PerPersonal")
        self.assertEqual(self.total(), D("0.00"))

    def test_optional_activity_without_price_is_free(self):
        make_activity(self.day, is_optional=True, optional_activity_price=0, price_per="PerPersonal")
        make_activity(self.day, is_optional=True, optional_activity_price=None, price_per="PerPersonal")
        self.assertEqual(self.total(), D("0.00"))

    def test_transit_fee_per(self):
        cases = [("Pax", D("40.00")), ("Vehicle", D("10.00")), ("Group", D("5.00")), (None, D("40.00"))]
        for per, expected in cases:
            with self.subTest(transit_fee_per=per):
                self.day.day_activities.all().delete()
                make_activity(self.day, transit_fee_included=True, transit_fee=5, transit_fee_per=per)
                self.assertEqual(self.total(), expected)

    def test_transit_fee_ignored_unless_included(self):
        make_activity(self.day, transit_fee_included=False, transit_fee=50, transit_fee_per="Pax")
        self.assertEqual(self.total(), D("0.00"))

    def test_activity_can_have_both_price_and_transit(self):
        make_activity(self.day, is_optional=True, optional_activity_price=10, price_per="PerGroup",
                      transit_fee_included=True, transit_fee=3, transit_fee_per="Vehicle")
        snap = self.price(self.version)
        self.assertEqual(snap.total_activities, D("16.00"))
        self.assertEqual(len(self.items(snap, "ACTIVITY")), 2)

    def test_optional_meals_per_paying_traveller(self):
        make_meal(self.day, "Bush Dinner", is_optional=True, price=D("12.50"))
        make_meal(self.day, "Lunch", is_optional=False, price=D("99"))
        make_meal(self.day, "Free Dinner", is_optional=True, price=0)
        snap = self.price(self.version)
        self.assertEqual(snap.total_optional_meals, D("100.00"))  # 12.50 x 8
        self.assertEqual(snap.total_activities, D("0.00"))
