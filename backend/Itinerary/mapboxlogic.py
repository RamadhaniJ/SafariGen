# import math
# import urllib.parse
# import requests
# from django.conf import settings
# from django.core.files.base import ContentFile
# from django.utils import timezone


# def encode_polyline(points):
#     """
#     Encodes a list of (lat, lng) tuples into a Mapbox-compatible Polyline string.
#     """
#     encoded = []
#     prev_lat = 0
#     prev_lng = 0

#     for lat, lng in points:
#         lat_e5 = int(round(lat * 1e5))
#         lng_e5 = int(round(lng * 1e5))

#         d_lat = lat_e5 - prev_lat
#         d_lng = lng_e5 - prev_lng

#         prev_lat = lat_e5
#         prev_lng = lng_e5

#         for val in (d_lat, d_lng):
#             val = ~(val << 1) if val < 0 else val << 1
#             while val >= 0x20:
#                 encoded.append(chr((0x20 | (val & 0x1f)) + 63))
#                 val >>= 5
#             encoded.append(chr(val + 63))

#     return "".join(encoded)


# def build_mapbox_url(destinations, width=1200, height=700):
#     """
#     Constructs an ultra-clean, Silicon Valley-styled Mapbox Static Image URL.
#     """
#     mapbox_token = getattr(settings, 'MAPBOX_ACCESS_TOKEN', '')
#     mapbox_style = getattr(settings, 'MAPBOX_STYLE', 'mapbox/outdoors-v12')
    
#     if not mapbox_token:
#         print("❌ Error: MAPBOX_ACCESS_TOKEN haijawekwa kwenye settings.py")
#         return None

#     # 1. CHUJA COORDINATES HALALI
#     valid_destinations = [
#         d for d in destinations 
#         if d['lat'] is not None and d['lng'] is not None
#         and not (d['lat'] == 0 and d['lng'] == 0)
#         and (-90 <= d['lat'] <= 90) and (-180 <= d['lng'] <= 180)
#     ]

#     if not valid_destinations:
#         print("❌ Hakuna destinations zenye coordinates halali.")
#         return None

#     overlays = []

#     # 2. ROUTE POLYLINE (Modern Dual-Layer Drop Shadow Line)
#     # Preservation ya Sequence halisi ya safari (1 -> 2 -> 3 -> ... -> N)
#     raw_points = [(d['lat'], d['lng']) for d in valid_destinations]
#     polyline_str = encode_polyline(raw_points)
#     safe_polyline = urllib.parse.quote(polyline_str)

#     # A. Outer Glow / White Outline Path (For high contrast on green maps)
#     outer_path = f"path-7+ffffff-0.85({safe_polyline})"
#     overlays.append(outer_path)

#     # B. Inner Slate Line (Deep Charcoal Slate #0f172a - Very Premium)
#     inner_path = f"path-4+0f172a-0.95({safe_polyline})"
#     overlays.append(inner_path)

#     # 3. MODERNIZED MARKERS & PIN OVERLAYS
#     # Tumia sequence order badala ya group ili kuzuia 400 error na icon mismatched.
#     total_stops = len(valid_destinations)

#     for i, dest in enumerate(valid_destinations):
#         lng, lat = dest['lng'], dest['lat']
#         day_num = dest.get('day_number', i + 1)

#         if i == 0:
#             # START / ARRIVAL: Emerald Green Marker ikiwa na Icon ya "star" au namba "1"
#             # Mapbox static API valid Maki icons: star, flag, airport, lodging nk.
#             pin = f"pin-l-airport+059669({lng},{lat})"
#         elif i == total_stops - 1:
#             # END / DEPARTURE: Crimson Red Marker ikiwa na Icon ya "flag"
#             pin = f"pin-l-marker+e11d48({lng},{lat})"
#         else:
#             # KATIKATI: Clean Slate Blue Pins zenye Namba ya siku (2, 3, 4...)
#             label = str(day_num) if day_num <= 99 else "pin"
#             pin = f"pin-s-{label}+0284c7({lng},{lat})"

#         overlays.append(pin)

#     all_overlays = ",".join(overlays)

#     # 4. AUTO-FIT BOUNDING BOX WITH PADDING
#     lats = [d['lat'] for d in valid_destinations]
#     lngs = [d['lng'] for d in valid_destinations]
    
#     min_lng, max_lng = min(lngs), max(lngs)
#     min_lat, max_lat = min(lats), max(lats)

#     if min_lng == max_lng and min_lat == max_lat:
#         center_and_zoom = f"{min_lng},{min_lat},11"
#         map_url = (
#             f"https://api.mapbox.com/styles/v1/{mapbox_style}/static/"
#             f"{all_overlays}/"
#             f"{center_and_zoom}/{width}x{height}@2x?"
#             f"access_token={mapbox_token}"
#         )
#     else:
#         bbox = f"[{min_lng},{min_lat},{max_lng},{max_lat}]"
#         map_url = (
#             f"https://api.mapbox.com/styles/v1/{mapbox_style}/static/"
#             f"{all_overlays}/"
#             f"{bbox}/{width}x{height}@2x?"
#             f"padding=110&"
#             f"access_token={mapbox_token}"
#         )

#     return map_url


# def generate_and_save_safari_map(snapshot, days_queryset):
#     """
#     Inatengeneza na kuhifadhi picha ya ramani kwenye Snapshot ya Safari.
#     """
#     destinations_for_map = []
    
#     for day in days_queryset:
#         if day.destination and day.destination.location_latitude and day.destination.location_longitude:
#             try:
#                 lat = float(day.destination.location_latitude)
#                 lng = float(day.destination.location_longitude)
                
#                 if -90 <= lat <= 90 and -180 <= lng <= 180:
#                     destinations_for_map.append({
#                         'day_number': getattr(day, 'day_number', len(destinations_for_map) + 1),
#                         'name': day.destination.name,
#                         'lat': lat,
#                         'lng': lng,
#                     })
#             except (ValueError, TypeError) as e:
#                 print(f"⚠️ Error kwenye coordinates za destination '{day.destination.name}': {e}")
#                 continue

#     if len(destinations_for_map) < 2:
#         print("⚠️ Destinations hazitoshi kuunda njia.")
#         return False, "Destinations hazitoshi au hazina coordinates."

#     map_url = build_mapbox_url(destinations_for_map)
    
#     if not map_url:
#         return False, "Imeshindwa kuunda Map URL."

#     try:
#         response = requests.get(map_url, timeout=30)
        
#         if response.status_code != 200:
#             error_message = f"❌ Mapbox API Error [{response.status_code}]: {response.text}"
#             print(error_message)
#             return False, error_message
            
#         response.raise_for_status()
        
#         tour_code = getattr(snapshot.client_request, 'tour_code', 'safari')
#         filename = f"map_{tour_code}_{timezone.now().strftime('%Y%m%d%H%M%S')}.png"
        
#         snapshot.map_image.save(
#             filename,
#             ContentFile(response.content),
#             save=True
#         )
        
#         snapshot.map_generated_at = timezone.now()
#         snapshot.save(update_fields=['map_image', 'map_generated_at'])
        
#         print(f"✅ Ramani ya kimataifa imetengenezwa na kuhifadhiwa kikamilifu: {filename}")
#         return True, "Success"

#     except Exception as e:
#         err = f"❌ Error: {e}"
#         print(err)
#         return False, err








import math
import io
import urllib.parse
import requests
from PIL import Image, ImageDraw, ImageFont
from django.conf import settings
from django.core.files.base import ContentFile
from django.utils import timezone
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

TILE_SIZE = 256  # Mapbox/Google Web Mercator base tile size


# =========================================================================
# 1. POLYLINE ENCODING (unchanged — still correct)
# =========================================================================
def encode_polyline(points):
    """
    Encodes a list of (lat, lng) tuples into a Mapbox-compatible Polyline string.
    """
    encoded = []
    prev_lat = 0
    prev_lng = 0

    for lat, lng in points:
        lat_e5 = int(round(lat * 1e5))
        lng_e5 = int(round(lng * 1e5))

        d_lat = lat_e5 - prev_lat
        d_lng = lng_e5 - prev_lng

        prev_lat = lat_e5
        prev_lng = lng_e5

        for val in (d_lat, d_lng):
            val = ~(val << 1) if val < 0 else val << 1
            while val >= 0x20:
                encoded.append(chr((0x20 | (val & 0x1f)) + 63))
                val >>= 5
            encoded.append(chr(val + 63))

    return "".join(encoded)


# =========================================================================
# 2. WEB MERCATOR PROJECTION HELPERS
#    We need these because we compute our OWN center/zoom instead of
#    letting Mapbox auto-fit a bbox — that's the only way to know exactly
#    where each point lands in pixel space afterwards, so we can draw our
#    own dots + label boxes with Pillow in the right spots.
# =========================================================================
def _lon_to_x(lon, zoom):
    return (lon + 180.0) / 360.0 * (TILE_SIZE * (2 ** zoom))


def _lat_to_y(lat, zoom):
    lat_rad = math.radians(lat)
    return (
        1.0 - math.log(math.tan(lat_rad) + 1.0 / math.cos(lat_rad)) / math.pi
    ) / 2.0 * (TILE_SIZE * (2 ** zoom))


def _y_to_lat(y, zoom):
    n = math.pi - 2.0 * math.pi * y / (TILE_SIZE * (2 ** zoom))
    return math.degrees(math.atan(math.sinh(n)))


def fit_bounds(min_lng, min_lat, max_lng, max_lat, width, height, padding=90, max_zoom=15.5):
    """
    Re-implements the core of Mapbox GL's fitBounds(): finds the largest
    zoom level at which the bounding box (with padding) fits inside
    width x height, and the lng/lat center of that box.

    Returns (center_lng, center_lat, zoom).
    """
    # Degenerate case: a single point (or all points identical)
    if min_lng == max_lng and min_lat == max_lat:
        return min_lng, min_lat, min(max_zoom, 11.0)

    avail_w = max(width - 2 * padding, 1)
    avail_h = max(height - 2 * padding, 1)

    x1, x2 = _lon_to_x(min_lng, 0), _lon_to_x(max_lng, 0)
    # lat is inverted in pixel space (higher lat = smaller y)
    y1, y2 = _lat_to_y(max_lat, 0), _lat_to_y(min_lat, 0)

    lng_span_px = max(x2 - x1, 1e-9)
    lat_span_px = max(y2 - y1, 1e-9)

    zoom_x = math.log2(avail_w / lng_span_px)
    zoom_y = math.log2(avail_h / lat_span_px)
    zoom = max(min(zoom_x, zoom_y, max_zoom), 0)

    center_lng = (min_lng + max_lng) / 2.0
    center_y0 = (_lat_to_y(min_lat, 0) + _lat_to_y(max_lat, 0)) / 2.0
    center_lat = _y_to_lat(center_y0, 0)

    return center_lng, center_lat, round(zoom, 3)


def project_to_pixel(lat, lng, center_lng, center_lat, zoom, width, height):
    """
    Projects a lat/lng into pixel coordinates on the FINAL rendered image
    (width x height, i.e. the @1x frame — multiply by the @2x scale factor
    separately when drawing on the retina image).
    """
    cx = _lon_to_x(center_lng, zoom)
    cy = _lat_to_y(center_lat, zoom)
    px = width / 2.0 + (_lon_to_x(lng, zoom) - cx)
    py = height / 2.0 + (_lat_to_y(lat, zoom) - cy)
    return px, py


# =========================================================================
# 3. GROUP STOPS THAT SHARE A LOCATION INTO ONE LABEL
#    e.g. Arusha visited on day 1 and day 6 -> "Day 1 & 6"
#         Serengeti visited days 4-5        -> "Day 4-5"
# =========================================================================
def _round_coord(lat, lng, precision=3):
    return (round(lat, precision), round(lng, precision))


def group_stops_by_location(destinations):
    """
    destinations: ordered list of dicts with 'lat', 'lng', 'day_number', 'name'
    Returns an ordered list of "stop groups":
        {
            'lat', 'lng', 'name',
            'day_numbers': [1, 6],
            'label': "Day 1 & 6"  (or "Day 4-5", or "Day 3"),
            'is_first': bool, 'is_last': bool
        }
    Order is preserved by first appearance so the route line still walks
    the stops in the correct visiting sequence.
    """
    groups_by_coord = {}
    order = []

    for dest in destinations:
        key = _round_coord(dest['lat'], dest['lng'])
        if key not in groups_by_coord:
            groups_by_coord[key] = {
                'lat': dest['lat'],
                'lng': dest['lng'],
                'name': dest.get('name', ''),
                'day_numbers': [],
            }
            order.append(key)
        groups_by_coord[key]['day_numbers'].append(dest['day_number'])

    all_days = [d['day_number'] for d in destinations]
    first_day, last_day = min(all_days), max(all_days)

    stop_groups = []
    for key in order:
        g = groups_by_coord[key]
        days = sorted(set(g['day_numbers']))
        g['label'] = _format_day_label(days)
        g['is_first'] = first_day in days and days[0] == first_day and destinations[0]['day_number'] in days
        g['is_last'] = last_day in days
        stop_groups.append(g)

    return stop_groups


def _format_day_label(days):
    """[3] -> 'Day 3'; [4,5] -> 'Day 4-5'; [1,6] -> 'Day 1 & 6'."""
    if len(days) == 1:
        return f"Day {days[0]}"
    # contiguous run -> range
    if days == list(range(days[0], days[-1] + 1)):
        return f"Day {days[0]}-{days[-1]}"
    # non-contiguous -> "&"-joined
    return "Day " + " & ".join(str(d) for d in days)


# =========================================================================
# 4. BUILD THE PLAIN MAPBOX STATIC URL — BASE MAP ONLY, NO OVERLAYS.
#    We deliberately do NOT ask Mapbox to draw the route line anymore.
#    Reason: Mapbox renders the "path" overlay server-side using its own
#    internal zoom/rounding, while we compute dot positions client-side
#    with our own project_to_pixel(). Those two pipelines can drift apart
#    by a few pixels — which is exactly the "line misses the dot" bug you
#    saw. Drawing the line ourselves (see draw_route_and_stops below)
#    with the SAME projection function used for the dots guarantees the
#    line always passes exactly through every stop, every time.
# =========================================================================
def build_mapbox_url(center_lng, center_lat, zoom, width=1200, height=700):
    mapbox_token = getattr(settings, 'MAPBOX_ACCESS_TOKEN', '')
    mapbox_style = getattr(settings, 'MAPBOX_STYLE', 'mapbox/light-v11')

    if not mapbox_token:
        print("❌ Error: MAPBOX_ACCESS_TOKEN haijawekwa kwenye settings.py")
        return None

    map_url = (
        f"https://api.mapbox.com/styles/v1/{mapbox_style}/static/"
        f"{center_lng},{center_lat},{zoom},0,0/{width}x{height}@2x?"
        f"access_token={mapbox_token}"
    )
    return map_url


# =========================================================================
# 5. DRAW DOTS + ROUNDED "DAY X" LABEL BOXES WITH PILLOW
# =========================================================================
def _load_font(size, bold=True):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold
        else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except (IOError, OSError):
            continue
    return ImageFont.load_default()


def draw_route_and_stops(image, route_points, stop_groups, center_lng, center_lat, zoom,
                          width, height, scale=2):
    """
    image: PIL Image already opened at @2x resolution (width*scale x height*scale)
    Draws, all using the SAME project_to_pixel() call so nothing can drift:
      - the route line, in the exact visiting order (route_points)
      - a small dark dot at every stop
      - a beige rounded-rect label box with "Day X" text near it
        (start/end stops get a slightly darker box, mirroring the screenshot)
    """
    draw = ImageDraw.Draw(image)
    font = _load_font(22)

    line_color = (26, 26, 26, 235)
    line_width = 2 * scale
    box_fill = (222, 210, 186, 255)      # tan/beige, like the screenshot
    box_fill_edge = (200, 186, 158, 255)  # slightly darker for start/end
    text_color = (40, 32, 20, 255)
    dot_color = (20, 20, 20, 255)

    # --- 1. Route line, drawn segment by segment so it passes through
    #         every stop exactly (same projection as the dots below).
    pixel_points = [
        tuple(
            c * scale for c in project_to_pixel(lat, lng, center_lng, center_lat, zoom, width, height)
        )
        for lat, lng in route_points
    ]
    if len(pixel_points) >= 2:
        draw.line(pixel_points, fill=line_color, width=line_width, joint="curve")
        # round off each joint/vertex so corners don't look jagged at this width
        r = line_width / 2
        for x, y in pixel_points:
            draw.ellipse([x - r, y - r, x + r, y + r], fill=line_color)

    # --- 2. Dots + labels
    for stop in stop_groups:
        px, py = project_to_pixel(
            stop['lat'], stop['lng'], center_lng, center_lat, zoom, width, height
        )
        px, py = px * scale, py * scale
        dot_r = 5 * scale / 2

        # dot marker
        draw.ellipse(
            [px - dot_r, py - dot_r, px + dot_r, py + dot_r],
            fill=dot_color,
        )

        # label box
        label = stop['label']
        bbox = draw.textbbox((0, 0), label, font=font)
        text_w, text_h = bbox[2] - bbox[0], bbox[3] - bbox[1]
        pad_x, pad_y = 12 * scale / 2, 7 * scale / 2

        box_w = text_w + pad_x * 2
        box_h = text_h + pad_y * 2

        # place label above-left of the dot, like the screenshot; nudge
        # so it doesn't run off the image edges
        box_x0 = px - box_w / 2
        box_y0 = py - dot_r - box_h - 6 * scale / 2
        box_x0 = max(4, min(box_x0, image.width - box_w - 4))
        box_y0 = max(4, box_y0)

        fill = box_fill_edge if (stop['is_first'] or stop['is_last']) else box_fill

        draw.rounded_rectangle(
            [box_x0, box_y0, box_x0 + box_w, box_y0 + box_h],
            radius=6 * scale / 2,
            fill=fill,
        )
        draw.text(
            (box_x0 + pad_x - bbox[0], box_y0 + pad_y - bbox[1]),
            label,
            font=font,
            fill=text_color,
        )

    return image


# =========================================================================
# 6. MAIN ENTRY POINT
# =========================================================================
def generate_and_save_safari_map(snapshot, days_queryset, width=1200, height=700):
    """
    Builds a clean route map (thin line + "Day X" label boxes, merging
    repeat-visited locations) and saves it onto the Snapshot.
    """
    destinations_for_map = []

    for day in days_queryset:
        if day.destination and day.destination.location_latitude and day.destination.location_longitude:
            try:
                lat = float(day.destination.location_latitude)
                lng = float(day.destination.location_longitude)
                if -90 <= lat <= 90 and -180 <= lng <= 180 and not (lat == 0 and lng == 0):
                    destinations_for_map.append({
                        'day_number': getattr(day, 'day_number', len(destinations_for_map) + 1),
                        'name': day.destination.name,
                        'lat': lat,
                        'lng': lng,
                    })
            except (ValueError, TypeError) as e:
                print(f"⚠️ Error kwenye coordinates za destination '{day.destination.name}': {e}")
                continue

    if len(destinations_for_map) < 2:
        print("⚠️ Destinations hazitoshi kuunda njia.")
        return False, "Destinations hazitoshi au hazina coordinates."

    # Sort by day_number so we are 100% sure the route starts exactly at
    # Day 1 and ends exactly at the last day, regardless of the order the
    # queryset happened to come in.
    destinations_for_map.sort(key=lambda d: d['day_number'])

    # Route line: keep full visiting sequence, but collapse consecutive
    # duplicate points (e.g. two nights at the same lodge) so the polyline
    # doesn't get a pointless zero-length segment. The first point is
    # guaranteed to be Day 1's location and the last point the final day's
    # location, since the list is sorted above.
    route_points = []
    for d in destinations_for_map:
        pt = (d['lat'], d['lng'])
        if not route_points or route_points[-1] != pt:
            route_points.append(pt)

    # Labels: merge every visit to the same coordinate into one stop group
    stop_groups = group_stops_by_location(destinations_for_map)

    lats = [d['lat'] for d in destinations_for_map]
    lngs = [d['lng'] for d in destinations_for_map]
    center_lng, center_lat, zoom = fit_bounds(
        min(lngs), min(lats), max(lngs), max(lats), width, height, padding=90
    )

    map_url = build_mapbox_url(center_lng, center_lat, zoom, width, height)
    if not map_url:
        return False, "Imeshindwa kuunda Map URL."

    try:
        session = requests.Session()
        retries = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[500, 502, 503, 504]
        )
        session.mount('https://', HTTPAdapter(max_retries=retries))

        response = session.get(map_url, timeout=15)

        if response.status_code != 200:
            error_message = f"❌ Mapbox API Error [{response.status_code}]: {response.text}"
            print(error_message)
            return False, error_message
        response.raise_for_status()

        # Draw the route line + our own dots/label boxes on top of the
        # plain base map — all with the SAME projection function, so the
        # line always passes exactly through every dot.
        base_image = Image.open(io.BytesIO(response.content)).convert("RGBA")
        final_image = draw_route_and_stops(
            base_image, route_points, stop_groups, center_lng, center_lat, zoom, width, height, scale=2
        )

        buffer = io.BytesIO()
        final_image.convert("RGB").save(buffer, format="PNG")
        buffer.seek(0)

        tour_code = getattr(snapshot.version.client_request, 'tour_code', 'safari')
        filename = f"map_{tour_code}_{timezone.now().strftime('%Y%m%d%H%M%S')}.png"

        snapshot.map_image.save(filename, ContentFile(buffer.read()), save=True)
        snapshot.map_generated_at = timezone.now()
        snapshot.save(update_fields=['map_image', 'map_generated_at'])

        print(f"✅ Ramani ya kimataifa imetengenezwa na kuhifadhiwa kikamilifu: {filename}")
        return True, "Success"


    except requests.exceptions.ConnectionError as ce:
        err_msg = f"❌ Mapbox Connection/DNS Error: Mtandao umeshindwa kufikia api.mapbox.com ({ce})"
        print(err_msg)
        return False, err_msg

    except Exception as e:
        err = f"❌ Error: ya Jumla wakati wa kutengeneza ramani:  {e}"
        print(err)
        return False, err