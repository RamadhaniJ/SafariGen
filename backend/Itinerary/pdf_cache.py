"""
Saved copies of the guest itinerary PDF, so downloads are instant.

Rendering a PDF (headless Chromium loading the React print page, then
Ghostscript) takes 30-60 seconds. Instead of doing that on every click:

- The finished PDF is saved on disk under PDF_CACHE_DIR, named after the
  version and a "fingerprint" of everything shown in it. Any edit to the
  version, its prices, the client, the company, or the destinations and
  lodges used (including their photos and descriptions) changes the
  fingerprint, so a fresh PDF is made automatically.
- A background thread pre-builds the PDF when a quote is saved and whenever
  its guest preview page is opened, so the first click is usually instant too.
- A lock file stops two renders of the same PDF at once (also across server
  processes). A download that arrives mid-render waits for it instead of
  starting a second browser.
"""

import hashlib
import logging
import os
import threading
import time
from pathlib import Path

from django.conf import settings
from django.db import connections, transaction
from django.db.models import Max

log = logging.getLogger(__name__)

LOCK_STALE_SECONDS = 10 * 60      # a lock older than this is from a crashed render
WAIT_POLL_SECONDS = 0.5

# Each render runs a full Chromium; cap how many run at once per server process.
_render_slots = threading.BoundedSemaphore(int(os.getenv("PDF_MAX_PARALLEL_RENDERS", "2")))


# ---------------------------------------------------------------------------
# Paths and settings
# ---------------------------------------------------------------------------

def cache_dir() -> Path:
    path = Path(getattr(settings, "PDF_CACHE_DIR", Path(settings.BASE_DIR) / "pdf_cache"))
    path.mkdir(parents=True, exist_ok=True)
    return path


def _max_age_seconds() -> float:
    return float(getattr(settings, "PDF_CACHE_MAX_AGE_HOURS", 24 * 7)) * 3600


def _paths(version_id, fp):
    base = cache_dir() / f"{version_id}_{fp}"
    return base.with_suffix(".pdf"), base.with_suffix(".lock")


# ---------------------------------------------------------------------------
# Fingerprint: changes whenever anything printed in the PDF changes
# ---------------------------------------------------------------------------

def _stamp(value):
    return value.isoformat() if value else "-"


def fingerprint(version) -> str:
    from Accommodation.models import AccommodationDescription, AccommodationImages
    from Destinations.models import DestinationDescription, DestinationImage
    from Itinerary.models import ItineraryPricingSnapshot, MainDayByDayItinerary

    request = version.client_request
    client = request.client_requested
    company = getattr(client, "company", None)

    parts = [
        str(getattr(settings, "PDF_CACHE_VERSION", "1")),
        str(version.id), _stamp(version.updated_at),
        _stamp(request.updated_at), _stamp(client.updated_at),
        _stamp(company.updated_at if company else None),
        _stamp(ItineraryPricingSnapshot.objects.filter(version=version)
               .values_list("updated_at", flat=True).first()),
    ]

    dest_ids, acc_ids = set(), set()
    days = (MainDayByDayItinerary.objects.filter(version=version)
            .select_related("destination", "accommodation").order_by("day_number"))
    for day in days:
        parts += [str(day.id), _stamp(day.updated_at),
                  _stamp(day.destination.updated_at if day.destination else None),
                  _stamp(day.accommodation.updated_at if day.accommodation else None)]
        if day.destination_id:
            dest_ids.add(day.destination_id)
        if day.accommodation_id:
            acc_ids.add(day.accommodation_id)

    for model, field, ids in [
        (DestinationImage, "destination_id__in", dest_ids),
        (DestinationDescription, "destination_id__in", dest_ids),
        (AccommodationImages, "accommodation_id__in", acc_ids),
        (AccommodationDescription, "accommodation_id__in", acc_ids),
    ]:
        agg = model.objects.filter(**{field: ids}).aggregate(m=Max("updated_at"), n=Max("id"))
        parts += [_stamp(agg["m"]), str(agg["n"])]

    return hashlib.sha256("|".join(parts).encode()).hexdigest()[:20]


# ---------------------------------------------------------------------------
# Cache file helpers
# ---------------------------------------------------------------------------

def _fresh(path: Path) -> bool:
    try:
        return time.time() - path.stat().st_mtime < _max_age_seconds()
    except FileNotFoundError:
        return False


def _try_lock(lock: Path) -> bool:
    try:
        fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
        os.close(fd)
        return True
    except FileExistsError:
        if _lock_is_stale(lock):
            lock.unlink(missing_ok=True)
            return _try_lock(lock)
        return False


def _lock_is_stale(lock: Path) -> bool:
    try:
        return time.time() - lock.stat().st_mtime > LOCK_STALE_SECONDS
    except FileNotFoundError:
        return False


def _remove_older_copies(version_id, keep: Path):
    for old in cache_dir().glob(f"{version_id}_*.pdf"):
        if old != keep:
            old.unlink(missing_ok=True)


def _render_and_store(version, pdf_path: Path, lock: Path, have_lock: bool) -> bytes:
    from Itinerary.pdf_view import render_itinerary_pdf

    try:
        with _render_slots:
            pdf_bytes = render_itinerary_pdf(version)
        tmp = pdf_path.with_suffix(f".{os.getpid()}.{threading.get_ident()}.tmp")
        tmp.write_bytes(pdf_bytes)
        os.replace(tmp, pdf_path)          # appears all at once, never half-written
        _remove_older_copies(version.id, keep=pdf_path)
        return pdf_bytes
    finally:
        if have_lock:
            lock.unlink(missing_ok=True)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def get_or_render(version, max_wait_seconds=LOCK_STALE_SECONDS) -> bytes:
    """Return the PDF for `version`: the saved copy if current, else render it."""
    pdf_path, lock = _paths(version.id, fingerprint(version))
    if _fresh(pdf_path):
        return pdf_path.read_bytes()

    have_lock = _try_lock(lock)
    if not have_lock:
        # Another request or the background pre-build is rendering it: wait.
        deadline = time.time() + max_wait_seconds
        while lock.exists() and time.time() < deadline:
            time.sleep(WAIT_POLL_SECONDS)
        if _fresh(pdf_path):
            return pdf_path.read_bytes()
        have_lock = _try_lock(lock)       # that render failed: try ourselves

    return _render_and_store(version, pdf_path, lock, have_lock)


def warm_in_background(version_id):
    """Pre-build the PDF in a background thread (skips if already current or in progress)."""

    def run():
        from Itinerary.models import ItineraryVersion
        try:
            version = ItineraryVersion.objects.select_related(
                "client_request__client_requested__company").get(id=version_id)
            pdf_path, lock = _paths(version.id, fingerprint(version))
            if _fresh(pdf_path) or not _try_lock(lock):
                return
            started = time.time()
            _render_and_store(version, pdf_path, lock, have_lock=True)
            log.info("Pre-built itinerary PDF %s in %.1fs", version_id, time.time() - started)
        except Exception:
            log.exception("Background PDF pre-build failed for version %s", version_id)
        finally:
            connections.close_all()

    threading.Thread(target=run, name=f"pdf-warm-{version_id}", daemon=True).start()


def schedule_warm(version_id):
    """Pre-build once the current database transaction has been saved."""
    if getattr(settings, "PDF_PREBUILD_ENABLED", True):
        transaction.on_commit(lambda: warm_in_background(version_id))
