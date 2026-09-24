import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Receipt,
  CheckCircle2,
  ShieldCheck,
  Compass,
  ChevronRight,
} from "lucide-react";
import PriceBreakdownSideBarPopUp from "./PriceBreakDown";

export default function DigitalPageHeader({ safariData }) {
  const [showPricingBreakdown, setShowPricingBreakdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { itinerary } = safariData || {};
  const { client_info, map_image_url, version_info} = itinerary || {};

  /* ------------------------------------------------------------------ */
  /*  Scroll listener — adds subtle shadow when header is no longer at  */
  /*  the very top, giving a modern "sticky" elevation feel.            */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll(); // initial check
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!client_info) return null;

  const handlePricingBreakDown = () =>
    setShowPricingBreakdown((prev) => !prev);

  /* ------------------------------------------------------------------ */
  /*  Format the grand total as a clean USD price (no decimal places).  */
  /* ------------------------------------------------------------------ */
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(map_image_url?.grand_total || 0);

  const companyName = client_info.staff_company || "Serengeti Safaris";
  const tourCode = client_info.tour_code || "N/A";

  return (
    <>
      <header
        className={`
           w-full z-50
          border-b transition-all duration-300
            border-stone-200/80 bg-[#fdfdfd] shadow-lg shadow-stone-900/[0.04] backdrop-blur-xl
                 
        `}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ------------------------- Desktop & Mobile Layout ------------------------- */}
          <div className="flex flex-col gap-3 py-3.5 md:h-16 md:flex-row md:items-center md:justify-between md:gap-6 md:py-0">
            {/* ==================== LEFT: Brand + Reference ==================== */}
            <div className="flex items-center justify-between gap-3 md:justify-start md:gap-5">
              {/* Brand */}
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-900 shadow-sm ring-1 ring-stone-900/10">
                  <Compass className="h-5 w-5 text-amber-400" />
                </div>
                <h1 className="truncate text-sm font-semibold tracking-tight text-stone-900 sm:text-[15px]">
                  {companyName}
                </h1>
              </div>

        
              {/* Reference badge — visible on all screens, pill-shaped */}
              <div
                className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-stone-200/80
                          bg-gradient-to-b from-white to-stone-50/80 py-1 pl-3 pr-1.5
                          shadow-[0_1px_2px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)]
                          ring-1 ring-inset ring-white/60
                          transition-all duration-300 ease-out
                          hover:-translate-y-px hover:border-stone-300
                          hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]"
                title={`Reference #${tourCode} · v${version_info.version_number}`}
              >
                {/* Label */}
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400 transition-colors duration-300 group-hover:text-stone-500">
                  Ref
                </span>

                {/* Code */}
                <span className="font-mono text-xs font-semibold tabular-nums tracking-tight text-stone-800">
                  #{tourCode}
                </span>

                {/* Divider */}
                <span className="hidden h-3.5 w-px bg-gradient-to-b from-transparent via-stone-200 to-transparent sm:block" />

                {/* Version chip */}
                <span className="hidden items-center gap-1.5 rounded-full bg-stone-100/90 px-2 py-[3px] sm:inline-flex">
                  <span className="text-[10px] font-medium tracking-wide text-stone-500">
                    v{version_info.version_number}
                  </span>

                  {version_info.is_current && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* ==================== RIGHT: Price + Actions ==================== */}
            <div className="flex items-center gap-2.5 md:gap-3">
              {/* Price — hidden on mobile (shown separately below) */}
              <div className="hidden items-baseline gap-2 rounded-xl border border-stone-200/80 bg-white px-4 py-2 shadow-xs md:flex">
                <span className="text-[10px] font-medium uppercase tracking-widest text-stone-500">
                  Total
                </span>
                <span className="text-lg font-bold tracking-tight text-stone-900">
                  {formattedPrice}
                </span>
                <span className="text-xs font-medium text-stone-400">USD</span>
              </div>

              {/* Pricing breakdown — outline button */}
              <button
                onClick={handlePricingBreakDown}
                className="group inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-stone-700 transition-all duration-200 hover:border-stone-300 hover:bg-stone-50 active:scale-[0.97] sm:px-4"
              >
                <span className="hidden sm:inline">Pricing Breakdown</span>
                <span className="sm:hidden">Breakdown</span>
              </button>

              {/* Confirm CTA — solid dark button */}
              <button
                onClick={() =>
                  toast.info(
                    "Booking feature opening soon! Contact host to confirm instantly."
                  )
                }
                className="group inline-flex items-center justify-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-stone-800 hover:shadow-md active:scale-[0.97] sm:px-5"
              >
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>Confirm Safari</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* ==================== MOBILE PRICE ROW ==================== */}
          {/* Shown only below `md` — clean, prominent, full-width */}
          <div className="flex items-center justify-between border-t border-stone-100 pb-3 pt-2.5 md:hidden">
            <span className="text-[11px] font-medium uppercase tracking-widest text-stone-500">
              Total Price
            </span>
            <span className="text-xl font-bold tracking-tight text-stone-900">
              {formattedPrice}
              <span className="ml-1 text-xs font-medium text-stone-400">
                USD
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* ------------------------- Sidebar Popup ------------------------- */}
      {showPricingBreakdown && (
        <PriceBreakdownSideBarPopUp
          safariData={safariData}
          onClose={() => setShowPricingBreakdown(false)}
        />
      )}
    </>
  );
}