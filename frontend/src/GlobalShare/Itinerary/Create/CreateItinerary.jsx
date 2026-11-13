// ── CreateQuotePage.jsx (Premium Studio Gate — Golden Hour Edition) ──
import React, { useContext, useEffect, useState, useMemo } from "react";
import { History, UserPlus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../../Apis/AuthProvider";
import api from "../../../Apis/api";
import { toast } from "react-toastify";

/* ── Small ornament divider ── */
function Ornament({ className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#E8772E]/55" />
      <span className="h-1 w-1 rotate-45 bg-[#E8772E]/70" />
      <span className="h-1.5 w-1.5 rotate-45 border border-[#E8772E]" />
      <span className="h-1 w-1 rotate-45 bg-[#E8772E]/70" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#E8772E]/55" />
    </div>
  );
}

/* ── Card — styled like a book cover ── */
function GateCard({
  number,
  icon,
  title,
  description,
  metricLabel,
  ctaLabel,
  tone = "ember",
  onClick,
}) {
  const isPrimary = tone === "ember";
  const accent = isPrimary ? "#E8772E" : "#0F2A2E";
  const accentLight = isPrimary ? "#F2B544" : "#1C3B40";
  const accentDeep = isPrimary ? "#B34F12" : "#0F2A2E";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full flex-col justify-between overflow-hidden border border-[#E4DCCB] bg-white p-8 text-left
                 shadow-[0_15px_50px_-30px_rgba(15,42,46,0.35)]
                 transition-all duration-300 ease-out
                 hover:-translate-y-1 hover:border-[#E8772E]/50 hover:shadow-[0_25px_60px_-30px_rgba(232,119,46,0.45)]
                 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
    >
      {/* ══ Left rule ══ */}
      <span
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{
          background: `linear-gradient(to bottom, ${accentLight}, ${accent}, ${accentDeep})`,
        }}
      />

      {/* ══ Top shimmer — ember to gold ══ */}
      <span
        className="absolute inset-x-6 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #E8772E 35%, #F2B544 50%, #E8772E 65%, transparent)",
        }}
      />

      {/* ══ Corner flourish ══ */}
      <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-[#E4DCCB] transition-colors duration-300 group-hover:border-[#E8772E]/50" />
      <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[#E4DCCB] transition-colors duration-300 group-hover:border-[#E8772E]/50" />

      {/* ══ Big ghost numeral (chapter number) ══ */}
      <span
        className="pointer-events-none absolute -right-2 -bottom-6 select-none font-serif text-[120px] font-bold leading-none tracking-tighter transition-opacity duration-500 group-hover:opacity-[0.14]"
        style={{
          color: accent,
          opacity: 0.06,
        }}
        aria-hidden
      >
        {number}
      </span>

      {/* ══ Content ══ */}
      <div className="relative z-10">
        {/* Icon + label */}
        <div className="mb-5 flex items-center gap-4">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center border transition-all duration-300 group-hover:scale-105"
            style={{
              borderColor: `${accent}80`,
              background: `${accent}12`,
              color: accent,
            }}
          >
            <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
          </span>

          <div className="flex items-center gap-2">
            <span className="h-px w-6" style={{ background: accent }} />
            <span
              className="text-[9.5px] font-bold uppercase tracking-[0.42em]"
              style={{ color: accentDeep }}
            >
              {number}
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="ddw-serif text-[26px] font-bold leading-[1.1] tracking-tight text-[#0F2A2E]">
          {title}
        </h2>

        {/* Description */}
        <p className="mt-3 max-w-[42ch] text-[13.5px] leading-relaxed text-[#6B6459]">
          {description}
        </p>
      </div>

      {/* ══ Footer row ══ */}
      <div className="relative z-10 mt-8 flex items-center justify-between gap-4 border-t border-[#E4DCCB] pt-5">
        {/* Metric */}
        <span className="flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.22em] text-[#6B6459]">
          <span
            className="h-1 w-1 rotate-45"
            style={{ background: accent }}
          />
          {metricLabel}
        </span>

        {/* CTA */}
        <span
          className="inline-flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.24em]"
          style={{ color: accentDeep }}
        >
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function CreateQuoteGlobal() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const { refreshAuth } = useContext(AuthenticationContext);

 const navigateHelper = useMemo(()=>{
          if (userRole === "MANAGER") return '/dashboard/manager';
          if (userRole === "STAFF") return '/staff/dashboard';
          return null;
      }, [userRole])

  const refreshUserRole = async()=>{
    try{
        const user = await refreshAuth();
        
        if (user?.role === "MANAGER" || user?.role === "STAFF"){
                setUserRole(user.role);
         }else{
            navigate("/", {replace: true});
        }

    }catch(error){
        const errorMsg = error.response?.data?.detail?.error || "Something went Wrong";
        toast.error(errorMsg);
    }
  }


  useEffect(()=>{
    refreshUserRole();
  }, [])



  const currentYear = new Date().getFullYear();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F6F1E7] font-sans text-[#0F2A2E] selection:bg-[#E8772E] selection:text-[#0F2A2E]">
      {/* ══ Ambient washes ══ */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[#E8772E]/12 blur-[150px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#F2B544]/15 blur-[150px]" />

      {/* ══ Compass rose watermark ══ */}
      <svg
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -bottom-32 -right-32 z-[1] h-[520px] w-[520px] opacity-[0.07]"
        aria-hidden
      >
        {[190, 152, 112, 62].map((r) => (
          <circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            fill="none"
            stroke="#E8772E"
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
            stroke="#E8772E"
            strokeWidth="0.7"
            transform={`rotate(${i * 5} 200 200)`}
          />
        ))}
        <path
          d="M200 18 L216 184 L382 200 L216 216 L200 382 L184 216 L18 200 L184 184 Z"
          fill="#E8772E"
          opacity="0.45"
        />
      </svg>

      {/* ══ Grain ══ */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ══ Main ══ */}
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-16 lg:px-10">
        {/* ── Gold frame wrapper ── */}
        <div className="relative w-full">
          {/* Stacked page edges */}
          <div
            aria-hidden
            className="absolute -left-2.5 -right-2.5 top-2.5 -bottom-2.5 border border-[#E4DCCB] bg-[#EFE8DA]"
          />
          <div
            aria-hidden
            className="absolute -left-5 -right-5 top-5 -bottom-5 border border-[#D4C9B0] bg-[#E8E0D2]"
          />

          {/* Book body */}
          <div className="relative border border-[#E4DCCB] bg-white px-8 py-12 shadow-[0_40px_90px_-45px_rgba(15,42,46,0.55)] sm:px-12 sm:py-14">

            {/* Inner gold frame */}
            <div className="pointer-events-none absolute inset-3 border border-[#E8772E]/30" />
            <div className="pointer-events-none absolute inset-[16px] border border-[#E8772E]/12" />

            {/* ── Title block ── */}
            <div className="relative mx-auto mb-10 max-w-2xl text-center">
              <h1 className="ddw-serif text-[38px] font-bold leading-[1.06] tracking-tight text-[#0F2A2E] sm:text-[46px]">
                Begin a New{" "}
                <span className="italic text-[#E8772E]">Safari</span>
              </h1>

              <p className="mx-auto mt-5 max-w-lg text-[13.5px] leading-relaxed text-[#6B6459]">
                Choose your path below. Build a brand-new client request, or pick
                up where you left off with a returning traveller.
              </p>

              <Ornament className="mt-7" />
            </div>

            {/* ── Cards grid ── */}
            <div className="relative mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
              <GateCard
                number="01"
                icon={<UserPlus />}
                title="New Client Request"
                description="Capture a first-time traveller's details, preferences, and dates — then generate a tailored safari itinerary in seconds."
                metricLabel="~3 second setup"
                ctaLabel="Start Now"
                tone="ember"
                onClick={() =>
                  navigate(`${navigateHelper}/clients/create/`)
                }
              />

              <GateCard
                number="02"
                icon={<History />}
                title="Returning Client"
                description="Pull up a saved client profile from your database and draft a fresh quote or duplicate a past journey."
                metricLabel="Instant lookup"
                ctaLabel="Select Profile"
                tone="savannah"
                onClick={() =>
                  navigate(`${navigateHelper}/clients/list/`)
                }
              />
            </div>

            {/* ── Footer signature ── */}
            <div className="relative mx-auto mt-12 max-w-2xl text-center">
              <Ornament className="opacity-60" />
              <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.32em] text-[#6B6459]/70">
                @SafariGen · {currentYear}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}