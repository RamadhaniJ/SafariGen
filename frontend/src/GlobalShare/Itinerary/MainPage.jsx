import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AccommodationComponentGlobal from "../Components/Accommodation";
import ActivitiesComponentGlobal from "../Components/Activities";
import DestinationComponentGlobal from "../Components/Destination";
import OptionalMealComponentGlobal from "../Components/Meals";

import api from "../../Apis/api";
import { toast } from 'react-toastify';
import SmartPricingBreakdownGlobal from "../Itinerary/BreakDown/PriceBreakDown"
import useItineraryPricingGlobal from "./Hooks/useItineraryPrice";
import MissingPricesNotice from "./BreakDown/MissingPricesNotice";

import { 
  Plus, 
  Utensils, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  Moon, 
  Trash2, 
  AlertTriangle ,
  Calculator, 
  X 
} from "lucide-react";

export default function ItineraryMainGlobal() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dayConfigs, setDayConfigs] = useState([]);

  // Modal State Controls
  const [activeActivityModalDay, setActiveActivityModalDay] = useState(null);
  const [activeMealModalDay, setActiveMealModalDay] = useState(null);
  const [showSavingModal, setShowSavingModal] = useState(false);
  const [savingMsg, setSavingMsg] = useState("Preparing to save...");

  const MEAL_OPTIONS = ["Breakfast", "Lunch", "Dinner"];

  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [officeCommission, setOfficeCommission] = useState("0");
  const [customCommission, setCustomCommission] = useState("");

  const commissionPercentage = officeCommission === "custom"
    ? parseFloat(customCommission) || 0
    : parseFloat(officeCommission) || 0;

  // Live price from the backend pricing engine (same calculation as Save).
  const pricing = useItineraryPricingGlobal(dayConfigs, clientInfo, commissionPercentage, clientId);
  const { commissionAmount, grandTotal, perPerson } = pricing;
  // ==========================================
  // 1. FETCH INITIAL CLIENT DATA
  // ==========================================
  const fetchClientInfo = async () => {
    setLoading(true);
    try {
      const resp = await api.get(`clients/small/clients/information/${clientId}/`);
      const data = resp.data;
      setClientInfo(data);
 
      const totalDays = Number(data.tour_length) || 1;
      const initialDays = [];

      for (let i = 1; i <= totalDays; i++) {
        let autoDest = null;
        if (i === 1 && data.start_destination_info) autoDest = data.start_destination_info;
        else if (i === totalDays && data.end_destination_info) autoDest = data.end_destination_info;

        const isLastRow = i === totalDays;

        initialDays.push({
          id: `initial_day_${i}_${Date.now()}`, // Unique ID for React keys
          nights: isLastRow ? 1 : 1,
          selectedMeals: ["Breakfast", "Lunch", "Dinner"],
          destination: autoDest,
          autoFilledDestination: autoDest,
          accommodation: null,
          activities: [],
          optionalMeals: [],
        });
      }
      setDayConfigs(initialDays);
    } catch (error) {
      const errorMsg = error?.response?.data;
      if (errorMsg?.detail){
        toast.error(errorMsg?.detail)
      }else if (errorMsg && typeof errorMsg === "object"){
        Object.entries(errorMsg).forEach(([value, msg])=>{
          const text = Array.isArray(msg) ? msg.join(", ") : String(msg);
         toast.error(`${value} : ${text}`)
        })
      }else{
         toast.error("Something went wrong try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchClientInfo();
    }
  }, [clientId]);

  const enrichedDays = useMemo(() => {
    let currentDay = 1;
    return dayConfigs.map((config, index) => {
      const dayIndex = currentDay;
      const endDaySpan = currentDay + config.nights - 1;
      currentDay += config.nights;
      
      return {
        ...config,
        dayIndex,
        endDaySpan,
        isMultiNight: config.nights > 1,
        isLastDay: index === dayConfigs.length - 1
      };
    });
  }, [dayConfigs]);

  const handleAddDay = () => {
    setDayConfigs(prev => {
      const lastDay = prev[prev.length - 1];
      return [
        ...prev,
        {
          id: `day_${Date.now()}`,
          nights: 1,
          selectedMeals: ["Breakfast", "Lunch", "Dinner"],
          destination: lastDay?.destination || null,
          autoFilledDestination: null,
          accommodation: null,
          activities: [],
          optionalMeals: [],
        }
      ];
    });
    toast.success("New day added to itinerary");
  };

  const handleRemoveDay = () => {
    if (dayConfigs.length <= 1) {
      toast.error("Itinerary must have at least 1 day.");
      return;
    }
    setDayConfigs(prev => prev.slice(0, -1));
    toast.info("Last day removed");
  };

  const handleNightsChange = (index, newNights) => {
    const nights = Number(newNights);

    setDayConfigs(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], nights };



      const totalNights = updated.reduce((sum, item) => sum + item.nights, 0);
      const currentTourLength = totalNights + 1; // Formula yako sahihi: Nights + 1 departure
      const isLastRow = index === updated.length - 1;

      // If it's the last day and nights > 1, ensure a departure day follows it.
       // 1. 
        if (isLastRow && nights > 1) {
        const lastConfig = updated[updated.length - 1];
        updated.push({
          id: `day_${Date.now()}`,
          nights: 1,
          selectedMeals: ["Breakfast", "Lunch", "Dinner"],
          destination: lastConfig.destination,
          autoFilledDestination: null,
          accommodation: null,
          activities: [],
          optionalMeals: [],
        });
        toast.success("Itinerary extended. New departure day added.");
        return updated;
      }

      // 2. 
      const MAX_TOUR_DAYS = Number(clientInfo?.tour_length) || 7;

      // SCENARIO 2: Mabadiliko ya KATIKATI yanayozidi urefu wa safari
      if (!isLastRow && currentTourLength > MAX_TOUR_DAYS) {
        let excessDays = currentTourLength - MAX_TOUR_DAYS;

        // FIX 3: Tunafuta kwa usalama row zilizopo mbele ya index ya sasa, lakini tunaacha ya mwisho kabisa (Departure)
        while (excessDays > 0 && updated.length > index + 2) {
          const removedRow = updated.splice(updated.length - 2, 1)[0];
          excessDays -= removedRow.nights;
        }
        toast.info("Adjusted subsequent days to fit tour length.");
      }



      // Cleanup: If nights reduced to 1, and the previous day was also a departure day, remove duplicate.
      if (isLastRow && nights === 1 && updated.length > 1) {
        const prevDay = updated[updated.length - 2];
        if (prevDay.accommodation === null && prevDay.nights === 1) {
          updated.pop();
          toast.info("Redundant departure day removed.");
        }
      }

      return updated;
    });
  };

  const handleAccommodationChange = (index, accPayload) => {
    setDayConfigs(prev => {
      const updated = [...prev];
      const currentConfig = updated[index];

      let nextDestination = currentConfig.destination;
      let nextAutoFilled = currentConfig.autoFilledDestination;

      if (!nextDestination && accPayload?.destination_id){
        nextAutoFilled = {
          id :accPayload.destination_id,
          name: accPayload.destination_name
        };
        nextDestination = nextAutoFilled;
      }

      if (accPayload === null){
        nextAutoFilled = currentConfig.autoFilledDestination;
      }
      

      updated[index] = {
        ...currentConfig,
        accommodation: accPayload,
        selectedRooms: accPayload?.selected_rooms || currentConfig.selectedRooms || [],
        autoFilledDestination: nextAutoFilled,
        destination: nextDestination,
      };

      // If accommodation is added to the LAST day, and it previously had none, add a new departure day.
      if (index === updated.length - 1 && accPayload !== null && currentConfig.accommodation === null) {
        updated.push({
          id: `day_${Date.now()}`,
          nights: 1,
          selectedMeals: ["Breakfast", "Lunch", "Dinner"],
          destination: updated[index].destination,
          autoFilledDestination: null,
          accommodation: null,
          activities: [],
          optionalMeals: [],
          selectedRooms: [],
        });
        toast.success("Accommodation added. A new departure day was automatically created.");
      }

      return updated;
    });
  };

  const handleDestinationSelect = (index, destinationObj) => {
    setDayConfigs(prev => {
      const updated = [...prev];
      updated[index] = { 
        ...updated[index], 
        destination: destinationObj, 
        autoFilledDestination: destinationObj 
      };
      return updated;
    });
  };

  const handleToggleMeal = (index, meal) => {
    setDayConfigs(prev => {
      const updated = [...prev];
      const exists = updated[index].selectedMeals.includes(meal);
      const updatedMeals = exists
        ? updated[index].selectedMeals.filter(m => m !== meal)
        : [...updated[index].selectedMeals, meal];
      
      updated[index] = { ...updated[index], selectedMeals: updatedMeals };
      return updated;
    });
  };

  const handleSaveActivities = (index, updatedActivities) => {
    setDayConfigs(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], activities: updatedActivities };
      return updated;
    });
  };

  const handleSaveMeals = (index, updatedMeals) => {
    setDayConfigs(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], optionalMeals: updatedMeals };
      return updated;
    });
  };

  // ==========================================
  // 3. BULK SAVE LOGIC
  // ==========================================
  const handleBulkSave = async (e) => {
    e.preventDefault();

    // Prices nobody has entered are never guessed: list them instead of saving.
    if (pricing.missing?.length) {
      toast.error(`Can't save yet: ${pricing.missing.length} price${pricing.missing.length > 1 ? "s are" : " is"} missing. See the red list above the price.`);
      return;
    }

    // Validation: Ensure all days except the final departure day have a destination
    const hasMissingDestination = enrichedDays.some((d, index) => !d.destination && index !== enrichedDays.length - 1);
    if (hasMissingDestination) {
      toast.error("Please provide a destination for all days (except the final departure day).");
      return;
    }

    setShowSavingModal(true);
    setSavingMsg("Saving Itinerary Data...");

    // Calculate true total tour days based on the last day's end span
    const totalTourDays = enrichedDays[enrichedDays.length - 1].endDaySpan;
     

    const finalCommissionPercentage = officeCommission === "custom" 
      ? parseFloat(customCommission) || 0 
      : parseFloat(officeCommission) || 0;


    const payload = {
      client_id: clientId,
      new_tour_length: totalTourDays,
      commission_percentage: finalCommissionPercentage, 

      days: enrichedDays.map(d => {

          const accId = d.accommodation 
          ? (typeof d.accommodation === 'object' ? (d.accommodation.accommodation_id || d.accommodation.id) : d.accommodation)
          : null;

      
        const destId = d.destination 
          ? (typeof d.destination === 'object' ? (d.destination.id || d.destination.destination_id) : d.destination)
          : null;

        const mappedActivities = (d.activities || []).map(act => ({
          activity_type_id: act.activity_type_id || act.activity_type?.id,
          main_location_id: act.main_location_id || act.main_location?.id,
          start_location_id: act.start_location_id || act.start_location?.id,
          via_location_id: act.via_location_id || act.via_location?.id,
          end_location_id: act.end_location_id || act.end_location?.id,
          moment: act.moment,
          transit_fee_included: act.transit_fee_included || false,
          transit_fee: act.transit_fee,
          transit_fee_per: act.transit_fee_per,
          is_optional: act.is_optional || false,
          optional_activity_price: act.optional_activity_price,
          price_per: act.price_per
        }));

       const mappedMeals = (d.optionalMeals || []).map(meal => ({
          meal_id: meal.meal_id || meal.meal?.id || meal.id,
          is_optional: meal.is_optional !== undefined ? meal.is_optional : true,
          price: meal.price || 0
        }));

        const mappedRooms = (d.selectedRooms || d.accommodation?.selected_rooms || []).map(room => ({
          room_type_id: room.room_type_id || room.id,
          quantity: room.quantity || room.number || 1
        }));

        return {
          day_number: d.dayIndex,
          nights: d.nights,
          destination_id: destId,
          accommodation_id: accId, 
          included_meals: d.selectedMeals || [],
          activities: mappedActivities, 
          optional_meals: mappedMeals,  
          selected_rooms: mappedRooms   
        };



      })
    };

    try {
      console.log("Payload to save:", JSON.stringify( payload, null, 2));

      const resp = await api.post("itinerary/bulk/create/daybyday/", payload);
      const versionId = resp.data.version_id
      
      setSavingMsg("Saved successfully!");
      setTimeout(() => {
        setShowSavingModal(false);
        toast.success("Itinerary saved successfully!");
        navigate(`/preview/safari/itinerary/${clientId}/${versionId}`);
      }, 1500);
    } catch (error) {
      setSavingMsg("Failed to save.");
      const errorMsg = error.response?.data;
      if (errorMsg?.detail){
        toast.error(errorMsg?.detail)
      }else if (errorMsg && typeof errorMsg === "object"){
        Object.entries(errorMsg).forEach(([val, msg])=>{
         const text = Array.isArray(msg) ? msg.join(", ") : String(msg);
         toast.error(`${val} : ${text}`);
        })
      }else {
      toast.error("Something went wrong, Please try again");
      }
      setTimeout(() => setShowSavingModal(false), 1500);
    }
  };

  // ==========================================
  // 4. HELPER FUNCTIONS
  // ==========================================
  const calculateDateForDay = (startDateStr, dayOffset) => {
    if (!startDateStr) return "";
    const date = new Date(startDateStr);
    date.setDate(date.getDate() + (dayOffset - 1));
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  
  




  // ==========================================
// 5. RENDER
// ==========================================
if (loading) { 
  return (
    <div className="min-h-screen bg-[#F6F1E7] flex flex-col items-center justify-center text-[#0F2A2E] gap-4">
      <div className="relative">
        <div className="absolute inset-0  bg-[#E8772E]/25 blur-md" />
        <div className="relative w-14 h-14  bg-[#FCE9DA] border border-[#E8772E]/25 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#B34F12]" />
        </div>
      </div>
      <p className="text-sm font-semibold tracking-wide">
        Loading itinerary workspace...
      </p>
    </div>
  );
}

if (!clientInfo) {
  return (
    <div className="min-h-screen bg-[#F6F1E7] p-8 text-center text-[#6B6459] flex items-center justify-center">
      <div className="bg-white border border-[#E4DCCB]  px-8 py-10 max-w-sm">
        <p className="text-sm font-semibold">Client information not found.</p>
      </div>
    </div>
  );
}

const totalTourDays = enrichedDays[enrichedDays.length - 1]?.endDaySpan || 0;

return (
  <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] p-4 md:p-8 font-sans selection:bg-[#E8772E] selection:text-[#0F2A2E] relative overflow-x-hidden">

    {/* Ambient brand washes */}
    <div className="pointer-events-none fixed top-0 -left-40 w-[600px] h-[600px] bg-[#E8772E]/8 blur-[150px] l" />
    <div className="pointer-events-none fixed bottom-0 -right-40 w-[600px] h-[600px] bg-[#F2B544]/12 blur-[150px] l" />

    <div className="max-w-6xl mx-auto space-y-8 relative z-10">

      {/* ==========================================
          TOP HEADER — Tour Summary Banner
          ========================================== */}
      <div className="bg-white border border-[#E4DCCB]  p-6 md:p-8 shadow-[0_8px_32px_-12px_rgba(15,42,46,0.12)] relative overflow-hidden">

        {/* Subtle corner wash */}
        <div className="pointer-events-none absolute -right-20 -top-20 w-56 h-56 bg-[#FDF4DD] l blur-3xl opacity-70" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">

          <div className="space-y-3">
            {/* Eyebrow row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-[#FDF4DD] border border-[#F2B544]/30 text-[#7A4E08] l text-[10px] font-bold tracking-widest uppercase">
                {clientInfo.tour_type || "Safari Tour"}
              </span>
              <span className="text-[#E4DCCB]">•</span>
              <span className="text-[#6B6459] text-xs flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#E8772E]" />
                {totalTourDays} Days Total
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F2A2E] tracking-tight leading-tight">
              {clientInfo.tour_title}
            </h1>
          </div>

          {/* Start date card */}
          <div className="flex items-center gap-4 bg-[#F6F1E7] border border-[#E4DCCB] p-4  shrink-0">
            <div className="w-11 h-11 bg-[#FCE9DA] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-[#B34F12]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459]">
                Start date
              </p>
              <p className="text-sm font-bold text-[#0F2A2E] mt-0.5">
                {calculateDateForDay(clientInfo.tour_start_date, 1)}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ==========================================
          DAY-BY-DAY SECTION
          ========================================== */}
      <div className="space-y-6">

        {/* Section header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 l bg-[#E8772E]" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#6B6459]">
              Day-by-Day Itinerary
            </h2>
          </div>
          <span className="text-xs font-medium text-[#6B6459]">
            {enrichedDays.length} itinerary blocks
          </span>
        </div>

        {enrichedDays.map((dayConfig, index) => {
          const { dayIndex, endDaySpan, isMultiNight, isLastDay } = dayConfig;
          const nightCount = dayConfig.nights;

          const dayTitle = isMultiNight
            ? `Day ${dayIndex} – ${endDaySpan}`
            : `Day ${dayIndex}`;
          const dateDisplay = isMultiNight
            ? `${calculateDateForDay(clientInfo.tour_start_date, dayIndex)} – ${calculateDateForDay(clientInfo.tour_start_date, endDaySpan)}`
            : calculateDateForDay(clientInfo.tour_start_date, dayIndex);

          return (
            <div
              key={dayConfig.id}
              className="bg-white border border-[#E4DCCB] hover:border-[#E8772E]/30  p-5 md:p-7 space-y-6 transition-all duration-300 shadow-[0_1px_2px_rgba(15,42,46,0.04)] hover:shadow-[0_8px_24px_-12px_rgba(232,119,46,0.2)]"
            >

              {/* ── Day Card Header ── */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E4DCCB] pb-5">

                <div className="flex items-center gap-3 min-w-0">
                  {/* Day number badge */}
                  <div className="w-12 h-12 rounded-full  bg-[#E8772E] text-[#0F2A2E] flex items-center justify-center font-black text-lg shadow-md shadow-[#E8772E]/25 shrink-0">
                    {dayIndex}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-[#0F2A2E]">
                        {dayTitle}
                      </h3>

                      {isMultiNight && (
                        <span className="px-2.5 py-0.5 bg-[#E2EEF4] text-[#1D4E68] text-[10px] font-bold uppercase tracking-widest l border border-[#1D4E68]/20">
                          {nightCount} Nights Stay
                        </span>
                      )}

                      {isLastDay && !dayConfig.accommodation && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 l bg-[#FDF4DD] border border-[#F2B544]/40 text-[10px] font-bold uppercase tracking-widest text-[#7A4E08]">
                          <AlertTriangle className="w-3 h-3" />
                          Departure · No accommodation
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#6B6459] flex items-center gap-1.5 mt-1 font-medium">
                      <Calendar className="w-3 h-3 text-[#E8772E]" />
                      {dateDisplay}
                    </p>
                  </div>
                </div>

                {/* Controls: Nights & Meals */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">

                  {/* Nights selector */}
                  <div className="flex items-center gap-2 bg-[#F6F1E7] px-3 py-2 border border-[#E4DCCB]">
                    <Moon className="w-3.5 h-3.5 text-[#E8772E]" />
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#6B6459]">
                      Nights
                    </label>
                    <select
                      value={nightCount}
                      onChange={(e) => handleNightsChange(index, e.target.value)}
                      className="bg-transparent text-xs font-bold text-[#0F2A2E] focus:outline-none cursor-pointer"
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Night" : "Nights"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Meal toggles */}
                  <div className="flex items-center gap-1 bg-[#F6F1E7] p-1 border border-[#E4DCCB]">
                    {MEAL_OPTIONS.map((meal) => {
                      const isSelected = dayConfig.selectedMeals.includes(meal);
                      return (
                        <button
                          key={meal}
                          type="button"
                          onClick={() => handleToggleMeal(index, meal)}
                          className={`px-2.5 py-1.5 text-[11px] font-bold transition-all duration-200 cursor-pointer flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] ${
                            isSelected
                              ? "bg-[#E8772E] text-[#0F2A2E] shadow-sm shadow-[#E8772E]/20"
                              : "text-[#6B6459] hover:text-[#0F2A2E] hover:bg-white"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3" />}
                          {meal.substring(0, 1)}
                          <span className="hidden lg:inline">{meal.substring(1)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── Accommodation & Destination ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6B6459] mb-2.5">
                    <div className="w-6 h-6 bg-[#FCE9DA] flex items-center justify-center">
                      <Building2 className="w-3.5 h-3.5 text-[#B34F12]" />
                    </div>
                    Accommodation
                  </div>

                  <AccommodationComponentGlobal
                    clientId={clientId}
                    dayIndex={dayIndex}
                    onChangeSelectedData={(payload) => handleAccommodationChange(index, payload)}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6B6459] mb-2.5">
                    <div className="w-6 h-6 bg-[#FCE9DA] flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5 text-[#B34F12]" />
                    </div>
                    Destination
                  </div>

                  <DestinationComponentGlobal
                    clientId={clientId}
                    initialValue={dayConfig.destination}
                    autoFilledDestination={dayConfig.autoFilledDestination}
                    onSelect={(destObj) => handleDestinationSelect(index, destObj)}
                  />
                </div>
              </div>

              {/* ── Activities & Optional Meals ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">

                {/* Activities summary card */}
                <div className="bg-[#F6F1E7]/60 border border-[#E4DCCB]  p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E4DCCB] pb-3">
                    <h4 className="text-[11px] font-bold text-[#0F2A2E] flex items-center gap-2 uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5 text-[#E8772E]" />
                      Activities ({dayConfig.activities.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveActivityModalDay(index)}
                      className="px-2.5 py-1.5 bg-[#FCE9DA] hover:bg-[#F8DAC2] text-[#B34F12] border border-[#E8772E]/25 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                    >
                      <Plus className="w-3 h-3" />
                      {dayConfig.activities.length > 0 ? "Edit" : "Add"}
                    </button>
                  </div>

                  {dayConfig.activities.length === 0 ? (
                    <p className="text-xs text-[#6B6459] italic py-2 text-center">
                      No activities added for {dayTitle}.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 py-1">
                      {dayConfig.activities.slice(0,2).map((act, idx) => (
                        <span
                          key={ act.temp_id || idx}
                          className="px-2.5 py-1 bg-white border border-[#E4DCCB] text-[11px] font-semibold text-[#0F2A2E]"
                        >
                          {act.activity_type_title || `Activity #${idx + 1}`}
                        </span>
                      ))} 
                      {dayConfig.activities.length > 2 && (
                          <span className="px-2.5 py-1 bg-[#FCE9DA] border border-[#E8772E]/25 text-[11px] font-bold text-[#B34F12]">
                          +{dayConfig.activities.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Optional meals summary card */}
                <div className="bg-[#F6F1E7]/60 border border-[#E4DCCB]  p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E4DCCB] pb-3">
                    <h4 className="text-[11px] font-bold text-[#0F2A2E] flex items-center gap-2 uppercase tracking-widest">
                      <Utensils className="w-3.5 h-3.5 text-[#F2B544]" />
                      Optional Meals ({dayConfig.optionalMeals.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveMealModalDay(index)}
                      className="px-2.5 py-1.5 bg-[#FDF4DD] hover:bg-[#F9EBC8] text-[#7A4E08] border border-[#F2B544]/40 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                    >
                      <Plus className="w-3 h-3" />
                      {dayConfig.optionalMeals.length > 0 ? "Edit" : "Add"}
                    </button>
                  </div>

                  {dayConfig.optionalMeals.length === 0 ? (
                    <p className="text-xs text-[#6B6459] italic py-2 text-center">
                      No optional meals specified.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 py-1">
                      {dayConfig.optionalMeals.slice(0,2).map((m, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white border border-[#E4DCCB] text-[11px] font-semibold text-[#0F2A2E]"
                        >
                          {m.meal_name || `Meal #${idx + 1}`}
                        </span>
                      ))}
                      {dayConfig.optionalMeals.length > 2 && (
                         <span className="px-2.5 py-1 bg-[#FCE9DA] border border-[#E8772E]/25 text-[11px] font-bold text-[#B34F12]">
                          +{dayConfig.optionalMeals.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Modals triggered dynamically per day ── */}
              {activeActivityModalDay === index && (
                <ActivitiesComponentGlobal
                  isOpen={true}
                  onClose={() => setActiveActivityModalDay(null)}
                  dayIndex={dayIndex}
                  dayId={dayConfig.id}
                  initialActivities={dayConfig.activities}
                  onSaveActivities={(updated) => handleSaveActivities(index, updated)}
                />
              )}

              {activeMealModalDay === index && (
                <OptionalMealComponentGlobal
                  isOpen={true}
                  onClose={() => setActiveMealModalDay(null)}
                  dayIndex={dayIndex}
                  dayId={dayConfig.id}
                  initialMeals={dayConfig.optionalMeals}
                  onSaveMeals={(updated) => handleSaveMeals(index, updated)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ==========================================
          PRICING SUMMARY BANNER
          ========================================== */}
      <div className="relative overflow-hidden bg-[#0F2A2E] border border-[#E4DCCB]/15  p-6 md:p-7 shadow-[0_20px_50px_-20px_rgba(15,42,46,0.4)]">

        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-24 -left-20 w-56 h-56 bg-[#E8772E]/15 l blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 w-56 h-56 bg-[#F2B544]/10 l blur-3xl" />

        <MissingPricesNotice missing={pricing.missing} className="mb-5" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E4DCCB]/15 pb-4 mb-5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 l bg-[#F2B544] animate-pulse" />
            <h3 className="text-[#F6F1E7] font-bold text-xs uppercase tracking-widest">
              Pricing Summary
            </h3>
          </div>

          {commissionPercentage > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 l text-[10px] font-bold uppercase tracking-widest bg-[#E8772E]/15 text-[#F2B544] border border-[#E8772E]/30">
              <span className="w-1.5 h-1.5 l bg-[#F2B544]" />
              {commissionPercentage}% Commission Included
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 l text-[10px] font-bold uppercase tracking-widest bg-[#F2B544]/10 text-[#F2B544] border border-[#F2B544]/30">
              <span className="w-1.5 h-1.5 l bg-[#F2B544]" />
              Commission Not Included
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 relative z-10">

          {/* Totals */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 w-full lg:w-auto">

            {/* Grand total */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F6F1E7]/50">
                Grand Total
              </span>
              <div className="mt-1">
                <span className="text-3xl md:text-4xl font-black text-[#F2B544] tracking-tight">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-[#E4DCCB]/25 to-transparent" />

            {/* Per person */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F6F1E7]/50">
                Per Person
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-extrabold text-[#F6F1E7] tracking-tight">
                  ${perPerson.toFixed(2)}
                </span>
                <span className="text-[11px] font-medium text-[#F6F1E7]/50">
                  ({pricing.totalTravellers} pax)
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="w-full lg:w-auto">
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="group w-full sm:w-auto px-6 py-3.5 bg-[#E8772E] text-[#0F2A2E] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 cursor-pointer transition-all
                         hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/25
                         hover:shadow-xl hover:shadow-[#E8772E]/40 hover:-translate-y-0.5
                         active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
            >
              <Calculator className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
              View Breakdown & Add Commission
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================
          BOTTOM ACTION BAR
          ========================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-[#E4DCCB]">

        {/* Left: Remove last day */}
        <button
          onClick={handleRemoveDay}
          disabled={dayConfigs.length <= 1}
          className="w-full sm:w-auto px-4 py-3 bg-white border border-[#E4DCCB] text-[#0F2A2E] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer
                     hover:bg-[#FBE5E2] hover:border-[#8E2A1F]/30 hover:text-[#8E2A1F]
                     disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:border-[#E9E3D6] disabled:cursor-not-allowed disabled:hover:bg-[#E9E3D6]
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
        >
          <Trash2 className="w-4 h-4" /> Remove last day
        </button>

        {/* Right: Add day + Save */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">

          <button
            onClick={handleAddDay}
            className="w-full sm:w-auto px-4 py-3 bg-white border border-[#E4DCCB] text-[#0F2A2E] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer
                       hover:bg-[#FCE9DA] hover:border-[#E8772E]/40 hover:text-[#B34F12]
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
          >
            <Plus className="w-4 h-4" /> Add Day {totalTourDays + 1}
          </button>

          <button
            onClick={handleBulkSave}
            className="w-full sm:w-auto px-6 py-3 bg-[#E8772E] text-[#0F2A2E] text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer
                       hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/25
                       hover:shadow-xl hover:shadow-[#E8772E]/40 hover:-translate-y-0.5
                       active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
          >
            <CheckCircle2 className="w-4 h-4" /> Save & Generate Itinerary
          </button>
        </div>
      </div>

      {/* ==========================================
          SAVING MODAL OVERLAY
          ========================================== */}
      {showSavingModal && (
        <div className="fixed inset-0 z-50 bg-[#0F2A2E]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#E4DCCB]  p-6 max-w-sm w-full shadow-[0_20px_60px_-15px_rgba(15,42,46,0.3)] space-y-4 animate-in zoom-in-95 duration-200">

            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className={`absolute inset-0 blur-md ${savingMsg.includes("Failed") ? "bg-[#8E2A1F]/20" : "bg-[#E8772E]/20"}`} />
                <div className={`relative w-12 h-12 flex items-center justify-center border ${
                  savingMsg.includes("Failed")
                    ? "bg-[#FBE5E2] border-[#8E2A1F]/25 text-[#8E2A1F]"
                    : "bg-[#FCE9DA] border-[#E8772E]/25 text-[#B34F12]"
                }`}>
                  {savingMsg.includes("Failed") ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  )}
                </div>
              </div>
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-[#0F2A2E]">
                {savingMsg.includes("Failed") ? "Save failed" : "Saving itinerary"}
              </h3>
              <p className="text-xs text-[#6B6459] leading-relaxed">
                {savingMsg.includes("Failed")
                  ? "Please check your connection and try again."
                  : "Please wait a moment while we process your safari itinerary."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SMART PRICING BREAKDOWN MODAL
          ========================================== */}
      {isPricingModalOpen && (
        <SmartPricingBreakdownGlobal
          dayConfigs={dayConfigs}
          clientInfo={clientInfo}
          pricing={pricing}
          officeCommission={officeCommission}
          setOfficeCommission={setOfficeCommission}
          customCommission={customCommission}
          setCustomCommission={setCustomCommission}
          onClose={() => setIsPricingModalOpen(false)}
          onSave={handleBulkSave}
        />
      )}

    </div>
  </div>
);
}