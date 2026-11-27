"""
Tests for company contact details and social links shown to guests.

Run with:  .venv/bin/python manage.py test Users
"""

from django.test import TestCase
from rest_framework.test import APIClient

from Users.models import Company, CustomUserModel


def make_manager(email="owner@safaris.test"):
    return CustomUserModel.objects.create_user(
        email=email, password="x-Strong-pass-123", full_name="Owner", role="MANAGER", is_active=True
    )


def make_company(owner, **kwargs):
    defaults = dict(
        owner=owner, name="Savanna Trails Ltd", email="info@savannatrails.test",
        phone_number="+255700000001", website="https://savannatrails.test",
        country="Tanzania", tax_id_number="TIN-1",
    )
    defaults.update(kwargs)
    company = Company.objects.create(**defaults)
    owner.companies.add(company)
    return company


class SocialLinksTests(TestCase):

    def test_only_filled_links_in_fixed_order(self):
        c = make_company(make_manager(), instagram_url="https://instagram.com/savanna.trails/",
                         facebook_url="https://facebook.com/savannatrails", tiktok_url="")
        self.assertEqual(c.social_links(), [
            {"name": "Facebook", "url": "https://facebook.com/savannatrails", "handle": "@savannatrails"},
            {"name": "Instagram", "url": "https://instagram.com/savanna.trails/", "handle": "@savanna.trails"},
        ])

    def test_handle_keeps_existing_at_and_drops_query(self):
        c = make_company(make_manager(), tiktok_url="https://www.tiktok.com/@savanna?lang=en")
        self.assertEqual(c.social_links()[0]["handle"], "@savanna")

    def test_no_links(self):
        self.assertEqual(make_company(make_manager()).social_links(), [])


class EditCompanyTests(TestCase):

    def setUp(self):
        self.owner = make_manager()
        self.company = make_company(self.owner)
        self.client = APIClient()
        self.client.force_authenticate(self.owner)
        self.url = f"/api/account/users/update/company/{self.company.id}/"

    def edit(self, **data):
        base = {"email": self.company.email, "phone_number": self.company.phone_number}
        base.update(data)
        return self.client.patch(self.url, base, format="multipart")

    def test_can_save_with_its_own_email(self):
        # Used to fail with "This email already registered".
        r = self.edit(address="Sekei Rd, Arusha")
        self.assertEqual(r.status_code, 200, r.content)
        self.company.refresh_from_db()
        self.assertEqual(self.company.address, "Sekei Rd, Arusha")

    def test_owner_with_three_companies_can_still_edit(self):
        # Used to fail with "You can only add max 3 Company".
        make_company(self.owner, name="Two", email="two@co.test")
        make_company(self.owner, name="Three", email="three@co.test")
        self.assertEqual(self.edit(whatsapp_number="+255 700 111 222").status_code, 200)

    def test_cannot_take_another_companys_email(self):
        other = make_company(make_manager("other@x.test"), name="Other", email="taken@other.test")
        r = self.edit(email=other.email)
        self.assertEqual(r.status_code, 400)
        self.assertIn("already registered", str(r.content))

    def test_social_links_get_https_added_and_can_be_cleared(self):
        r = self.edit(instagram_url="instagram.com/savanna", youtube_url="  https://youtube.com/@savanna  ")
        self.assertEqual(r.status_code, 200, r.content)
        self.company.refresh_from_db()
        self.assertEqual(self.company.instagram_url, "https://instagram.com/savanna")
        self.assertEqual(self.company.youtube_url, "https://youtube.com/@savanna")
        self.assertEqual(self.edit(instagram_url="").status_code, 200)
        self.company.refresh_from_db()
        self.assertEqual(self.company.instagram_url, "")

    def test_invalid_link_is_rejected(self):
        r = self.edit(facebook_url="not a link at all")
        self.assertEqual(r.status_code, 400)
        self.assertIn("facebook_url", r.json())

    def test_other_managers_cannot_edit(self):
        intruder = make_manager("intruder@x.test")
        client = APIClient()
        client.force_authenticate(intruder)
        r = client.patch(self.url, {"address": "Hacked"}, format="multipart")
        self.assertEqual(r.status_code, 404)
        self.company.refresh_from_db()
        self.assertEqual(self.company.address, "")


    def test_spaced_phone_number_is_accepted(self):
        # "+255 754 123 456" is 16 characters but only 12 digits.
        r = self.edit(phone_number="+255 754 123 456")
        self.assertEqual(r.status_code, 200, r.content)

    def test_too_many_digits_is_rejected(self):
        r = self.edit(phone_number="+1234567890123456")
        self.assertEqual(r.status_code, 400)


    def test_set_and_clear_vehicle_price(self):
        self.assertEqual(self.edit(vehicle_rate_per_day="280.50").status_code, 200)
        self.company.refresh_from_db()
        self.assertEqual(str(self.company.vehicle_rate_per_day), "280.50")
        self.assertEqual(self.edit(vehicle_rate_per_day="").status_code, 200)
        self.company.refresh_from_db()
        self.assertIsNone(self.company.vehicle_rate_per_day)

    def test_response_lists_repriced_quotes(self):
        r = self.edit(vehicle_rate_per_day="190")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()["repriced_quotes"], [])   # no quotes for this company yet

    def test_negative_vehicle_price_rejected(self):
        r = self.edit(vehicle_rate_per_day="-5")
        self.assertEqual(r.status_code, 400)
        self.assertIn("vehicle_rate_per_day", r.json())
