// ── PdfHeroSection.jsx ──
import React from "react";
import {
  Calendar,
  Users,
  Phone,
  Mail,
  Plane,
  MapPin,
  Compass,
  TagIcon,
} from "lucide-react";
import StatCard from "./Stats/PdfStats";
import { formatDate, calculateEndDate } from "./Helpers/PdfHelpers";

/* ── Film grain (print-safe, inline) ─────────────────────── */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* ── Faint compass rose watermark ────────────────────────── */
function CompassRose() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute -bottom-28 -right-28 z-[1] h-[440px] w-[440px] opacity-[0.14]"
      aria-hidden="true"
    >
      {[190, 152, 112, 62].map((r) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          fill="none"
          stroke="#B98B3E"
          strokeWidth="0.7"
        />
      ))}
      {Array.from({ length: 72 }).map((_, i) => (
        <line
          key={i}
          x1="200"
          y1="10"
          x2="200"
          y2={i % 6 === 0 ? "26" : "18"}
          stroke="#B98B3E"
          strokeWidth="0.7"
          transform={`rotate(${i * 5} 200 200)`}
        />
      ))}
      <path
        d="M200 18 L216 184 L382 200 L216 216 L200 382 L184 216 L18 200 L184 184 Z"
        fill="#B98B3E"
        opacity="0.45"
      />
      <circle cx="200" cy="200" r="3.5" fill="#B98B3E" opacity="0.8" />
    </svg>
  );
}

/* ── Ornament divider ────────────────────────────────────── */
function Ornament({ className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#B98B3E]/55" />
      <span className="h-1 w-1 rotate-45 bg-[#B98B3E]/70" />
      <span className="h-1.5 w-1.5 rotate-45 border border-[#B98B3E]/85" />
      <span className="h-1 w-1 rotate-45 bg-[#B98B3E]/70" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#B98B3E]/55" />
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */
function cleanWebsite(url) {
  if (!url || typeof url !== "string") return "www.safariadventures.com";
  let cleaned = url.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
  cleaned = cleaned.replace(/^www\./i, "");
  return `www.${cleaned}`;
}

export default function PdfHeroSection({ safariData }) {
  const { hero_image, itinerary } = safariData || {};
  const { client_info, days } = itinerary || {};

  if (!client_info) return null;

  const clientName = `${client_info.salutation || "Mr/Ms"}. ${
    client_info.first_name || ""
  } ${client_info.last_name || ""}`.trim();

  const startDate = formatDate(client_info.tour_start_date);
  const endDate = calculateEndDate(
    client_info.tour_start_date,
    client_info.tour_length
  );

  const startDestination =
    client_info.start_destination ||
    days?.[0]?.destination_info?.name ||
    "N/A";
  const endDestination =
    client_info.end_destination ||
    days?.[days.length - 1]?.destination_info?.name ||
    "N/A";

  const nights = Math.max(0, (client_info.tour_length || 1) - 1);

  const startYear = (() => {
    const d = new Date(client_info.tour_start_date);
    return Number.isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
  })();

  const cleanedWebsite = cleanWebsite(
    client_info.company_website || "https://www.safariadventures.com"
  );

  const tourCode = client_info.tour_code || "—";

  return (
    <div
      className="relative h-[297mm] w-full overflow-hidden bg-[#0B1410] text-[#F8F4EA]
                 [-webkit-print-color-adjust:exact] [print-color-adjust:exact]"
    >
      {/* ══ 1. Background image + lighter scrims ══ */}
      <div className="absolute inset-0 z-0">
        <img
          src={hero_image || "/placeholder-safari.jpg"}
          alt="Safari Adventure"
          className="h-full w-full object-cover object-center"
        />
        {/* Lighter scrims so the photo actually shows through */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1410]/65 via-[#0B1410]/35 to-[#0B1410]/90" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1410]/45 via-transparent to-[#0B1410]/70" />
        {/* Bottom text legibility wash */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#0B1410] via-[#0B1410]/40 to-transparent" />
      </div>

      {/* ══ 2. Softer vignette ══ */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 30%, rgba(11,20,16,0.78) 100%)",
        }}
      />

      {/* ══ 3. Compass rose watermark ══ */}
      <CompassRose />

      {/* ══ 4. Film grain ══ */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      {/* ══ 5. Vertical editorial rails ══ */}
      {/* LEFT — brand / year */}
      <div className="absolute left-[4mm] top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-4">
        <span className="h-12 w-px bg-gradient-to-b from-transparent to-[#B98B3E]/60" />
        <span className="rotate-180 text-[8.5px] uppercase tracking-[0.55em] text-[#B98B3E]/75 [writing-mode:vertical-rl]">
          Bespoke Safari · {startYear}
        </span>
        <span className="h-12 w-px bg-gradient-to-t from-transparent to-[#B98B3E]/60" />
      </div>

      {/* RIGHT — reference / tour code (now clearly visible) */}
      <div className="absolute right-[4mm] top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-3">
        <span className="h-10 w-px bg-gradient-to-b from-transparent to-[#B98B3E]/60" />

        <span className="text-[8px] uppercase tracking-[0.42em] text-[#F8F4EA]/40 [writing-mode:vertical-rl]">
          Reference
        </span>

        {/* Gold-bordered chip so the code pops from any distance */}
        <span
          className="border border-[#B98B3E]/55 bg-[#0B1410]/70 px-1.5 py-2.5 text-[11px] font-bold tracking-[0.32em] backdrop-blur-sm [writing-mode:vertical-rl]"
          style={{
            color: "#E4C888",
            boxShadow: "0 0 12px -4px rgba(185,139,62,0.55)",
          }}
        >
          {tourCode}
        </span>

        <span className="h-10 w-px bg-gradient-to-t from-transparent to-[#B98B3E]/60" />
      </div>

      {/* ══ 6. Content ══ */}
      <div className="relative z-10 flex h-full w-full flex-col px-[24mm] pb-[16mm] pt-[20mm]">
        {/* ── Masthead ── */}
        <div className="flex items-start justify-between gap-6 border-b border-[#B98B3E]/30 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-11 w-11 items-center justify-center border border-[#B98B3E]/50 bg-[#B98B3E]/10 p-1.5">
              <span className="absolute -left-px -top-px h-2 w-2 border-l border-t border-[#E4C888]" />
              <span className="absolute -bottom-px -right-px h-2 w-2 border-b border-r border-[#E4C888]" />
              {client_info.company_logo ? (
                <img
                  src={client_info.company_logo}
                  alt="Company logo"
                  className="h-full w-full object-contain"
                />
              ) : (
                <Compass className="h-5 w-5 text-[#B98B3E]" />
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase leading-none tracking-[0.34em] text-[#B98B3E]">
                {client_info.company_name || "ACE"}
              </p>
              <p className="mt-1.5 text-[8.5px] uppercase leading-none tracking-[0.3em] text-[#F8F4EA]/45">
                Bespoke Safari Proposal
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[8.5px] uppercase leading-none tracking-[0.32em] text-[#F8F4EA]/45">
              Reference
            </p>
            <p className="mt-1.5  text-[15px] font-bold leading-none tracking-[0.16em]  uppercase  text-[#B98B3E]">
              №&nbsp; {tourCode}
            </p>
          </div>
          
        </div>

        {/* ── Title block ── */}
        <div className="mb-[9mm] mt-[12mm]">
          <div className="mb-5 flex items-center gap-3">
            <TagIcon className="h-3.5 w-3.5 text-[#B98B3E]" />
            <p className="text-[9.5px] font-bold uppercase leading-none tracking-[0.42em] text-[#B98B3E]">
              A Journey Crafted For You
            </p>
            <span className="h-px w-16 bg-gradient-to-r from-[#B98B3E]/70 to-transparent" />
          </div>

          <h1 className="ddw-serif max-w-[92%] text-[54px] font-bold leading-[1.03] tracking-tight text-[#F8F4EA] drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]">
            {client_info.tour_title}
          </h1>

          {/* Route line */}
          <div className="mt-7 flex w-full max-w-[155mm] items-center">
            <div className="flex shrink-0 items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B98B3E] ring-4 ring-[#B98B3E]/20" />
              <span className="text-[12px] uppercase tracking-[0.16em] text-[#F8F4EA]/90">
                {startDestination}
              </span>
            </div>

            <span className="mx-4 h-px flex-1 bg-gradient-to-r from-[#B98B3E]/65 to-[#B98B3E]/15" />
            <Plane className="h-3.5 w-3.5 rotate-45 text-[#B98B3E]" />
            <span className="mx-4 h-px flex-1 bg-gradient-to-r from-[#B98B3E]/15 to-[#B98B3E]/65" />

            <div className="flex shrink-0 items-center gap-2.5">
              <MapPin className="h-3.5 w-3.5 text-[#B98B3E]" />
              <span className="text-[12px] uppercase tracking-[0.16em] text-[#F8F4EA]/90">
                {endDestination}
              </span>
            </div>
          </div>

          <Ornament className="mt-8 opacity-90" />
        </div>

        {/* ── Body grid ── */}
        <div className="grid min-h-0 flex-1 grid-cols-12 gap-6">
          {/* Letter */}
          <div className="col-span-8">
            <div className="relative flex h-full flex-col border border-[#F8F4EA]/12 bg-gradient-to-br from-[#0B1410]/65 via-[#0B1410]/45 to-[#0B1410]/25 p-8 backdrop-blur-[3px] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.85)]">
              {/* Gold top hairline */}
              <span className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-[#B98B3E]/75 to-transparent" />
              {/* 4 gold corner ticks */}
              <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-[#B98B3E]/75" />
              <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-[#B98B3E]/75" />
              <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-[#B98B3E]/75" />
              <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-[#B98B3E]/75" />

              <p className="ddw-serif mb-5 text-[22px] text-[#F8F4EA]">
                Dear {client_info.salutation || "Mr/Ms"}.{" "}
                {client_info.first_name},
              </p>

              <div className="flex-1 space-y-4 text-[15px] leading-relaxed text-[#F8F4EA]/85">
                <p>
                  Thank you for reaching out. It is our sincere pleasure to
                  present this custom-crafted{" "}
                  <span className="font-semibold italic text-[#B98B3E]">
                    {client_info.tour_title}
                  </span>{" "}
                  — designed exclusively around your travel dreams.
                </p>
                <p>
                  Your adventure begins on{" "}
                  <span className="font-semibold text-[#F8F4EA]">
                    {startDate}
                  </span>
                  , as you touch down at{" "}
                  <span className="font-semibold text-[#F8F4EA]">
                    {client_info.start_destination || "your destination"}
                  </span>
                  .
                </p>
                <p>
                  Should you wish to refine any detail, our team is at your
                  service — we cannot wait to bring this journey of a lifetime
                  to life.
                </p>
              </div>

              <Ornament className="my-6 opacity-85" />

              {/* Signature */}
              <div className="mt-auto border-t border-[#B98B3E]/30 pt-5">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="mb-2 text-[8.5px] uppercase tracking-[0.3em] text-[#B98B3E]">
                      Warm regards
                    </p>
                    <p className="ddw-serif text-[17px] font-bold leading-tight text-[#F8F4EA]">
                      {client_info.creator_full_name || "James Rashid"}
                    </p>
                    <p className="mt-1 text-[11px] text-[#F8F4EA]/55">
                      {client_info.company_name || "ACE"}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-[#F8F4EA]/85">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-[#B98B3E]" />
                      <span className="text-[12px] font-medium tracking-wide">
                        {client_info.company_phone || "+255 766 792 993"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[#F8F4EA]/85">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-[#B98B3E]" />
                      <span className="truncate text-[12px] font-medium tracking-wide">
                        {client_info.company_email || "info@safari.com"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="col-span-4 grid grid-rows-4 gap-3">
            <StatCard
              icon={<Calendar className="h-3.5 w-3.5" />}
              label="Departure"
              value={startDate}
            />
            <StatCard
              icon={<Calendar className="h-3.5 w-3.5" />}
              label="Return"
              value={endDate}
            />
            <StatCard
              icon={<Users className="h-3.5 w-3.5" />}
              label="Travellers"
              value={client_info.total_travellers || "N/A"}
            />
            <StatCard
              icon={<MapPin className="h-3.5 w-3.5" />}
              label="Duration"
              value={`${client_info.tour_length || 0} Days · ${nights} Nights`}
            />
          </div>
        </div>

        {/* ── Colophon footer ── */}
        <div className="mt-auto flex items-center justify-between gap-6 border-t border-[#B98B3E]/35 pt-5">
          <div>
            <p className="ddw-serif text-[17px] font-bold leading-tight text-[#F8F4EA]">
              {client_info.company_name || "ACE"}
            </p>
            <p className="mt-1 text-[8.5px] tracking-[0.3em] text-[#F8F4EA]/50">
              {cleanedWebsite}
            </p>
          </div>

          <Ornament className="hidden flex-1 lg:flex" />

          <div className="flex items-center gap-5">
            <p className="text-right text-[8.5px] uppercase leading-tight tracking-[0.3em] text-[#F8F4EA]/40">
              Prepared for
              <br />
              <span className="font-semibold tracking-[0.12em] text-[#F8F4EA]/80">
                {clientName}
              </span>
            </p>

            <div className="flex h-12 w-12 items-center justify-center border border-[#B98B3E]/40 bg-[#F8F4EA]/[0.05] p-1.5">
              {client_info.company_logo ? (
                <img
                  src={client_info.company_logo}
                  alt="Company logo"
                  className="h-full w-full object-contain"
                />
              ) : (
                <Compass className="h-5 w-5 text-[#B98B3E]" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}