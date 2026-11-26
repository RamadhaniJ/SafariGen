import { useContext, useEffect, useState , useMemo} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MapPin, Calendar, Users, Star, Phone, Mail, Building2,
  Utensils, Sparkles, Map, Bed, Clock, CheckCircle2,
  ChevronRight, Award, Compass, Sun, Moon, Sunrise,
  Calculator, X
} from "lucide-react";
import { AuthenticationContext } from "../../../Apis/AuthProvider";
import api from "../../../Apis/api";
import GlobalLoader from "../../../Component/Loader";

import FooterDigitalSection from "../DigitalSections/FooterSection5";
import PriceBreakdownSideBarSubSection from "../SubSections/SideBar-Pricing";

// Cinematic guest page (dark, full-screen photos, scroll animations)
import { C } from "../Cinematic/cinematic";
import CinematicHero from "../Cinematic/CinematicHero";
import DayNavigator from "../Cinematic/DayNavigator";
import RouteMap from "../Cinematic/RouteMap";
import SummaryTable from "../Cinematic/SummaryTable";
import DaySection from "../Cinematic/DaySection";

import PricingBreakdownPage from "../../Pricing/PricingBreakD";
  
export default function PreviewDigitalPageItineraryMain() {
  const { client_id, version_id } = useParams();
  const [safariData, setSafariData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isGuestPriceOpen, setIsGuestPriceOpen] = useState(false);
  
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


  const navigateHelper = useMemo(()=>{
            if (userRole === "MANAGER") return '/dashboard/manager';
            if (userRole === "STAFF") return '/staff/dashboard';
            return null;
        }, [userRole])
    

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
  const { client_info, days = [], map_image_url } = itinerary;
  const totalNights = days.reduce((n, d) => n + (d.accommodation_info ? (d.nights_number || 1) : 0), 0);
  const heroPhoto =
    hero_image ||
    days.map((d) => d.destination_info?.featured_image).find(Boolean) ||
    null;

  const handleConfirm = () =>
    toast.info("Booking feature opening soon! Contact host to confirm instantly.");

  return (
    <div className="relative min-h-screen" style={{ background: C.ink }}>

      {/* --- MAIN ITINERARY CONTENT --- */}
      <DayNavigator
        clientInfo={client_info}
        days={days}
        grandTotal={map_image_url?.grand_total}
        onOpenPrice={() => setIsGuestPriceOpen(true)}
        onConfirm={handleConfirm}
      />
      <CinematicHero
        clientInfo={client_info}
        heroImage={heroPhoto}
        nights={totalNights}
        onExplore={() => document.getElementById("route")?.scrollIntoView({ behavior: "smooth" })}
      />
      <RouteMap days={days} clientInfo={client_info} mapImage={map_image_url?.map_image} />
      <SummaryTable days={days} clientInfo={client_info} />
      {days.map((day, i) => (
        <DaySection key={day.id} day={day} index={i} total={days.length} />
      ))}
      <div id="your-quote">
        <FooterDigitalSection safariData={safariData} client_id={client_id} version_id={version_id} />
      </div>

      {isGuestPriceOpen && (
        <PriceBreakdownSideBarSubSection safariData={safariData} onClose={() => setIsGuestPriceOpen(false)} />
      )}

      

      {/* --- VERTICAL CLOSE BUTTON (left edge, staff only) --- */}
{isAuthenticated && (userRole === "STAFF" || userRole === "MANAGER") && (
  <button
    onClick={() => {
     navigate(`${navigateHelper}/quotes/list/`)
    }}
    aria-label="Close and return to previous page"
    className="group fixed left-0 top-1/2 z-40 -translate-y-1/2
               flex flex-col items-center justify-center
               rounded-r-2xl border border-l-0 border-stone-300/60
               bg-white/85 backdrop-blur-xl
               px-2 py-4
               shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]
               transition-all duration-300 ease-out
               hover:bg-white hover:px-2.5
               hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)]
               focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B98B3E]/50
               active:scale-[0.98]"
  >
    <span className="flex flex-col items-center gap-0.5">
      {"Close".split("").map((ch, i) => (
        <span
          key={i}
          className="text-[10px] font-bold uppercase tracking-wider leading-tight
                     text-stone-700 transition-colors duration-200
                     group-hover:text-[#B98B3E]"
        >
          {ch}
        </span>
      ))}
    </span>
  </button>
)}



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