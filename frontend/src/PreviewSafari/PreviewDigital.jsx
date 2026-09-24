import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../Apis/api";
import GlobalLoader from "../Component/Loader";
import { toast } from "sonner";
import {
  MapPin, Calendar, Users, Star, Phone, Mail, Building2,
  Utensils, Sparkles, Map, Bed, Clock, CheckCircle2,
  ChevronRight, Award, Compass, Sun, Moon, Sunrise,
  Calculator, X
} from "lucide-react";

import DigitalPageHeader from "./DigitalSection/Header";
import DigitalHeroSection from "./DigitalSection/HeroSection";
import DigitalMapComponent from "./DigitalSection/digitalMap";
import DigitalDayByDayComponent from "./DigitalSection/Days-by-Day";
import MainDigitalFooterComponent from "./DigitalSection/MainFooter";
import { AuthenticationContext } from "../Apis/AuthProvider";
import PricingBreakdownToStaff from "./DigitalSection/Pricing/PricingBreakDown"; // Hakikisha path ni sahihi

export default function PreviewDigitalPageDayByDayItinerary() {
  const { client_id, version_id } = useParams();
  const [safariData, setSafariData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State mpya ya kudhibiti kuonekana kwa Pricing Panel
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
      <DigitalPageHeader safariData={safariData} />
      <DigitalHeroSection safariData={safariData} />

      <DigitalMapComponent safariData={safariData} />
      <DigitalDayByDayComponent safariData={safariData} />
      <MainDigitalFooterComponent safariData={safariData} client_id={client_id} version_id={version_id} />
   

     {/* --- FLOATING ACTION BUTTON (FAB) FOR STAFF ONLY --- */}
          {isAuthenticated && userRole === "STAFF" && (
            <button
              onClick={() => setIsPricingOpen(true)}
              aria-label="View Pricing Breakdown"
              className="group fixed bottom-5 right-6 z-40 inline-flex items-center gap-3 overflow-hidden
                        rounded-full border border-amber-400/20
                        bg-gradient-to-br from-orange-950 via-orange-900 to-orange-950
                        px-5 py-3.5 font-semibold text-amber-200
                        shadow-[0_8px_24px_-6px_rgba(120,53,15,0.5),0_2px_6px_-1px_rgba(0,0,0,0.2)]
                        ring-1 ring-inset ring-white/10
                        transition-all duration-300 ease-out
                        hover:-translate-y-1 hover:border-amber-400/40
                        hover:text-amber-100
                        hover:shadow-[0_16px_36px_-8px_rgba(120,53,15,0.65),0_4px_12px_-2px_rgba(0,0,0,0.25)]
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2
                        active:translate-y-0 active:scale-[0.98]"
            >
              {/* Soft glow halo */}
              <span className="pointer-events-none absolute -inset-px rounded-full bg-gradient-to-r from-amber-500/0 via-amber-400/20 to-amber-500/0 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />

              {/* Shine sweep */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-amber-200/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

              {/* Icon container */}
              <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                              bg-amber-400/10 ring-1 ring-inset ring-amber-400/20
                              transition-all duration-300 group-hover:bg-amber-400/20 group-hover:ring-amber-400/40">
                <Calculator className="h-4 w-4 text-amber-300 transition-transform duration-500 group-hover:rotate-[18deg] group-hover:scale-110" />
              </span>

              {/* Label */}
              <span className="relative z-10 text-sm tracking-tight whitespace-nowrap">
                View Pricing Breakdown
              </span>

              {/* Pulse dot — live indicator */}
              <span className="relative z-10 ml-0.5 flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
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
              <PricingBreakdownToStaff 
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