"""
Price grid for one lodge: room types × meal plans (rows) by season + "All year" (columns).

Each cell is one RoomRate (room type, season or none, meal plan, price per night).
An empty cell means "no price". Because quotes are never priced with a guess
(review issue 4), the grid highlights gaps: seasons where a room has no price at
all, and dates of the year that no season covers (when the room has no all-year
price either).
"""

import calendar
from datetime import date, timedelta
from decimal import Decimal, InvalidOperation

from django.db import transaction

from Accommodation.models import AccommodationSeason, RoomRate

MEAL_PLANS = RoomRate._meta.get_field("meal_plan").choices      # [(code, label), ...]
ALL_YEAR = "all"


def _short_plan(label):
    return label.split(" (")[0]


def season_label(season):
    return (f"{season.start_day} {calendar.month_abbr[season.start_month]} – "
            f"{season.end_day} {calendar.month_abbr[season.end_month]}")


def _covers(season, md):
    start, end = (season.start_month, season.start_day), (season.end_month, season.end_day)
    return start <= md <= end if start <= end else (md >= start or md <= end)


def uncovered_ranges(seasons):
    """Date ranges of a (non-leap) year that no season covers, e.g. ['1 Jun – 31 Dec']."""
    ranges, start = [], None
    day = date(2027, 1, 1)
    while day.year == 2027:
        covered = any(_covers(s, (day.month, day.day)) for s in seasons)
        if not covered and start is None:
            start = day
        if covered and start is not None:
            ranges.append((start, day - timedelta(days=1)))
            start = None
        day += timedelta(days=1)
    if start is not None:
        ranges.append((start, date(2027, 12, 31)))
    fmt = lambda d: f"{d.day} {calendar.month_abbr[d.month]}"
    return [fmt(a) if a == b else f"{fmt(a)} – {fmt(b)}" for a, b in ranges]


def build_grid(accommodation, show_all_plans=False, posted=None):
    """posted: submitted values to show again when saving failed."""
    seasons = sorted(AccommodationSeason.objects.filter(accommodation=accommodation),
                     key=lambda s: (s.start_month, s.start_day))
    room_types = list(accommodation.room_type.all().order_by("id"))
    rates = list(RoomRate.objects.filter(room_type__accommodation=accommodation))

    by_cell = {}
    for r in rates:
        by_cell.setdefault((r.room_type_id, r.meal_plan, r.season_id or ALL_YEAR), r)

    used_plans = {r.meal_plan for r in rates}
    plans = [(c, l) for c, l in MEAL_PLANS if show_all_plans or not used_plans or c in used_plans]

    columns = [{"key": s.id, "name": s.name, "dates": season_label(s)} for s in seasons]
    columns.append({"key": ALL_YEAR, "name": "All year", "dates": "used when no season matches"})

    gaps = uncovered_ranges(seasons)
    rows, missing = [], []
    for rt in room_types:
        has_all_year = any((rt.id, c, ALL_YEAR) in by_cell for c, _ in MEAL_PLANS)
        priced_seasons = {s.id for s in seasons if any((rt.id, c, s.id) in by_cell for c, _ in MEAL_PLANS)}
        for i, (code, label) in enumerate(plans):
            cells = []
            for col in columns:
                rate = by_cell.get((rt.id, code, col["key"]))
                season_gap = col["key"] != ALL_YEAR and col["key"] not in priced_seasons and not has_all_year
                name = f"price__{rt.id}__{code}__{col['key']}"
                cells.append({
                    "name": name,
                    "value": posted[name] if posted is not None and name in posted
                             else (rate.price_per_night if rate else ""),
                    "gap": season_gap and rate is None,
                })
            rows.append({"room": rt, "first_of_room": i == 0, "plan_count": len(plans),
                         "plan": _short_plan(label), "cells": cells})
        for s in seasons:
            if s.id not in priced_seasons and not has_all_year:
                missing.append(f"{rt.name}: no price for {s.name} ({season_label(s)})")
        if gaps and not has_all_year:
            missing.append(f"{rt.name}: no season covers {', '.join(gaps)} and there's no all-year price")
    if not room_types:
        missing.append("This lodge has no room types yet — add them in the Room types tab first.")

    return {"columns": columns, "rows": rows, "plans": plans, "missing": missing,
            "uncovered": gaps, "show_all_plans": show_all_plans or not used_plans,
            "has_rooms": bool(room_types)}


def save_grid(accommodation, post):
    """Apply submitted cells. Returns (errors, counts). Saves nothing if any cell is invalid."""
    room_ids = set(accommodation.room_type.values_list("id", flat=True))
    season_ids = set(AccommodationSeason.objects.filter(accommodation=accommodation).values_list("id", flat=True))
    plan_codes = {c for c, _ in MEAL_PLANS}

    cells, errors = [], []
    for key, raw in post.items():
        if not key.startswith("price__"):
            continue
        try:
            _, rt_id, plan, col = key.split("__")
            rt_id = int(rt_id)
            season_id = None if col == ALL_YEAR else int(col)
        except ValueError:
            continue
        if rt_id not in room_ids or plan not in plan_codes or (season_id is not None and season_id not in season_ids):
            continue                                    # not this lodge's: ignore
        raw = (raw or "").strip().replace(",", "")
        if raw == "":
            cells.append((rt_id, plan, season_id, None))
            continue
        try:
            price = Decimal(raw)
        except InvalidOperation:
            errors.append(f"“{raw}” isn't a price.")
            continue
        if price < 0:
            errors.append(f"Prices can't be negative ({raw}).")
            continue
        cells.append((rt_id, plan, season_id, price.quantize(Decimal("0.01"))))

    counts = {"added": 0, "changed": 0, "removed": 0}
    if errors:
        return errors, counts

    with transaction.atomic():
        for rt_id, plan, season_id, price in cells:
            existing = RoomRate.objects.filter(room_type_id=rt_id, meal_plan=plan, season_id=season_id).first()
            if price is None:
                if existing:
                    existing.delete()
                    counts["removed"] += 1
            elif existing is None:
                RoomRate.objects.create(room_type_id=rt_id, meal_plan=plan, season_id=season_id, price_per_night=price)
                counts["added"] += 1
            elif existing.price_per_night != price:
                existing.price_per_night = price
                existing.save(update_fields=["price_per_night", "updated_at"])
                counts["changed"] += 1
    return errors, counts
