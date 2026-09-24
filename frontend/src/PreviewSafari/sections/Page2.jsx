import React from "react";
import { CheckCircle2, XCircle, ShieldCheck, CreditCard } from "lucide-react";
import { toast } from "sonner";
import PageFooter from "../shared/pageFooter";
import { useNavigate } from "react-router-dom";

export default function Page2Component({ safariData }) {
  const navigate = useNavigate();
  const { itinerary } = safariData || {};
  const { client_info, map_image_url } = itinerary || {};

  if (!client_info) return null;

  const clientName = `${client_info.salutation || "Mr/Ms"}. ${client_info.first_name || ""} ${client_info.last_name || ""}`.trim();
  const tour_code = client_info.tour_code || "N/A";
  const company_name = client_info.staff_company || "ACE";

  const DUMMY_INCLUDED = [
    "All accommodation during the safari itinerary as specified",
    "Professional, English-speaking safari guide and driver",
    "Private 4x4 safari vehicle with a pop-up roof for game viewing",
    "All national park entrance fees and conservation fees",
    "Full board meals (Breakfast, Lunch, and Dinner as specified)",
    "Complimentary bottled drinking water inside the safari vehicle",

  ];

  const DUMMY_EXCLUDED = [
    "Additional accommodation before and at the end of the tour",
    "International and domestic flights (unless specified otherwise)",
    "Entry visas for the destination country",
    "Tips and gratuities for the safari guide and camp staff",
    "Comprehensive travel, medical, and baggage insurance",
    "Premium alcoholic beverages and soft drinks at the lodges",
   
  ];

  const formatCurrency = (value) => {
    if (!value) return "N/A";
    return `$${Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    // BADILISHO: Ondoa h-[297mm] na overflow-hidden. Tumia w-full ili ijaze PageWrapper.
    <div className="pdf-section relative w-full bg-white text-[#2B2620] font-sans px-10 pt-8 pb-12">
      
      {/* ── Header Bar ───────────────────────────────── */}
      <div className="flex flex-row items-center justify-between gap-4 mb-8">
        <div className="bg-[#2B2620] text-[#F8F4EA] rounded-lg px-5 py-2.5 shadow-sm">
          <h1 className="text-xs font-bold tracking-[0.15em] uppercase">
            Pricing & Details
          </h1>
        </div>
      </div>

      <div className="border-b border-[#B98B3E]/30 pb-2 mb-5">
        <h2 className="ddw-serif text-4xl text-[#16211A] tracking-tight flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-[#B98B3E]" />
          Inclusions & Exclusions
        </h2>
      </div>

      {/* BADILISHO: break-inside-avoid inazuia box hili kusikatwa katikati ya page 2 na 3 */}
      <div className="grid grid-cols-2 gap-5 mb-10">
        <div className="bg-[#F8F4EA]/40 border border-[#2B2620]/20 rounded-xl p-6 break-inside-avoid">
          <div className="flex items-center gap-3 pb-3 border-b border-[#24352A]/10 mb-4">
            <CheckCircle2 className="w-5 h-5 text-[#24352A] shrink-0" />
            <h3 className="text-lg font-bold text-[#16211A] tracking-wide uppercase">
              What's Included
            </h3>
          </div>
          <ul className="space-y-2.5">
            {DUMMY_INCLUDED.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[#3D4A3F] text-sm leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#B98B3E] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#F8F4EA]/40 border border-[#2B2620]/20 rounded-xl p-6 break-inside-avoid">
          <div className="flex items-center gap-3 pb-3 border-b border-[#9C5B3C]/10 mb-4">
            <XCircle className="w-5 h-5 text-[#9C5B3C] shrink-0" />
            <h3 className="text-lg font-bold text-[#16211A] tracking-wide uppercase">
              What's Excluded
            </h3>
          </div>
          <ul className="space-y-2.5">
            {DUMMY_EXCLUDED.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[#3D4A3F] text-sm leading-relaxed">
                <XCircle className="w-4 h-4 text-[#9C5B3C]/70 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-b border-[#B98B3E]/30 pb-2 mb-5 break-inside-avoid">
        <h2 className="ddw-serif text-4xl text-[#16211A] tracking-tight flex items-center gap-3">
          <CreditCard className="w-7 h-7 text-[#B98B3E]" />
          Cost Breakdown
        </h2>
      </div>

      <div className="bg-[#2B2620] text-[#F8F4EA] rounded-xl border border-[#2B2620] break-inside-avoid mb-12">
        <div className="grid grid-cols-3 divide-x divide-[#F8F4EA]/20">
          <div className="p-6 text-left">
            <span className="text-[9px] uppercase tracking-[0.15em] text-[#B98B3E] font-bold block mb-2">
              Total Travellers
            </span>
            <p className="ddw-serif text-xl text-white font-bold">
              {client_info.total_travellers || "N/A"}
            </p>
          </div>
          <div className="p-6 text-left">
            <span className="text-[9px] uppercase tracking-[0.15em] text-[#B98B3E] font-bold block mb-2">
              Price Per Person
            </span>
            <p className="ddw-serif text-2xl text-white font-bold">
              {formatCurrency(map_image_url?.price_per_person)}
            </p>
          </div>
          <div className="p-6 text-left">
            <span className="text-[9px] uppercase tracking-[0.15em] text-[#B98B3E] font-bold block mb-2">
              Grand Total (USD)
            </span>
            <p className="ddw-serif text-3xl text-[#B98B3E] font-extrabold">
              {formatCurrency(map_image_url?.grand_total)}
            </p>
          </div>
        </div>

        <div className="bg-[#16211A] px-8 py-4 flex flex-row items-center justify-between gap-4 border-t border-[#F8F4EA]/20 rounded-b-xl">
          <p className="text-[#F8F4EA]/70 text-sm">
            All quotes are inclusive of park entrance fees and local VAT.
          </p>
          <button
            onClick={() => toast.info("Coming soon!")}
            className="px-8 py-3 bg-[#B98B3E] hover:bg-[#A37A34] text-[#2B2620] font-bold text-sm uppercase tracking-wider rounded-lg shadow-md transition-all duration-300 cursor-pointer active:scale-95"
          >
            Confirm Booking
          </button>
        </div>
      </div>

    
    </div>
  );
}