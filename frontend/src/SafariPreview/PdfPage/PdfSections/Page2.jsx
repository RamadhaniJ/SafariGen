// ── Page2PDFSection.jsx (Premium Book Page — Part Four) ──
import React from "react";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  CreditCard,
  Users,
  UserRound,
  Banknote,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Ornament } from "./PdfShare/ShareSection";
import PdfBookPage from "./PdfShare/SmartSplit";

/* ── Chapter opener ── */
function ChapterOpener({ title, titleAccent, subtitle }) {
  return (
    <div className="mb-8 border-b border-[#B98B3E]/35 pb-6">
      <h1 className="ddw-serif text-[38px] font-bold leading-[1.08] tracking-tight text-[#0B1410]">
        {title} <span className="italic text-[#B98B3E]">{titleAccent}</span>
      </h1>

      <p className="mt-3 max-w-[150mm] text-[13.5px] leading-relaxed text-[#0F1A14]/70">
        {subtitle}
      </p>
    </div>
  );
}

/* ── Section header (numbered) ── */
function SectionHeader({ icon, title }) {
  return (
    <div className="mb-5">
      <h2 className="ddw-serif flex items-center gap-3 text-[28px] font-bold tracking-tight text-[#0B1410]">
        <span className="text-[#B98B3E] [&>svg]:h-6 [&>svg]:w-6">{icon}</span>
        {title}
      </h2>
    </div>
  );
}

/* ── One item line inside include/exclude ── */
function ListItem({ ok, text }) {
  const color = ok ? "#1E5A3B" : "#9C5B3C";
  return (
    <li className="flex items-start gap-3 py-1.5">
      <span
        className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center border"
        style={{ borderColor: `${color}66`, background: `${color}14`, color }}
      >
        {ok ? (
          <CheckCircle2 className="h-3 w-3" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
      </span>
      <span className="text-[13px] leading-relaxed text-[#0F1A14]/85">
        {text}
      </span>
    </li>
  );
}

/* ── Include / Exclude panel ── */
function PolicyPanel({ ok, title, items }) {
  const tone = ok ? "#1E5A3B" : "#9C5B3C";
  return (
    <div className="relative flex flex-col border border-[#B98B3E]/35 bg-[#FDFBF6] p-6 break-inside-avoid">
      <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#E4C888] via-[#B98B3E] to-[#8A6528]" />
      <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#B98B3E]/45" />

      <div
        className="mb-4 flex items-center gap-3 border-b pb-3"
        style={{ borderColor: `${tone}26` }}
      >
        <span
          className="flex h-8 w-8 items-center justify-center border"
          style={{ borderColor: `${tone}66`, background: `${tone}12`, color: tone }}
        >
          {ok ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
        </span>
        <div>
          <p
            className="text-[9px] font-bold uppercase tracking-[0.32em]"
            style={{ color: tone }}
          >
            {ok ? "Included" : "Excluded"}
          </p>
          <h3 className="ddw-serif text-[16px] font-bold leading-tight text-[#0B1410]">
            {title}
          </h3>
        </div>
      </div>

      <ul className="divide-y divide-[#B98B3E]/10">
        {items.map((item, idx) => (
          <ListItem key={idx} ok={ok} text={item} />
        ))}
      </ul>
    </div>
  );
}

/* ── Inclusions & Exclusions block ── */
function InclusionsBlock({ included, excluded }) {
  return (
    <div>
      <SectionHeader icon={<ShieldCheck />} title="Inclusions & Exclusions" />

      <div className="grid grid-cols-2 gap-5">
        <PolicyPanel ok title="What's Included" items={included} />
        <PolicyPanel ok={false} title="What's Excluded" items={excluded} />
      </div>
    </div>
  );
}

/* ── Cost breakdown card ── */
function CostBreakdownBlock({ clientInfo, mapImageUrl, formatCurrency, onConfirm }) {
  return (
    <div>
      <SectionHeader icon={<CreditCard />} title="Cost Breakdown" />

      <div className="relative overflow-hidden border border-[#B98B3E]/40 bg-[#0B1410] text-[#F8F4EA] break-inside-avoid shadow-[0_20px_60px_-30px_rgba(11,20,16,0.7)]">
        {/* Gold top shimmer */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, #B98B3E 35%, #E4C888 50%, #B98B3E 65%, transparent)",
          }}
        />

        {/* Corner ticks */}
        <span className="absolute left-2 top-2 h-3 w-3 border-l border-t border-[#E4C888]/60" />
        <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#E4C888]/60" />
        <span className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-[#E4C888]/60" />
        <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-[#E4C888]/60" />

        {/* Row 1: metrics */}
        <div className="grid grid-cols-3 divide-x divide-[#B98B3E]/25">
          <div className="p-6">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-[#B98B3E]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#B98B3E]">
                Travellers
              </span>
            </div>
            <p className="ddw-serif text-[22px] font-bold text-[#F8F4EA]">
              {clientInfo.total_travellers || "N/A"}
            </p>
          </div>

          <div className="p-6">
            <div className="mb-2 flex items-center gap-2">
              <UserRound className="h-3.5 w-3.5 text-[#B98B3E]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#B98B3E]">
                Per Person
              </span>
            </div>
            <p className="ddw-serif text-[22px] font-bold text-[#F8F4EA]">
              {formatCurrency(mapImageUrl?.price_per_person)}
            </p>
          </div>

          <div className="relative p-6">
            <div className="mb-2 flex items-center gap-2">
              <Banknote className="h-3.5 w-3.5 text-[#E4C888]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#E4C888]">
                Grand Total (USD)
              </span>
            </div>
            <p className="ddw-serif text-[28px] font-extrabold leading-tight text-[#ffedbf]">
              {formatCurrency(mapImageUrl?.grand_total)}
            </p>
          </div>
        </div>

        {/* Row 2: action bar */}
        <div className="flex flex-row items-center justify-between gap-4 border-t border-[#B98B3E]/25 bg-[#08130F] px-6 py-4">
          <div className="flex items-center gap-2.5" />

          <button
            onClick={onConfirm}
            className="group inline-flex shrink-0 items-center gap-2.5 border border-[#B98B3E] bg-[#B98B3E] px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B1410]
                       transition-all duration-300
                       hover:bg-[#E4C888] hover:shadow-[0_0_24px_-4px_rgba(185,139,62,0.75)]
                       active:scale-[0.97]
                       cursor-pointer"
          >
            <span>Confirm Booking</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function Page2PDFSection({ safariData }) {
  const navigate = useNavigate();
  const { itinerary } = safariData || {};
  const { client_info, map_image_url } = itinerary || {};

  if (!client_info) return null;

  const clientName = `${client_info.salutation || "Mr/Ms"}. ${
    client_info.first_name || ""
  } ${client_info.last_name || ""}`.trim();
  const tourCode = client_info.tour_code || "—";
  const companyName =
    client_info.staff_company || client_info.company_name || "";

  const startYear = (() => {
    const d = new Date(client_info.tour_start_date);
    return Number.isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
  })();

  const DUMMY_INCLUDED = [
    "All accommodation during the safari itinerary as specified",
    "Professional, English-speaking safari guide and driver",
    "Private 4x4 safari vehicle with a pop-up roof for game viewing",
    "All national park entrance fees and conservation fees",
    "Full board meals (Breakfast, Lunch, and Dinner as specified)",
    "Complimentary bottled drinking water inside the safari vehicle",
  ];

  const DUMMY_EXCLUDED = [
    "Additional accommodation before and at the end of the tour",
    "International and domestic flights (unless specified otherwise)",
    "Entry visas for the destination country",
    "Tips and gratuities for the safari guide and camp staff",
    "Comprehensive travel, medical, and baggage insurance",
    "Premium alcoholic beverages and soft drinks at the lodges",
  ];

  const formatCurrency = (value) => {
    if (!value) return "N/A";
    return `$${Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  /* ── Sections array kwa PdfBookPage ── */
  const sections = [
    {
      id: "inclusions",
      weight: 130, // 2 panels side by side + items ~130mm
      element: (
        <InclusionsBlock
          included={DUMMY_INCLUDED}
          excluded={DUMMY_EXCLUDED}
        />
      ),
    },
    {
      id: "divider",
      weight: 20,
      element: <Ornament className="opacity-80" />,
    },
    {
      id: "cost-breakdown",
      weight: 110,
      element: (
        <CostBreakdownBlock
          clientInfo={client_info}
          mapImageUrl={map_image_url}
          formatCurrency={formatCurrency}
          onConfirm={() => toast.info("Coming soon!")}
        />
      ),
    },
  ];

  return (
    <PdfBookPage
      tourCode={tourCode}
      leftRailLabel={`${companyName} · Pricing`}
      watermarkSide="left"
      opener={
        <ChapterOpener
          title="Pricing"
          titleAccent="& Details"
          subtitle={
            <>
              Prepared exclusively for{" "}
              <span className="font-semibold text-[#8A6528]">
                {clientName}
              </span>{" "}
              — here is what your journey includes, what it does not, and the
              investment it represents.
            </>
          }
        />
      }
      openerWeight={60}
      sections={sections}
    />
  );
}