import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DestinationComponentGlobal from "../../Components/Destination";
import AccommodationComponentGlobal from "../../Components/Accommodation";
import OptionalMealComponentGlobal from "../../Components/Meals";
import ActivitiesComponentGlobal from "../../Components/Activities";

import { toast } from "react-toastify";
import api from "../../../Apis/api";
import useItineraryPricingGlobal from "../Hooks/useItineraryPrice";
import SmartPricingBreakdownGlobal from "../BreakDown/PriceBreakDown";

import {
  Plus, Utensils, Sparkles, Calendar, MapPin, Building2,
  Clock, CheckCircle2, Loader2, Moon, Trash2, AlertTriangle,
  Calculator, ArrowLeft
} from "lucide-react";

const MEAL_OPTIONS = ["Breakfast", "Lunch", "Dinner"];

// --- HELPER FUNCTIONS (Zimebaki salama kama zilivyokuwa) ---
const normalizeMeals = (meals) => {
  if (Array.isArray(meals)) return meals.filter(Boolean);
  if (typeof meals === "string" && meals.trim()) {
    return meals.split(",").map((m) => m.trim()).filter(Boolean);
  }
  return [...MEAL_OPTIONS];
};

const normalizeDestination = (day) => {
  if (!day.destination && !day.destination_name) return null;
  if (typeof day.destination === "object" && day.destination !== null) return day.destination;
  return { id: day.destination, name: day.destination_name || "" };
};

const normalizeAccommodation = (day) => {
  if (!day.accommodation && !day.accommodation_name) return null;
  if (typeof day.accommodation === "object" && day.accommodation !== null) {
    return { ...day.accommodation, accommodation_id: day.accommodation.accommodation_id ?? day.accommodation.id };
  }
  return { id: day.accommodation, accommodation_id: day.accommodation, name: day.accommodation_name || "" };
};

const normalizeRooms = (rooms) =>
  (rooms || []).map((room) => ({
    ...room,
    room_type_id: room.room_type_id ?? (typeof room.room_type === "object" ? room.room_type?.id : room.room_type) ?? null,
    room_type_name: room.room_type_name ?? (typeof room.room_type === "object" ? room.room_type?.name : "") ?? "",
    number: room.quantity ?? room.number ?? 1,
  }));

const normalizeDay = (day, idx) => {
  const destination = normalizeDestination(day);
  return {
    ...day,
    id: day.id || `day_${idx}_${Date.now()}`,
    nights: Number(day.nights ?? day.nights_number ?? 1),
    selectedMeals: normalizeMeals(day.included_meals ?? day.selectedMeals),
    destination,
    autoFilledDestination: day.autoFilledDestination ?? destination,
    accommodation: normalizeAccommodation(day),
    activities: day.activities || [],
    optionalMeals: day.optional_meals || day.optionalMeals || [],
    selectedRooms: normalizeRooms(day.selected_rooms || day.selectedRooms),
  };
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ItinerariesEditingGlobal({ dataToEdit, clientId, versionId, onBack, onUpdateDays }) {
  const navigate = useNavigate();
  const clientInfo = dataToEdit?.client_info || {};
   
  const dataSignature = useMemo(
    () => (dataToEdit?.days ? `${dataToEdit.days.length}_${dataToEdit.days[0]?.id ?? "x"}` : null),
    [dataToEdit]
  );

  const [dayConfigs, setDayConfigs] = useState(() =>
    Array.isArray(dataToEdit?.days) ? dataToEdit.days.map(normalizeDay) : []
  );

  const lastSignature = useRef(dataSignature);
  useEffect(() => {
    if (dataSignature && dataSignature !== lastSignature.current) {
      lastSignature.current = dataSignature;
      setDayConfigs(dataToEdit.days.map(normalizeDay));
    }
  }, [dataSignature, dataToEdit]);

  // Modal States
  const [activeActivityModalDay, setActiveActivityModalDay] = useState(null);
  const [activeMealModalDay, setActiveMealModalDay] = useState(null);
  const [showSavingModal, setShowSavingModal] = useState(false);
  const [savingMsg, setSavingMsg] = useState("Preparing to save...");
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  
  const [officeCommission, setOfficeCommission] = useState(() =>
    dataToEdit?.pricing?.commission_percentage != null ? String(dataToEdit.pricing.commission_percentage) : "0"
  );
  const [customCommission, setCustomCommission] = useState("");

  const pricing = useItineraryPricingGlobal(dayConfigs, clientInfo);
  const commissionPercentage = officeCommission === "custom" ? parseFloat(customCommission) || 0 : parseFloat(officeCommission) || 0;
  const commissionAmount = (pricing.subtotal * commissionPercentage) / 100;
  const grandTotal = pricing.subtotal + commissionAmount;
  const perPerson = pricing.totalTravellers > 0 ? grandTotal / pricing.totalTravellers : 0;

  useEffect(() => {
    if (typeof onUpdateDays === "function") onUpdateDays(dayConfigs);
  }, [dayConfigs, onUpdateDays]);



  // --- DAY NUMBERING LOGIC ---
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
        isLastDay: index === dayConfigs.length - 1,
      };
    });
  }, [dayConfigs]);

  const makeEmptyDay = (inheritFrom = null) => ({
    id: `day_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    nights: 1,
    selectedMeals: [...MEAL_OPTIONS],
    destination: inheritFrom?.destination || null,
    autoFilledDestination: null,
    accommodation: null,
    activities: [],
    optionalMeals: [],
    selectedRooms: [],
  });

  const handleAddDay = () => {
    setDayConfigs((prev) => [...prev, makeEmptyDay(prev[prev.length - 1])]);
    toast.success("New day added to itinerary");
  };

  const handleRemoveDay = () => {
    if (dayConfigs.length <= 1) {
      toast.error("Itinerary must have at least 1 day.");
      return;
    }
    setDayConfigs((prev) => prev.slice(0, -1));
    toast.info("Last day removed");
  };

  const handleNightsChange = (index, newNights) => {
    const nights = Number(newNights);
    setDayConfigs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], nights };
      
      const totalNights = updated.reduce((sum, item) => sum + item.nights, 0);
      const currentTourLength = totalNights + 1;
      const isLastRow = index === updated.length - 1;
      const MAX_TOUR_DAYS = Number(clientInfo?.tour_length) || 7;

      if (isLastRow && nights > 1) {
        updated.push(makeEmptyDay(updated[index]));
        toast.success("Itinerary extended. New departure day added.");
        return updated;
      }

      if (!isLastRow && currentTourLength > MAX_TOUR_DAYS) {
        toast.warning(`Warning: Total days (${currentTourLength}) exceed tour length (${MAX_TOUR_DAYS}).`);
      }

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
    setDayConfigs((prev) => {
      const updated = [...prev];
      const currentConfig = updated[index];

       let nextDestination = currentConfig.destination;     // preserve
       let nextAutoFilled = currentConfig.autoFilledDestination;

    if (!nextDestination && accPayload?.destination_id) {
      nextAutoFilled = { id: accPayload.destination_id, name: accPayload.destination_name };
      nextDestination = nextAutoFilled;
    }

    if (accPayload === null) {
      nextAutoFilled = currentConfig.autoFilledDestination;
    }



      updated[index] = {
        ...currentConfig,
        accommodation: accPayload,
        selectedRooms: accPayload?.selected_rooms || currentConfig.selectedRooms,
        autoFilledDestination: nextAutoFilled,
        destination: nextDestination,
      };

      if (index === updated.length - 1 && accPayload !== null && currentConfig.accommodation === null) {
        updated.push(makeEmptyDay(updated[index]));
        toast.success("Accommodation added. A new departure day was automatically created.");
      }
      return updated;
    });
  };

  const handleDestinationSelect = (index, destinationObj) => {
    setDayConfigs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], destination: destinationObj, autoFilledDestination: destinationObj };
      return updated;
    });
  };

  const handleToggleMeal = (index, meal) => {
    setDayConfigs((prev) => {
      const updated = [...prev];
      const exists = updated[index].selectedMeals.includes(meal);
      updated[index] = {
        ...updated[index],
        selectedMeals: exists ? updated[index].selectedMeals.filter((m) => m !== meal) : [...updated[index].selectedMeals, meal],
      };
      return updated;
    });
  };

  const handleSaveActivities = (index, updatedActivities) => {
    setDayConfigs((prev) => prev.map((d, i) => (i === index ? { ...d, activities: updatedActivities } : d)));
  };

  const handleSaveMeals = (index, updatedMeals) => {
    setDayConfigs((prev) => prev.map((d, i) => (i === index ? { ...d, optionalMeals: updatedMeals } : d)));
  };

  // ==========================================================
  // BULK SAVE PAYLOAD
  // ==========================================================
  const handleEditBulkSave = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    const totalTourDays = enrichedDays[enrichedDays.length - 1]?.endDaySpan || dayConfigs.reduce((sum, item) => sum + item.nights, 0) + 1;

    const payload = {
      client_info: {
        tour_title: clientInfo.tour_title,
        tour_type: clientInfo.tour_type,
        tour_length: totalTourDays,
        tour_start_date: clientInfo.tour_start_date,
        country_visited: clientInfo.country_visited || "",
        start_destination:  clientInfo.start_destination?.id ,
        end_destination:  clientInfo.end_destination?.id,
        request_info: clientInfo.request_info || "",
        travellers: clientInfo.travellers || [],
        rooms: clientInfo.rooms || [],
      },
      days: enrichedDays.map((d) => ({
        day_number: d.dayIndex,
        nights: d.nights,
        destination_id: d.destination ? (typeof d.destination === "object" ? d.destination.id : d.destination) : null,
        accommodation_id: d.accommodation ? (typeof d.accommodation === "object" ? (d.accommodation.accommodation_id || d.accommodation.id) : d.accommodation) : null,
        included_meals: d.selectedMeals || [],
        activities: (d.activities || []).map((act) => ({
          activity_type_id: act.activity_type_id ?? (typeof act.activity_type === "object" ? act.activity_type?.id : act.activity_type),
          main_location_id: act.main_location_id ?? (typeof act.main_location === "object" ? act.main_location?.id : act.main_location) ?? null,
          start_location_id: act.start_location_id ?? (typeof act.start_location === "object" ? act.start_location?.id : act.start_location) ?? null,
          via_location_id: act.via_location_id ?? (typeof act.via_location === "object" ? act.via_location?.id : act.via_location) ?? null,
          end_location_id: act.end_location_id ?? (typeof act.end_location === "object" ? act.end_location?.id : act.end_location) ?? null,
          moment: act.moment,
          transit_fee_included: act.transit_fee_included || false,
          transit_fee: act.transit_fee ?? null,
          transit_fee_per: act.transit_fee_per ?? null,
          is_optional: act.is_optional || false,
          optional_activity_price: act.optional_activity_price ?? null,
          price_per: act.price_per ?? null,
        })),
        optional_meals: (d.optionalMeals || []).map((meal) => ({
          meal_id: meal.meal_id ?? (typeof meal.meal === "object" ? meal.meal?.id : meal.meal),
          is_optional: meal.is_optional !== undefined ? meal.is_optional : true,
          price: meal.price ?? 0,
        })),
        selected_rooms: (d.selectedRooms || []).map((room) => ({
          room_type_id: room.room_type_id ?? (typeof room.room_type === "object" ? room.room_type?.id : room.room_type),
          quantity: room.quantity ?? 1,
        })),
      })),
      change_summary: "Updated via Edit Itinerary Form",
      commission_percentage: parseFloat(officeCommission === "custom" ? customCommission : officeCommission) || 0,
    };

    for (const d of payload.days) {
      if (!d.destination_id) {
        toast.error(`Day ${d.day_number} has no destination. Please select one.`);
        return;
      }
    }

    try {
      setShowSavingModal(true);
      setSavingMsg("Saving Itinerary Data...");
      const resp = await api.post(`itinerary/edit/save/itinerary/${versionId}/${clientId}/`, payload);
      const newVersionId = resp.data.version_id;
      setSavingMsg("Saved successfully!");
      setTimeout(() => {
        setShowSavingModal(false);
        toast.success("Itinerary saved successfully!");
        navigate(`/preview/safari/itinerary/${clientId}/${newVersionId}`);
      }, 1500);
    } catch (error) {
      setSavingMsg("Failed to save.");
      const errData = error.response?.data;
      if (errData?.detail){
        toast.error(errData?.detail)
      }else if (errData && typeof errData === "object"){
        Object.entries(errData).forEach(([val, msg])=>{
          const text = Array.isArray(msg) ? msg.join(", ") : String(msg)
          toast.error(`${val} : ${text}`)
        })
      } 
      const errorMsg = errData?.message  || errData?.non_field_errors?.[0] || errData?.days?.[0] || errData?.client_info?.tour_title?.[0] || "Failed to save itinerary. Check all required fields.";
      toast.error(typeof errorMsg === "string" ? errorMsg : "Failed to save itinerary.");
      setTimeout(() => setShowSavingModal(false), 1500);
    }
  };

  const calculateDateForDay = (startDateStr, dayOffset) => {
    if (!startDateStr) return "";
    const date = new Date(startDateStr);
    date.setDate(date.getDate() + (dayOffset - 1));
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  if (!dataToEdit) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center text-[#6B6459] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#E8772E]" />
        <p className="text-sm font-medium">Loading itinerary workspace...</p>
      </div>
    );
  }

  const totalTourDays = enrichedDays[enrichedDays.length - 1]?.endDaySpan || 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F2A2E] p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0F2A2E]">{clientInfo.tour_title || "Edit Itinerary"}</h1>
            <p className="text-sm text-[#6B6459] flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-[#1E5A3B]/10 text-[#1E5A3B] rounded-md text-xs font-semibold">{clientInfo.tour_type}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5" /> {totalTourDays} Days Total
            </p>
            <p className="text-xs text-[#6B6459] mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Starts: {calculateDateForDay(clientInfo.tour_start_date, 1)}
            </p>
          </div>
        </div>

        {/* Day-by-Day Cards */}
        <div className="space-y-6">
          {enrichedDays.map((dayConfig, index) => {
            const { dayIndex, endDaySpan, isMultiNight, isLastDay } = dayConfig;
            const nightCount = dayConfig.nights;
            const dayTitle = isMultiNight ? `Day ${dayIndex} - ${endDaySpan}` : `Day ${dayIndex}`;
            const dateDisplay = isMultiNight
              ? `${calculateDateForDay(clientInfo.tour_start_date, dayIndex)} - ${calculateDateForDay(clientInfo.tour_start_date, endDaySpan)}`
              : calculateDateForDay(clientInfo.tour_start_date, dayIndex);

            return (
              <div key={dayConfig.id} className="bg-white border border-[#E4DCCB] p-5 md:p-6 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4DCCB] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1E5A3B]/10 flex items-center justify-center text-[#1E5A3B] font-bold text-base">
                      {dayIndex}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0F2A2E] flex items-center gap-2 flex-wrap">
                        {dayTitle}
                        {isMultiNight && <span className="px-2.5 py-0.5 bg-[#E8772E]/10 text-[#E8772E] text-xs rounded-full font-semibold">{nightCount} Nights Stay</span>}
                        {isLastDay && !dayConfig.accommodation && (
                          <span className="py-1 px-2 rounded-lg bg-[#8E2A1F]/10 border border-[#8E2A1F]/20 text-xs text-[#8E2A1F] flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5" /> Departure Day (No accommodation)
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-[#6B6459] flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3 h-3" /> {dateDisplay}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#FAFAFA] px-3 py-1.5 border border-[#E4DCCB]">
                      <Moon className="w-4 h-4 text-[#1E5A3B]" />
                      <label className="text-xs text-[#6B6459] font-medium">Nights:</label>
                      <select
                        value={nightCount}
                        onChange={(e) => handleNightsChange(index, e.target.value)}
                        className="bg-transparent text-xs font-bold text-[#0F2A2E] focus:outline-none cursor-pointer"
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n} className="bg-white text-[#0F2A2E]">{n} {n === 1 ? "Night" : "Nights"}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#FAFAFA] p-1 border border-[#E4DCCB]">
                      {MEAL_OPTIONS.map((meal) => {
                        const isSelected = dayConfig.selectedMeals.includes(meal);
                        return (
                          <button
                            key={meal}
                            type="button"
                            onClick={() => handleToggleMeal(index, meal)}
                            className={`px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                              isSelected ? "bg-[#E8772E] text-white shadow-sm" : "text-[#6B6459] hover:text-[#0F2A2E] hover:bg-[#E4DCCB]"
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-3 h-3" />}
                            {meal.substring(0, 1)}<span className="hidden sm:inline">{meal.substring(1)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Accommodation & Destination Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6459] mb-2 uppercase tracking-wider">
                      <Building2 className="w-3.5 h-3.5 text-[#1E5A3B]" /> Accommodation Setup
                    </div>
                    <AccommodationComponentGlobal
                      clientId={clientId}
                      dayIndex={dayIndex}
                      initialAccommodation={dayConfig.accommodation}
                      initialSelectedRooms={dayConfig.selectedRooms}
                      onChangeSelectedData={(payload) => handleAccommodationChange(index, payload)}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6459] mb-2 uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 text-[#1E5A3B]" /> Destination Setup
                    </div>
                    <DestinationComponentGlobal
                      clientId={clientId}
                      autoFilledDestination={dayConfig.autoFilledDestination}
                      initialDestination={dayConfig.destination}
                      onSelect={(destObj) => handleDestinationSelect(index, destObj)}
                    />
                  </div>
                </div>

                {/* Activities & Optional Meals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-[#FAFAFA] border border-[#E4DCCB] p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E4DCCB] pb-3">
                      <h4 className="text-xs font-bold text-[#0F2A2E] flex items-center gap-2 uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-[#E8772E]" /> Day Activities ({dayConfig.activities.length})
                      </h4>
                      <button
                        type="button"
                        onClick={() => setActiveActivityModalDay(index)}
                        className="px-3 py-1.5 bg-white hover:bg-[#E8772E]/10 text-[#E8772E] border border-[#E4DCCB] hover:border-[#E8772E] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> {dayConfig.activities.length > 0 ? "Edit" : "Add"}
                      </button>
                    </div>
                    {dayConfig.activities.length === 0 ? (
                      <p className="text-xs text-[#6B6459] italic py-2 text-center">No activities added for this day.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2 py-1">
                        {dayConfig.activities.map((act, idx) => (
                          <span key={act.id || idx} className="px-2.5 py-1 bg-white border border-[#E4DCCB] text-xs text-[#0F2A2E] font-medium">
                            {act.activity_type_name || act.activity_type_title || `Activity #${idx + 1}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-[#FAFAFA] border border-[#E4DCCB] p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E4DCCB] pb-3">
                      <h4 className="text-xs font-bold text-[#0F2A2E] flex items-center gap-2 uppercase tracking-wider">
                        <Utensils className="w-4 h-4 text-[#1E5A3B]" /> Optional Meals ({dayConfig.optionalMeals.length})
                      </h4>
                      <button
                        type="button"
                        onClick={() => setActiveMealModalDay(index)}
                        className="px-3 py-1.5 bg-white hover:bg-[#1E5A3B]/10 text-[#1E5A3B] border border-[#E4DCCB] hover:border-[#1E5A3B] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> {dayConfig.optionalMeals.length > 0 ? "Edit" : "Add"}
                      </button>
                    </div>
                    {dayConfig.optionalMeals.length === 0 ? (
                      <p className="text-xs text-[#6B6459] italic py-2 text-center">No optional meals specified.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2 py-1">
                        {dayConfig.optionalMeals.map((m, idx) => (
                          <span key={m.id || idx} className="px-2.5 py-1 bg-white border border-[#E4DCCB] text-xs text-[#0F2A2E] font-medium">
                            {m.meal_name || `Meal #${idx + 1}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modals */}
                {activeActivityModalDay === index && (
                  <ActivitiesComponentGlobal
                    isOpen={true}
                    onClose={() => setActiveActivityModalDay(null)}
                    dayIndex={dayIndex}
                    initialActivities={dayConfig.activities}
                    onSaveActivities={(updated) => handleSaveActivities(index, updated)}
                  />
                )}
                {activeMealModalDay === index && (
                  <OptionalMealComponentGlobal
                    isOpen={true}
                    onClose={() => setActiveMealModalDay(null)}
                    dayIndex={dayIndex}
                    initialMeals={dayConfig.optionalMeals}
                    onSaveMeals={(updated) => handleSaveMeals(index, updated)}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Pricing Summary */}
        <div className="relative overflow-hidden bg-white border border-[#E4DCCB]  p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E4DCCB] pb-4 mb-4">
            <h3 className="text-[#0F2A2E] font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#1E5A3B]" /> Pricing Summary
            </h3>
            {commissionPercentage > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 l text-[10px] font-bold bg-[#1E5A3B]/10 text-[#1E5A3B] border border-[#1E5A3B]/20">
                {commissionPercentage}% Commission Included
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 l text-[10px] font-bold bg-[#8E2A1F]/10 text-[#8E2A1F] border border-[#8E2A1F]/20">
                Commission Not Included
              </span>
            )}
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-row items-center justify-between sm:justify-start gap-8 w-full lg:w-auto">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#6B6459] uppercase tracking-wider font-bold">Grand Total</span>
                <span className="text-3xl font-black text-[#1E5A3B] tracking-tight mt-0.5">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
              <div className="w-px h-10 bg-[#E4DCCB]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-[#6B6459] uppercase tracking-wider font-bold">Per Person</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-extrabold text-[#0F2A2E] tracking-tight">${perPerson.toFixed(2)}</span>
                  <span className="text-[10px] text-[#6B6459] font-medium">({pricing.totalTravellers} pax)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#E8772E]/5 text-[#E8772E] border border-[#E8772E] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4" /> View Breakdown & Add Commission
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E4DCCB]">
          <button
            onClick={handleRemoveDay}
            disabled={dayConfigs.length <= 1}
            className="w-full sm:w-auto px-4 py-3 bg-white hover:bg-[#8E2A1F]/5 disabled:opacity-50 disabled:cursor-not-allowed text-[#8E2A1F] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#E4DCCB] hover:border-[#8E2A1F]/30"
          >
            <Trash2 className="w-4 h-4" /> Remove Last Day
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={handleAddDay}
              className="w-full sm:w-auto px-4 py-3 bg-white hover:bg-[#1E5A3B]/5 text-[#1E5A3B] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#E4DCCB] hover:border-[#1E5A3B]/30"
            >
              <Plus className="w-4 h-4" /> Add Day {totalTourDays + 1}
            </button>

            <button
              onClick={handleEditBulkSave}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#E8772E] hover:bg-[#B34F12] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg shadow-[#E8772E]/20"
            >
              <CheckCircle2 className="w-4 h-4" /> Save & Generate Itinerary
            </button>
          </div>
        </div>

        {/* Saving Overlay */}
        {showSavingModal && (
          <div className="fixed inset-0 z-50 bg-[#0F2A2E]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[#E4DCCB]  p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
              <div className="w-12 h-12 mx-auto bg-[#E8772E]/10 l flex items-center justify-center text-[#E8772E]">
                {savingMsg.includes("Failed") ? <AlertTriangle className="w-6 h-6" /> : <Loader2 className="w-6 h-6 animate-spin" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F2A2E]">{savingMsg.includes("Failed") ? "Save Failed" : "Saving Itinerary"}</h3>
                <p className="text-xs text-[#6B6459] mt-1">{savingMsg}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {isPricingModalOpen && (
        <SmartPricingBreakdownGlobal
          dayConfigs={dayConfigs}
          clientInfo={clientInfo}
          officeCommission={officeCommission}
          setOfficeCommission={setOfficeCommission}
          customCommission={customCommission}
          setCustomCommission={setCustomCommission}
          onClose={() => setIsPricingModalOpen(false)}
        />
      )}
    </div>
  );
}