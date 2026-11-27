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
        for text in ["Needs attention", "Latest tour requests", "No vehicle price per day is set", "Quotes &amp; clients"]:
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
