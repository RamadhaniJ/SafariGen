"""
The live price preview must equal the saved price (review issue 3).

Run with:  .venv/bin/python manage.py test Itinerary.tests_price_preview
"""

from datetime import date
from decimal import Decimal as D

from rest_framework.test import APIClient

from Itinerary.models import ItineraryPricingSnapshot
from Itinerary.tests import (
    PricingTestCase, make_accommodation, make_acc_season, make_activity, make_client_request,
    make_day, make_dest_season, make_destination, make_fee, make_meal, make_room, make_version,
)
from Configuration.models import ConfigurationData
from Users.models import Company, CustomUserModel


def payload_from_version(version, commission=0, **extra):
    """The same 'days' payload the builder screen sends, read back from saved rows."""
    days = []
    for day in version.version_daybyday.all().order_by("day_number"):
        days.append({
            "day_number": day.day_number,
            "nights": day.nights_number,
            "destination_id": day.destination_id,
            "accommodation_id": day.accommodation_id,
            "included_meals": [],
            "selected_rooms": [{"room_type_id": r.room_type_id, "quantity": r.quantity} for r in day.selected_rooms.all()],
            "activities": [{
                "activity_type_id": a.activity_type_id, "moment": a.moment,
                "main_location_id": None, "start_location_id": None, "end_location_id": None,
                "transit_fee_included": a.transit_fee_included,
                "transit_fee": str(a.transit_fee) if a.transit_fee is not None else None,
                "transit_fee_per": a.transit_fee_per, "is_optional": a.is_optional,
                "optional_activity_price": str(a.optional_activity_price) if a.optional_activity_price is not None else None,
                "price_per": a.price_per,
            } for a in day.day_activities.all()],
            "optional_meals": [{"meal_id": m.meal_id, "is_optional": m.is_optional, "price": str(m.price)}
                               for m in day.day_optionals_meal.all()],
        })
    return {"client_id": str(version.client_request_id), "commission_percentage": str(commission), "days": days, **extra}


class PricePreviewTests(PricingTestCase):

    def setUp(self):
        super().setUp()
        ConfigurationData.objects.create(vehicle_rent_pricing=D("300"))
        self.manager = CustomUserModel.objects.create_user(
            email="m@x.test", password="x-Strong-pass-1", full_name="M", role="MANAGER", is_active=True)
        self.company = Company.objects.create(owner=self.manager, name="Co", email="co@x.test")
        self.api = APIClient()
        self.api.force_authenticate(self.manager)

        # A trip that crosses a season change: starts 29 Jun (Low), lodge nights 30 Jun–2 Jul,
        # High season from 1 Jul. The old browser maths priced every day by the start date.
        self.req = make_client_request(start=date(2026, 6, 29), travellers=[
            ("ADULT", 2, False), ("CHILD", 1, False), ("INFANT", 1, False)])
        self.req.client_requested.company = self.company
        self.req.client_requested.save()
        self.version = make_version(self.req)

        park = make_destination("Serengeti", "Park")
        high = make_dest_season(park, "High", (1, 7), (31, 10))
        make_fee(park, high, "ParkFee", "NON_RESIDENT", D("82"), D("23.60"))
        make_fee(park, make_dest_season(park, "ALL_YEAR"), "ParkFee", "NON_RESIDENT", D("70"), D("20"))
        lodge = make_accommodation("Camp", inside_park=True, conc=(70, 20, 10, 5))
        lodge_high = make_acc_season(lodge, "High", (1, 7), (31, 10))
        double = make_room(lodge, "Double", [(lodge_high, D("400")), (None, D("300"))])

        make_day(self.version, 1, 1, park, lodge, rooms=[(double, 1)])     # 29 Jun: low
        day2 = make_day(self.version, 2, 3, park, lodge, rooms=[(double, 1)])  # 30 Jun–2 Jul: low (by first night)
        make_day(self.version, 5, 2, park, lodge, rooms=[(double, 2)])     # 3–4 Jul: high
        make_activity(day2, "Balloon", is_optional=True, optional_activity_price=550, price_per="PerPersonal")
        make_activity(day2, "Transit", transit_fee_included=True, transit_fee=40, transit_fee_per="Vehicle")
        make_meal(day2, "Bush Dinner", is_optional=True, price=D("45.50"))

    def preview(self, **kwargs):
        r = self.api.post("/api/itinerary/price-preview/", payload_from_version(self.version, **kwargs), format="json")
        self.assertEqual(r.status_code, 200, r.content)
        return r.json()

    def test_preview_equals_saved_price_exactly(self):
        preview = self.preview(commission=12.5)
        saved = self.price(self.version, commission=D("12.5"))
        t = preview["totals"]
        self.assertEqual(D(t["accommodation"]), saved.total_accommodation)
        self.assertEqual(D(t["park_fees"]), saved.total_park_fees)
        self.assertEqual(D(t["concession_fees"]), saved.total_concession_fees)
        self.assertEqual(D(t["vehicle"]), saved.total_transport_vehicle)
        self.assertEqual(D(t["activities"]), saved.total_activities)
        self.assertEqual(D(t["optional_meals"]), saved.total_optional_meals)
        self.assertEqual(D(t["subtotal"]), saved.subtotal_net)
        self.assertEqual(D(t["commission_amount"]), saved.commission_amount)
        self.assertEqual(D(t["grand_total"]), saved.grand_total)
        self.assertEqual(D(t["price_per_person"]), saved.price_per_person)
        saved_lines = sorted((i.day_number, i.category, i.item_title, i.line_total) for i in saved.breakdown_items.all())
        preview_lines = sorted((l["day_number"], l["category"], l["item_title"], D(l["line_total"])) for l in preview["lines"])
        self.assertEqual(preview_lines, saved_lines)

    def test_each_day_uses_its_own_season(self):
        by_day = {}
        for l in self.preview()["lines"]:
            if l["category"] == "ACCOMMODATION":
                by_day[l["day_number"]] = D(l["unit_price"])
        self.assertEqual(by_day, {1: D("300.00"), 2: D("300.00"), 5: D("400.00")})

    def test_preview_writes_nothing(self):
        self.preview()
        self.assertFalse(ItineraryPricingSnapshot.objects.exists())
        self.req.refresh_from_db()
        self.assertEqual(self.req.safari_grand_total, D("0.00"))

    def test_edited_travellers_and_start_date_are_used(self):
        base = self.preview()
        bigger = self.preview(travellers=[{"age_category": "ADULT", "number": 7, "is_resident": False}],
                              tour_start_date="2026-08-01")
        self.assertEqual(bigger["total_travellers"], 7)
        self.assertEqual(bigger["vehicles_needed"], 2)
        self.assertGreater(D(bigger["totals"]["grand_total"]), D(base["totals"]["grand_total"]))

    def test_vehicle_details_and_company_price(self):
        self.company.vehicle_rate_per_day = D("210")
        self.company.save()
        p = self.preview()
        self.assertEqual((p["vehicles_needed"], p["total_tour_days"], p["vehicle_daily_rate"], p["vehicle_rate_source"]),
                         (1, 6, "210.00", "company"))

    def test_incomplete_draft_days_are_fine(self):
        r = self.api.post("/api/itinerary/price-preview/", {
            "client_id": str(self.req.id),
            "days": [{"day_number": 1, "nights": 1}, {"day_number": 2, "nights": 2, "destination_id": None}],
        }, format="json")
        self.assertEqual(r.status_code, 200, r.content)
        self.assertEqual(r.json()["totals"]["accommodation"], "0.00")

    def test_other_companies_cannot_preview(self):
        stranger = CustomUserModel.objects.create_user(
            email="s@x.test", password="x-Strong-pass-1", full_name="S", role="MANAGER", is_active=True)
        api = APIClient()
        api.force_authenticate(stranger)
        r = api.post("/api/itinerary/price-preview/", payload_from_version(self.version), format="json")
        self.assertEqual(r.status_code, 403)

    def test_must_be_signed_in(self):
        r = APIClient().post("/api/itinerary/price-preview/", payload_from_version(self.version), format="json")
        self.assertIn(r.status_code, (401, 403))
