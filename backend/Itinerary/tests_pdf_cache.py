"""
Tests for saved guest-itinerary PDFs (Itinerary/pdf_cache.py).

The real renderer (headless Chromium) is replaced by a fake so these run in
milliseconds. Run with:
    cd backend && .venv/bin/python manage.py test Itinerary.tests_pdf_cache
"""

import os
import shutil
import tempfile
import threading
import time
from datetime import date
from pathlib import Path
from unittest.mock import patch

from django.test import Client, TestCase, override_settings

from Accommodation.models import AccommodationImages
from Users.models import Company
from Itinerary import pdf_cache
from Itinerary.tests import (
    make_accommodation, make_client_request, make_day, make_destination, make_version,
)


class FakeRenderer:
    """Stands in for render_itinerary_pdf: counts calls, returns distinct bytes."""

    def __init__(self, delay=0.0):
        self.calls = 0
        self.delay = delay
        self.lock = threading.Lock()

    def __call__(self, version):
        with self.lock:
            self.calls += 1
            n = self.calls
        if self.delay:
            time.sleep(self.delay)
        return f"%PDF-fake render {n}".encode()


class PdfCacheTestBase(TestCase):

    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="pdfcache-test-")
        self.addCleanup(shutil.rmtree, self.tmp, ignore_errors=True)
        override = override_settings(PDF_CACHE_DIR=self.tmp, PDF_CACHE_MAX_AGE_HOURS=168,
                                     PDF_CACHE_VERSION="1", PDF_PREBUILD_ENABLED=False)
        override.enable()
        self.addCleanup(override.disable)

        self.renderer = FakeRenderer()
        p = patch("Itinerary.pdf_view.render_itinerary_pdf", side_effect=self._render)
        p.start()
        self.addCleanup(p.stop)

        self.req = make_client_request(start=date(2026, 7, 10), travellers=[("ADULT", 2, False)])
        # The preview page currently crashes for clients without a company.
        self.req.client_requested.company = Company.objects.create(name="Test Safaris Ltd")
        self.req.client_requested.save()
        self.version = make_version(self.req)
        self.dest = make_destination("Serengeti", "Park")
        self.lodge = make_accommodation("Lodge", destination=self.dest)
        self.day = make_day(self.version, 1, 2, self.dest, self.lodge)

    def _render(self, version):
        return self.renderer(version)

    def pdf_files(self):
        return sorted(p.name for p in Path(self.tmp).glob("*.pdf"))


class GetOrRenderTests(PdfCacheTestBase):

    def test_first_download_renders_and_saves(self):
        self.assertEqual(pdf_cache.get_or_render(self.version), b"%PDF-fake render 1")
        self.assertEqual(self.renderer.calls, 1)
        self.assertEqual(len(self.pdf_files()), 1)
        self.assertTrue(self.pdf_files()[0].startswith(str(self.version.id)))

    def test_second_download_uses_saved_copy(self):
        pdf_cache.get_or_render(self.version)
        self.assertEqual(pdf_cache.get_or_render(self.version), b"%PDF-fake render 1")
        self.assertEqual(self.renderer.calls, 1)

    def test_editing_the_day_makes_a_new_pdf_and_removes_the_old_one(self):
        pdf_cache.get_or_render(self.version)
        self.day.nights_number = 3
        self.day.save()
        self.assertEqual(pdf_cache.get_or_render(self.version), b"%PDF-fake render 2")
        self.assertEqual(len(self.pdf_files()), 1)

    def test_changes_that_appear_in_the_pdf_invalidate_it(self):
        changes = [
            lambda: self.req.client_requested.save(),              # client renamed etc.
            lambda: self.req.save(),                               # tour request edited
            lambda: self.version.save(),                           # version status/details
            lambda: self.lodge.save(),                             # lodge edited
            lambda: self.dest.save(),                              # destination edited
            lambda: AccommodationImages.objects.create(            # lodge photo added
                accommodation=self.lodge, images="x.jpg", tag="ROOM"),
        ]
        fp = pdf_cache.fingerprint(self.version)
        for change in changes:
            time.sleep(0.002)  # make sure updated_at moves on
            change()
            self.version.refresh_from_db()
            new_fp = pdf_cache.fingerprint(self.version)
            self.assertNotEqual(new_fp, fp)
            fp = new_fp

    def test_cache_version_setting_rebuilds_everything(self):
        pdf_cache.get_or_render(self.version)
        with override_settings(PDF_CACHE_VERSION="2"):
            self.assertEqual(pdf_cache.get_or_render(self.version), b"%PDF-fake render 2")

    def test_saved_copy_expires(self):
        pdf_cache.get_or_render(self.version)
        old = time.time() - 8 * 24 * 3600
        for f in Path(self.tmp).glob("*.pdf"):
            os.utime(f, (old, old))
        pdf_cache.get_or_render(self.version)
        self.assertEqual(self.renderer.calls, 2)

    def test_failed_render_saves_nothing_and_releases_lock(self):
        with patch("Itinerary.pdf_view.render_itinerary_pdf", side_effect=RuntimeError("boom")):
            with self.assertRaises(RuntimeError):
                pdf_cache.get_or_render(self.version)
        self.assertEqual(self.pdf_files(), [])
        self.assertEqual(list(Path(self.tmp).glob("*.lock")), [])
        self.assertEqual(pdf_cache.get_or_render(self.version), b"%PDF-fake render 1")

    def test_download_waits_for_render_already_in_progress(self):
        # Threads can't see this test's uncommitted rows, so fix the fingerprint.
        self.enterContext(patch("Itinerary.pdf_cache.fingerprint", return_value="fixedfp"))
        self.renderer.delay = 0.5
        results = []
        threads = [threading.Thread(target=lambda: results.append(pdf_cache.get_or_render(self.version)))
                   for _ in range(3)]
        for t in threads:
            t.start()
        for t in threads:
            t.join()
        self.assertEqual(self.renderer.calls, 1)
        self.assertEqual(results, [b"%PDF-fake render 1"] * 3)

    def test_stale_lock_from_crashed_render_is_ignored(self):
        _, lock = pdf_cache._paths(self.version.id, pdf_cache.fingerprint(self.version))
        lock.touch()
        old = time.time() - pdf_cache.LOCK_STALE_SECONDS - 5
        os.utime(lock, (old, old))
        self.assertEqual(pdf_cache.get_or_render(self.version), b"%PDF-fake render 1")


class BackgroundPrebuildTests(PdfCacheTestBase):
    # A real background thread can't see this test's uncommitted rows, so these
    # tests capture the thread's work function and run it in the test itself.

    def run_warm(self):
        with patch("Itinerary.pdf_cache.threading.Thread") as fake_thread, \
             patch("Itinerary.pdf_cache.connections.close_all"):
            pdf_cache.warm_in_background(self.version.id)
            target = fake_thread.call_args.kwargs["target"]
        target()

    def test_prebuild_saves_pdf_then_download_is_instant(self):
        self.run_warm()
        self.assertEqual(self.renderer.calls, 1)
        self.assertEqual(pdf_cache.get_or_render(self.version), b"%PDF-fake render 1")
        self.assertEqual(self.renderer.calls, 1)

    def test_prebuild_skips_when_already_saved(self):
        pdf_cache.get_or_render(self.version)
        self.run_warm()
        self.assertEqual(self.renderer.calls, 1)

    def test_prebuild_skips_when_render_in_progress(self):
        _, lock = pdf_cache._paths(self.version.id, pdf_cache.fingerprint(self.version))
        lock.touch()
        self.run_warm()
        self.assertEqual(self.renderer.calls, 0)

    def test_prebuild_errors_are_logged_not_raised(self):
        with patch("Itinerary.pdf_view.render_itinerary_pdf", side_effect=RuntimeError("boom")), \
             self.assertLogs("Itinerary.pdf_cache", level="ERROR"):
            self.run_warm()

    def test_schedule_warm_respects_setting(self):
        with patch("Itinerary.pdf_cache.warm_in_background") as warm:
            with override_settings(PDF_PREBUILD_ENABLED=False), self.captureOnCommitCallbacks(execute=True):
                pdf_cache.schedule_warm(self.version.id)
            warm.assert_not_called()
            with override_settings(PDF_PREBUILD_ENABLED=True), self.captureOnCommitCallbacks(execute=True):
                pdf_cache.schedule_warm(self.version.id)
            warm.assert_called_once_with(self.version.id)


class DownloadEndpointTests(PdfCacheTestBase):

    def url(self, client_id=None):
        return f"/api/itinerary/view/pdf/{client_id or self.req.id}/{self.version.id}/"

    def test_download_returns_pdf_attachment(self):
        r = Client().get(self.url())
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r["Content-Type"], "application/pdf")
        self.assertIn('attachment; filename="Test Safari.pdf"', r["Content-Disposition"])
        self.assertEqual(r.content, b"%PDF-fake render 1")

    def test_repeat_download_does_not_render_again(self):
        Client().get(self.url())
        Client().get(self.url())
        self.assertEqual(self.renderer.calls, 1)

    def test_wrong_client_is_404(self):
        other = make_client_request(travellers=[("ADULT", 1, False)])
        self.assertEqual(Client().get(self.url(client_id=other.id)).status_code, 404)

    def test_render_failure_is_500_json(self):
        with patch("Itinerary.pdf_view.render_itinerary_pdf", side_effect=RuntimeError("boom")):
            r = Client().get(self.url())
        self.assertEqual(r.status_code, 500)
        self.assertIn("PDF generation failed", r.json()["error"])

    def test_opening_preview_schedules_prebuild_but_renderer_visit_does_not(self):
        preview = f"/api/itinerary/preview/client/safari/data/{self.req.id}/{self.version.id}/"
        with patch("Itinerary.views.schedule_warm") as warm:
            Client().get(preview, HTTP_USER_AGENT="Mozilla/5.0 Safari/605")
            warm.assert_called_once_with(self.version.id)
            warm.reset_mock()
            Client().get(preview, HTTP_USER_AGENT="Mozilla/5.0 HeadlessChrome/151.0")
            warm.assert_not_called()


class PreviewRouteMapDataTests(PdfCacheTestBase):
    """The guest page's animated route map needs each destination's coordinates."""

    def test_preview_includes_destination_coordinates_and_type(self):
        self.dest.location_latitude = "-2.333333"
        self.dest.location_longitude = "34.833333"
        self.dest.save()
        url = f"/api/itinerary/preview/client/safari/data/{self.req.id}/{self.version.id}/"
        with patch("Itinerary.views.schedule_warm"):
            data = Client().get(url).json()
        info = data["itinerary"]["days"][0]["destination_info"]
        self.assertEqual(info["destination_type"], "Park")
        self.assertAlmostEqual(info["latitude"], -2.333333)
        self.assertAlmostEqual(info["longitude"], 34.833333)

    def test_missing_coordinates_are_null(self):
        url = f"/api/itinerary/preview/client/safari/data/{self.req.id}/{self.version.id}/"
        with patch("Itinerary.views.schedule_warm"):
            info = Client().get(url).json()["itinerary"]["days"][0]["destination_info"]
        self.assertIsNone(info["latitude"])
        self.assertIsNone(info["longitude"])
