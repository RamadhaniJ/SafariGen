"""
Smoke tests for the admin: every list, add and edit page opens for an admin,
the dashboard renders, and searches that used to crash now work.

Run with:  .venv/bin/python manage.py test backend
"""

from datetime import date

from django.contrib import admin
from django.test import TestCase
from django.urls import reverse

from ActivityLog.models import ActivitiesLogs
from Clients.models import ClientInformation, ClientRequestInformation
from Users.models import Company, CustomUserModel


class AdminPagesTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.admin_user = CustomUserModel.objects.create_superuser(
            email="admin@test.local", password="x-Strong-pass-123", full_name="Admin")
        cls.company = Company.objects.create(owner=cls.admin_user, name="Savanna Trails", email="a@b.test",
                                             country="Tanzania", website="https://x.test", tax_id_number="1")
        client = ClientInformation.objects.create(company=cls.company, email="c@d.test", salutation="Ms",
                                                  first_name="Asha", last_name="K", created_by=cls.admin_user)
        ClientRequestInformation.objects.create(client_requested=client, tour_title="Test", tour_type="Private",
                                                country_visited="Tanzania", tour_start_date=date(2027, 7, 1))
        ActivitiesLogs.objects.create(actor=cls.admin_user, client=client, action="CREATED", module="CLIENT",
                                      description="made a client") if hasattr(ActivitiesLogs, "module") else None

    def setUp(self):
        self.client.force_login(self.admin_user)

    def test_dashboard(self):
        r = self.client.get(reverse("admin:index"))
        self.assertEqual(r.status_code, 200)
        html = r.content.decode()
        for text in ["Needs attention", "Latest tour requests", "no vehicle price and no default", "Quotes &amp; clients"]:
            self.assertIn(text, html)

    def test_every_list_and_add_page_opens(self):
        for model, model_admin in admin.site._registry.items():
            info = (model._meta.app_label, model._meta.model_name)
            with self.subTest(model=model.__name__):
                r = self.client.get(reverse("admin:%s_%s_changelist" % info))
                self.assertEqual(r.status_code, 200, f"list page for {model.__name__}")
                r = self.client.get(reverse("admin:%s_%s_changelist" % info) + "?q=test")
                self.assertIn(r.status_code, (200, 302), f"search on {model.__name__}")
                if model_admin.has_add_permission(r.wsgi_request):
                    r = self.client.get(reverse("admin:%s_%s_add" % info))
                    self.assertEqual(r.status_code, 200, f"add page for {model.__name__}")

    def test_edit_pages_open(self):
        for obj in [self.company, self.admin_user, ClientInformation.objects.first(),
                    ClientRequestInformation.objects.first()]:
            info = (obj._meta.app_label, obj._meta.model_name)
            with self.subTest(model=type(obj).__name__):
                r = self.client.get(reverse("admin:%s_%s_change" % info, args=[obj.pk]))
                self.assertEqual(r.status_code, 200)

    def test_user_password_is_not_editable_as_text(self):
        r = self.client.get(reverse("admin:Users_customusermodel_change", args=[self.admin_user.pk]))
        html = r.content.decode()
        self.assertNotIn('name="password" type="text"', html)
        self.assertIn("password/", html)   # link to the proper change-password page

    def test_staff_cannot_open_admin(self):
        staff = CustomUserModel.objects.create_user(email="s@t.local", password="x-Strong-pass-123",
                                                    full_name="S", role="STAFF", is_active=True)
        self.client.force_login(staff)
        self.assertEqual(self.client.get(reverse("admin:index")).status_code, 302)



class RecalculatePricesActionTests(TestCase):
    """Admin action that re-prices saved quotes after rates change."""

    def test_recalculate_after_the_default_vehicle_price_changes(self):
        # Company prices re-price automatically; the default price doesn't, so this
        # action is how quotes of companies without their own price get updated.
        from decimal import Decimal
        from unittest.mock import patch
        from Itinerary.models import ItineraryVersion, MainDayByDayItinerary
        from Itinerary.pricing import calculate_and_save_pricing_snapshot
        from Clients.models import Traveller
        from Configuration.models import ConfigurationData

        admin_user = CustomUserModel.objects.create_superuser(email="a@t.local", password="x-Strong-pass-123", full_name="A")
        company = Company.objects.create(owner=admin_user, name="Co", email="co@x.test")
        client = ClientInformation.objects.create(company=company, email="g@x.test", salutation="Mr", first_name="G", last_name="H")
        req = ClientRequestInformation.objects.create(client_requested=client, tour_title="T", tour_type="P",
                                                      country_visited="Tanzania", tour_start_date=date(2027, 7, 1))
        Traveller.objects.create(request=req, age_category="ADULT", number=2)
        version = ItineraryVersion.objects.create(client_request=req, version_number=1)
        MainDayByDayItinerary.objects.create(version=version, day_number=1, nights_number=4)

        config = ConfigurationData.objects.create(vehicle_rent_pricing=Decimal("250"))
        with patch("Itinerary.pricing.generate_and_save_safari_map"):
            calculate_and_save_pricing_snapshot(version, commission_percentage=10)   # $250 x 4 = 1000 + 10%
            version.refresh_from_db()
            self.assertEqual(version.version_pricing_snapshot.grand_total, Decimal("1100.00"))

            config.vehicle_rent_pricing = Decimal("200")
            config.save()

            self.client.force_login(admin_user)
            r = self.client.post(reverse("admin:Itinerary_itineraryversion_changelist"),
                                 {"action": "recalculate_prices", "_selected_action": [str(version.pk)]}, follow=True)
        self.assertEqual(r.status_code, 200)
        self.assertIn("$1,100.00 → $880.00", r.content.decode())      # 200 x 4 = 800 + 10% (commission kept)
        version.refresh_from_db()
        self.assertEqual(version.version_pricing_snapshot.total_transport_vehicle, Decimal("800.00"))
        self.assertEqual(version.version_pricing_snapshot.commission_percentage, Decimal("10.00"))
