import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, Receipt, CheckCircle2, Copy, Check } from "lucide-react";
import { toast } from "react-toastify";
import { C, EASE, serif, dayId, dayRangeLabel, money } from "./cinematic";

/**
 * Slim bar pinned to the top: company, where you are in the trip, a reading
 * progress line, and a menu to jump to any day or to the price.
 */
export default function DayNavigator({ clientInfo, days, grandTotal, onOpenPrice, onConfirm }) {
  const [active, setActive] = useState("overview");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "route", label: "Route map" },
    { id: "summary", label: "Day by day" },
    ...days.map((d) => ({ id: dayId(d), label: `${dayRangeLabel(d)} · ${d.destination_info?.name || "—"}` })),
    { id: "your-quote", label: "Your quote" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section in the middle of the screen.
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days.length]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(String(clientInfo?.tour_code || ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Couldn't copy the reference");
    }
  };

  const current = sections.find((s) => s.id === active);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-40 transition-colors duration-500"
        style={{
          background: scrolled ? "rgba(11,15,13,0.82)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: `1px solid ${scrolled ? C.line : "transparent"}`,
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            {clientInfo?.company_logo ? (
              <img src={clientInfo.company_logo} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15" />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: C.gold, color: C.ink }}>
                {(clientInfo?.company_name || "S").charAt(0)}
              </span>
            )}
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold" style={{ color: C.cream }}>{clientInfo?.company_name}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={current?.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: scrolled ? 1 : 0, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="truncate text-[11px] uppercase tracking-[0.18em]"
                  style={{ color: C.gold }}
                >
                  {current?.label}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPrice}
              className="hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:bg-white/5 sm:inline-flex"
              style={{ borderColor: "rgba(201,163,91,0.45)", color: C.cream }}
            >
              <Receipt className="h-4 w-4" style={{ color: C.gold }} />
              {money(grandTotal)}
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
              style={{ background: C.gold, color: C.ink }}
              aria-label="Open trip menu"
            >
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </div>
        {/* reading progress */}
        <motion.div className="h-[2px] origin-left" style={{ scaleX: progress, background: `linear-gradient(90deg, ${C.gold}, ${C.goldSoft})` }} />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto border-l px-6 pb-8 pt-6"
              style={{ background: C.panel, borderColor: C.line }}
              aria-label="Trip sections"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em]" style={{ color: C.gold }}>Your journey</p>
                  <p className="mt-1 text-xl" style={{ ...serif, color: C.cream }}>{clientInfo?.tour_title}</p>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/5" aria-label="Close menu">
                  <X className="h-5 w-5" style={{ color: C.cream }} />
                </button>
              </div>

              <ol className="relative space-y-1 border-l pl-5" style={{ borderColor: C.line }}>
                {sections.map((s, i) => {
                  const isActive = s.id === active;
                  return (
                    <motion.li
                      key={s.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.035, duration: 0.4, ease: EASE }}
                      className="relative"
                    >
                      <span
                        className="absolute -left-[26px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 transition"
                        style={{ borderColor: isActive ? C.gold : "rgba(243,238,227,0.25)", background: isActive ? C.gold : C.panel }}
                      />
                      <button
                        type="button"
                        onClick={() => go(s.id)}
                        className="w-full rounded-lg px-3 py-2.5 text-left text-[15px] transition hover:bg-white/5"
                        style={{ color: isActive ? C.cream : C.muted, fontWeight: isActive ? 600 : 400 }}
                      >
                        {s.label}
                      </button>
                    </motion.li>
                  );
                })}
              </ol>

              <div className="mt-auto space-y-3 pt-8">
                <button
                  type="button"
                  onClick={() => { setOpen(false); onOpenPrice(); }}
                  className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold"
                  style={{ borderColor: C.line, color: C.cream }}
                >
                  <span className="flex items-center gap-2"><Receipt className="h-4 w-4" style={{ color: C.gold }} /> Price details</span>
                  {money(grandTotal)}
                </button>
                <button
                  type="button"
                  onClick={() => { setOpen(false); onConfirm(); }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold"
                  style={{ background: C.gold, color: C.ink }}
                >
                  <CheckCircle2 className="h-4 w-4" /> Confirm safari
                </button>
                <button type="button" onClick={copyRef} className="flex w-full items-center justify-center gap-2 py-2 text-xs" style={{ color: C.muted }}>
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  Ref {clientInfo?.tour_code}
                </button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
