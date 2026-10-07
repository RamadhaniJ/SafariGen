// ── Page6MapPDFSection.jsx (Premium Book Page — Part Eight: Route Map) ──
import React from "react";
import {
  MapPin,
  Navigation,
  Tent,
  Route,
  Compass,
  Sparkles,
  Hotel,
  Moon,
  ArrowRight,
} from "lucide-react";
import { Ornament } from "./PdfShare/ShareSection";
import PdfBookPage from "./PdfShare/SmartSplit";

/* ── Chapter opener ── */
function ChapterOpener({ icon, title, subtitle }) {
  return (
    <div className="mb-8 border-b border-[#B98B3E]/35 pb-6">
      <h1 className="ddw-serif flex items-center gap-3 text-[36px] font-bold leading-[1.08] tracking-tight text-[#0B1410]">
        <span className="text-[#B98B3E] [&>svg]:h-7 [&>svg]:w-7">{icon}</span>
        {title}
      </h1>

      {subtitle && (
        <div className="mt-3 flex items-center gap-3">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#B98B3E]" />
          <p className="text-[11.5px] font-medium italic tracking-wide text-[#8A6528]">
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Atlas plate — framed map with gold corners ── */
function AtlasPlate({ image, startDestination, endDestination }) {
  return (
    <div className="relative break-inside-avoid border border-[#B98B3E]/50 bg-[#FDFBF6] p-3 shadow-[0_15px_50px_-30px_rgba(11,20,16,0.6)]">
      {/* Outer gold rule */}
      <div className="pointer-events-none absolute inset-[6px] border border-[#B98B3E]/25" />

      {/* Gold top shimmer */}
      <div
        className="absolute inset-x-3 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #B98B3E 30%, #E4C888 50%, #B98B3E 70%, transparent)",
        }}
      />

      {/* 4 corner ticks */}
      <span className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-[#E4C888]" />
      <span className="absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-[#E4C888]" />
      <span className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-[#E4C888]" />
      <span className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-[#E4C888]" />

      {/* Plate label */}
      <div className="absolute left-6 top-6 z-10 inline-flex items-center gap-2 border border-[#B98B3E]/50 bg-[#0B1410]/85 px-3 py-1.5 backdrop-blur-sm">
        <Route className="h-3 w-3 text-[#E4C888]" />
        <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#E4C888]">
          Route Atlas
        </span>
      </div>

      {/* Map image */}
      <div className="relative overflow-hidden border border-[#B98B3E]/25">
        <img
          src={image}
          alt="Safari Route Map"
          className="h-auto w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-[#F8F4EA]/[0.06]" />
      </div>

      {/* Start → End legend */}
      <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-[#B98B3E]/30 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#1E5A3B]/45 bg-[#1E5A3B]/[0.08] text-[#1E5A3B]">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[8.5px] font-bold uppercase tracking-[0.32em] text-[#8A6528]">
              Starting Point
            </p>
            <p className="ddw-serif text-[14px] font-bold leading-tight text-[#0B1410]">
              {startDestination}
            </p>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-center px-4 sm:flex">
          <span className="h-px flex-1 border-t border-dashed border-[#B98B3E]/70" />
          <span className="mx-2 flex h-6 w-6 shrink-0 items-center justify-center border border-[#B98B3E]/55 bg-[#F8F4EA]">
            <MapPin className="h-3 w-3 text-[#B98B3E]" />
          </span>
          <span className="h-px flex-1 border-t border-dashed border-[#B98B3E]/70" />
        </div>

        <div className="flex items-center gap-3 sm:justify-end">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#9C5B3C]/45 bg-[#9C5B3C]/[0.08] text-[#9C5B3C]">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[8.5px] font-bold uppercase tracking-[0.32em] text-[#8A6528]">
              Ending Point
            </p>
            <p className="ddw-serif text-[14px] font-bold leading-tight text-[#0B1410]">
              {endDestination}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Empty state (no map) ── */
function EmptyState() {
  return (
    <div className="relative break-inside-avoid border border-dashed border-[#B98B3E]/45 bg-[#FDFBF6] px-10 py-14 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-[#B98B3E]/55 bg-[#B98B3E]/[0.08]">
        <Compass className="h-6 w-6 text-[#B98B3E]" />
      </div>
      <p className="ddw-serif mb-2 text-[18px] font-bold text-[#0B1410]">
        Route map coming soon
      </p>
      <p className="mx-auto max-w-[120mm] text-[12.5px] leading-relaxed text-[#0F1A14]/70">
        A personalised route map will be attached once your itinerary is
        finalised.
      </p>
    </div>
  );
}

/* ── Route ledger row ── */
function RouteRow({ day }) {
  const dayRange =
    day.nights_number > 1
      ? `Days ${day.day_number}–${day.day_number + day.nights_number - 1}`
      : `Day ${day.day_number}`;

  const nightsLabel =
    day.nights_number > 1 ? `${day.nights_number} Nights` : "1 Night";

  return (
    <tr className="group border-b border-[#B98B3E]/12 last:border-b-0 align-top hover:bg-[#FCE9DA]/30 transition-colors duration-200">
      <td className="py-4 pl-6 pr-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-[#B98B3E]/45 bg-[#B98B3E]/[0.08] text-[#8A6528]">
              <Moon className="h-2.5 w-2.5" />
            </span>
            <span className="ddw-serif text-[14px] font-bold text-[#0B1410] whitespace-nowrap">
              {dayRange}
            </span>
          </div>
          <span className="text-[10.5px] font-medium tracking-wide text-[#6B6153] pl-7">
            {nightsLabel}
          </span>
        </div>
      </td>

      <td className="py-4 px-4">
        <div className="flex items-start gap-2">
          <MapPin className="mt-[2px] h-3.5 w-3.5 shrink-0 text-[#B98B3E]" />
          <div className="min-w-0">
            <p className="text-[12.5px] font-medium text-[#0F1A14]/90">
              {day.destination_info?.name || "En Route / Transit"}
            </p>
            {day.destination_info?.location && (
              <p className="mt-0.5 text-[10.5px] tracking-wide text-[#6B6153]">
                {day.destination_info.location}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="py-4 pl-4 pr-6">
        {day.accommodation_info?.name ? (
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-[#1E5A3B]/40 bg-[#1E5A3B]/[0.08] text-[#1E5A3B]">
              <Hotel className="h-2.5 w-2.5" />
            </span>
            <span className="ddw-serif text-[13px] font-bold leading-snug text-[#0B1410]">
              {day.accommodation_info.name}
            </span>
          </div>
        ) : (
          <span className="inline-flex items-center gap-2 border border-[#8A6528]/30 bg-[#8A6528]/[0.05] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A6528]">
            <Tent className="h-3 w-3" />
            Departure · No Accommodation
          </span>
        )}
      </td>
    </tr>
  );
}

/* ── Route ledger (chunk of days) ── */
function RouteLedger({
  days,
  chunkIndex,
  totalChunks,
  isLastChunk,
  startDestination,
  endDestination,
}) {
  return (
    <div>
      {/* Section header — only on first chunk */}
      {chunkIndex === 0 && (
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-[10px] font-bold text-[#B98B3E]">
            01
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.38em] text-[#8A6528]">
            Route Schedule
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-[#B98B3E]/60 to-transparent" />
          <span className="ddw-serif italic text-[12px] text-[#8A6528]">
            {totalChunks > 1 ? `Part ${chunkIndex + 1} of ${totalChunks}` : ""}
          </span>
        </div>
      )}

      {/* Continued header for chunks 2+ */}
      {chunkIndex > 0 && (
        <div className="mb-4 flex items-center gap-3 border-b border-[#B98B3E]/35 pb-3">
          <span className="h-px w-8 bg-[#B98B3E]" />
          <span className="text-[9.5px] font-bold uppercase tracking-[0.38em] text-[#8A6528]">
            Route Schedule · Continued
          </span>
        </div>
      )}

      <div className="relative break-inside-avoid border border-[#B98B3E]/40 bg-[#FDFBF6] shadow-[0_10px_40px_-25px_rgba(11,20,16,0.5)]">
        {/* Gold top shimmer */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, #B98B3E 35%, #E4C888 50%, #B98B3E 65%, transparent)",
          }}
        />

        {/* Corner ticks */}
        <span className="absolute left-2 top-2 h-3 w-3 border-l border-t border-[#B98B3E]/60" />
        <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#B98B3E]/60" />
        <span className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-[#B98B3E]/60" />
        <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-[#B98B3E]/60" />

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#0B1410] text-[#F8F4EA]">
              {[
                { label: "Schedule", align: "left" },
                { label: "Destination", align: "left" },
                { label: "Accommodation", align: "left" },
              ].map((h, i) => (
                <th
                  key={i}
                  className={`border-b border-[#B98B3E]/35 py-3.5 ${
                    i === 0 ? "pl-6 pr-4" : i === 2 ? "pl-4 pr-6" : "px-4"
                  }`}
                >
                  <span className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.32em] text-[#E4C888]">
                    <span className="h-1 w-1 rotate-45 bg-[#B98B3E]" />
                    {h.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {days.map((day, idx) => (
              <RouteRow key={day.id || idx} day={day} />
            ))}
          </tbody>
        </table>

        {/* Footer strip — only on last chunk */}
        {isLastChunk && (
          <div className="flex items-center justify-between border-t border-[#B98B3E]/35 bg-[#0B1410]/[0.03] px-6 py-3">
            <span className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#8A6528]">
              Full Route
            </span>
            <span className="inline-flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#8A6528]">
              {startDestination}
              <ArrowRight className="h-3 w-3" />
              {endDestination}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function Page6MapPDFSection({ safariData }) {
  const { itinerary } = safariData || {};
  const { client_info, days = [], map_image_url } = itinerary || {};

  if (!client_info) return null;

  const tourCode = client_info.tour_code || "—";
  const companyName =
    client_info.staff_company || client_info.company_name || "ACE";

  const startDestination =
    client_info.start_destination ||
    days[0]?.destination_info?.name ||
    "—";
  const endDestination =
    client_info.end_destination ||
    days[days.length - 1]?.destination_info?.name ||
    "—";

  const mapImage = map_image_url?.map_image;

  /* ── Chunk route days ── */
  const DAYS_PER_CHUNK = 6;
  const dayChunks = [];
  if (days.length > 0) {
    for (let i = 0; i < days.length; i += DAYS_PER_CHUNK) {
      dayChunks.push(days.slice(i, i + DAYS_PER_CHUNK));
    }
  }

  /* ── Build sections array ── */
  const sections = [];

  // 1. Atlas plate (or empty state)
  sections.push({
    id: "map",
    weight: mapImage ? 170 : 120,
    element: mapImage ? (
      <AtlasPlate
        image={mapImage}
        startDestination={startDestination}
        endDestination={endDestination}
      />
    ) : (
      <EmptyState />
    ),
  });

  // 2. Ornament divider
  sections.push({
    id: "ornament",
    weight: 20,
    element: <Ornament className="opacity-80" />,
  });

  // 3. Route ledger chunks
  dayChunks.forEach((chunk, idx) => {
    const isLastChunk = idx === dayChunks.length - 1;
    sections.push({
      id: `ledger-${idx}`,
      weight: 40 + chunk.length * 26 + (isLastChunk ? 15 : 0),
      element: (
        <RouteLedger
          days={chunk}
          chunkIndex={idx}
          totalChunks={dayChunks.length}
          isLastChunk={isLastChunk}
          startDestination={startDestination}
          endDestination={endDestination}
        />
      ),
    });
  });

  return (
    <PdfBookPage
      tourCode={tourCode}
      leftRailLabel={`${companyName} · Route`}
      watermarkSide="right"
      opener={
        <ChapterOpener
          icon={<Route />}
          title="Journey Overview"
          subtitle={`${startDestination} → ${endDestination} · Mapped across ${days.length} days.`}
        />
      }
      openerWeight={60}
      sections={sections}
    />
  );
}