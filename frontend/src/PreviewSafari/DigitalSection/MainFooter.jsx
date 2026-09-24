

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileDown,
  Loader2,
  MapPin,
  Globe,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../Apis/api";
import PriceBreakdownSideBarPopUp from "./PriceBreakDown";

/* ------------------------------------------------------------------ */
/*  Premium social icons (your file)                                   */
/*  Adjust this path to wherever you saved SocialIcons.jsx             */
/* ------------------------------------------------------------------ */

import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
  TwitterIcon,
  ThreadsIcon,
} from "./Icons/SocialIcons";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const PDF_STEPS = [
  "Connecting to your secure workspace…",
  "Fetching your personalized data…",
  "Generating your custom document…",
  "Applying your branding & preferences…",
  "Rendering high-resolution PDF…",
  "Finalising layout & quality check…",
  "Almost there — preparing your download…",
];

const SOCIALS = [
  { label: "Facebook", Icon: FacebookIcon, href: "https://facebook.com/acesafarisltd" },
  { label: "Instagram", Icon: InstagramIcon, href: "https://instagram.com/acesafarisltd" },
  { label: "TikTok", Icon: TikTokIcon, href: "https://tiktok.com/@acesafarisltd" },
  { label: "YouTube", Icon: YouTubeIcon, href: "https://youtube.com/@acesafarisltd" },
  { label: "Twitter", Icon: TwitterIcon, href: "https://twitter.com/acesafarisltd" },
  { label: "Threads", Icon: ThreadsIcon, href: "https://threads.net/@acesafarisltd" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MainDigitalFooterComponent({
  safariData,
  client_id,
  version_id,
  onConfirmBooking,
}) {
  const { itinerary } = safariData || {};
  const { client_info = {}, map_image_url = {} } = itinerary || {};

  const [downloading, setDownloading] = useState(false);
  const [showPricingBreakdown, setShowPricingBreakdown] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => () => clearInterval(intervalRef.current), []);

    const handlePricingBreakDown = () =>
    setShowPricingBreakdown((prev) => !prev);


  /* ----------------------------- price ----------------------------- */
  const rawTotal = Number(map_image_url?.grand_total ?? 0);
  const total = Number.isFinite(rawTotal)
    ? rawTotal.toLocaleString("en-US")
    : map_image_url?.grand_total;

  /* --------------------------- download ---------------------------- */
  const handleDownloadPdf = async () => {
    if (!client_id || client_id === "undefined") {
      toast.error("Client not found! Try again later.");
      return;
    }

    setDownloading(true);

    let step = 0;
    const toastId = toast.loading(PDF_STEPS[0]);

    intervalRef.current = setInterval(() => {
      step = Math.min(step + 1, PDF_STEPS.length - 1);
      toast.loading(PDF_STEPS[step], { id: toastId });
    }, 2500);

    try {
      const response = await api.get(`itinerary/view/pdf/${client_id}/${version_id}`, {
        responseType: "blob",
        timeout: 120000,
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        `${client_info?.tour_title}.pdf` ||
        `Safari Proposal-${client_info?.tour_code}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      clearInterval(intervalRef.current);
      toast.success("Download success! 🔥", { id: toastId });
    } catch (error) {
      console.error("PDF error:", error);
      clearInterval(intervalRef.current);
      toast.error("Failed to generate PDF. Try again later.", { id: toastId });
    } finally {
      clearInterval(intervalRef.current);
      setDownloading(false);
    }
  };

  /* --------------------------- booking ----------------------------- */
  const handleBookingConfirmation = () => {
    if (typeof onConfirmBooking === "function") return onConfirmBooking();
    toast.success("Booking request sent — our team will contact you shortly.");
  };

  /* ---------------------------- render ----------------------------- */
  return (
    <footer className="w-full bg-[#16211A] border-t border-[#B98B3E]/20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,500&family=Inter:wght@400;500;600&display=swap');
        .ddw-serif { font-family: 'Fraunces', serif; }
        .ddw-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-10 ddw-sans">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          {/* ================= Left — Proposal ================= */}
          <div className="lg:col-span-5">
            {/* <p className="text-sm text-[#B98B3E]">Your safari proposal</p> */}

            <h1 className="mt-4 text-3xl sm:text-4xl leading-tight text-[#FBF8F1]">
              Special {client_info?.tour_title} for{" "}
             <span className="font-extrabold ddw-sans"> {client_info?.salutation} {client_info?.first_name}{" "}{client_info?.last_name}</span>  
            </h1>

            <div className="mt-8 flex items-baseline gap-2">
              <span className="text-sm text-[#FBF8F1]/45">USD</span>
              <span className="ddw-serif text-4xl text-[#FBF8F1]">
                ${total}
              </span>
              <span className="text-sm text-[#FBF8F1]/45">total</span>
            </div>

            <button
              type="button"
              onClick={handlePricingBreakDown}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#FBF8F1]/60 underline decoration-[#FBF8F1]/25 decoration-1 underline-offset-4 transition-colors hover:text-[#FBF8F1] hover:decoration-[#B98B3E]"
            >
              See detailed price breakdown
            </button>

            <div className="mt-8 h-px w-full bg-[#B98B3E]/15" />

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={downloading}
                onClick={handleDownloadPdf}
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#16211A] transition-all duration-300 ${
                  downloading
                    ? "cursor-not-allowed bg-[#B98B3E]/50"
                    : "cursor-pointer bg-[#B98B3E] hover:bg-[#CBA05A] hover:shadow-lg hover:shadow-[#B98B3E]/20"
                }`}
              >
                {downloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Wait a bit…</span>
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4" />
                    <span>Download quote</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBookingConfirmation}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#FBF8F1]/25 bg-transparent px-6 py-3 text-sm font-semibold text-[#FBF8F1] transition-all duration-300 hover:border-[#FBF8F1] hover:bg-[#FBF8F1] hover:text-[#16211A]"
              >
                Confirm booking
              </button>
            </div>
          </div>

          {/* ================= Middle — Contact ================= */}
          <div className="lg:col-span-4">
            <p className="text-sm text-[#FBF8F1]/45">Contact us</p>

            <p className="mt-4 text-sm font-medium leading-relaxed text-[#FBF8F1]">
              {client_info?.staff_full_name || "James Mollel"}
              <span className="text-[#FBF8F1]/45">
                {" — "}
                {client_info?.staff_company} Safaris Ltd
              </span>
            </p>

            <ul className="mt-7 space-y-5">
              <ContactRow Icon={MapPin} label="Address" value="Arusha, Sekei Rd." />
              <ContactRow Icon={Globe} label="Country" value="Tanzania" />
              <ContactRow
                Icon={Phone}
                label="Phone"
                value="+255 783 738 8923"
                href="tel:+2557837388923"
              />
              <ContactRow
                Icon={Mail}
                label="Email"
                value="contact@acesafarisltd.com"
                href="mailto:contact@acesafarisltd.com"
              />
            </ul>
          </div>

          {/* ================= Right — Socials ================= */}
          <div className="lg:col-span-3">
            <p className="text-sm text-[#FBF8F1]/45">Follow us</p>

            <ul className="mt-4 -ml-3 space-y-0.5">
              {SOCIALS.map(({ label, Icon, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-200 hover:bg-[#FBF8F1]/[0.05]"
                  >
                    <Icon
                      size={26}
                      className="shrink-0 opacity-90 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:opacity-100"
                    />
                    <span className="text-sm font-medium text-[#FBF8F1]/70 transition-colors group-hover:text-[#FBF8F1]">
                      {label}
                    </span>
                    <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-[#FBF8F1]/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 h-px w-full bg-[#B98B3E]/15" />

            <Link
              to="/"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#FBF8F1]"
            >
              Visit our website
              <ArrowUpRight className="h-4 w-4 text-[#B98B3E] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>

        {showPricingBreakdown && (
              <PriceBreakdownSideBarPopUp
                safariData={safariData}
                onClose={() => setShowPricingBreakdown(false)}
              />
            )}

    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Small presentational helper                                        */
/* ------------------------------------------------------------------ */

function ContactRow({ Icon, label, value, href }) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#B98B3E]/10 text-[#B98B3E] transition-colors group-hover:bg-[#B98B3E] group-hover:text-[#16211A]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <span className="block text-xs text-[#FBF8F1]/40">{label}</span>
        <p className="truncate text-sm font-medium text-[#FBF8F1]/90">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <li className="group">
      {href ? (
        <a href={href} className="block transition-opacity hover:opacity-80">
          {content}
        </a>
      ) : (
        content
      )}
    </li>
  );
}