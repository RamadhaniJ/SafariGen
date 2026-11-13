import React, {
  useCallback,
  useEffect,
  useMemo, 
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Shared helpers (export these so the Day-by-Day component can use  */
/*  the exact same anchor ids)                                        */
/* ------------------------------------------------------------------ */

const DAY_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
  "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty", "Twenty-one",
  "Twenty-two", "Twenty-three", "Twenty-four", "Twenty-five", "Twenty-six",
  "Twenty-seven", "Twenty-eight", "Twenty-nine", "Thirty", "Thirty-one",
];

const dayWord = (n) => DAY_WORDS[n] || String(n);

/** Stable DOM id for a day section. */
export const dayAnchorId = (day) =>
  `itinerary-day-${day?.id ?? day?.day_number}`;

/* ------------------------------------------------------------------ */

export default function StickyNavigationSubSection({ safariData, className = "" }) {
  const days = safariData?.itinerary?.days ?? [];

  const barRef = useRef(null);
  const stripRef = useRef(null);
  const pillRefs = useRef({});
  const ticking = useRef(false);

  const [activeId, setActiveId] = useState(() =>
    days.length ? dayAnchorId(days[0]) : null
  );
  const [edges, setEdges] = useState({ left: false, right: false });
  const [headerHeight, setHeaderHeight] = useState(64); 


// Auto header measure 
  useEffect(() => {
  const measure = () => {
    const header = document.querySelector('header.sticky, header.fixed');
    if (header) setHeaderHeight(header.offsetHeight);
  };
  measure();
  window.addEventListener('resize', measure);
  // Measure again after fonts/images load
  const t = setTimeout(measure, 300);
  return () => {
    window.removeEventListener('resize', measure);
    clearTimeout(t);
  };
}, []);




  /* Pretty labels: "Day Three" / "Days Three–Five" ------------------ */
  const labels = useMemo(
    () =>
      days.map((day) => {
        const nights = Number(day?.nights_number) || 1;
        return nights > 1
          ? `Days ${dayWord(day.day_number)}–${dayWord(
              day.day_number + nights - 1
            )}`
          : `Day ${dayWord(day.day_number)}`;
      }),
    [days]
  );

  /* How much vertical space the sticky bar eats --------------------- */
  const getOffset = useCallback(
    () => (barRef.current?.offsetHeight ?? 72) + headerHeight + 8,
    [headerHeight]
  );

  const prefersReduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- */
  /*  Scroll-spy: which day is currently under the bar?               */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    if (!days.length) return;

    const update = () => {
      ticking.current = false;
      const probe = getOffset();
      let current = dayAnchorId(days[0]);

      for (const day of days) {
        const el = document.getElementById(dayAnchorId(day));
        if (!el) continue;
        if (el.getBoundingClientRect().top - probe <= 0) current = dayAnchorId(day);
        else break;
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [days, getOffset]);

  /* ---------------------------------------------------------------- */
  /*  Track whether the strip can scroll left / right (for the fades) */
  /* ---------------------------------------------------------------- */
  const updateEdges = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    const el = stripRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges, days.length]);

  /* ---------------------------------------------------------------- */
  /*  Keep the active pill centred inside the strip                   */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const strip = stripRef.current;
    const pill = activeId ? pillRefs.current[activeId] : null;
    if (!strip || !pill) return;

    const sRect = strip.getBoundingClientRect();
    const pRect = pill.getBoundingClientRect();
    const pad = 16;

    if (pRect.left < sRect.left + pad || pRect.right > sRect.right - pad) {
      strip.scrollTo({
        left:
          strip.scrollLeft +
          (pRect.left - sRect.left) -
          sRect.width / 2 +
          pRect.width / 2,
        behavior: prefersReduced() ? "auto" : "smooth",
      });
    }
  }, [activeId]);

  /* ---------------------------------------------------------------- */
  /*  Jump to a day                                                    */
  /* ---------------------------------------------------------------- */
  const scrollToDay = useCallback(
    (day) => {
      const el = document.getElementById(dayAnchorId(day));
      if (!el) return;

      const top =
        el.getBoundingClientRect().top + window.scrollY - getOffset();

      window.scrollTo({
        top: Math.max(top, 0),
        behavior: prefersReduced() ? "auto" : "smooth",
      });
      setActiveId(dayAnchorId(day));
    },
    [getOffset]
  );

  const nudge = (dir) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.max(el.clientWidth * 0.7, 220),
      behavior: prefersReduced() ? "auto" : "smooth",
    });
  };

  if (!days.length) return null;

  const activeIndex = Math.max(
    0,
    days.findIndex((d) => dayAnchorId(d) === activeId)
  );

  return (
    <nav
      ref={barRef}
      aria-label="Itinerary day navigation"
      style={{top : headerHeight}}
      className={`sticky z-40 w-full ${className}`}
    >
      <style>{`
        .esn-strip { scrollbar-width: none; -ms-overflow-style: none; }
        .esn-strip::-webkit-scrollbar { display: none; }
        .esn-sans { font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif; }
      `}</style>

      <div className="esn-sans bg-[#FBF8F1]/85 backdrop-blur-md border-b border-[#B98B3E]/20 shadow-[0_10px_30px_-24px_rgba(22,33,26,0.55)]">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="flex items-center gap-1.5 sm:gap-3 py-2.5">
            {/* ── Left arrow ─────────────────────────────────────── */}
            <ArrowButton
              dir="left"
              disabled={!edges.left}
              onClick={() => nudge(-1)}
            />

            {/* ── Scrollable pill strip ──────────────────────────── */}
            <div className="relative flex-1 min-w-0">
              {/* edge fades */}
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-y-0 left-0 w-8 z-10 bg-gradient-to-r from-[#FBF8F1] to-transparent transition-opacity duration-300 ${
                  edges.left ? "opacity-100" : "opacity-0"
                }`}
              />
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-[#FBF8F1] to-transparent transition-opacity duration-300 ${
                  edges.right ? "opacity-100" : "opacity-0"
                }`}
              />

              <div
                ref={stripRef}
                className="esn-strip flex items-center gap-2 overflow-x-auto scroll-smooth px-1 py-1"
              >
                {days.map((day, i) => {
                  const id = dayAnchorId(day);
                  const isActive = id === activeId;

                  return (
                    <button
                      key={id}
                      type="button"
                      ref={(el) => {
                        pillRefs.current[id] = el;
                      }}
                      onClick={() => scrollToDay(day)}
                      aria-current={isActive ? "true" : undefined}
                      aria-label={`Scroll to ${labels[i]}`}
                      className={[
                        "group relative inline-flex shrink-0 items-center gap-2",
                        "rounded-full border px-3.5 py-1.5",
                        "text-[13px] sm:text-sm font-medium leading-none",
                        "transition-all duration-200 ease-out",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B98B3E]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF8F1]",
                        isActive
                          ? "border-[#16211A] bg-[#16211A] text-[#FBF8F1] shadow-[0_6px_18px_-10px_rgba(22,33,26,0.9)]"
                          : "border-[#B98B3E]/25 bg-transparent text-[#3D4A3F] hover:border-[#B98B3E]/60 hover:bg-[#B98B3E]/10 active:scale-[0.97]",
                      ].join(" ")}
                    >
                      <span
                        aria-hidden
                        className={` ${
                          isActive
                            ? "bg-[#B98B3E]"
                            : "bg-[#B98B3E]/40 group-hover:bg-[#B98B3E]"
                        }`}
                      />
                      <span className="whitespace-nowrap">{labels[i]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Right arrow ────────────────────────────────────── */}
            <ArrowButton
              dir="right"
              disabled={!edges.right}
              onClick={() => nudge(1)}
            />
          </div>
        </div>

        {/* ── Progress rail ──────────────────────────────────────── */}
        <div className="h-[2px] w-full bg-[#B98B3E]/15">
          <div
            className="h-full bg-[#B98B3E] transition-[width] duration-500 ease-out"
            style={{ width: `${((activeIndex + 1) / days.length) * 100}%` }}
          />
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */

function ArrowButton({ dir, disabled, onClick }) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Scroll days left" : "Scroll days right"}
      className={[
        "hidden sm:inline-flex shrink-0 items-center justify-center",
        "h-9 w-9 rounded-full border transition-all duration-200",
        "border-[#B98B3E]/25 text-[#3D4A3F]",
        "hover:border-[#B98B3E]/60 hover:bg-[#B98B3E]/10",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B98B3E]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF8F1]",
        disabled
          ? "opacity-30 pointer-events-none"
          : "opacity-100 active:scale-95",
      ].join(" ")}
    >
      <Icon className="w-4 h-4" strokeWidth={2} />
    </button>
  );
}







