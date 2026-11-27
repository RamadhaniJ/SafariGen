"""
Tests for the lodge price grid (Admin → Lodges & hotels → Room prices).

Run with:  .venv/bin/python manage.py test Accommodation
"""

from decimal import Decimal as D

from django.test import TestCase
from django.urls import reverse

from Accommodation.models import Accommodation, AccommodationRoomType, AccommodationSeason, RoomRate
from Accommodation.price_grid import build_grid, uncovered_ranges
from Users.models import CustomUserModel


class PriceGridTests(TestCase):

    def setUp(self):
        self.admin = CustomUserModel.objects.create_superuser(email="a@x.test", password="x-Strong-pass-1", full_name="A")
        self.client.force_login(self.admin)
        self.acc = Accommodation.objects.create(name="Planet Lodge", tag_label="Lodge", park_status="OutsidePark",
                                                featured_image="x.jpg")
        self.high = AccommodationSeason.objects.create(accommodation=self.acc, name="High", start_day=1, start_month=1, end_day=29, end_month=2)
        self.low = AccommodationSeason.objects.create(accommodation=self.acc, name="Low", start_day=1, start_month=4, end_day=31, end_month=5)
        self.triple = AccommodationRoomType.objects.create(accommodation=self.acc, name="Triple")
        RoomRate.objects.create(room_type=self.triple, season=self.high, meal_plan="BB", price_per_night=D("197"))
        self.url = reverse("admin:accommodation-price-grid", args=[self.acc.pk])

    def cell(self, season, plan="BB"):
        return f"price__{self.triple.id}__{plan}__{season.id if season else 'all'}"

    def test_uncovered_dates(self):
        self.assertEqual(uncovered_ranges([self.high, self.low]), ["1 Mar – 31 Mar", "1 Jun – 31 Dec"])
        wrap = AccommodationSeason(name="Festive", start_day=16, start_month=12, end_day=15, end_month=1)
        self.assertEqual(uncovered_ranges([wrap]), ["16 Jan – 15 Dec"])

    def test_grid_shows_prices_and_gaps(self):
        g = build_grid(self.acc)
        self.assertEqual([c["name"] for c in g["columns"]], ["High", "Low", "All year"])
        (row,) = g["rows"]                                   # only BB is in use
        self.assertEqual([str(c["value"]) for c in row["cells"]], ["197.00", "", ""])
        self.assertEqual([c["gap"] for c in row["cells"]], [False, True, False])
        self.assertIn("Triple: no price for Low (1 Apr – 31 May)", g["missing"])
        self.assertIn("Triple: no season covers 1 Mar – 31 Mar, 1 Jun – 31 Dec and there's no all-year price", g["missing"])

    def test_page_opens(self):
        r = self.client.get(self.url)
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, "Room prices — Planet Lodge")
        self.assertContains(r, 'name="%s"' % self.cell(self.low))

    def test_save_adds_changes_and_removes(self):
        r = self.client.post(self.url, {
            self.cell(self.high): "",                # remove
            self.cell(self.low): "127.50",           # add
            self.cell(None): "150",                  # all-year: add
        })
        self.assertEqual(r.status_code, 302)
        rates = {(x.season_id, x.meal_plan): x.price_per_night for x in RoomRate.objects.filter(room_type=self.triple)}
        self.assertEqual(rates, {(self.low.id, "BB"): D("127.50"), (None, "BB"): D("150.00")})
        self.client.post(self.url, {self.cell(None): "160"})          # change
        self.assertEqual(RoomRate.objects.get(room_type=self.triple, season=None).price_per_night, D("160.00"))

    def test_all_year_price_closes_every_gap(self):
        self.client.post(self.url, {self.cell(None): "150"})
        self.assertEqual(build_grid(self.acc)["missing"], [])

    def test_invalid_price_saves_nothing_and_keeps_input(self):
        r = self.client.post(self.url, {self.cell(self.low): "abc", self.cell(None): "150"})
        self.assertEqual(r.status_code, 200)
        self.assertContains(r, "Nothing was saved")
        self.assertContains(r, 'value="150"')
        self.assertFalse(RoomRate.objects.filter(season=None).exists())
        r = self.client.post(self.url, {self.cell(self.low): "-5"})
        self.assertContains(r, "can&#x27;t be negative")

    def test_other_lodges_cells_are_ignored(self):
        other = Accommodation.objects.create(name="Other", tag_label="Lodge", park_status="OutsidePark", featured_image="x.jpg")
        other_room = AccommodationRoomType.objects.create(accommodation=other, name="Double")
        self.client.post(self.url, {f"price__{other_room.id}__BB__all": "999"})
        self.assertFalse(RoomRate.objects.filter(room_type=other_room).exists())

    def test_staff_without_admin_access_is_refused(self):
        staff = CustomUserModel.objects.create_user(email="s@x.test", password="x-Strong-pass-1", full_name="S",
                                                    role="STAFF", is_active=True)
        self.client.force_login(staff)
        self.assertEqual(self.client.get(self.url).status_code, 302)   # sent to admin login
