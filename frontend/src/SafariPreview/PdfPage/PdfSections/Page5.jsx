// ── Page5PDFSection.jsx (Premium Book Page — Part Seven: Trip Summary) ──
import React from "react";
import {
  Sparkles,
  MapPin,
  Utensils,
  Hotel,
  CalendarCheck,
  Compass,
  Calendar,
  BedDouble,
  ArrowRight,
} from "lucide-react";
import { Ornament } from "./PdfShare/ShareSection";
import PdfBookPage from "./PdfShare/SmartSplit";

/* ── Chapter opener ── */
function ChapterOpener({ icon, title, subtitle }) {
  return (
    <div className="mb-8 border-b border-[#B98B3E]/35 pb-6">
      <h1 className="ddw-serif flex flex-wrap items-baseline gap-3 text-[36px] font-bold leading-[1.08] tracking-tight text-[#0B1410]">
        <span className="text-[#B98B3E] [&>svg]:h-7 [&>svg]:w-7">{icon}</span>
        <span>{title}</span>
        <span className="ddw-serif italic font-light text-[#8A6528]">
          — Summary
        </span>
      </h1>

      {subtitle && (
        <div className="mt-3 flex items-center gap-3">
          <p className="text-[11.5px] font-medium italic tracking-wide text-[#8A6528]">
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Ledger row ── */
function LedgerRow({ day }) {
  const dayRange =
    day.nights_number > 1
      ? `Day ${day.day_number}–${day.day_number + day.nights_number - 1}`
      : `Day ${day.day_number}`;

  const rooms = (day.selected_rooms || [])
    .map((r) => `${r.quantity} × ${r.room_type_name}`)
    .join(" · ");

  const mealPlan = (() => {
    if (!day.included_meals) return "No meals included";
    const mealList = day.included_meals.split(",").map((m) => m.trim());
    if (mealList.length === 3) return "Full Board";
    if (mealList.length === 2) return "Half Board";
    return "Bed & Breakfast";
  })();

  return (
    <tr className="group border-b border-[#B98B3E]/12 last:border-b-0 hover:bg-[#FCE9DA]/30 transition-colors duration-200 align-top">
      <td className="py-4 pl-6 pr-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-[#B98B3E]/45 bg-[#B98B3E]/[0.08] text-[#8A6528]">
              <Calendar className="h-2.5 w-2.5" />
            </span>
            <span className="ddw-serif text-[14px] font-bold text-[#0B1410] whitespace-nowrap">
              {dayRange}
            </span>
          </div>
          <span className="text-[10.5px] font-medium tracking-wide text-[#6B6153] pl-7">
            {day.date_display}
          </span>
        </div>
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-2 text-[12.5px] font-medium text-[#0F1A14]/85">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#B98B3E]" />
          <span>{day.destination_info?.name || "—"}</span>
        </div>
      </td>

      <td className="py-4 px-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Hotel className="h-3.5 w-3.5 shrink-0 text-[#B98B3E]" />
            <span className="ddw-serif text-[13px] font-bold leading-snug text-[#0B1410]">
              {day.accommodation_info?.name || "No Accommodation"}
            </span>
          </div>

          {rooms && (
            <div className="flex items-center gap-1.5 pl-5 text-[10.5px] tracking-wide text-[#6B6153]">
              <BedDouble className="h-3 w-3 shrink-0 text-[#B98B3E]/70" />
              <span>{rooms}</span>
            </div>
          )}
        </div>
      </td>

      <td className="py-4 pl-4 pr-6 text-right">
        <span className="inline-flex items-center gap-2 border border-[#1E5A3B]/30 bg-[#1E5A3B]/[0.06] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1E5A3B]">
          <Utensils className="h-3 w-3" />
          {mealPlan}
        </span>
      </td>
    </tr>
  );
}

/* ── Ledger table (chunk of days) ── */
function LedgerTable({ days, isLastChunk, totalDays, totalNights }) {
  return (
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
              { label: "Day", align: "left" },
              { label: "Destination", align: "left" },
              { label: "Accommodation", align: "left" },
              { label: "Meal Plan", align: "right" },
            ].map((h, i) => (
              <th
                key={i}
                className={`border-b border-[#B98B3E]/35 py-3.5 ${
                  i === 0
                    ? "pl-6 pr-4"
                    : i === 3
                    ? "pl-4 pr-6"
                    : "px-4"
                } text-${h.align}`}
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
            <LedgerRow key={day.id || day.day_number || idx} day={day} />
          ))}
        </tbody>
      </table>

      {/* Footer strip only on last chunk */}
      {isLastChunk && (
        <div className="flex items-center justify-between border-t border-[#B98B3E]/35 bg-[#0B1410]/[0.03] px-6 py-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#8A6528]">
            Total Journey
          </span>
          <span className="ddw-serif text-[13px] font-bold text-[#0B1410]">
            {totalDays} Days · {totalNights} Nights
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Empty state ── */
function EmptyState() {
  return (
    <div className="relative break-inside-avoid border border-dashed border-[#B98B3E]/45 bg-[#FDFBF6] px-10 py-14 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-[#B98B3E]/55 bg-[#B98B3E]/[0.08]">
        <Compass className="h-6 w-6 text-[#B98B3E]" />
      </div>
      <p className="ddw-serif mb-2 text-[18px] font-bold text-[#0B1410]">
        No days scheduled yet
      </p>
      <p className="mx-auto max-w-[120mm] text-[12.5px] leading-relaxed text-[#0F1A14]/70">
        Your itinerary is being prepared. Once days are added, a complete
        summary will appear here.
      </p>
    </div>
  );
}

/* ── Trip highlights ── */
function TripHighlights({ highlights }) {
  return (
    <div className="relative break-inside-avoid border border-[#B98B3E]/35 bg-[#FDFBF6] px-6 py-5">
      <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#E4C888] via-[#B98B3E] to-[#8A6528]" />
      <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#B98B3E]/45" />

      <div className="mb-4 flex items-center gap-3">
        <Compass className="h-3.5 w-3.5 text-[#B98B3E]" />
        <span className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#8A6528]">
          Trip Highlights
        </span>
        <span className="h-px flex-1 bg-[#B98B3E]/35" />
        <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#8A6528]/70">
          {highlights.length} Destinations
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {highlights.map((dest, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 border border-[#B98B3E]/40 bg-[#F8F4EA] px-3.5 py-1.5 text-[11.5px] font-semibold tracking-wide text-[#0B1410] transition-colors hover:border-[#B98B3E]/75 hover:bg-[#FCE9DA]/45"
          >
            <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-[#B98B3E]" />
            <span className="ddw-serif">{dest}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── CTA panel ── */
function CTAPanel({ clientName, tourCode }) {
  return (
    <div className="relative break-inside-avoid border border-[#B98B3E]/45 bg-[#0B1410] px-7 py-5">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #B98B3E 35%, #E4C888 50%, #B98B3E 65%, transparent)",
        }}
      />
      <span className="absolute left-2 top-2 h-3 w-3 border-l border-t border-[#E4C888]/60" />
      <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#E4C888]/60" />

      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 shrink-0 text-[#E4C888]" />
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#E4C888]">
              Prepared Exclusively For
            </p>
            <p className="ddw-serif text-[14px] leading-tight text-[#F8F4EA]/90">
              {clientName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#E4C888]">
          <span>{tourCode}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function Page5PDFSection({ safariData }) {
  const { itinerary } = safariData || {};
  const { client_info, days = [] } = itinerary || {};

  if (!client_info) return null;

  const clientName = `${client_info.salutation || "Mr/Ms"}. ${
    client_info.first_name || ""
  } ${client_info.last_name || ""}`.trim();

  const tourCode = client_info.tour_code || "—";
  const companyName =
    client_info.staff_company || client_info.company_name || "ACE";
  const tourTitle = client_info.tour_title || "Safari Itinerary Summary";

  /* ── Unique destinations (in order of appearance) ── */
  const highlights = days.reduce((acc, day) => {
    const name = day.destination_info?.name?.trim();
    if (!name) return acc;
    if (!acc.includes(name)) acc.push(name);
    return acc;
  }, []);

  const totalDays = days.length;
  const totalNights = Math.max(0, totalDays - 1);

  /* ── Chunk days so table splits cleanly across pages ── */
  const DAYS_PER_CHUNK = 6;
  const dayChunks = [];
  if (days.length > 0) {
    for (let i = 0; i < days.length; i += DAYS_PER_CHUNK) {
      dayChunks.push(days.slice(i, i + DAYS_PER_CHUNK));
    }
  }

  /* ── Build sections array ── */
  const sections = [];

  if (dayChunks.length > 0) {
    dayChunks.forEach((chunk, idx) => {
      const isLastChunk = idx === dayChunks.length - 1;
      sections.push({
        id: `ledger-${idx}`,
        weight: 40 + chunk.length * 26 + (isLastChunk ? 15 : 0),
        element: (
          <LedgerTable
            days={chunk}
            isLastChunk={isLastChunk}
            totalDays={totalDays}
            totalNights={totalNights}
          />
        ),
      });
    });
  } else {
    sections.push({
      id: "empty",
      weight: 120,
      element: <EmptyState />,
    });
  }

  sections.push({
    id: "ornament",
    weight: 20,
    element: <Ornament className="opacity-80" />,
  });

  if (highlights.length > 0) {
    sections.push({
      id: "highlights",
      weight: 55 + Math.ceil(highlights.length / 4) * 12,
      element: <TripHighlights highlights={highlights} />,
    });
  }

  sections.push({
    id: "cta",
    weight: 50,
    element: <CTAPanel clientName={clientName} tourCode={tourCode} />,
  });

  return (
    <PdfBookPage
      tourCode={tourCode}
      leftRailLabel={`${companyName} · Summary`}
      watermarkSide="left"
      opener={
        <ChapterOpener
          icon={<CalendarCheck />}
          title={tourTitle}
          subtitle={`A complete overview of your ${totalDays}-day, ${totalNights}-night journey.`}
        />
      }
      openerWeight={60}
      sections={sections}
    />
  );
}