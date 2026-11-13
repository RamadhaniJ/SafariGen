import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Receipt,
  ShieldCheck,
  Compass,
  ChevronRight,
  X,
  Menu,
  Copy,
  Check,
} from "lucide-react";
import PriceBreakdownSideBarSubSection from "../SubSections/SideBar-Pricing";

/* ------------------------------------------------------------------ */
/*  Shared bits                                                        */
/* ------------------------------------------------------------------ */
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
    </span>
  );
}

function MenuRow({ icon: Icon, label, hint, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3.5 rounded-2xl p-3 text-left transition-colors hover:bg-stone-50 active:bg-stone-100 ${FOCUS}`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-stone-100 text-stone-700 transition-colors group-hover:bg-white group-hover:shadow-sm">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium text-stone-900">
          {label}
        </span>
        <span className="block truncate text-[13px] text-stone-500">
          {hint}
        </span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-stone-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-stone-500" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */
export default function DigitalPageHeaderSection({ safariData }) {
  const [showPricingBreakdown, setShowPricingBreakdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const { itinerary } = safariData || {};
  const { client_info, map_image_url, version_info } = itinerary || {};

  /* ----------------------------- scroll state ----------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      setIsScrolled(y > 8);
      setProgress(Math.min(Math.max(y / max, 0), 1));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  /* ------------------- lock scroll + ESC while menu is open ---------------- */
  useEffect(() => {
    if (!isMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => e.key === "Escape" && setIsMenuOpen(false);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  /* ------------------------------- derived -------------------------------- */
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(map_image_url?.grand_total || 0);

  const companyName = client_info?.company_name || "Serengeti Safaris";
  const tourCode = client_info?.tour_code || "N/A";
  const versionNumber = version_info?.version_number;
  const isCurrentVersion = version_info?.is_current;

  const handlePricingBreakDown = () => {
    setIsMenuOpen(false);
    setShowPricingBreakdown(true);
  };

  const handleConfirm = () => {
    setIsMenuOpen(false);
    toast.info(
      "Booking feature opening soon! Contact host to confirm instantly."
    );
  };

  const handleCopyRef = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(String(tourCode));
      setCopied(true);
      toast.success("Reference copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy the reference");
    }
  }, [tourCode]);

  if (!client_info) return null;

  return (
    <>
      {/* ==================================================================== */}
      {/*  HEADER                                                              */}
      {/* ==================================================================== */}
      <header
        className={[
          "sticky top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none",
          isScrolled
            ? "border-stone-200/80 bg-white/75 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.25)] backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-white",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* ------------------------- LEFT · identity ---------------------- */}
            <div className="flex min-w-0 items-center gap-3">
              <a
                href="#"
                className={`flex min-w-0 items-center gap-3 rounded-lg ${FOCUS}`}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-white ring-1 ring-stone-200">
                  <img
                    src={client_info?.company_logo}
                    alt=""
                    className="h-full w-full object-contain p-1.5"
                  />
                </span>
                <span className="truncate text-[15px] font-semibold tracking-tight text-stone-900">
                  {companyName}
                </span>
              </a>

              {/* divider */}
              <span
                className="hidden h-5 w-px rotate-[20deg] bg-stone-200 lg:block"
                aria-hidden="true"
              />

              {/* Reference chip: click to copy */}
              <button
                type="button"
                onClick={handleCopyRef}
                title="Copy reference"
                className={`group hidden items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 lg:inline-flex ${FOCUS}`}
              >
                <span className="text-stone-400">Ref</span>
                <span className="font-medium tabular-nums text-stone-800">
                  {tourCode}
                </span>
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-stone-300 transition-colors group-hover:text-stone-500" />
                )}
              </button>

              {versionNumber && (
                <span className="hidden items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600 lg:inline-flex">
                  v{versionNumber}
                  {isCurrentVersion && (
                    <>
                      <LiveDot />
                      <span className="sr-only">Current version</span>
                    </>
                  )}
                </span>
              )}
            </div>

            {/* --------------------- RIGHT · desktop actions ------------------ */}
            <div className="hidden items-center gap-3 md:flex">
              {/* Price */}
              <div className="pr-1 text-right leading-none">
                <p className="text-xs text-stone-500">Total price</p>
                <p className="mt-1 text-lg font-semibold tabular-nums tracking-tight text-stone-900">
                  {formattedPrice}
                  <span className="ml-1 text-xs font-normal text-stone-400">
                    USD
                  </span>
                </p>
              </div>

              <span className="h-8 w-px bg-stone-200" aria-hidden="true" />

              <button
                type="button"
                onClick={handlePricingBreakDown}
                className={`inline-flex h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900 active:scale-[0.98] motion-reduce:active:scale-100 ${FOCUS}`}
              >
                <Receipt className="h-4 w-4 text-stone-400" strokeWidth={1.8} />
                <span className="hidden lg:inline">Price breakdown</span>
                <span className="lg:hidden">Breakdown</span>
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className={`group inline-flex h-10 items-center gap-2 rounded-xl bg-stone-900 pl-4 pr-3 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-200 hover:bg-stone-800 active:scale-[0.98] motion-reduce:active:scale-100 ${FOCUS}`}
              >
                Confirm safari
                <ChevronRight className="h-4 w-4 opacity-60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </button>
            </div>

            {/* --------------------- RIGHT · mobile actions ------------------- */}
            <div className="flex items-center gap-1 md:hidden">
              <p className="text-[15px] font-semibold tabular-nums tracking-tight text-stone-900">
                {formattedPrice}
              </p>
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
                className={`-mr-2 grid h-10 w-10 place-items-center rounded-xl text-stone-700 transition-colors hover:bg-stone-100 active:bg-stone-200 ${FOCUS}`}
              >
                <Menu className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>

        {/* Reading progress */}
      </header>

      {/* ==================================================================== */}
      {/*  MOBILE BOTTOM SHEET                                                 */}
      {/* ==================================================================== */}
      <div
        className={[
          "fixed inset-0 z-[70] md:hidden",
          isMenuOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!isMenuOpen}
      >
        {/* backdrop */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={[
            "absolute inset-0 bg-stone-950/40 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none",
            isMenuOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        {/* sheet */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Trip menu"
          className={[
            "absolute inset-x-0 bottom-0 flex max-h-[92%] flex-col rounded-t-[28px] bg-white shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            isMenuOpen ? "translate-y-0" : "translate-y-full",
          ].join(" ")}
        >
          {/* grabber */}
          <div className="flex justify-center pt-2.5" aria-hidden="true">
            <span className="h-1 w-9 rounded-full bg-stone-200" />
          </div>

          {/* top bar */}
          <div className="flex items-center justify-between px-5 pb-2 pt-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-stone-200">
                <img
                  src={client_info?.company_logo}
                  alt=""
                  className="h-full w-full object-contain p-1"
                />
              </span>
              <span className="truncate text-[15px] font-semibold tracking-tight text-stone-900">
                {companyName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className={`-mr-2 grid h-10 w-10 place-items-center rounded-xl text-stone-500 transition-colors hover:bg-stone-100 active:bg-stone-200 ${FOCUS}`}
            >
              <X className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>

          {/* body */}
          <div className="flex-1 overflow-y-auto px-5 pb-4">
            {/* price */}
            <div className="mt-2 rounded-2xl bg-stone-50 p-5 ring-1 ring-stone-200/70">
              <p className="text-[13px] text-stone-500">Total trip price</p>
              <p className="mt-1 text-4xl font-semibold tabular-nums tracking-tight text-stone-900">
                {formattedPrice}
                <span className="ml-1.5 text-sm font-normal text-stone-400">
                  USD
                </span>
              </p>

              <dl className="mt-4 divide-y divide-stone-200/70 border-t border-stone-200/70 text-[13px]">
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-stone-500">Reference</dt>
                  <dd className="font-medium tabular-nums text-stone-900">
                    #{tourCode}
                  </dd>
                </div>
                {versionNumber && (
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-stone-500">Version</dt>
                    <dd className="inline-flex items-center gap-2 font-medium text-stone-900">
                      v{versionNumber}
                      {isCurrentVersion && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          <LiveDot />
                          Current
                        </span>
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* actions */}
            <nav className="mt-3 space-y-0.5" aria-label="Trip">
              <MenuRow
                icon={Receipt}
                label="Price breakdown"
                hint="See the full cost split"
                onClick={handlePricingBreakDown}
              />
              <MenuRow
                icon={Compass}
                label="Trip overview"
                hint="Day-by-day itinerary"
                onClick={() => toast.info("Trip overview coming soon.")}
              />
            </nav>
          </div>

          {/* footer CTA */}
          <div className="shrink-0 border-t border-stone-100 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
            <button
              type="button"
              onClick={handleConfirm}
              className={`group flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_20px_-8px_rgba(0,0,0,0.5)] transition-all duration-200 hover:bg-stone-800 active:scale-[0.98] motion-reduce:active:scale-100 ${FOCUS}`}
            >
              <ShieldCheck className="h-[18px] w-[18px] text-amber-400" />
              Confirm safari
            </button>
            <p className="mt-2.5 text-center text-xs text-stone-500">
              Free cancellation up to 30 days before departure
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/*  PRICING SIDEBAR                                                     */}
      {/* ==================================================================== */}
      {showPricingBreakdown && (
        <PriceBreakdownSideBarSubSection
          safariData={safariData}
          onClose={() => setShowPricingBreakdown(false)}
        />
      )}
    </>
  );
}