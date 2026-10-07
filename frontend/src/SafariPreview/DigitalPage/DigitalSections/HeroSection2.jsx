import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Compass,
  Users,
  Globe,
  ChevronDown,
  Sparkles,
  MapPin,
} from "lucide-react";

/* ---------- Rotating hook phrases (kept, single color for cohesion) ---------- */
const HOOKS = [
  "Exclusively crafted for",
  "Custom tailored experience for",
  "A bespoke African journey for",
  "Your personalized safari dream",
  "Handcrafted adventure for",
  "Privately designed itinerary for",
  "Special curated offer for",
  "An extraordinary proposal for",
  "Your ultimate getaway plan",
  "A once-in-a-lifetime journey for",
  "Specially prepared for",
];

export default function DigitalHeroSection({ safariData, onScrollClick }) {
  const { itinerary, hero_image } = safariData || {};
  const { client_info } = itinerary || {};

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const tourLength = client_info?.tour_length || 0;
  const tourNights = Math.max(0, tourLength - 1);

  const clientName = useMemo(() => {
    if (!client_info) return "Valued Guest";
    const parts = [
      client_info.salutation,
      client_info.first_name,
      client_info.last_name,
    ].filter(Boolean);
    return parts.length ? parts.join(" ") : "Valued Guest";
  }, [client_info]);

  const countries = useMemo(() => {
    const raw = client_info?.country_visited;
    if (Array.isArray(raw)) return raw.filter(Boolean);
    if (typeof raw === "string")
      return raw.split(",").map((c) => c.trim()).filter(Boolean);
    return [];
  }, [client_info]);

  const tourTitle = client_info?.tour_title || "Unforgettable Safari Journey";

  const stats = [
    {
      icon: Calendar,
      label: "Duration",
      value: `${tourLength} ${tourLength === 1 ? "Day" : "Days"} · ${tourNights} ${
        tourNights === 1 ? "Night" : "Nights"
      }`,
    },
    {
      icon: Compass,
      label: "Tour Type",
      value: client_info?.tour_type || "Private Safari",
    },
    {
      icon: Users,
      label: "Travellers",
      value: `${client_info?.total_travellers || 1}`,
    },
    {
      icon: Globe,
      label: countries.length > 1 ? "Countries" : "Country",
      value: countries.length ? countries.join(" · ") : "—",
    },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col overflow-hidden text-white bg-slate-950">
      {/* ---------- Background ---------- */}
      <div className="absolute inset-0 z-0">
        {hero_image ? (
          <img
            src={hero_image}
            alt=""
            className="w-full h-full object-cover object-center animate-slow-pan"
          />
        ) : (
          <div className="w-full h-full bg-slate-900" />
        )}
        {/* vertical + horizontal gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/40" />
        {/* radial vignette so the image edges fade into darkness */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(2,6,23,0.75) 100%)",
          }}
        />
      </div>

      {/* ---------- Top bar ---------- */}
      <header className="relative z-10 w-full px-6 md:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-white/70">
          {/* <Sparkles className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.75} />
          <span>Safari Collection</span> */}
        </div>
        <div className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-white/50">
          {/* <MapPin className="w-3.5 h-3.5 text-amber-400/80" strokeWidth={1.75} />
          <span>East Africa</span> */}
        </div>
      </header>

      {/* ---------- Main ---------- */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        {/* Rotating eyebrow */}
        <div
          className={`flex items-center gap-4 mb-6 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <span className="h-px w-8 md:w-14 bg-gradient-to-r from-transparent to-amber-400/70" />
          <span className="text-[10px] md:text-[11px] tracking-[0.34em] uppercase text-amber-300/90 font-medium whitespace-nowrap">
            <RotatingText items={HOOKS} />
          </span>
          <span className="h-px w-8 md:w-14 bg-gradient-to-l from-transparent to-amber-400/70" />
        </div>

        {/* Client name — the emotional hook */}
        <p
          className={`font-serif text-2xl md:text-3xl text-white mb-8 transition-all duration-1000 delay-100 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          {clientName}
        </p>

        {/* Main title */}
        <h1
          className={`font-serif text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.05] text-balance mb-8 transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {tourTitle}
        </h1>

        {/* Gold divider */}
        <div
          className={`h-px w-16 bg-amber-400/60 mb-10 origin-center transition-all duration-1000 delay-300 ${
            mounted ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          }`}
        />

        {/* Stat panel */}
        <div
          className={`w-full max-w-3xl rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden transition-all duration-1000 delay-400 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x divide-white/10">
            {stats.map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-2 px-4 py-6"
              >
                <s.icon
                  className="w-4 h-4 text-amber-400/90"
                  strokeWidth={1.75}
                />
                <span className="text-[10px] uppercase tracking-[0.22em] text-white/50">
                  {s.label}
                </span>
                <span className="text-sm font-medium text-white/95 truncate max-w-full">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ---------- Footer ---------- */}
      <footer
        className={`relative z-10 w-full pb-10 pt-8 flex flex-col items-center gap-6 transition-all duration-1000 delay-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        {(client_info?.staff_full_name || client_info?.staff_company) && (
          <p className="text-xs md:text-sm text-white/60 tracking-wide">
            Curated by{" "}
            <span className="text-white/90 font-medium">
              {client_info?.staff_full_name}
            </span>
            {client_info?.staff_company && (
              <span className="text-white/40">
                {" "}
                · {client_info.staff_company}
              </span>
            )}
          </p>
        )}

        <button
          onClick={onScrollClick}
          className="group flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
          aria-label="Explore itinerary"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">
            Explore Itinerary
          </span>
          <span className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 group-hover:border-amber-400/60 transition-colors">
            <ChevronDown className="w-4 h-4 animate-bounce" strokeWidth={2} />
          </span>
        </button>
      </footer>
    </section>
  );
}

/* ---------- Rotating text (crossfade + slide) ---------- */
function RotatingText({ items, interval = 2500 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      interval
    );
    return () => clearInterval(t);
  }, [items.length, interval]);

  return (
    <span className="inline-grid align-middle">
      {items.map((item, i) => (
        <span
          key={i}
          aria-hidden={i !== index}
          className={`col-start-1 row-start-1 transition-all duration-700 ${
            i === index
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-1 pointer-events-none"
          }`}
        >
          {item}
        </span>
      ))}
    </span>
  );
}