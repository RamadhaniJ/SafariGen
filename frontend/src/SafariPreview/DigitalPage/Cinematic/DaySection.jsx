import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import {
  MapPin, Sunrise, Sun, Sunset, Moon, Clock, Compass, Sparkles, BedDouble, UtensilsCrossed, Route,
} from "lucide-react";
import { C, serif, reveal, dayId, dayRangeLabel, nightsLabel, splitMeals, firstPhoto, money } from "./cinematic";

const MOMENT_ICON = { "1_MORNING": Sunrise, "2_AFTERNOON": Sun, "3_EVENING": Sunset, "4_NIGHT": Moon, "5_FULL_DAY": Compass };
const PER_LABEL = { "Per Personal": "per person", "Per Group": "per group", "Per Vehicle": "per vehicle" };

/**
 * One day of the trip: a full-screen destination photo stays pinned while
 * the day's story, activities, lodge and meals slide up over it.
 */
export default function DaySection({ day, index, total }) {
  const ref = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], still ? [1, 1] : [1.18, 1]);
  const introFade = useTransform(scrollYProgress, [0.2, 0.42], [1, 0]);
  const introY = useTransform(scrollYProgress, [0.12, 0.42], [0, still ? 0 : -60]);

  const photo = firstPhoto(day);
  const dest = day.destination_info || {};
  const included = (day.activities || []).filter((a) => !a.is_optional);
  const optional = (day.activities || []).filter((a) => a.is_optional);
  const meals = splitMeals(day.included_meals);
  const story = (day.destination_description || "").split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const gallery = (day.destination_images || []).filter(Boolean).slice(0, 4);

  return (
    <section ref={ref} id={dayId(day)} className="relative" style={{ background: C.ink }}>
      {/* pinned photo */}
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {photo ? (
          <motion.img src={photo} alt={dest.name || ""} style={{ scale }} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#1d2a22] to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0D] via-[#0B0F0D]/30 to-[#0B0F0D]/40" />

        <motion.div style={{ opacity: introFade, y: introY }} className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-[14svh] sm:px-10">
          <motion.div {...reveal(0, 20)} className="flex items-center gap-3">
            <span className="rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em]" style={{ background: C.gold, color: C.ink }}>
              {dayRangeLabel(day)}
            </span>
            <span className="text-xs uppercase tracking-[0.2em]" style={{ color: C.cream }}>
              {day.date_display}
            </span>
          </motion.div>
          <motion.h2 {...reveal(0.1, 30)} className="mt-4 text-[clamp(2.4rem,7vw,5rem)] font-semibold leading-[1.02]" style={{ ...serif, color: C.cream }}>
            {dest.name || "Free day"}
          </motion.h2>
          {dest.location && (
            <motion.p {...reveal(0.2, 16)} className="mt-3 flex items-center gap-2 text-sm" style={{ color: C.cream }}>
              <MapPin className="h-4 w-4" style={{ color: C.gold }} /> {dest.location}
            </motion.p>
          )}
          <p className="mt-8 text-[10px] uppercase tracking-[0.3em]" style={{ color: "rgba(243,238,227,0.55)" }}>
            {index + 1} / {total}
          </p>
        </motion.div>
      </div>

      {/* content sliding over the photo */}
      <div className="relative z-10 -mt-[100svh] px-4 pb-28 pt-[92svh] sm:px-8">
        <div className="mx-auto max-w-3xl space-y-5">
          {story.length > 0 && (
            <Card delay={0}>
              <Eyebrow icon={Route}>{dayRangeLabel(day)} · {nightsLabel(day.nights_number || 1)}</Eyebrow>
              <div className="mt-4 space-y-4 text-[16px] leading-relaxed" style={{ color: "rgba(243,238,227,0.86)" }}>
                {story.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </Card>
          )}

          {gallery.length > 0 && (
            <div className={`grid gap-3 ${gallery.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
              {gallery.map((src, i) => (
                <motion.div key={src} {...reveal(i * 0.08, 24)} className={`overflow-hidden rounded-2xl ${gallery.length === 3 && i === 0 ? "col-span-2" : ""}`}>
                  <img src={src} alt="" loading="lazy" className="aspect-[4/3] h-full w-full object-cover transition duration-700 hover:scale-105" />
                </motion.div>
              ))}
            </div>
          )}

          {(included.length > 0 || optional.length > 0) && (
            <Card delay={0.05}>
              <Eyebrow icon={Compass}>Activities</Eyebrow>
              <ul className="mt-4 space-y-3">
                {included.map((a, i) => <ActivityRow key={a.id} a={a} i={i} />)}
              </ul>
              {optional.length > 0 && (
                <div className="mt-6 rounded-2xl border p-4" style={{ borderColor: "rgba(201,163,91,0.35)", background: "rgba(201,163,91,0.06)" }}>
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: C.gold }}>
                    <Sparkles className="h-4 w-4" /> Optional extras
                  </p>
                  <ul className="mt-3 space-y-3">
                    {optional.map((a, i) => <ActivityRow key={a.id} a={a} i={i} optional />)}
                  </ul>
                </div>
              )}
            </Card>
          )}

          {day.accommodation_info && <StayCard day={day} />}

          {(meals.length > 0 || (day.optional_meals || []).length > 0) && (
            <Card delay={0.05}>
              <Eyebrow icon={UtensilsCrossed}>Meals</Eyebrow>
              {meals.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {meals.map((m) => (
                    <span key={m} className="rounded-full border px-3.5 py-1.5 text-sm" style={{ borderColor: C.line, color: C.cream }}>{m}</span>
                  ))}
                </div>
              )}
              {(day.optional_meals || []).map((m) => (
                <p key={m.id} className="mt-4 flex items-center justify-between gap-4 text-sm" style={{ color: C.cream }}>
                  <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" style={{ color: C.gold }} /> {m.meal_name} <span style={{ color: C.muted }}>(optional)</span></span>
                  {Number(m.price) > 0 && <span style={{ color: C.goldSoft }}>{money(m.price)} per person</span>}
                </p>
              ))}
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}

function Card({ children, delay = 0 }) {
  return (
    <motion.div
      {...reveal(delay, 48)}
      className="rounded-3xl border p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-8"
      style={{ borderColor: C.line, background: "rgba(18,24,21,0.82)" }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ icon: Icon, children }) {
  return (
    <p className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: C.gold }}>
      <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "rgba(201,163,91,0.14)" }}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      {children}
    </p>
  );
}

function ActivityRow({ a, i, optional }) {
  const Icon = MOMENT_ICON[a.moment] || Clock;
  const place = a.main_location_name || [a.start_location_name, a.via_location_name, a.end_location_name].filter(Boolean).join(" → ");
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.5, delay: i * 0.07 }}
      className="flex gap-3.5"
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: C.line }}>
        <Icon className="h-4 w-4" style={{ color: C.goldSoft }} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline justify-between gap-x-3 text-[15px] font-semibold" style={{ color: C.cream }}>
          <span>{a.activity_type_name}</span>
          {optional && Number(a.optional_activity_price) > 0 && (
            <span className="text-sm font-normal" style={{ color: C.goldSoft }}>
              {money(a.optional_activity_price)} {PER_LABEL[a.price_per] || ""}
            </span>
          )}
        </p>
        <p className="text-sm" style={{ color: C.muted }}>
          {a.moment_display}{place ? ` · ${place}` : ""}
        </p>
      </div>
    </motion.li>
  );
}

function StayCard({ day }) {
  const acc = day.accommodation_info;
  const photos = [acc.featured_image, ...(day.accommodation_images || [])].filter(Boolean);
  const rooms = (day.selected_rooms || []).map((r) => `${r.quantity} × ${r.room_type_name}`).join(", ");
  return (
    <motion.div
      {...reveal(0.05, 48)}
      className="overflow-hidden rounded-3xl border shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
      style={{ borderColor: C.line, background: "rgba(18,24,21,0.9)" }}
    >
      {photos[0] && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <motion.img
            src={photos[0]}
            alt={acc.name}
            loading="lazy"
            className="h-full w-full object-cover"
            initial={{ scale: 1.12 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0D] via-transparent to-transparent" />
          {acc.tag_label && (
            <span className="absolute left-5 top-5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] backdrop-blur-md" style={{ background: "rgba(11,15,13,0.55)", color: C.goldSoft }}>
              {acc.tag_label.replace(/([a-z])([A-Z])/g, "$1 $2")}
            </span>
          )}
        </div>
      )}
      <div className="p-6 sm:p-8">
        <p className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: C.gold }}>
          <BedDouble className="h-4 w-4" /> Your stay · {nightsLabel(day.nights_number || 1)}
        </p>
        <h3 className="mt-3 text-3xl" style={{ ...serif, color: C.cream }}>{acc.name}</h3>
        {(acc.location || rooms) && (
          <p className="mt-2 text-sm" style={{ color: C.muted }}>
            {[acc.location, rooms].filter(Boolean).join(" · ")}
          </p>
        )}
        {day.accommodation_description && (
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "rgba(243,238,227,0.82)" }}>{day.accommodation_description}</p>
        )}
        {photos.length > 1 && (
          <div className="mt-5 grid grid-cols-3 gap-2">
            {photos.slice(1, 4).map((src) => (
              <img key={src} src={src} alt="" loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
