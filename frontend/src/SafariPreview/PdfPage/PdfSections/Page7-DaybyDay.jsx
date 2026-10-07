// ── Page7PDFDayByDaySection.jsx (Premium Book — The Heart of the Journey) ──
import React from "react";
import {
  Sunrise, Sun, Moon, Clock, Calendar, MapPin, Bed,
  Compass, Utensils, Tent, Camera, Route,
} from "lucide-react";
import { GrainOverlay, CompassRose, Ornament } from "./PdfShare/ShareSection";

const API_BASE_URL = "http://127.0.0.1:8000";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80";

const resolveImageUrl = (url) => {
  if (!url) return FALLBACK_IMAGE;
  if (
    url.startsWith("http://127.0.0.1:8000") ||
    url.startsWith("http://localhost:8000")
  ) {
    return url.replace(/http:\/\/(127\.0\.0\.1|localhost):8000/, API_BASE_URL);
  }
  return url;
};

const DAY_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
  "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty", "Twenty-One", "Twenty-Two",
];

const dayWord = (n) => DAY_WORDS[n] || String(n);

/* ── Moment icon ── */
function MomentIcon({ moment }) {
  const m = moment?.toUpperCase() || "";
  const common = "h-3.5 w-3.5 text-[#B98B3E]";
  if (m.includes("MORNING")) return <Sunrise className={common} strokeWidth={1.75} />;
  if (m.includes("AFTERNOON")) return <Sun className={common} strokeWidth={1.75} />;
  if (m.includes("EVENING")) return <Moon className={common} strokeWidth={1.75} />;
  return <Clock className={common} strokeWidth={1.75} />;
}

/* ── Section label ── */
function SectionLabel({ icon, label, tone = "gold" }) {
  const accent = tone === "rust" ? "#9C5B3C" : "#8A6528";
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-[#B98B3E]/45 bg-[#B98B3E]/[0.08] text-[#8A6528]">
        <span className="[&>svg]:h-2.5 [&>svg]:w-2.5">{icon}</span>
      </span>
      <span
        className="text-[9px] font-bold uppercase tracking-[0.32em]"
        style={{ color: accent }}
      >
        {label}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-[#B98B3E]/45 to-transparent" />
    </div>
  );
}

/* ── Day header — chapter opener ── */
function DayHeader({
  dayNumber,
  endDayNumber,
  nightsNumber,
  isMultiNight,
  dayLabel,
  dateDisplay,
  destination,
}) {
  const numeral = isMultiNight
    ? `${String(dayNumber).padStart(2, "0")}–${String(endDayNumber).padStart(2, "0")}`
    : String(dayNumber).padStart(2, "0");

  return (
    <div className="relative mb-6 border-b border-[#B98B3E]/35 pb-5">
      <div className="flex items-end gap-6">
        {/* Big numeral */}
        <div className="relative shrink-0">
          <span
            className="ddw-serif block font-bold leading-[0.82] tracking-tighter"
            style={{
              fontSize: isMultiNight ? "58px" : "76px",
              color: "#8A6528",
              textShadow: "0 1px 0 rgba(228,200,136,0.45)",
            }}
          >
            {numeral}
          </span>

          <span className="mt-1 block text-[8.5px] font-bold uppercase tracking-[0.38em] text-[#8A6528]">
            {isMultiNight ? `${nightsNumber} Nights Stay` : "Overnight"}
          </span>
        </div>

        {/* Label + destination */}
        <div className="min-w-0 flex-1 pb-1">
          <div className="mb-2 flex items-center gap-3">
            <span className="h-px w-8 bg-[#B98B3E]" />
            <span className="text-[9.5px] font-bold uppercase tracking-[0.38em] text-[#8A6528]">
              {dayLabel}
            </span>
          </div>

          <h2 className="ddw-serif text-[26px] font-bold leading-[1.08] tracking-tight text-[#0B1410]">
            {destination || "The Journey Continues"}
          </h2>

          {dateDisplay && (
            <div className="mt-2 flex items-center gap-2">
              <Calendar className="h-3 w-3 text-[#B98B3E]" />
              <span className="text-[11px] font-medium tracking-[0.06em] text-[#6B6153]">
                {dateDisplay}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Destination block ── */
function DestinationBlock({ dest, description, gallery }) {
  if (!dest) return null;
  return (
    <div className="mb-7 break-inside-avoid">
      <SectionLabel icon={<MapPin />} label="Destination" />

      <div className="relative mb-3 h-[64mm] w-full overflow-hidden border border-[#B98B3E]/40">
        <img
          src={resolveImageUrl(dest.featured_image)}
          alt={dest.name}
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
          className="h-full w-full object-cover object-center"
        />

        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B1410]/90 via-[#0B1410]/30 to-transparent" />

        <span className="absolute left-2 top-2 h-3.5 w-3.5 border-l-2 border-t-2 border-[#E4C888]" />
        <span className="absolute right-2 top-2 h-3.5 w-3.5 border-r-2 border-t-2 border-[#E4C888]" />
        <span className="absolute bottom-2 left-2 h-3.5 w-3.5 border-b-2 border-l-2 border-[#E4C888]" />
        <span className="absolute bottom-2 right-2 h-3.5 w-3.5 border-b-2 border-r-2 border-[#E4C888]" />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="ddw-serif text-[24px] font-bold leading-tight text-[#F8F4EA] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            {dest.name}
          </h3>
          {dest.location && (
            <p className="mt-1 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#E4C888]">
              <MapPin className="h-3 w-3" />
              {dest.location}
            </p>
          )}
        </div>
      </div>

      {description && (
        <p className="text-[13px] leading-relaxed text-[#0F1A14]/85">{description}</p>
      )}

      {gallery.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3 break-inside-avoid">
          {gallery.slice(0, 2).map((imgUrl, i) => (
            <div key={i} className="relative h-[38mm] overflow-hidden border border-[#B98B3E]/35">
              <img
                src={resolveImageUrl(imgUrl)}
                alt={`Destination gallery ${i + 1}`}
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-1.5 top-1.5 flex h-4 w-4 items-center justify-center border border-[#E4C888]/70 bg-[#0B1410]/70 text-[#E4C888]">
                <Camera className="h-2 w-2" />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Accommodation block ── */
function AccommodationBlock({ accom, description, rooms, gallery }) {
  if (!accom) return null;
  return (
    <div className="mb-7 break-inside-avoid">
      <SectionLabel icon={<Tent />} label="Accommodation" />

      <div className="relative border border-[#B98B3E]/35 bg-[#FDFBF6] pl-6 pr-5 py-4">
        <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#E4C888] via-[#B98B3E] to-[#8A6528]" />
        <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#B98B3E]/45" />

        <div className="mb-2 flex flex-wrap items-center gap-2.5">
          <h3 className="ddw-serif text-[17px] font-bold leading-tight text-[#0B1410]">
            {accom.name}
          </h3>
          {accom.tag_label && (
            <span className="inline-flex items-center gap-1 border border-[#B98B3E]/45 bg-[#B98B3E]/[0.08] px-2 py-[2px] text-[9px] font-bold uppercase tracking-[0.22em] text-[#8A6528]">
              {accom.tag_label}
            </span>
          )}
        </div>

        {accom.location && (
          <p className="mb-3 flex items-center gap-1.5 text-[11px] tracking-[0.06em] text-[#6B6153]">
            <MapPin className="h-3 w-3 text-[#B98B3E]" />
            {accom.location}
          </p>
        )}

        {description && (
          <p className="mb-3 text-[12.5px] leading-relaxed text-[#0F1A14]/85">
            {description}
          </p>
        )}

        {Array.isArray(rooms) && rooms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {rooms.map((room, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 border border-[#1E5A3B]/35 bg-[#1E5A3B]/[0.06] px-2.5 py-1 text-[10.5px] font-semibold text-[#1E5A3B]"
              >
                <Bed className="h-3 w-3" />
                {room.quantity}× {room.room_type_name}
              </span>
            ))}
          </div>
        )}
      </div>

      {gallery.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3 break-inside-avoid">
          {gallery.map((imgUrl, i) => (
            <div key={i} className="relative h-[34mm] overflow-hidden border border-[#B98B3E]/35">
              <img
                src={resolveImageUrl(imgUrl)}
                alt={`Accommodation gallery ${i + 1}`}
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-1.5 top-1.5 flex h-4 w-4 items-center justify-center border border-[#E4C888]/70 bg-[#0B1410]/70 text-[#E4C888]">
                <Camera className="h-2 w-2" />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Standalone gallery grid (for split days) ── */
function GalleryGrid({ images }) {
  if (!images || images.length === 0) return null;
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 break-inside-avoid">
      {images.slice(0, 4).map((imgUrl, i) => (
        <div key={i} className="relative h-[42mm] overflow-hidden border border-[#B98B3E]/35">
          <img
            src={resolveImageUrl(imgUrl)}
            alt={`Gallery ${i + 1}`}
            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
            className="h-full w-full object-cover"
          />
          <span className="absolute left-1.5 top-1.5 flex h-4 w-4 items-center justify-center border border-[#E4C888]/70 bg-[#0B1410]/70 text-[#E4C888]">
            <Camera className="h-2 w-2" />
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Activities block (timeline) ── */
function ActivitiesBlock({ activities }) {
  if (!activities || activities.length === 0) return null;
  return (
    <div className="mb-7 break-inside-avoid">
      <SectionLabel icon={<Compass />} label="Scheduled Activities" />

      <div className="relative pl-5">
        <span className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[#B98B3E]/40 via-[#B98B3E]/60 to-[#B98B3E]/40" />

        <div className="space-y-2.5">
          {activities.map((act, i) => (
            <div key={act.id || i} className="relative pl-4">
              <span className="absolute -left-[19px] top-3 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-[#B98B3E] bg-[#FDFBF6] shadow-[0_0_0_3px_rgba(185,139,62,0.12)]" />

              <div className="flex items-center gap-3 border border-[#B98B3E]/25 bg-[#FDFBF6] px-4 py-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#B98B3E]/40 bg-[#B98B3E]/[0.06]">
                  <MomentIcon moment={act.moment} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold leading-snug text-[#0B1410]">
                    {act.activity_type_name}
                  </p>
                  {(act.main_location_name || act.start_location_name) && (
                    <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] tracking-wide text-[#6B6153]">
                      <MapPin className="h-2.5 w-2.5 text-[#B98B3E]" />
                      {act.main_location_name || act.start_location_name}
                    </p>
                  )}
                </div>

                {act.is_optional && (
                  <span className="inline-flex shrink-0 items-center gap-1 border border-[#9C5B3C]/35 bg-[#9C5B3C]/[0.08] px-2 py-[3px] text-[9px] font-bold uppercase tracking-[0.22em] text-[#9C5B3C]">
                    Optional
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Meals block ── */
function MealsBlock({ meals }) {
  if (!meals) return null;
  const list = meals.split(",").map((m) => m.trim()).filter(Boolean);
  return (
    <div className="break-inside-avoid">
      <SectionLabel icon={<Utensils />} label="Meals Included" />

      <div className="flex flex-wrap gap-2">
        {list.map((meal, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 border border-[#1E5A3B]/30 bg-[#1E5A3B]/[0.06] px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#1E5A3B]"
          >
            <span className="h-1 w-1 rotate-45 bg-[#1E5A3B]" />
            {meal}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Split heuristic ── */
function shouldSplitDay(day) {
  const acts = (day.activities || []).length;
  const destImgs = (day.destination_images || []).length;
  const accomImgs = (day.accommodation_images || []).length;
  const destDesc = (day.destination_description || "").length;
  const accomDesc = (day.accommodation_description || "").length;

  const weight =
    80 +
    (destImgs > 0 ? 45 : 0) +
    (destDesc > 200 ? 20 : 0) +
    (day.accommodation_info ? 60 : 0) +
    (accomImgs > 0 ? 45 : 0) +
    (accomDesc > 300 ? 15 : 0) +
    acts * 14 +
    (day.included_meals ? 25 : 0);

  // Returns a STRING mode (consistent type)
  if (weight > 380) return "triple";
  if (weight > 235) return "double";
  return "single";
}

/* ── Day page (dispatcher) ── */
function DayPage({ day, index, tourCode, startYear, totalDays }) {
  const mode = shouldSplitDay(day);
  const common = { day, index, tourCode, startYear, totalDays };

  if (mode === "single") {
    return <DayPageBlock {...common} part="all" />;
  }

  if (mode === "triple") {
    return (
      <>
        <DayPageBlock {...common} part="main" />
        <DayPageBlock {...common} part="gallery" />
        <DayPageBlock {...common} part="extra" />
      </>
    );
  }

  // "double"
  return (
    <>
      <DayPageBlock {...common} part="main" />
      <DayPageBlock {...common} part="extra" />
    </>
  );
}

/* ── The day page block ── */
function DayPageBlock({ day, index, tourCode, startYear, totalDays, part }) {
  const isMultiNight = day.nights_number > 1;
  const dayLabel = isMultiNight
    ? `Days ${dayWord(day.day_number)}–${dayWord(
        day.day_number + day.nights_number - 1
      )}`
    : `Day ${dayWord(day.day_number)}`;

  const destGallery = Array.isArray(day.destination_images)
    ? day.destination_images
    : [];
  const accommGallery = Array.isArray(day.accommodation_images)
    ? day.accommodation_images
    : [];

  // ── Section visibility per part ──
  const showHeader = part === "all" || part === "main";
  const showDestination = part === "all" || part === "main";
  const showAccommodation = part === "all" || part === "main";
  const showStandaloneGalleries = part === "gallery" || part === "extra";
  const showActivities = part === "all" || part === "extra";
  const showMeals = part === "all" || part === "extra";

  // Galleries inline ONLY on single-page compact view
  const destGalleryInBlock = part === "all" ? destGallery : [];
  const accommGalleryInBlock = part === "all" ? accommGallery : [];

  // Continued label
  const continuedLabel =
    part === "gallery"
      ? `${dayLabel} · Photo Gallery`
      : part === "extra"
      ? `${dayLabel} · Continued`
      : null;

  return (
    <div
      className="pdf-section relative w-full overflow-hidden bg-[#F8F4EA] text-[#0F1A14]
                 [-webkit-print-color-adjust:exact] [print-color-adjust:exact]"
      style={{ pageBreakAfter: "always" }}
    >
      {/* Cream tint */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #FDFBF6 0%, #F8F4EA 55%, #EFE8DA 100%)",
        }}
      />

      {/* Compass watermark — alternates per day AND per part */}
      <CompassRose
        className={
          (index + (part === "extra" || part === "gallery" ? 1 : 0)) % 2 === 0
            ? "absolute -bottom-24 -right-24 h-[380px] w-[380px] opacity-[0.06]"
            : "absolute -bottom-24 -left-24 h-[380px] w-[380px] opacity-[0.06]"
        }
        stroke="#8A6528"
      />

      {/* Grain */}
      <GrainOverlay opacity={0.035} blend="multiply" />

      {/* LEFT rail */}
      <div className="absolute left-[4mm] top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-4">
        <span className="h-12 w-px bg-gradient-to-b from-transparent to-[#B98B3E]/60" />
        <span className="rotate-180 text-[8.5px] uppercase tracking-[0.55em] text-[#8A6528]/75 [writing-mode:vertical-rl]">
          Day {String(day.day_number).padStart(2, "0")} of{" "}
          {String(totalDays).padStart(2, "0")}
          {part !== "all" && part !== "main" ? " · Continued" : ""} · {startYear}
        </span>
        <span className="h-12 w-px bg-gradient-to-t from-transparent to-[#B98B3E]/60" />
      </div>

      {/* RIGHT rail */}
      <div className="absolute right-[4mm] top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-3">
        <span className="h-10 w-px bg-gradient-to-b from-transparent to-[#B98B3E]/60" />
        <span className="text-[8px] uppercase tracking-[0.42em] text-[#8A6528]/55 [writing-mode:vertical-rl]">
          Reference
        </span>
        <span
          className="border border-[#B98B3E]/85 px-1.5 py-2.5 text-[11px] font-bold tracking-[0.32em] text-[#8A6528] [writing-mode:vertical-rl]"
          style={{ boxShadow: "0 0 10px -6px rgba(138,101,40,0.35)" }}
        >
          {tourCode}
        </span>
        <span className="h-10 w-px bg-gradient-to-t from-transparent to-[#B98B3E]/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-[22mm] py-[16mm]">
        {showHeader && (
          <DayHeader
            dayNumber={day.day_number || index + 1}
            endDayNumber={
              (day.day_number || index + 1) + (day.nights_number || 1) - 1
            }
            nightsNumber={day.nights_number || 1}
            isMultiNight={isMultiNight}
            dayLabel={dayLabel}
            dateDisplay={day.date_display}
            destination={day.destination_info?.name}
          />
        )}

        {continuedLabel && (
          <div className="mb-6 flex items-center gap-3 border-b border-[#B98B3E]/35 pb-4">
            <span className="h-px w-8 bg-[#B98B3E]" />
            <span className="text-[9.5px] font-bold uppercase tracking-[0.38em] text-[#8A6528]">
              {continuedLabel}
            </span>
          </div>
        )}

        {showDestination && (
          <DestinationBlock
            dest={day.destination_info}
            description={day.destination_description}
            gallery={destGalleryInBlock}
          />
        )}

        {showAccommodation && (
          <AccommodationBlock
            accom={day.accommodation_info}
            description={day.accommodation_description}
            rooms={day.selected_rooms}
            gallery={accommGalleryInBlock}
          />
        )}

        {/* Standalone galleries for split pages */}
        {showStandaloneGalleries && destGallery.length > 0 && (
          <>
            <SectionLabel icon={<MapPin />} label="Destination Gallery" />
            <GalleryGrid images={destGallery} />
          </>
        )}

        {showStandaloneGalleries && accommGallery.length > 0 && (
          <>
            <SectionLabel icon={<Tent />} label="Accommodation Gallery" />
            <GalleryGrid images={accommGallery} />
          </>
        )}

        {showActivities && <ActivitiesBlock activities={day.activities} />}

        {showMeals && <MealsBlock meals={day.included_meals} />}

        <Ornament className="my-6 opacity-75" />

        {/* Colophon page tag */}
        <div className="flex items-center justify-between gap-6 pt-2">
          <span className="text-[8.5px] uppercase tracking-[0.32em] text-[#8A6528]/70">
            {dayLabel}
          </span>
          <span className="inline-flex items-center gap-2 text-[8.5px] uppercase tracking-[0.32em] text-[#8A6528]/70">
            <Route className="h-3 w-3" />
            {day.destination_info?.name || "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function Page7PDFDayByDaySection({ safariData }) {
  const { itinerary } = safariData || {};
  const { client_info, days = [] } = itinerary || {};

  if (!days || days.length === 0) {
    return (
      <div className="flex h-[297mm] w-full items-center justify-center bg-[#F8F4EA] text-[#6B6153]">
        <p className="ddw-serif text-xl">No itinerary data available.</p>
      </div>
    );
  }

  const tourCode = client_info?.tour_code || "—";
  const startYear = (() => {
    const d = new Date(client_info?.tour_start_date);
    return Number.isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
  })();
  const totalDays = days.length;

  return (
    <>
      {days.map((day, idx) => (
        <DayPage
          key={day.id || day.day_number || idx}
          day={day}
          index={idx}
          tourCode={tourCode}
          startYear={startYear}
          totalDays={totalDays}
        />
      ))}
    </>
  );
}