import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DestinationComponentOnly from "./Destination";
import AccommodationComponentOnly from "./Accommodation";
import ActivitiesPopUpComponent from "./Activities";
import OptionalMealComponentPopUp from "./OptionalMeal";
import api from "../../Apis/api";
import { toast } from 'sonner';
import SmartPricingBreakdown from "./SmallPricingBreakDown";
import useItineraryPricing from "./useItineraryPricing";

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

export default function ItineraryMainPage() {
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

    const pricing = useItineraryPricing(dayConfigs, clientInfo);
      const commissionPercentage = officeCommission === "custom" 
    ? parseFloat(customCommission) || 0 
    : parseFloat(officeCommission) || 0;

  const commissionAmount = (pricing.subtotal * commissionPercentage) / 100;
  const grandTotal = pricing.subtotal + commissionAmount;
  const perPerson = pricing.totalTravellers > 0 ? grandTotal / pricing.totalTravellers : 0;
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
        if (i === 1 && data.start_destination) autoDest = data.start_destination;
        else if (i === totalDays && data.end_destination) autoDest = data.end_destination;

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
      const errorMsg = error?.response?.data?.detail || "Failed to fetch Client Data";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchClientInfo();
    }
  }, [clientId]);

  // ==========================================
  // 2. DYNAMIC DAY & NIGHTS MANAGEMENT (THE CORE FIX)
  // ==========================================
  
  // Dynamically calculate dayIndex based on cumulative nights. 
  // This prevents missing rows or gaps when nights are changed!
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
      
      const autoDest = accPayload?.destination_id ? {
        id: accPayload.destination_id,
        name: accPayload.destination_name
      } : currentConfig.autoFilledDestination;

      updated[index] = {
        ...currentConfig,
        accommodation: accPayload,
        autoFilledDestination: autoDest,
        destination: autoDest || currentConfig.destination
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
      const errorMsg = error.response?.data?.message || error.response?.data?.non_field_errors?.[0] || "Failed to save itinerary. Check console for details.";
      toast.error(errorMsg);
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Loading itinerary workspace...</p>
      </div>
    );
  }

  if (!clientInfo) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-center text-slate-400">
        Client information not found.
      </div>
    );
  }

  const totalTourDays = enrichedDays[enrichedDays.length - 1]?.endDaySpan || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
         
        {/* Top Header & Tour Summary Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-full text-xs font-semibold tracking-wide uppercase">
                  {clientInfo.tour_type || "Safari Tour"}
                </span>
                <span className="text-slate-500 text-sm">•</span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {totalTourDays} Days Total
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {clientInfo.tour_title}
              </h1>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Start Date</p>
                <p className="text-sm font-bold text-white">
                  {calculateDateForDay(clientInfo.tour_start_date, 1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Day-by-Day Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Day-by-Day Itinerary</h2>
            <span className="text-xs text-slate-400">
              Showing {enrichedDays.length} itinerary blocks
            </span>
          </div>

          {enrichedDays.map((dayConfig, index) => {
            const { dayIndex, endDaySpan, isMultiNight, isLastDay } = dayConfig;
            const nightCount = dayConfig.nights;

            const dayTitle = isMultiNight ? `Day ${dayIndex} - ${endDaySpan}` : `Day ${dayIndex}`;
            const dateDisplay = isMultiNight
              ? `${calculateDateForDay(clientInfo.tour_start_date, dayIndex)} - ${calculateDateForDay(clientInfo.tour_start_date, endDaySpan)}`
              : calculateDateForDay(clientInfo.tour_start_date, dayIndex);

            return (
              <div
                key={dayConfig.id}
                className="bg-slate-900/70 border border-slate-800/90 hover:border-slate-700/80 rounded-3xl p-5 md:p-7 space-y-6 transition-all duration-300 shadow-lg relative"
              >
                {/* Day Card Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-base">
                      {dayIndex}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {dayTitle}
                        {isMultiNight && (
                          <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full border border-indigo-500/40">
                            {nightCount} Nights Stay
                          </span>
                        )}
                        {isLastDay && !dayConfig.accommodation && (
                        <div className="py-2 px-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span> <span className="py-[2px] px-[6px] rounded-3xl bg-amber-400/15 border border-dashed border-amber-400/30" > Departure Day</span> No accommodation</span>
                        </div>
                        )}

                        
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3 text-indigo-400" />
                        {dateDisplay}
                      </p>
                    </div>
                  </div>

                  {/* Controls: Nights & Meals */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <label className="text-xs text-slate-400 font-medium">Nights:</label>
                      <select
                        value={nightCount}
                        onChange={(e) => handleNightsChange(index, e.target.value)}
                        className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n} className="bg-slate-900 text-white">
                            {n} {n === 1 ? "Night" : "Nights"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                      {MEAL_OPTIONS.map((meal) => {
                        const isSelected = dayConfig.selectedMeals.includes(meal);
                        return (
                          <button
                            key={meal}
                            type="button"
                            onClick={() => handleToggleMeal(index, meal)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                              isSelected
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
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

                {/* Accommodation & Destination Block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                      Accommodation Setup
                    </div>
                    
                    {/* {isLastDay && !dayConfig.accommodation && (
                      <div className="mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Departure Day: No accommodation by default. Selecting a lodge here will automatically extend your itinerary by 1 day.</span>
                      </div>
                    )} */}

                    <AccommodationComponentOnly
                      clientId={clientId}
                      dayIndex={dayIndex}
                      onChangeSelectedData={(payload) => handleAccommodationChange(index, payload)}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      Destination Setup
                    </div>
                    <DestinationComponentOnly
                      clientId={clientId}
                      autoFilledDestination={dayConfig.autoFilledDestination}
                      onSelect={(destObj) => handleDestinationSelect(index, destObj)}
                    />
                  </div>
                </div>

                {/* Activities and Optional Meals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Activities Box */}
                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Day Activities ({dayConfig.activities.length})
                      </h4>
                      <button
                        type="button"
                        onClick={() => setActiveActivityModalDay(index)}
                        className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {dayConfig.activities.length > 0 ? "Edit / Add" : "Add Activities"}
                      </button>
                    </div>

                    <div>
                      {dayConfig.activities.length === 0 ? (
                        <p className="text-xs text-slate-500 italic py-2 text-center">
                          No activities added for {dayTitle}.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2 py-1">
                          {dayConfig.activities.map((act, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-slate-900 border border-slate-700/60 rounded-lg text-xs text-slate-300"
                            >
                              {act.activity_type_title || `Activity #${idx + 1}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Optional Meals Box */}
                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-indigo-400" />
                        Optional Meals ({dayConfig.optionalMeals.length})
                      </h4>
                      <button
                        type="button"
                        onClick={() => setActiveMealModalDay(index)}
                        className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {dayConfig.optionalMeals.length > 0 ? "Edit Meals" : "Add Optionals"}
                      </button>
                    </div>

                    <div>
                      {dayConfig.optionalMeals.length === 0 ? (
                        <p className="text-xs text-slate-500 italic py-2 text-center">
                          No optional meals specified.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2 py-1">
                          {dayConfig.optionalMeals.map((m, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-slate-900 border border-slate-700/60 rounded-lg text-xs text-slate-300"
                            >
                              {m.meal_name || `Meal #${idx + 1}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modals triggered dynamically per day */}
                {activeActivityModalDay === index && (
                  <ActivitiesPopUpComponent
                    isOpen={true}
                    onClose={() => setActiveActivityModalDay(null)}
                    dayIndex={dayIndex}
                    onSaveActivities={(updated) => handleSaveActivities(index, updated)}
                  />
                )}

                {activeMealModalDay === index && (
                  <OptionalMealComponentPopUp
                    isOpen={true}
                    onClose={() => setActiveMealModalDay(null)}
                    dayIndex={dayIndex}
                    onSaveMeals={(updated) => handleSaveMeals(index, updated)}
                  />
                )}
              </div>
            );
          })}
        </div>




<div className="relative overflow-hidden bg-slate-900/95 backdrop-blur-2xl border border-slate-800/80 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
  {/* Ambient Background Glow Effect */}
  <div className="absolute -top-24 -left-20 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute -bottom-24 -right-20 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

  {/* Header Title Section */}
  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
    <div className="flex items-center gap-2">
      <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
      <h3 className="text-slate-300 font-bold text-xs uppercase tracking-widest">
        Pricing Summary
      </h3>
    </div>
    
    {/* Dynamic Status Pill */}
    {commissionPercentage > 0 ? (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
        {commissionPercentage}% Commission Included
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        Commission Not Included
      </span>
    )}
  </div>

  {/* Content Section */}
  <div className="flex flex-col lg:flex-row items-center justify-between gap-5 relative z-10">
    
    {/* Left: Totals Showcase */}
    <div className="flex flex-row items-center justify-between sm:justify-start gap-6 sm:gap-8 w-full lg:w-auto">
      
      {/* Grand Total */}
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
          Grand Total
        </span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 tracking-tight">
            ${grandTotal.toFixed(2)}
          </span>
        </div>
      </div>
      
      {/* Divider */}
      <div className="w-px h-10 bg-gradient-to-b from-transparent via-slate-700 to-transparent" />

      {/* Per Person */}
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
          Per Person
        </span>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-xl font-extrabold text-white tracking-tight">
            ${perPerson.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            ({pricing.totalTravellers} pax)
          </span>
        </div>
      </div>
    </div>

    {/* Right: Action Button */}
    <div className="w-full lg:w-auto">
      <button
        onClick={() => setIsPricingModalOpen(true)}
        className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-slate-800 to-slate-800/90 hover:from-indigo-950/50 hover:to-slate-800 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 hover:border-indigo-400/60 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-black/40 hover:shadow-indigo-500/10 transition-all duration-200 group active:scale-[0.98] cursor-pointer"
      >
        <Calculator className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform duration-200" />
        View Breakdown & Add Commission
      </button>
    </div>

  </div>
</div>

             

   
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <button
            onClick={handleRemoveDay}
            disabled={dayConfigs.length <= 1}
            className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
          >
            <Trash2 className="w-4 h-4" /> Remove Last Day
          </button>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={handleAddDay}
              className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
            >
              <Plus className="w-4 h-4" /> Add Day {totalTourDays + 1}
            </button>
            
            <button
              onClick={handleBulkSave}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              <CheckCircle2 className="w-4 h-4" /> Save & Generate Itinerary
            </button>
          </div>
        </div>

        {/* Saving Modal Overlay */}
        {showSavingModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
              <div className="w-10 h-10 bg-indigo-950/50 border border-indigo-800/50 rounded-xl flex items-center justify-center text-indigo-400">
                {savingMsg.includes("Failed") ? <AlertTriangle className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {savingMsg.includes("Failed") ? "Save Failed" : "Saving Itinerary"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {savingMsg.includes("Failed") 
                    ? "Please check your connection and try again." 
                    : "Please wait a little bit while we process your safari itinerary."}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>



         {isPricingModalOpen && (
              <SmartPricingBreakdown 
                dayConfigs={dayConfigs} 
                clientInfo={clientInfo}
                officeCommission={officeCommission}
                setOfficeCommission={setOfficeCommission}
                customCommission={customCommission}
                setCustomCommission={setCustomCommission}
                onClose={() => setIsPricingModalOpen(false)}
                onSave={handleBulkSave}
              />
            )}



    </div>
  );
}