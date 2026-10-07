// ── Page4PDFSection.jsx (Premium Book Page — Part Six) ──
import React from "react";
import {
  Compass,
  Sparkles,
  CheckCircle2,
  MapPin,
  Utensils,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Ornament } from "./PdfShare/ShareSection";
import PdfBookPage from "./PdfShare/SmartSplit";

/* ── Chapter opener ── */
function ChapterOpener({ icon, title, subtitle }) {
  return (
    <div className="mb-8 border-b border-[#B98B3E]/35 pb-6">
      <h1 className="ddw-serif flex items-center gap-3 text-[38px] font-bold leading-[1.08] tracking-tight text-[#0B1410]">
        <span className="text-[#B98B3E] [&>svg]:h-7 [&>svg]:w-7">{icon}</span>
        {title}
      </h1>

      <div className="mt-3 flex items-center gap-3">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#B98B3E]" />
        <p className="text-[11.5px] font-medium italic tracking-wide text-[#8A6528]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* ── One row in the ledger table ── */
function LedgerRow({ dayLabel, name, moment, destination, price, per, isMeal }) {
  return (
    <tr className="group border-b border-[#B98B3E]/12 last:border-b-0 hover:bg-[#FCE9DA]/30 transition-colors duration-200">
      {/* Item name + moment chip */}
      <td className="py-4 pl-6 pr-4 align-top">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-[#B98B3E]/45 bg-[#B98B3E]/[0.08] text-[#8A6528]">
              {isMeal ? (
                <Utensils className="h-2.5 w-2.5" />
              ) : (
                <Compass className="h-2.5 w-2.5" />
              )}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#8A6528]">
              {dayLabel}
            </span>
          </div>

          <p className="ddw-serif text-[14.5px] font-bold leading-snug text-[#0B1410]">
            {name}
          </p>

          {moment && (
            <span className="inline-flex w-fit items-center gap-1.5 border border-[#B98B3E]/40 bg-[#B98B3E]/[0.06] px-2 py-[2px] text-[9px] font-bold uppercase tracking-[0.22em] text-[#8A6528]">
              {moment}
            </span>
          )}
        </div>
      </td>

      <td className="py-4 px-4 align-top">
        <div className="flex items-center gap-2 text-[12.5px] font-medium text-[#0F1A14]/80">
          <MapPin className="h-3 w-3 shrink-0 text-[#B98B3E]" />
          <span>{destination}</span>
        </div>
      </td>

      <td className="py-4 px-4 align-top">
        <div className="flex items-baseline gap-1.5">
          <span className="ddw-serif text-[15px] font-bold text-[#0B1410]">
            ${price}
          </span>
          <span className="text-[10.5px] text-[#6B6153]">/ {per}</span>
        </div>
      </td>

      <td className="py-4 pl-4 pr-6 text-right align-top">
        <span className="inline-flex items-center gap-2 border border-[#1E5A3B]/35 bg-[#1E5A3B]/[0.06] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1E5A3B]">
          <CheckCircle2 className="h-3 w-3" />
          Book Before Trip
        </span>
      </td>
    </tr>
  );
}

/* ── Ledger table card (reusable per chunk) ── */
function LedgerTable({ rows }) {
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
              { label: "Experience", align: "left" },
              { label: "Destination", align: "left" },
              { label: "Price", align: "left" },
              { label: "Booking", align: "right" },
            ].map((h, i) => (
              <th
                key={i}
                className={`border-b border-[#B98B3E]/35 py-3.5 ${
                  i === 0 ? "pl-6 pr-4" : i === 3 ? "pl-4 pr-6" : "px-4"
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
          {rows.map((row) => (
            <LedgerRow
              key={row.id}
              dayLabel={row.dayLabel}
              name={row.name}
              moment={row.moment}
              destination={row.destination}
              price={row.price}
              per={row.per}
              isMeal={row.isMeal}
            />
          ))}
        </tbody>
      </table>
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

      <p className="ddw-serif mb-2 text-[20px] font-bold text-[#0B1410]">
        No optional activities added
      </p>

      <p className="mx-auto max-w-[120mm] text-[13px] leading-relaxed text-[#0F1A14]/70">
        Optional experiences — hot-air balloon safaris, cultural village visits,
        spa treatments, and curated meals — can be arranged upon request. Reach
        out to your safari consultant to enrich your itinerary.
      </p>
    </div>
  );
}

/* ── Notes panel ── */
function NotesPanel() {
  return (
    <div className="relative break-inside-avoid border border-[#B98B3E]/35 bg-[#FDFBF6] pl-6 pr-6 py-5">
      <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#E4C888] via-[#B98B3E] to-[#8A6528]" />
      <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#B98B3E]/45" />

      <div className="mb-3 flex items-center gap-2.5">
        <Plus className="h-3.5 w-3.5 text-[#B98B3E]" />
        <span className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#8A6528]">
          Good to Know
        </span>
        <span className="h-px flex-1 bg-[#B98B3E]/35" />
      </div>

      <ul className="space-y-2 text-[12.5px] leading-relaxed text-[#0F1A14]/80">
        {[
          "All optional experiences must be pre-booked at least 14 days before arrival.",
          "Prices are quoted per person and subject to availability at time of request.",
          "Balloon safaris and premium meals are weather-permitting and non-refundable once confirmed.",
        ].map((note, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rotate-45 bg-[#B98B3E]" />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── CTA panel ── */
function CTAPanel({ companyName }) {
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
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#E4C888]">
            Enrich Your Journey
          </p>
          <p className="ddw-serif text-[14px] leading-tight text-[#F8F4EA]/90">
            Contact your consultant to add any of these experiences.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#E4C888]">
          <span>Ask {companyName}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function Page4PDFSection({ safariData }) {
  const { itinerary } = safariData || {};
  const { client_info, days = [] } = itinerary || {};

  if (!client_info) return null;

  const tourCode = client_info.tour_code || "—";
  const companyName =
    client_info.staff_company || client_info.company_name || "ACE";

  /* ── Flatten optional activities + meals into unified rows ── */
  const rows = [];
  days.forEach((day) => {
    const dayLabel = `Day ${String(day.day_number || 1).padStart(2, "0")}`;
    const destination = day.destination_info?.name || "—";

    (day.activities || [])
      .filter((act) => act.is_optional)
      .forEach((act) => {
        rows.push({
          id: `act-${day.day_number}-${act.id || act.activity_type_name}`,
          dayLabel,
          name: act.activity_type_name || "Optional Activity",
          moment: act.moment_display || null,
          destination,
          price: act.optional_activity_price || "—",
          per: act.price_per || "person",
          isMeal: false,
        });
      });

    (day.optional_meals || [])
      .filter((meal) => meal.is_optional)
      .forEach((meal) => {
        rows.push({
          id: `meal-${day.day_number}-${meal.id || meal.meal_name}`,
          dayLabel,
          name: meal.meal_name || "Optional Meal",
          moment: meal.moment_display || null,
          destination,
          price: meal.price || "—",
          per: meal.price_per || "person",
          isMeal: true,
        });
      });
  });

  const hasRows = rows.length > 0;

  /* ── Chunk table rows so it can split across pages ── */
  const ROWS_PER_CHUNK = 5;
  const chunks = [];
  if (hasRows) {
    for (let i = 0; i < rows.length; i += ROWS_PER_CHUNK) {
      chunks.push(rows.slice(i, i + ROWS_PER_CHUNK));
    }
  }

  /* ── Build sections array ── */
  const sections = [];

  if (hasRows) {
    chunks.forEach((chunk, idx) => {
      sections.push({
        id: `ledger-${idx}`,
        weight: 60 + chunk.length * 22, // header ~30 + row ~22 each
        element: <LedgerTable rows={chunk} />,
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

  sections.push({
    id: "notes",
    weight: 60,
    element: <NotesPanel />,
  });

  sections.push({
    id: "cta",
    weight: 50,
    element: <CTAPanel companyName={companyName} />,
  });

  return (
    <PdfBookPage
      tourCode={tourCode}
      leftRailLabel={`${companyName} · Optional`}
      watermarkSide="right"
      opener={
        <ChapterOpener
          icon={<Compass />}
          title="Optional Activities & Meals"
          subtitle="Not included in base price — available upon request before your trip."
        />
      }
      openerWeight={60}
      sections={sections}
    />
  );
}