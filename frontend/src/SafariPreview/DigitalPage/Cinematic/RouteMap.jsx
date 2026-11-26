import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Flag, MapPin, Mountain, Palmtree, Building2, Trees } from "lucide-react";
import { C, EASE, serif, reveal, buildRouteStops, routePath, placeLabels } from "./cinematic";

// Wide canvas on desktop; taller, tighter canvas on phones so labels stay readable.
const WIDE = { W: 1000, H: 620 };
const TALL = { W: 560, H: 680 };

function useCanvas() {
  const query = "(max-width: 640px)";
  const [tall, setTall] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setTall(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return tall ? TALL : WIDE;
}

const TYPE_ICON = { Park: Trees, Mountain: Mountain, Beach: Palmtree, City: Building2 };

/** Route drawn stop by stop when it scrolls into view. */
export default function RouteMap({ days, clientInfo, mapImage }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const still = useReducedMotion();
  const { W, H } = useCanvas();
  const stops = useMemo(() => buildRouteStops(days, W, H, W < 800 ? 90 : 130), [days, W, H]);
  const path = useMemo(() => routePath(stops), [stops]);
  const labels = useMemo(() => placeLabels(stops, W, H), [stops, W, H]);

  // Seconds for the line to reach each stop (used to pop markers in sequence).
  const drawTime = still ? 0 : Math.min(1.1 * Math.max(stops.length - 1, 1), 5);
  const stopDelay = (i) => (stops.length > 1 ? (drawTime * i) / (stops.length - 1) : 0);

  if (!stops.length) return null;

  return (
    <section id="route" className="relative px-4 py-24 sm:px-8" style={{ background: C.ink }}>
      <div className="mx-auto max-w-6xl">
        <motion.p {...reveal(0)} className="text-[11px] font-semibold uppercase tracking-[0.32em]" style={{ color: C.gold }}>
          The route
        </motion.p>
        <motion.h2 {...reveal(0.08)} className="mt-3 text-4xl sm:text-5xl" style={{ ...serif, color: C.cream }}>
          From {clientInfo?.start_destination || stops[0].name} to {clientInfo?.end_destination || stops[stops.length - 1].name}
        </motion.h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
          <motion.div
            ref={ref}
            {...reveal(0.12, 40)}
            className="relative overflow-hidden rounded-3xl border"
            style={{ borderColor: C.line, background: "radial-gradient(120% 90% at 30% 20%, #1a241e 0%, #0f1512 55%, #0B0F0D 100%)" }}
          >
            <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Map of the safari route">
              <defs>
                <pattern id="sgmap-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(243,238,227,0.05)" strokeWidth="1" />
                </pattern>
                <radialGradient id="sgmap-glow">
                  <stop offset="0%" stopColor={C.gold} stopOpacity="0.55" />
                  <stop offset="100%" stopColor={C.gold} stopOpacity="0" />
                </radialGradient>
                <linearGradient id="sgmap-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={C.goldSoft} />
                  <stop offset="100%" stopColor={C.gold} />
                </linearGradient>
              </defs>
              <rect width={W} height={H} fill="url(#sgmap-grid)" />

              {/* compass */}
              <g transform={`translate(${W - 70} 70)`} opacity="0.55">
                <circle r="26" fill="none" stroke="rgba(243,238,227,0.25)" />
                <path d="M0 -20 L5 0 L0 20 L-5 0 Z" fill={C.gold} />
                <text y="-32" textAnchor="middle" fontSize="12" fill={C.muted}>N</text>
              </g>

              {/* faint full route, then the animated one on top */}
              {path && <path d={path} fill="none" stroke="rgba(243,238,227,0.10)" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />}
              {path && (
                <motion.path
                  d={path}
                  fill="none"
                  stroke="url(#sgmap-line)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: still ? 1 : 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: drawTime, ease: "easeInOut" }}
                />
              )}

              {stops.map((s, i) => {
                return (
                  <motion.g
                    key={s.key}
                    initial={{ opacity: still ? 1 : 0, scale: still ? 1 : 0.4 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: stopDelay(i), duration: 0.5, ease: EASE }}
                    style={{ transformOrigin: `${s.x}px ${s.y}px` }}
                  >
                    <circle cx={s.x} cy={s.y} r="34" fill="url(#sgmap-glow)" />
                    {!still && (
                      <motion.circle
                        cx={s.x} cy={s.y} r="10" fill="none" stroke={C.gold} strokeWidth="1.5"
                        animate={inView ? { r: [10, 26], opacity: [0.7, 0] } : {}}
                        transition={{ delay: stopDelay(i) + 0.4, duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                    <circle cx={s.x} cy={s.y} r="9" fill={s.isStart || s.isEnd ? C.cream : C.gold} stroke={C.ink} strokeWidth="3" />
                    {labels[i].leader && (
                      <line x1={s.x} y1={s.y} x2={labels[i].ax} y2={labels[i].ay} stroke="rgba(201,163,91,0.45)" strokeWidth="1.2" />
                    )}
                    <g transform={`translate(${labels[i].x} ${labels[i].y})`}>
                      <text textAnchor={labels[i].anchor} fontSize="17" fontWeight="700" letterSpacing="1.5" fill={C.gold}>
                        {s.isStart ? "START · " : s.isEnd ? "END · " : ""}DAY {s.days}
                      </text>
                      <text y="27" textAnchor={labels[i].anchor} fontSize="25" fill={C.cream} style={serif}>
                        {s.name}
                      </text>
                    </g>
                  </motion.g>
                );
              })}
            </svg>
          </motion.div>
          <p className="mt-3 text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(243,238,227,0.35)" }}>
            Route illustration · not to scale for driving distances
          </p>
          </div>

          {/* stop list */}
          <ol className="space-y-3">
            {stops.map((s, i) => {
              const Icon = s.isStart || s.isEnd ? Flag : TYPE_ICON[s.type] || MapPin;
              return (
                <motion.li
                  key={s.key}
                  {...reveal(0.15 + i * 0.07, 18)}
                  className="flex items-center gap-4 rounded-2xl border px-4 py-3.5"
                  style={{ borderColor: C.line, background: C.panel }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: "rgba(201,163,91,0.12)" }}>
                    <Icon className="h-[18px] w-[18px]" style={{ color: C.gold }} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: C.gold }}>Day {s.days}</p>
                    <p className="truncate text-[15px]" style={{ color: C.cream }}>{s.name}</p>
                  </div>
                </motion.li>
              );
            })}
            {mapImage && (
              <motion.li {...reveal(0.2)}>
                <a href={mapImage} target="_blank" rel="noreferrer" className="block rounded-2xl border px-4 py-3 text-center text-sm underline-offset-4 hover:underline" style={{ borderColor: C.line, color: C.muted }}>
                  Open the detailed map
                </a>
              </motion.li>
            )}
          </ol>
        </div>
      </div>
    </section>
  );
}
