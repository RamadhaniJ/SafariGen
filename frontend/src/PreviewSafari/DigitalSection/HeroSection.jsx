// import React from "react";
// import { 
//   Calendar, 
//   Compass, 
//   Users, 
//   Globe, 
//   ChevronDown, 
//   Sparkles 
// } from "lucide-react";
// import { useState, useEffect } from "react";

// export default function DigitalHeroSection({ safariData, onScrollClick }) {
//   const { itinerary, hero_image } = safariData || {};
//   const { client_info } = itinerary || {};

//   const tourLength = client_info?.tour_length || 0;
//   const tourNights = Math.max(0, tourLength - 1);
//   const clientName = `${client_info.salutation}. ${client_info.first_name} ${client_info.last_name}`


//   const HOOK_TO_BOOK = [
//   { text: "Exclusively crafted for", color: "bg-gold-50 text-gold-700" },
//   { text: "Custom tailored experience for", color: "bg-amber-50 text-amber-700" },
//   { text: "A bespoke African journey for", color: "bg-emerald-50 text-emerald-700" },
//   { text: "Your personalized safari dream,", color: "bg-blue-50 text-blue-700" },
//   { text: "Handcrafted adventure for", color: "bg-indigo-50 text-indigo-700" },
//   { text: "Privately designed itinerary for", color: "bg-violet-50 text-violet-700" },
  

//   { text: "Special curated offer for", color: "bg-rose-50 text-rose-700" },
//   { text: "An extraordinary proposal for", color: "bg-teal-50 text-teal-700" },
//   { text: "Your ultimate getaway plan,", color: "bg-cyan-50 text-cyan-700" },
//   { text: "Exclusive luxury awaits", color: "bg-orange-50 text-orange-700" },
//   { text: "A once-in-a-lifetime journey for", color: "bg-purple-50 text-purple-700" },
//   { text: "Specially prepared for", color: "bg-slate-100 text-slate-700" }
// ];


//   // Mfano wa jina lako: const clientName = `${client_info.salutation}. ${client_info.first_name} ${client_info.last_name}`

// const HOOK_AMAZING_NAME = [
//   // Kingereza - Classic & Luxury
//   { text: `Our Esteemed Guest, ${clientName}`, color: "text-amber-600" },
//   { text: `Our Highly Valued Explorer, ${clientName}`, color: "text-emerald-600" },
//   { text: `The Adventurous ${clientName}`, color: "text-blue-600" },
//   { text: `Our VIP Guest, ${clientName}`, color: "text-purple-600" },
//   { text: `Welcome to Africa, ${clientName}`, color: "text-indigo-600" },
//   { text: `Prepared with Honor for ${clientName}`, color: "text-rose-600" },
// ];

//   // Normalize country list handling (array or comma-separated string)
//   const rawCountries = client_info?.country_visited;
//   const countries = Array.isArray(rawCountries)
//     ? rawCountries
//     : typeof rawCountries === "string"
//     ? rawCountries.split(",").map((c) => c.trim())
//     : [];

//   return (
//     <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden text-white bg-slate-950">
//       {/* Background Image & Gradient Overlays */}
//       <div className="absolute inset-0 z-0">
//         {hero_image ? (
//           <img
//             src={hero_image}
//             alt="Safari Experience"
//             className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
//           />
//         ) : (
//           <div className="w-full h-full bg-slate-900" />
//         )}
//         {/* Layered overlay for dark readability + subtle ambient lighting */}
//         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/70" />
//         <div className="absolute inset-0 bg-black/20 backdrop-brightness-90" />
//       </div>

//       {/* Top Banner / Greeting */}
//       <header className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-10 md:pt-14 flex justify-between items-center">
//         {client_info?.salutation || client_info?.first_name ? (
//           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full  text-xs md:text-sm font-medium tracking-wide">
//             {/* <Sparkles className="w-3.5 h-3.5 text-amber-400" />
//             <span>
//               Prepared exclusively for{" "}
//               <strong className="font-semibold text-white">
//                 {client_info?.salutation} {client_info?.first_name} {client_info?.last_name}
//               </strong>
//             </span> */}
//           </div>
//         ) : <div />}
//       </header>

//       {/* Main Content Area */}
//       <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col justify-center items-center text-center">
//         {/* Main Tour Title */}
//         <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-balance text-white drop-shadow-md mb-8">
//           {client_info?.tour_title || "Unforgettable Safari Journey"}
//         </h1>

//         {/* Tour Metadata Cards (Grid Layout) */}
//         <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4">
//           {/* Duration */}
//           <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 transition-all duration-300 hover:bg-white/15 hover:border-white/25">
//             <Calendar className="w-5 h-5 text-amber-400 mb-2 opacity-90" />
//             <span className="text-[11px] uppercase tracking-wider text-slate-300 font-medium">
//               Duration
//             </span>
//             <span className="text-sm md:text-base font-bold text-white mt-1">
//               {tourLength} {tourLength === 1 ? "Day" : "Days"} / {tourNights} {tourNights === 1 ? "Night" : "Nights"}
//             </span>
//           </div>

//           {/* Tour Type */}
//           <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 transition-all duration-300 hover:bg-white/15 hover:border-white/25">
//             <Compass className="w-5 h-5 text-amber-400 mb-2 opacity-90" />
//             <span className="text-[11px] uppercase tracking-wider text-slate-300 font-medium">
//               Tour Type
//             </span>
//             <span className="text-sm md:text-base font-bold text-white mt-1 truncate max-w-full">
//               {client_info?.tour_type || "Private Safari"}
//             </span>
//           </div>

//           {/* Travellers */}
//           <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 transition-all duration-300 hover:bg-white/15 hover:border-white/25">
//             <Users className="w-5 h-5 text-amber-400 mb-2 opacity-90" />
//             <span className="text-[11px] uppercase tracking-wider text-slate-300 font-medium">
//               Travellers
//             </span>
//             <span className="text-sm md:text-base font-bold text-white mt-1">
//               {client_info?.total_travellers || 1} {client_info?.total_travellers === 1 ? "Guest" : "Guests"}
//             </span>
//           </div>

//           {/* Destinations / Countries */}
//           <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 transition-all duration-300 hover:bg-white/15 hover:border-white/25">
//             <Globe className="w-5 h-5 text-amber-400 mb-2 opacity-90" />
//             <span className="text-[11px] uppercase tracking-wider text-slate-300 font-medium">
//               {countries.length > 1 ? "Countries Visited" : "Country Visited"}
//             </span>
//             <span className="text-sm md:text-base font-bold text-white mt-1 truncate max-w-full">
//               {countries.length > 0 ? countries.join(", ") : "N/A"}
//             </span>
//           </div>
//         </div>

//         {/* Agency / Agent Signature */}
//         {(client_info?.staff_full_name || client_info?.staff_company) && (
//           <p className="mt-8 text-xs md:text-sm text-slate-300 font-light tracking-wide">
//             Curated by{" "}
//             <span className="font-medium text-white">
//               {client_info?.staff_full_name || "James Mollel"}
//             </span>
//             {client_info?.staff_company && (
//               <span className="text-slate-400"> • {client_info.staff_company} Safaris Ltd</span>
//             )}
//           </p>
//         )}
//       </main>

//       {/* Bottom Action / Scroll CTA */}
//       <footer className="relative z-10 w-full pb-10 flex flex-col items-center justify-center gap-3">
//                <div className="mt-3 pt-2">
//                 <VerticalTicker proofs={HOOK_TO_BOOK} />
//               </div>


          
//                <div className="mt-3 pt-2">
//                 <VerticalTicker proofs={HOOK_AMAZING_NAME} />
//               </div>
              
    

//       </footer>
//     </section>
//   );
// }



// function VerticalTicker({ proofs }) {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setIndex((prevIndex) => (prevIndex + 1) % proofs.length);
//     }, 2500); // Swaps message every 2.5 seconds

//     return () => clearInterval(timer);
//   }, [proofs.length]);

//   return (
//     <div className="h-6 overflow-hidden relative">
//       <div
//         className="transition-transform duration-500 ease-in-out flex flex-col"
//         style={{ transform: `translateY(-${index * 24}px)` }}
//       >
//         {proofs.map((proof, i) => {
//           return (
//             <div
//               key={i}
//               className="h-6 flex items-center gap-1.5 text-lg font-bold"
//             >
//               <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${proof.color}`}>
//                 {proof.text}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }





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