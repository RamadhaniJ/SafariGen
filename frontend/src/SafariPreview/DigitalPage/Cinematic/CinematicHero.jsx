import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { CalendarDays, MapPin, Users, ChevronDown } from "lucide-react";
import { C, EASE, serif, formatLongDate } from "./cinematic";

/** Full-screen opening: slow-zooming photo, title rising line by line, gold sweep. */
export default function CinematicHero({ clientInfo, heroImage, nights, onExplore }) {
  const ref = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, still ? 0 : -120]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", still ? "0%" : "18%"]);

  const title = clientInfo?.tour_title || "Your Safari";
  const words = title.split(" ");
  const guest = [clientInfo?.salutation && `${clientInfo.salutation}.`, clientInfo?.first_name, clientInfo?.last_name]
    .filter(Boolean)
    .join(" ");

  const facts = [
    { icon: CalendarDays, text: `${clientInfo?.tour_length || "–"} Days · ${nights} Nights` },
    { icon: MapPin, text: clientInfo?.country_visited },
    { icon: Users, text: clientInfo?.total_travellers },
  ].filter((f) => f.text);

  return (
    <section ref={ref} id="overview" className="relative h-[100svh] min-h-[560px] overflow-hidden" style={{ background: C.ink }}>
      {/* Photo with slow "Ken Burns" zoom and parallax */}
      <motion.div className="absolute inset-0" style={{ y: photoY }}>
        {heroImage ? (
          <motion.img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover"
            initial={{ scale: still ? 1 : 1.18 }}
            animate={{ scale: 1.02 }}
            transition={{ duration: still ? 0 : 14, ease: "easeOut" }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#1d2a22] via-[#101611] to-black" />
        )}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0D] via-[#0B0F0D]/55 to-[#0B0F0D]/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F0D]/70 via-transparent to-transparent" />

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-28 sm:px-10 sm:pb-32"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em]"
          style={{ color: C.goldSoft }}
        >
          <span className="h-px w-10" style={{ background: C.gold }} />
          Privately designed for {guest || "you"}
        </motion.div>

        <h1 className="max-w-4xl text-[clamp(2.4rem,7vw,5.6rem)] font-semibold leading-[1.02] tracking-tight" style={{ ...serif, color: C.cream }}>
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-2 align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: still ? 0 : "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.35 + i * 0.07 }}
              >
                {w}&nbsp;
              </motion.span>
            </span>
          ))}
        </h1>

        {/* gold sweep under the title */}
        <motion.span
          className="mt-4 block h-[3px] w-40 origin-left rounded-full"
          style={{ background: `linear-gradient(90deg, ${C.gold}, ${C.goldSoft}, transparent)` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.6 + words.length * 0.07 }}
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.9 + words.length * 0.07 }}
          className="mt-7 flex flex-wrap gap-2.5"
        >
          {facts.map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm backdrop-blur-md"
              style={{ borderColor: "rgba(243,238,227,0.18)", background: "rgba(11,15,13,0.35)", color: C.cream }}
            >
              <Icon className="h-4 w-4" style={{ color: C.gold }} />
              {text}
            </span>
          ))}
          {clientInfo?.tour_start_date && (
            <span className="inline-flex items-center px-1 py-2 text-sm" style={{ color: C.muted }}>
              Starting {formatLongDate(clientInfo.tour_start_date)}
            </span>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 + words.length * 0.07 }}
          className="mt-6 text-sm"
          style={{ color: C.muted }}
        >
          Created by <span style={{ color: C.cream }} className="font-semibold">{clientInfo?.creator_full_name || clientInfo?.company_name}</span>
          {clientInfo?.creator_full_name && clientInfo?.company_name ? ` · ${clientInfo.company_name}` : ""}
        </motion.p>
      </motion.div>

      {/* scroll cue */}
      <motion.button
        type="button"
        onClick={onExplore}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em]"
        style={{ color: C.muted }}
        aria-label="Start exploring the itinerary"
      >
        Explore the journey
        <motion.span
          animate={still ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-9 items-center justify-center rounded-full border"
          style={{ borderColor: "rgba(201,163,91,0.5)" }}
        >
          <ChevronDown className="h-4 w-4" style={{ color: C.gold }} />
        </motion.span>
      </motion.button>
    </section>
  );
}
