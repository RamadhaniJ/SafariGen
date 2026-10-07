import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  MapPin, Calendar, Users, Star, Phone, Mail, Building2,
  Utensils, Sparkles, Map, Bed, Clock, CheckCircle2,
  ChevronRight, Award, Compass, Sun, Moon, Sunrise,
  Calculator, X
} from "lucide-react";
import { AuthenticationContext } from "../../../Apis/AuthProvider";
import api from "../../../Apis/api";
import GlobalLoader from "../../../Component/Loader";

import DigitalPageHeaderSection from "../DigitalSections/Header1";
import DigitalHeroSection from "../DigitalSections/HeroSection2";
import DigitalMapSection from "../DigitalSections/MapSection3";
import DayByDayDigitalSection from "../DigitalSections/DayByDaySection4";
import FooterDigitalSection from "../DigitalSections/FooterSection5";

import PricingBreakdownPage from "../../Pricing/PricingBreakD";
  
export default function PreviewDigitalPageItineraryMain() {
  const { client_id, version_id } = useParams();
  const [safariData, setSafariData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isPricingOpen, setIsPricingOpen] = useState(false);
  
  const navigate = useNavigate();
  const { userRole, isAuthenticated } = useContext(AuthenticationContext);

  const fetchSafariData = async () => {
    setLoading(true);
    try {
      const resp = await api.get(`itinerary/preview/client/safari/data/${client_id}/${version_id}/`);
      setSafariData(resp.data);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (client_id) fetchSafariData();
  }, [client_id, version_id]);

  // Helper Functions
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };




  if (loading) return <GlobalLoader />;
  if (!safariData) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <p className="text-gray-500 text-lg">No itinerary data available</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Go Back</button>
    </div>
  );

  const { hero_image, itinerary } = safariData;
  const { client_info, days, map_image_url } = itinerary;

  return (
    <div className="relative bg-stone-700 min-h-screen">
      
      {/* --- MAIN ITINERARY CONTENT --- */}
      <DigitalPageHeaderSection safariData={safariData} />
      <DigitalHeroSection safariData={safariData} />

      <DigitalMapSection safariData={safariData} />
      <DayByDayDigitalSection safariData={safariData} />
      <FooterDigitalSection safariData={safariData} client_id={client_id} version_id={version_id} />


      {/* --- FLOATING ACTION BUTTON (FAB) FOR STAFF ONLY --- */}
        {isAuthenticated && (userRole === "STAFF" || userRole === "MANAGER") && (
          <button
            onClick={() => setIsPricingOpen(true)}
            aria-label="View Pricing Breakdown"
            className="group fixed bottom-4 right-4 z-40 inline-flex items-center gap-2.5 overflow-hidden
                      rounded-full border border-white/10 bg-white/[0.035] backdrop-blur-xl
                      px-4 py-3 font-medium text-[#FBF8F1]
                      shadow-[0_10px_36px_-12px_rgba(0,0,0,0.85),0_2px_8px_-2px_rgba(0,0,0,0.4)]
                      ring-1 ring-inset ring-white/5
                      transition-all duration-300 ease-out
                      hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]
                      hover:shadow-[0_18px_44px_-14px_rgba(0,0,0,0.9),0_4px_14px_-2px_rgba(0,0,0,0.5)]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBF8F1]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                      active:translate-y-0 active:scale-[0.97]
                      sm:bottom-6 sm:right-6 sm:gap-3 sm:px-5 sm:py-3.5"
          >
            {/* ambient top glow */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#FBF8F1]/[0.08] blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            {/* emerald live glow */}
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-14 -left-14 h-28 w-28 rounded-full bg-emerald-400/[0.10] blur-3xl"
            />
            {/* hairline top highlight */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#FBF8F1]/30 to-transparent"
            />

            {/* shine sweep */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-[#FBF8F1]/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />

            {/* icon tile */}
            <span
              className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                        border border-white/10 bg-[#FBF8F1]/[0.06]
                        transition-all duration-300 group-hover:border-white/20 group-hover:bg-[#FBF8F1]/[0.10]"
            >
              <Calculator className="h-3.5 w-3.5 text-[#FBF8F1]/90 transition-transform duration-500 group-hover:rotate-[18deg] group-hover:scale-110" />
            </span>

            {/* label */}
            <span className="relative z-10 hidden text-[13px] tracking-tight whitespace-nowrap sm:inline">
              View Pricing Breakdown
            </span>

            {/* pulse dot — live indicator */}
            <span className="relative z-10 ml-0.5 flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
          </button>
        )}


      {/* --- SLIDE-OVER PRICING PANEL (MODAL) --- */}
      {isPricingOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          
          {/* 1. Backdrop (Darkens the background, closes on click) */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsPricingOpen(false)}
          ></div>

          {/* 2. Slide-over Panel */}
          <div className="relative w-full max-w-5xl bg-gray-50 h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 ease-out">
            
            {/* Panel Header (Sticky) */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Pricing Breakdown</h2>
                        <p className="text-sm text-gray-500">Internal use only • <span className="font-bold text-zinc-800" >Hidden from client</span></p>
                   </div>

              </div>
              
              <button
                onClick={() => setIsPricingOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                aria-label="Close pricing panel"
              >
                <X className="w-6 h-6 text-gray-500 group-hover:text-red-500 transition-colors" />
              </button>
            </div>

            {/* Panel Content (Our Component) */}
            <div className="p-4 md:p-6">
              <PricingBreakdownPage 
                client_id={client_id} 
                version_id={version_id}
                safariData={safariData} 
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}