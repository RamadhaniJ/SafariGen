// ── Page3PDFSection.jsx (Premium Book Page — Part Five) ──
import React from "react";
import {
  Lock,
  Clock,
  CreditCard,
  Globe,
  AlertTriangle,
  FileText,
  Quote,
} from "lucide-react";
import PdfBookPage from "./PdfShare/SmartSplit";

/* ── Chapter opener ── */
function ChapterOpener({ title, subtitle, icon }) {
  return (
    <div className="mb-9 border-b border-[#B98B3E]/35 pb-6">
      <h1 className="ddw-serif flex items-center gap-3 text-[38px] font-bold leading-[1.08] tracking-tight text-[#0B1410]">
        <span className="text-[#B98B3E] [&>svg]:h-7 [&>svg]:w-7">{icon}</span>
        {title}
      </h1>

      <p className="ddw-serif mt-3 max-w-[155mm] text-[14px] italic leading-relaxed text-[#6B6153]">
        {subtitle}
      </p>
    </div>
  );
}

/* ── One policy clause (numbered ledger entry) ── */
function PolicyClause({ number, icon, title, tone = "gold", children }) {
  const isWarn = tone === "warn";
  const accent = isWarn ? "#9C5B3C" : "#B98B3E";
  const accentLight = isWarn ? "#E8C4A8" : "#E4C888";
  const accentDeep = isWarn ? "#7A3F26" : "#8A6528";

  return (
    <section className="relative break-inside-avoid border border-[#B98B3E]/35 bg-[#FDFBF6] pl-14 pr-6 py-5">
      {/* Gold left rule */}
      <div
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{
          background: `linear-gradient(to bottom, ${accentLight}, ${accent}, ${accentDeep})`,
        }}
      />

      {/* Big serif numeral */}
      <div className="absolute left-3 top-5 flex flex-col items-center gap-1">
        <span
          className="ddw-serif text-[22px] font-bold leading-none tracking-tighter"
          style={{
            background: `linear-gradient(180deg, ${accentLight} 0%, ${accent} 55%, ${accentDeep} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {number}
        </span>
        <span className="h-4 w-px" style={{ background: `${accent}66` }} />
        <span className="h-1 w-1 rotate-45" style={{ background: accent }} />
      </div>

      {/* Corner flourish */}
      <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#B98B3E]/45" />

      {/* Content */}
      <div className="flex items-start gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center border"
          style={{
            borderColor: `${accent}66`,
            background: `${accent}0F`,
            color: accent,
          }}
        >
          <span className="[&>svg]:h-4.5 [&>svg]:w-4.5">{icon}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2.5">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.32em]"
              style={{ color: accentDeep }}
            >
              Clause {number}
            </span>
            <span className="h-px w-8" style={{ background: `${accent}55` }} />
          </div>

          <h2 className="ddw-serif mb-2.5 text-[17px] font-bold leading-tight text-[#0B1410]">
            {title}
          </h2>

          <div className="text-[13px] leading-relaxed text-[#0F1A14]/85 space-y-2.5">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Bullet row ── */
function Bullet({ children }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-[#B98B3E]" />
      <span className="font-medium text-[#0F1A14]">{children}</span>
    </li>
  );
}

/* ── Closing panel ── */
function ClosingPanel({ companyName, clientName }) {
  return (
    <div className="relative break-inside-avoid border border-[#B98B3E]/45 bg-[#0B1410] px-8 py-7 text-center">
      {/* Gold top shimmer */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #B98B3E 35%, #E4C888 50%, #B98B3E 65%, transparent)",
        }}
      />

      <span className="absolute left-2 top-2 h-3 w-3 border-l border-t border-[#E4C888]/60" />
      <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#E4C888]/60" />
      <span className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-[#E4C888]/60" />
      <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-[#E4C888]/60" />

      <div className="mb-3 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#B98B3E]/70" />
        <Quote className="h-4 w-4 text-[#E4C888]" />
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#B98B3E]/70" />
      </div>

      <p className="ddw-serif mx-auto max-w-[145mm] text-[15px] italic leading-relaxed text-[#F8F4EA]/90">
        Thank you for choosing{" "}
        <span className="not-italic font-semibold text-[#E4C888]">
          {companyName}
        </span>
        . We look forward to crafting an unforgettable safari experience for you,{" "}
        <span className="not-italic font-semibold text-[#E4C888]">
          {clientName}
        </span>
        .
      </p>

      <div className="mt-5 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#B98B3E]/60" />
        <span className="h-1 w-1 rotate-45 bg-[#B98B3E]" />
        <span className="h-1.5 w-1.5 rotate-45 border border-[#B98B3E]" />
        <span className="h-1 w-1 rotate-45 bg-[#B98B3E]" />
        <span className="h-px w-8 bg-[#B98B3E]/60" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function Page3PDFSection({ safariData }) {
  const { itinerary } = safariData || {};
  const { client_info } = itinerary || {};

  if (!client_info) return null;

  const clientName = `${client_info.salutation || "Mr/Ms"}. ${
    client_info.first_name || ""
  } ${client_info.last_name || ""}`.trim();

  const tourCode = client_info.tour_code || "—";
  const companyName =
    client_info.staff_company || client_info.company_name || "ACE";

  const startYear = (() => {
    const d = new Date(client_info.tour_start_date);
    return Number.isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
  })();

  /* ── Policy clauses ── */
  const policies = [
    {
      id: "deposit",
      icon: <Lock />,
      tone: "gold",
      title: "Deposit Requirement",
      content: (
        <p>
          A deposit of{" "}
          <strong className="font-bold text-[#0B1410]">
            30% of the total safari cost
          </strong>{" "}
          is required at the time of booking confirmation. This deposit is
          non-refundable and serves to lock in park permits, accommodation
          bookings, and guide availability. Reservations will only be secured
          once the cleared deposit has been officially received.
        </p>
      ),
    },
    {
      id: "final-payment",
      icon: <Clock />,
      tone: "gold",
      title: "Final Payment",
      content: (
        <p>
          The remaining balance must be fully settled at least{" "}
          <strong className="font-bold text-[#0B1410]">
            30 days prior to your arrival date
          </strong>
          . For bookings made within 30 days of arrival, full payment is
          required immediately upon confirmation to guarantee all services.
        </p>
      ),
    },
    {
      id: "methods",
      icon: <CreditCard />,
      tone: "gold",
      title: "Payment Methods",
      content: (
        <>
          <p>
            Payments can be securely processed through the following channels:
          </p>
          <ul className="space-y-2 pt-1">
            <Bullet>
              Direct Bank Wire Transfer (Details provided upon invoice request)
            </Bullet>
            <Bullet>
              Credit / Debit Card Online Payment (Secure gateway)
            </Bullet>
          </ul>
        </>
      ),
    },
    {
      id: "currency",
      icon: <Globe />,
      tone: "gold",
      title: "Currency & Itinerary Changes",
      content: (
        <p>
          All prices are quoted in{" "}
          <strong className="font-bold text-[#0B1410]">
            US Dollars (USD)
          </strong>{" "}
          unless explicitly stated otherwise. Any requested modifications to
          confirmed itineraries are subject to availability and may incur
          additional tariff adjustments or vendor cancellation fees.
        </p>
      ),
    },
    {
      id: "cancellation",
      icon: <AlertTriangle />,
      tone: "warn",
      title: "Late Payments & Cancellations",
      content: (
        <p>
          Failure to complete payments within the specified deadlines may
          result in the{" "}
          <strong className="font-bold text-[#9C5B3C]">
            automatic cancellation
          </strong>{" "}
          of the booking and reserved accommodations without prior notice,
          subject to the vendor's specific cancellation policies.
        </p>
      ),
    },
  ];

  /* ── Sections array kwa PdfBookPage ── */
  const sections = policies.map((policy, i) => ({
    id: policy.id,
    weight: 70, // ~70mm per clause (adjust baada ya kuona PDF)
    element: (
      <PolicyClause
        number={String(i + 1).padStart(2, "0")}
        icon={policy.icon}
        title={policy.title}
        tone={policy.tone}
      >
        {policy.content}
      </PolicyClause>
    ),
  }));

  return (
    <PdfBookPage
      tourCode={tourCode}
      leftRailLabel={`${companyName} · Terms`}
      watermarkSide="right"
      opener={
        <ChapterOpener
          icon={<FileText />}
          title="Terms & Guidelines"
          subtitle="To confirm and secure your safari reservation, the following terms and guidelines apply."
        />
      }
      openerWeight={60}
      sections={sections}
      footer={
        <ClosingPanel companyName={companyName} clientName={clientName} />
      }
      footerWeight={75}
    />
  );
}