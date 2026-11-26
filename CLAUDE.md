# SafariGen

A SaaS for safari tour operators: build day-by-day itineraries, price them
automatically, send quotes and generate PDFs.

- **Backend:** Django 6.1 + Django REST Framework, in `backend/`
- **Frontend:** React 19 + Vite + Tailwind, in `frontend/`
- **Production frontend:** https://app.safarigen.io

## Working with the owner

- The owner is not a full-time developer. Explain every change in plain
  language: what changed, why, and what it means for operators and guests.
- **Ask before anything risky**: database migrations, deleting data or files,
  changing prices or pricing rules, anything touching production, auth, or
  secrets. Committing and pushing also need a yes.
- Work on a new git branch per issue. Never commit to `main` directly.
- Never commit `.env` files or secrets. Use `.env.example` for documentation.
- Code comments are a mix of English and Swahili. Keep that as you find it.

## Known issues (from the code review, in priority order)

1. `DEBUG = True` and `ALLOWED_HOSTS = ['*']` are hard-coded in
   `backend/backend/settings.py`, so production shows Django debug pages.
   They should come from environment variables, with safe defaults (DEBUG off).
   Note: `backend/urls.py` only serves `/media/` while DEBUG is on, so media
   needs another way to be served in production before DEBUG goes off.
2. There were no automated tests. Pricing tests now live in `backend/Itinerary/tests.py`.
3. Pricing is calculated in several places that must "match": the backend
   engine (`Itinerary/pricing.py`), the frontend hook
   (`frontend/src/GlobalShare/Itinerary/Hooks/useItineraryPrice.js`) and
   per-request helpers in `Destinations/Serializer.py`
   (`calculated_park_fee`, `calculated_rescue_fee`) and
   `Accommodation/Serializer.py` (`calculated_concesion_fee`,
   `available_room_rates`). **The backend engine should be the single source of truth.**
4. Silent wrong prices: with no matching season, `_get_room_rate` falls back to
   any rate. With no vehicle price, a hard-coded $250/day is used (also in
   `Clients/Serializer.py` and the frontend hook).
5. Seasons (`AccommodationSeason`, `DestinationSeason`) have day and month but
   no year, so 2026 and 2027 rates can't coexist.
6. Vehicle pricing and transit fees are one global `ConfigurationData` row
   (`.objects.first()`), not per company.
7. SQLite is the configured database. It should move to PostgreSQL.
8. About 530 lines of commented-out old engine at the top of `Itinerary/pricing.py`,
   plus stray files: `Itinerary/testonly.py`, `Itinerary/test.py`,
   `Itinerary/test_compress.py`, `Accommodation/models_v2.py` (all commented
   out), and `Destinations/tests.py` (contains a copy of a view, not tests).
   The commented-out first copy of `useItineraryPrice.js` is the same kind of leftover.

Other things noticed while reading (not yet fixed):
- `Itinerary/test.py` fails to import (`PricingSnapshotSerializer` undefined),
  so a plain `manage.py test` reports 1 error. Run `manage.py test Itinerary.tests` until it is removed.
- `REACT_PRINT_URL` is read by `pdf_view.py` (expects `.../print`) and
  `pricing_pdf.py` (expects the bare site URL and adds `/print/...`). One value
  can't satisfy both.
- `is_eac_country` matches by substring, so "Sudan" and "Congo" count as EAC
  members (pinned in tests as current behaviour).
- `FRONTEND_URL`, `DEFAULT_FROM_EMAIL`, CORS and CSRF origins are hard-coded in settings.
- `frontend/package-lock.json` is out of sync with `package.json` on macOS, so
  `npm ci` fails. Use `npm install --no-package-lock` locally until it is regenerated.

## Repository layout

```
backend/
  backend/            Django project: settings.py, urls.py, wsgi/asgi
  Users/              Custom user (email login), Company, roles, OTP, JWT-in-cookie auth
  Clients/            Clients, tour requests, travellers, room requests, residency helper
  Destinations/       Destinations, seasons, park/rescue fees, images, descriptions
  Accommodation/      Accommodations, seasons, room types, room rates, images
  Activities/         Activity types, locations, activities attached to itinerary days
  Meal/               Meal plans and optional (paid) meals attached to days
  Itinerary/          Versions, day-by-day plan, selected rooms, PRICING ENGINE,
                      pricing snapshot + breakdown, Mapbox map, PDF generation
  Configuration/      Global vehicle rate / transit fees, hero images
  Communication/      Email templates and quote emails (CommunicationLog)
  ActivityLog/        Audit log of staff actions
  templates/          Admin bulk-upload pages, OTP email
frontend/src/
  Apis/               axios client (api.jsx), auth provider, route guards
  Authentication/     Login, registration, forgot password
  ManagerPages/       Manager dashboard, companies, staff, settings
  StaffPages/         Staff dashboard and settings
  GlobalShare/        Shared screens: clients, itinerary create/edit, price breakdown
  SafariPreview/      Digital (web) preview, PDF pages, pricing PDF
```

API routes (`backend/backend/urls.py`): `/admin/`, `/api/account/`,
`/api/clients/`, `/api/destination/`, `/api/accommodation/`,
`/api/activities/`, `/api/itinerary/`, `/api/meals/`,
`/api/communications/`, `/api/activities-logs/`.

## Main models

- **Users:** `CustomUserModel` (email login, role ADMIN/MANAGER/STAFF,
  M2M `companies`), `Company`, `ManagerProfile`, `StaffProfile`, `UserEmailOTP`.
- **Clients:** `ClientInformation` (guest, `country`, belongs to a `Company`),
  `ClientRequestInformation` (one tour request: `tour_start_date`, tour code,
  `safari_grand_total`, `price_per_personal`), `Traveller` (`age_category`
  ADULT/CHILD/INFANT, `number`, `is_resident`), `RoomSelection`.
- **Destinations:** `Destination` (`destination_type` City/Park/Beach/Mountain),
  `DestinationSeason` (day/month range, or a season named `ALL_YEAR` with no dates),
  `DestinationFee` (per season, `fee_category` ParkFee/RescueFee,
  `residency_label` NON_RESIDENT/RESIDENT/EAC_MEMBER, adult and child fee).
- **Accommodation:** `Accommodation` (`park_status` InsidePark/OutsidePark,
  four concession fees: adult/child × resident/non-resident), `AccommodationSeason`,
  `AccommodationRoomType`, `RoomRate` (room type + optional season, meal plan,
  `price_per_night`).
- **Itinerary:** `ItineraryVersion` (versions of a request, one `is_current`),
  `MainDayByDayItinerary` (`day_number`, `nights_number`, destination,
  accommodation), `SelectedDayRoom` (room type × quantity),
  `ItineraryPricingSnapshot` (totals per version, one per version),
  `ItineraryPricingBreakdownItem` (the line items).
- **Activities:** `Activity` on a day: `is_optional` + `optional_activity_price`
  + `price_per` (PerPersonal/PerGroup/PerVehicle); `transit_fee_included` +
  `transit_fee` + `transit_fee_per` (Pax/Group/Vehicle).
- **Meal:** `MealPlan`, `OptionalMeal` on a day (`is_optional`, `price`).
- **Configuration:** `ConfigurationData` (`vehicle_rent_pricing`,
  transit fees, which are unused by the engine).

## How pricing is calculated

Entry point: `calculate_and_save_pricing_snapshot(itinerary_version,
commission_percentage, current_user)` in `backend/Itinerary/pricing.py`.
Called when an itinerary is created (`Itinerary/Serializer.py`) or edited
(`Itinerary/serializer_edit.py`); commission comes from the request.

1. **Travellers.** Count paying travellers: adults + children. Infants are
   free and ignored everywhere.
2. **Residency.** Each traveller gets a bucket (`Clients/utils/residency.py`):
   `is_resident` → RESIDENT; else guest's country in the EAC list → EAC_MEMBER;
   else NON_RESIDENT.
3. **Vehicles.** `max(1, ceil(paying travellers / 6))`.
4. **Tour days.** The furthest day reached: max of `day_number + nights - 1`.
5. **For each itinerary day** (date = tour start + day_number − 1):
   - **A. Accommodation.** Find the accommodation season containing the day's
     date by month/day (seasons may wrap over New Year, ends inclusive; with
     overlaps the first by `start_day, start_month` wins). For each selected
     room, use the rate for that season. If there's none, use the all-year rate
     (season empty). If there's none of those either, use **any** rate (issue 4).
     Line = price per night × rooms × nights. The whole stay uses the first night's season.
   - **B. Concession** (only if the accommodation is InsidePark). Per residency
     bucket: RESIDENT and EAC_MEMBER pay resident rates, NON_RESIDENT pay
     non-resident rates. Line = rate × adults (or children) × nights.
   - **C. Park and rescue fees** (only if the destination is Park or Mountain). Find
     the destination season for the day's date (seasons with no dates are
     skipped). For ParkFee and RescueFee, for each residency bucket, use the fee for that
     season, else the fee on the season named `ALL_YEAR` (any case), else
     nothing. Line = fee × adults (or children) × nights.
   - **D. Activities.** Optional activity with a price: price × travellers
     (PerPersonal), × vehicles (PerVehicle), or × 1 (PerGroup or empty).
     Non-optional activities are free. Transit fee (if `transit_fee_included`):
     fee × travellers (Pax or empty), × vehicles (Vehicle), × 1 (Group).
     Not multiplied by nights.
   - **E. Optional meals.** If `is_optional` and priced: price × paying travellers.
     Not multiplied by nights.
6. **Vehicle.** Daily rate = first `ConfigurationData.vehicle_rent_pricing`,
   else **$250** (issue 4). Line = vehicles × tour days × rate.
7. **Totals.** Subtotal = accommodation + park fees + concession + vehicle +
   activities + meals. Commission = subtotal × % / 100. Grand total = subtotal +
   commission. Price per person = grand total / paying travellers (0 if none).
   Values are stored rounded to 2 decimals.
8. **Save** (one transaction): delete the version's old snapshot, create the
   new snapshot and breakdown items, try to generate the Mapbox map (failures
   are only printed), and copy grand total and per-person price onto the
   `ClientRequestInformation`.

The frontend hook `useItineraryPrice.js` repeats steps 1, 3, 4 and 5 in the browser
with floats, using per-request fee totals from the Destination and Accommodation
serializers, which pick the season by the **tour start date** rather than each
day's date. That's why the numbers can drift (issue 3).

## Running locally

Requirements: Python 3.13 (Django 6.1 needs 3.12+; the macOS system
`python3` is 3.9 and won't work), Node 24.

### Backend

```bash
cd backend
python3.13 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env        # then set SECRET_KEY (see below)
.venv/bin/python manage.py migrate
.venv/bin/python manage.py createsuperuser
.venv/bin/python manage.py runserver      # http://localhost:8000
```

Generate a secret key:
`.venv/bin/python -c "from django.core.management.utils import get_random_secret_key as g; print(g())"`

`.env` variables: `SECRET_KEY` (required), `MAPBOX_ACCESS_TOKEN`,
`MAPBOX_STYLE`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `REACT_PRINT_URL`
(see the note above). Seed commands exist, e.g. `manage.py seed_destinations`,
`seed_accommodations`, `seed_activities`, `seed_meals`. PDF generation needs
Playwright's browser (`.venv/bin/playwright install chromium`) and optionally
Ghostscript (`gs`).

### Frontend

```bash
cd frontend
cp .env.example .env        # VITE_API_URL=http://localhost:8000/api/
npm install --no-package-lock   # see lock-file note above
npm run dev                 # http://localhost:5173
```

CORS and CSRF in settings allow only `http://localhost:5173`.

### Tests

```bash
cd backend
.venv/bin/python manage.py test Itinerary.tests
```

`Itinerary/tests.py` pins down today's pricing results, including the known-bad
fallbacks (marked `CURRENT BEHAVIOUR`). When pricing changes on purpose, update
the affected test in the same change and say why. Tests mock the Mapbox call.

GitHub Actions (`.github/workflows/tests.yml`) runs on every pull request and every push
to `main`: Django check, missing-migration check, `manage.py test backend
Itinerary.tests`, and a frontend `npm ci && npm run build`. When adding test
modules, add them to that command until the stray test files are removed.
