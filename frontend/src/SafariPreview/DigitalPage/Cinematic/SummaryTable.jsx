import { motion } from "framer-motion";
import { Flag, BedDouble } from "lucide-react";
import { C, EASE, serif, reveal, dayId, dayRangeLabel, splitMeals } from "./cinematic";

/** Compact Day · Destination · Stay · Meals overview; rows fade in one by one. */
export default function SummaryTable({ days, clientInfo }) {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section id="summary" className="px-4 pb-24 pt-8 sm:px-8" style={{ background: C.ink }}>
      <div className="mx-auto max-w-6xl">
        <motion.p {...reveal(0)} className="text-[11px] font-semibold uppercase tracking-[0.32em]" style={{ color: C.gold }}>
          At a glance
        </motion.p>
        <motion.h2 {...reveal(0.08)} className="mt-3 text-4xl sm:text-5xl" style={{ ...serif, color: C.cream }}>
          Day by day
        </motion.h2>

        <motion.div {...reveal(0.12, 30)} className="mt-10 overflow-hidden rounded-3xl border" style={{ borderColor: C.line, background: C.panel }}>
          {clientInfo?.start_destination && (
            <Endpoint label="Start" place={clientInfo.start_destination} />
          )}

          <div className="hidden grid-cols-[130px_1.2fr_1.2fr_1fr] gap-4 border-b px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] sm:grid" style={{ borderColor: C.line, color: C.muted }}>
            <span>Days</span><span>Destination</span><span>Stay</span><span>Meals</span>
          </div>

          {days.map((d, i) => {
            const meals = splitMeals(d.included_meals);
            return (
              <motion.button
                type="button"
                key={d.id}
                onClick={() => go(dayId(d))}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.55, ease: EASE, delay: i * 0.06 }}
                className="group grid w-full grid-cols-[88px_1fr] gap-x-4 gap-y-1 border-b px-5 py-4 text-left transition hover:bg-white/[0.03] sm:grid-cols-[130px_1.2fr_1.2fr_1fr] sm:items-center sm:px-6"
                style={{ borderColor: C.line }}
              >
                <span className="text-sm font-bold sm:text-[15px]" style={{ color: C.gold }}>{dayRangeLabel(d)}</span>
                <span className="text-[15px] font-semibold transition group-hover:translate-x-1" style={{ color: C.cream }}>
                  {d.destination_info?.name || "—"}
                  {d.date_display && <span className="block text-xs font-normal" style={{ color: C.muted }}>{d.date_display}</span>}
                </span>
                <span className="col-start-2 flex items-center gap-2 text-sm sm:col-start-auto" style={{ color: d.accommodation_info ? C.cream : C.muted }}>
                  <BedDouble className="h-4 w-4 shrink-0" style={{ color: C.gold }} />
                  {d.accommodation_info?.name || "No accommodation"}
                </span>
                <span className="col-start-2 text-sm sm:col-start-auto" style={{ color: C.muted }}>
                  {meals.length ? meals.join(", ") : "—"}
                </span>
              </motion.button>
            );
          })}

          {clientInfo?.end_destination && <Endpoint label="End" place={clientInfo.end_destination} last />}
        </motion.div>
      </div>
    </section>
  );
}

function Endpoint({ label, place, last }) {
  return (
    <div className={`flex items-center gap-3 px-6 py-4 ${last ? "" : "border-b"}`} style={{ borderColor: C.line, background: "rgba(201,163,91,0.06)" }}>
      <Flag className="h-4 w-4" style={{ color: C.gold }} />
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: C.gold }}>{label} point</span>
      <span className="text-sm" style={{ color: C.cream }}>{place}</span>
    </div>
  );
}
