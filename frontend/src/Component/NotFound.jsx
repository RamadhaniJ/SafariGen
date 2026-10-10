import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Home,
  Map,
  Tag,
  Layers,
  ShieldCheck,
  Zap,
  MessageCircleQuestion,
  SailboatIcon
} from "lucide-react";


/* ───────────────────────── helpers ───────────────────────── */

const QUICK_LINKS = [
  {
    icon: SailboatIcon,
    title: "Generate an itinerary",
    desc: "Full trip plan with pricing in one click.",
    to: "/",
  },
  {
    icon: Tag,
    title: "Get a quote",
    desc: "Instant, transparent safari pricing.",
    to: "/",
  },
  {
    icon: Layers,
    title: "Our products",
    desc: "Explore everything SafariGen offers.",
    to: "/",
  },
];

export default function NotFoundComponent() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [query, setQuery] = useState("");

  /* Mouse-follow spotlight */
  useEffect(() => {
    document.title = "404 Not found | SafariGen";
    const el = rootRef.current;
    if (!el) return;
    const onMove = (e) => {
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);


  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8772E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071A1D]";

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-hidden bg-[#071A1D] font-sans text-white selection:bg-[#E8772E] selection:text-[#071A1D] flex flex-col"
      style={{ "--mx": "50vw", "--my": "30vh" }}
    >
      {/* Component-scoped keyframes */}
      <style>{`
        @keyframes sg-aurora-a { 0%,100% { transform: translate3d(0,0,0) scale(1);} 50% { transform: translate3d(60px,40px,0) scale(1.15);} }
        @keyframes sg-aurora-b { 0%,100% { transform: translate3d(0,0,0) scale(1);} 50% { transform: translate3d(-70px,-30px,0) scale(1.2);} }
        @keyframes sg-float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-14px);} }
        @keyframes sg-float-slow { 0%,100% { transform: translateY(0) rotate(-3deg);} 50% { transform: translateY(-10px) rotate(3deg);} }
        @keyframes sg-spin { to { transform: rotate(360deg);} }
        @keyframes sg-spin-rev { to { transform: rotate(-360deg);} }
        @keyframes sg-shimmer { 0% { background-position: 200% 0;} 100% { background-position: -200% 0;} }
        @keyframes sg-rise { from { opacity: 0; transform: translateY(18px);} to { opacity: 1; transform: translateY(0);} }
        .sg-rise { opacity: 0; animation: sg-rise .8s cubic-bezier(.2,.8,.2,1) forwards; }
        .sg-shimmer-text {
          background: linear-gradient(110deg, #ffffff 20%, #F2B544 40%, #E8772E 50%, #F2B544 60%, #ffffff 80%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          animation: sg-shimmer 6s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .sg-rise, .sg-shimmer-text, [class*="animate-"] { animation: none !important; opacity: 1 !important; }
        }
      `}</style>

      {/* ═════════════ BACKGROUND ═════════════ */}

      {/* Aurora blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 -left-40 h-[640px] w-[640px] rounded-full bg-[#E8772E]/30 blur-[140px]"
        style={{ animation: "sg-aurora-a 16s ease-in-out infinite" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-48 h-[620px] w-[620px] rounded-full bg-[#F2B544]/20 blur-[150px]"
        style={{ animation: "sg-aurora-b 20s ease-in-out infinite" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-64 left-1/3 h-[700px] w-[700px] rounded-full bg-[#1E6F6B]/30 blur-[170px]"
        style={{ animation: "sg-aurora-a 24s ease-in-out infinite" }}
      />

      {/* Grid with fade mask */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 65% 55% at 50% 38%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 55% at 50% 38%, #000 30%, transparent 100%)",
        }}
      />

      {/* Cursor spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx) var(--my), rgba(232,119,46,.16), transparent 60%)",
        }}
      />

      {/* Noise / grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* ═════════════ HERO ═════════════ */}
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 py-12 text-center sm:py-16">

        {/* Status pill */}
        <div
          className="sg-rise inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 backdrop-blur-md"
          style={{ animationDelay: "0.05s" }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
            Error 404
          </span>
          <span className="h-3 w-px bg-white/15" />
          <span className="text-[11px] font-medium text-white/50">Page not found</span>
        </div>

        {/* 4 ◎ 4 */}
        <div
          className="sg-rise relative mt-8 flex items-center justify-center gap-1 sm:gap-3 select-none"
          style={{ animationDelay: "0.15s" }}
        >
          {/* glow */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8772E]/30 blur-[90px]"
          />

          <span className="sg-shimmer-text font-serif text-[120px] font-black leading-none tracking-tighter sm:text-[190px] lg:text-[230px]">
            4
          </span>

          {/* Compass orb */}
          <div
            className="relative grid h-[112px] w-[112px] place-items-center sm:h-[170px] sm:w-[170px] lg:h-[205px] lg:w-[205px]"
            style={{ animation: "sg-float 6s ease-in-out infinite" }}
          >
            {/* outer ring */}
            <div className="absolute inset-0 rounded-full border border-white/15" />
            {/* dashed spinning ring */}
            <div
              className="absolute inset-2 rounded-full border border-dashed border-[#F2B544]/50"
              style={{ animation: "sg-spin 22s linear infinite" }}
            />
            {/* counter ring with marker */}
            <div
              className="absolute inset-5 rounded-full border border-[#E8772E]/30"
              style={{ animation: "sg-spin-rev 14s linear infinite" }}
            >
              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#E8772E] shadow-[0_0_14px_#E8772E]" />
            </div>
            {/* glass core */}
            <div className="absolute inset-8 rounded-full border border-white/20 bg-gradient-to-br from-white/20 via-white/5 to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_20px_60px_-10px_rgba(232,119,46,.5)] backdrop-blur-xl" />
            <Compass
              className="relative h-9 w-9 text-[#F2B544] drop-shadow-[0_0_14px_rgba(242,181,68,.7)] sm:h-14 sm:w-14 lg:h-16 lg:w-16"
              style={{ animation: "sg-float-slow 7s ease-in-out infinite" }}
            />
          </div>

          <span className="sg-shimmer-text font-serif text-[120px] font-black leading-none tracking-tighter sm:text-[190px] lg:text-[230px]">
            4
          </span>
        </div>

        {/* Headline */}
        <h1
          className="sg-rise mt-4 max-w-3xl text-balance font-serif text-[32px] font-bold leading-[1.08] tracking-tight sm:text-[46px] lg:text-[56px]"
          style={{ animationDelay: "0.25s" }}
        >
          This trail went{" "}
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#F2B544] via-[#E8772E] to-[#F2B544]">
            off the map
          </span>
          .
        </h1>

        <p
          className="sg-rise mt-5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base"
          style={{ animationDelay: "0.35s" }}
        >
          The page you're looking for moved, vanished, or never existed. Every great
          safari has a detour. Search, jump to something useful, or head back to base camp.
        </p>

        {/* CTAs */}
        <div
          className="sg-rise mt-6 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
          style={{ animationDelay: "0.55s" }}
        >
          <button
            onClick={() => navigate("/")}
            className={`group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-b from-[#F08A3F] to-[#E8772E] px-7 py-3.5 text-sm font-semibold text-[#071A1D] shadow-[0_10px_40px_-8px_rgba(232,119,46,.7),inset_0_1px_0_rgba(255,255,255,.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_50px_-8px_rgba(232,119,46,.85),inset_0_1px_0_rgba(255,255,255,.4)] active:translate-y-0 active:scale-[0.99] sm:text-base ${focusRing}`}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <Home className="relative h-5 w-5" />
            <span className="relative">Take me home</span>
            <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => navigate("/")}
            className={`group inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.05] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 active:translate-y-0 active:scale-[0.99] sm:text-base ${focusRing}`}
          >
            <MessageCircleQuestion className="h-5 w-5 text-[#F2B544]" />
            Contact support
          </button>
        </div>

        {/* Quick link cards */}
        <div className="mt-14 grid w-full max-w-4xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
          {QUICK_LINKS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.to}
                className={`sg-rise group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#E8772E]/50 hover:shadow-[0_20px_50px_-20px_rgba(232,119,46,.5)] ${focusRing}`}
                style={{ animationDelay: `${0.65 + i * 0.1}s` }}
              >
                <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-[#E8772E]/0 blur-3xl transition-all duration-500 group-hover:bg-[#E8772E]/30" />
                <div className="relative flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-[#F2B544] transition-colors group-hover:border-[#E8772E]/40 group-hover:bg-[#E8772E]/15">
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-white/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#F2B544]" />
                </div>
                <h3 className="relative mt-4 text-[15px] font-semibold text-white">
                  {item.title}
                </h3>
                <p className="relative mt-1 text-[13px] leading-relaxed text-white/50">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Trust strip */}
        <div
          className="sg-rise mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-white/45"
          style={{ animationDelay: "1s" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#E8772E]" />
            Enterprise-grade security
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:inline-block" />
          <span className="inline-flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-[#E8772E]" />
            Zero data loss
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:inline-block" />
          <span className="inline-flex items-center gap-1.5">
            <Map className="h-3.5 w-3.5 text-[#E8772E]" />
            Itineraries in one click
          </span>
        </div>
      </main>

      {/* ═════════════ FOOTER ═════════════ */}
      <footer className="relative z-10 px-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-[12px] text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} SafariGen. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <Link to="/" className={`rounded transition-colors hover:text-white ${focusRing}`}>
              Help center
            </Link>
            <Link to="/" className={`rounded transition-colors hover:text-white ${focusRing}`}>
              Contact
            </Link>
            <Link to="/" className={`rounded transition-colors hover:text-white ${focusRing}`}>
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}