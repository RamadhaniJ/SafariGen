"""
Live price while a quote is being built or edited.

POST /api/itinerary/price-preview/
Body: the same "days" the Save button sends, plus client_id, commission_percentage,
and optionally the (edited) tour_start_date and travellers.

Runs the same compute_pricing() used when a quote is saved, so the number on screen
is exactly the number that will be saved. Nothing is written to the database.
"""

from types import SimpleNamespace
from uuid import UUID

from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from Accommodation.models import Accommodation, AccommodationRoomType
from Activities.models import Activity, ActivityType
from Clients.models import ClientRequestInformation
from Destinations.models import Destination
from Itinerary.Serializer import OptionalMealItemSerializer, SelectedRoomItemSerializer
from Itinerary.pricing import PricingDay, compute_pricing
from Meal.models import MealPlan, OptionalMeal
from Users.authentication import CustomJwtCookiesAuth
from Users.view_auth import IsStaffOrManager


class PreviewActivitySerializer(serializers.Serializer):
    """Only the fields that affect price. Places (from/via/to) are checked on save, not here,
    so the price keeps updating while an activity is still being filled in."""
    activity_type_id = serializers.UUIDField()
    moment = serializers.ChoiceField(choices=Activity._meta.get_field("moment").choices, required=False, allow_null=True)
    transit_fee_included = serializers.BooleanField(default=False)
    transit_fee = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    transit_fee_per = serializers.ChoiceField(choices=Activity._meta.get_field("transit_fee_per").choices,
                                              required=False, allow_null=True)
    is_optional = serializers.BooleanField(default=False)
    optional_activity_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    price_per = serializers.ChoiceField(choices=Activity._meta.get_field("price_per").choices,
                                        required=False, allow_null=True)


class PreviewDaySerializer(serializers.Serializer):
    day_number = serializers.IntegerField(min_value=1)
    nights = serializers.IntegerField(min_value=1, default=1)
    destination_id = serializers.IntegerField(required=False, allow_null=True)
    accommodation_id = serializers.IntegerField(required=False, allow_null=True)
    activities = serializers.ListField(child=PreviewActivitySerializer(), required=False, default=list)
    optional_meals = serializers.ListField(child=OptionalMealItemSerializer(), required=False, default=list)
    selected_rooms = serializers.ListField(child=SelectedRoomItemSerializer(), required=False, default=list)


class PreviewTravellerSerializer(serializers.Serializer):
    age_category = serializers.ChoiceField(choices=["ADULT", "CHILD", "INFANT"])
    number = serializers.IntegerField(min_value=0)
    is_resident = serializers.BooleanField(default=False)


class PricePreviewSerializer(serializers.Serializer):
    client_id = serializers.UUIDField()
    commission_percentage = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, default=0)
    days = serializers.ListField(child=PreviewDaySerializer(), allow_empty=True)
    tour_start_date = serializers.DateField(required=False, allow_null=True)
    travellers = serializers.ListField(child=PreviewTravellerSerializer(), required=False)


def _as_int(value):
    """Some ids arrive as UUIDs because of the form serializer; the tables use integers."""
    if value is None:
        return None
    return int(value) if isinstance(value, UUID) else int(value)


def build_pricing_days(days_data):
    """Turn the (validated) save payload's days into PricingDay objects, fetching rates in bulk."""
    ids = lambda key: {d.get(key) for d in days_data if d.get(key)}
    destinations = Destination.objects.in_bulk(ids("destination_id"))
    accommodations = Accommodation.objects.in_bulk(ids("accommodation_id"))
    room_types = AccommodationRoomType.objects.in_bulk(
        {r["room_type_id"] for d in days_data for r in d.get("selected_rooms", [])})
    activity_types = ActivityType.objects.in_bulk(
        {_as_int(a["activity_type_id"]) for d in days_data for a in d.get("activities", [])})
    meal_plans = MealPlan.objects.in_bulk(
        {_as_int(m["meal_id"]) for d in days_data for m in d.get("optional_meals", [])})

    days = []
    for d in days_data:
        rooms = [SimpleNamespace(room_type=room_types[r["room_type_id"]], quantity=r["quantity"])
                 for r in d.get("selected_rooms", []) if r["room_type_id"] in room_types]
        activities = [
            Activity(
                activity_type=activity_types.get(_as_int(a["activity_type_id"])),
                moment=a.get("moment"),
                transit_fee_included=a.get("transit_fee_included") or False,
                transit_fee=a.get("transit_fee"),
                transit_fee_per=a.get("transit_fee_per"),
                is_optional=a.get("is_optional") or False,
                optional_activity_price=a.get("optional_activity_price"),
                price_per=a.get("price_per"),
            )
            for a in d.get("activities", [])
        ]
        meals = [
            OptionalMeal(meal=meal_plans.get(_as_int(m["meal_id"])), is_optional=m.get("is_optional", True),
                         price=m.get("price") or 0)
            for m in d.get("optional_meals", [])
        ]
        days.append(PricingDay(
            day_number=d["day_number"],
            nights_number=d.get("nights", 1),
            destination=destinations.get(d.get("destination_id")),
            accommodation=accommodations.get(d.get("accommodation_id")),
            rooms=rooms, activities=activities, meals=meals,
        ))
    return days


def _money(v):
    return str(v.quantize(v.__class__("0.01")))


class ItineraryPricePreviewView(APIView):
    authentication_classes = [CustomJwtCookiesAuth]
    permission_classes = [IsAuthenticated, IsStaffOrManager]

    def post(self, request):
        s = PricePreviewSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        data = s.validated_data

        try:
            client_request = ClientRequestInformation.objects.select_related(
                "client_requested__company").get(id=data["client_id"])
        except ClientRequestInformation.DoesNotExist:
            return Response({"detail": "Client request not found."}, status=status.HTTP_404_NOT_FOUND)

        company = client_request.client_requested.company
        user = request.user
        allowed = company is not None and (company.owner_id == user.id or user.companies.filter(id=company.id).exists())
        if not allowed:
            return Response({"detail": "You don't have access to this client."}, status=status.HTTP_403_FORBIDDEN)

        travellers = (
            [SimpleNamespace(**t) for t in data["travellers"]] if "travellers" in data
            else list(client_request.travellers.all())
        )
        start = data.get("tour_start_date") or client_request.tour_start_date

        r = compute_pricing(client_request, build_pricing_days(data["days"]), travellers, start,
                            data.get("commission_percentage") or 0)

        return Response({
            "total_travellers": r.total_travellers,
            "vehicles_needed": r.vehicles_needed,
            "total_tour_days": r.total_tour_days,
            "vehicle_daily_rate": _money(r.vehicle_daily_rate),
            "vehicle_rate_source": r.vehicle_rate_source,
            "totals": {
                "accommodation": _money(r.sum_accommodation),
                "park_fees": _money(r.sum_park_fees),
                "concession_fees": _money(r.sum_concession),
                "vehicle": _money(r.vehicle_total),
                "activities": _money(r.sum_activities),
                "optional_meals": _money(r.sum_meals),
                "subtotal": _money(r.subtotal_net),
                "commission_percentage": _money(r.commission_pct),
                "commission_amount": _money(r.commission_amount),
                "grand_total": _money(r.grand_total),
                "price_per_person": _money(r.price_per_person),
            },
            "lines": [
                {**item,
                 "unit_price": _money(item["unit_price"]),
                 "quantity": str(item["quantity"]),
                 "line_total": _money(item["line_total"])}
                for item in r.breakdown_items
            ],
        })
