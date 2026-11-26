// Shared look and helpers for the cinematic guest itinerary page.

export const C = {
  ink: "#0B0F0D",        // page background
  panel: "#121815",      // cards
  line: "rgba(243,238,227,0.10)",
  gold: "#C9A35B",
  goldSoft: "#E3C98F",
  cream: "#F3EEE3",
  muted: "#A8A398",
};

export const serif = { fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif" };

// Easing used for every reveal so the page moves as one piece.
export const EASE = [0.22, 1, 0.36, 1];

export const reveal = (delay = 0, y = 28) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.8, ease: EASE, delay },
});

export const dayId = (day) => `day-${day.day_number}`;

export const dayRangeLabel = (day) => {
  const last = day.day_number + Math.max(1, day.nights_number || 1) - 1;
  return last > day.day_number ? `Day ${day.day_number} – ${last}` : `Day ${day.day_number}`;
};

export const nightsLabel = (n) => `${n} night${n === 1 ? "" : "s"}`;

export const formatLongDate = (iso) => {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

export const splitMeals = (included) =>
  (included || "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

export const firstPhoto = (day) =>
  day?.destination_info?.featured_image ||
  day?.destination_images?.[0] ||
  day?.accommodation_info?.featured_image ||
  null;

export const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number(value) || 0
  );

/* ------------------------------------------------------------------ */
/* Route map: Web-Mercator projection fitted into an SVG box           */
/* ------------------------------------------------------------------ */

const mercY = (lat) => {
  const r = (Math.max(-85, Math.min(85, lat)) * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + r / 2));
};

/**
 * Group consecutive itinerary days into map stops and project them.
 * Returns [{ key, name, days: "1", label, x, y, isStart, isEnd, type }]
 */
export function buildRouteStops(days, width, height, padding = 130) {
  const located = (days || []).filter(
    (d) => d.destination_info && d.destination_info.latitude != null && d.destination_info.longitude != null
  );
  if (!located.length) return [];

  // Merge stops at the same place (e.g. two nights split over two rows).
  const stops = [];
  for (const d of located) {
    const { name, latitude, longitude, destination_type } = d.destination_info;
    const prev = stops[stops.length - 1];
    if (prev && prev.name === name) {
      prev.dayLabels.push(dayRangeLabel(d).replace("Day ", ""));
      continue;
    }
    stops.push({ name, lat: latitude, lng: longitude, type: destination_type, dayLabels: [dayRangeLabel(d).replace("Day ", "")] });
  }

  const xs = stops.map((s) => s.lng);
  const ys = stops.map((s) => mercY(s.lat));
  let minX = Math.min(...xs), maxX = Math.max(...xs);
  let minY = Math.min(...ys), maxY = Math.max(...ys);
  // Avoid a zero-size box for one-stop trips or stops on a straight line.
  const spanX = Math.max(maxX - minX, 0.6);
  const spanY = Math.max(maxY - minY, (0.6 * Math.PI) / 180);
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const scaleX = (width - 2 * padding) / spanX;
  const scaleY = (height - 2 * padding) / ((spanY * 180) / Math.PI);
  const scale = Math.min(scaleX, scaleY);

  return stops.map((s, i) => ({
    key: `${s.name}-${i}`,
    name: s.name,
    type: s.type,
    days: s.dayLabels.join(" & "),
    x: width / 2 + (s.lng - cx) * scale,
    y: height / 2 - ((mercY(s.lat) - cy) * 180 / Math.PI) * scale,
    isStart: i === 0,
    isEnd: i === stops.length - 1 && stops.length > 1,
  }));
}

/** Smooth curved path through the stops (gentle arcs, like a flight/drive route). */
export function routePath(stops) {
  if (stops.length < 2) return "";
  let d = `M ${stops[0].x.toFixed(1)} ${stops[0].y.toFixed(1)}`;
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1], b = stops[i];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const dx = b.x - a.x, dy = b.y - a.y;
    const bend = 0.18 * (i % 2 ? 1 : -1);
    const qx = mx - dy * bend, qy = my + dx * bend;
    d += ` Q ${qx.toFixed(1)} ${qy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }
  return d;
}

/**
 * Place each stop's two-line label (DAY n / Place name) so labels don't
 * overlap each other or run off the map. Tries right, left, above, below,
 * then pushes further out with a thin leader line.
 */
export function placeLabels(stops, width, height) {
  const charW = 12.5;            // approx. width per character at the label size
  const placed = [];
  // Points along the route, so labels avoid sitting on the line itself.
  const routePts = [];
  for (let i = 1; i < stops.length; i++) {
    for (let t = 0; t <= 1; t += 0.04) {
      routePts.push({ x: stops[i - 1].x + (stops[i].x - stops[i - 1].x) * t, y: stops[i - 1].y + (stops[i].y - stops[i - 1].y) * t });
    }
  }
  const countIn = (pts, b, pad) =>
    pts.filter((q) => q.x > b.x0 - pad && q.x < b.x1 + pad && q.y > b.y0 - pad && q.y < b.y1 + pad).length;
  const area = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
  // Keep clear of the edges and of the caption along the bottom.
  const inside = (b) => b.x0 >= 8 && b.x1 <= width - 8 && b.y0 >= 8 && b.y1 <= height - 12;

  return stops.map((s) => {
    const label = `${s.isStart ? "START · " : s.isEnd ? "END · " : ""}DAY ${s.days}`;
    const w = Math.max(label.length * 10.5, s.name.length * charW);
    const h = 46;
    const options = [];
    for (const dist of [18, 50, 90, 140]) {
      const up = s.y - dist - h, down = s.y + dist;
      options.push(
        { anchor: "start", x0: s.x + dist, y0: s.y - 26 },                 // right
        { anchor: "end", x0: s.x - dist - w, y0: s.y - 26 },               // left
        { anchor: "middle", x0: s.x - w / 2, y0: up },                     // above
        { anchor: "middle", x0: s.x - w / 2, y0: down },                   // below
        { anchor: "start", x0: s.x + dist * 0.7, y0: up + dist * 0.3 },    // above-right
        { anchor: "end", x0: s.x - dist * 0.7 - w, y0: up + dist * 0.3 },  // above-left
        { anchor: "start", x0: s.x + dist * 0.7, y0: down - dist * 0.3 },  // below-right
        { anchor: "end", x0: s.x - dist * 0.7 - w, y0: down - dist * 0.3 },// below-left
      );
    }
    let best = null;
    for (const o of options) {
      const b = { x0: o.x0, y0: o.y0, x1: o.x0 + w, y1: o.y0 + h };
      if (!inside(b)) continue;
      const score =
        placed.reduce((n, p) => n + area(b, p), 0) * 4 +
        countIn(stops, b, 10) * 3000 +
        countIn(routePts, b, 3) * 400 +
        Math.hypot(b.x0 + w / 2 - s.x, b.y0 + h / 2 - s.y) * 2;
      if (!best || score < best.score) best = { ...o, b, score };
    }
    if (!best) {
      const b = { x0: s.x + 18, y0: s.y - 26, x1: s.x + 18 + w, y1: s.y + 20 };
      best = { anchor: "start", b };
    }
    const b = best.b;
    placed.push(b);
    const tx = best.anchor === "start" ? b.x0 : best.anchor === "end" ? b.x1 : (b.x0 + b.x1) / 2;
    const dist = Math.hypot((b.x0 + b.x1) / 2 - s.x, (b.y0 + b.y1) / 2 - s.y);
    return {
      anchor: best.anchor,
      x: tx,
      y: b.y0 + 16,
      leader: dist > 75,
      ax: Math.max(b.x0, Math.min(s.x, b.x1)),
      ay: Math.max(b.y0, Math.min(s.y, b.y1)),
    };
  });
}
