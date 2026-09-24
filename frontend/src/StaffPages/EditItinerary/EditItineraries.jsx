
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DestinationComponentOnly from "../Itinerary/Destination";
import AccommodationComponentOnly from "../Itinerary/Accommodation";
import ActivitiesPopUpComponent from "../Itinerary/Activities";
import OptionalMealComponentPopUp from "../Itinerary/OptionalMeal";
import api from "../../Apis/api";
import { toast } from "sonner";
import SmartPricingBreakdown from "../Itinerary/SmallPricingBreakDown";
import useItineraryPricing from "../Itinerary/useItineraryPricing";

import {
  Plus, Utensils, Sparkles, Calendar, MapPin, Building2,
  Clock, CheckCircle2, Loader2, Moon, Trash2, AlertTriangle,
  Calculator
} from "lucide-react";

// ============================================================
// NORMALIZATION HELPERS — map backend shape -> component shape
// Backend returns: nights_number, included_meals (string),
// destination/destination_name, accommodation/accommodation_name,
// activities[], optional_meals[], selected_rooms[]
// ============================================================

const MEAL_OPTIONS = ["Breakfast", "Lunch", "Dinner"];

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
  return {
    id: day.accommodation,
    accommodation_id: day.accommodation,
    name: day.accommodation_name || "",
  };
};

const normalizeRooms = (rooms) =>
  (rooms || []).map((room) => ({
    // keep original fields for display, but guarantee a usable room_type_id
    ...room,
    room_type_id:
      room.room_type_id ??
      (typeof room.room_type === "object" ? room.room_type?.id : room.room_type) ??
      null,
    room_type_name:
      room.room_type_name ??
      (typeof room.room_type === "object" ? room.room_type?.name : "") ??
      "",
    quantity: room.quantity ?? room.number ?? 1,
  }));

const normalizeDay = (day, idx) => {
  const destination = normalizeDestination(day);
  return {
    ...day,
    id: day.id || `day_${idx}_${Date.now()}`,
    // BUGFIX: backend sends "nights_number", not "nights"
    nights: Number(day.nights ?? day.nights_number ?? 1),
    // BUGFIX: backend sends included_meals as a comma string
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
// COMPONENT
// ============================================================

export default function EditItinerariesPage({ dataToEdit, clientId, versionId, onBack, onUpdateDays }) {
  const navigate = useNavigate();
  const clientInfo = dataToEdit?.client_info || {};
  const dataSignature = useMemo(
    () => (dataToEdit?.days ? `${dataToEdit.days.length}_${dataToEdit.days[0]?.id ?? "x"}` : null),
    [dataToEdit]
  );

  const [dayConfigs, setDayConfigs] = useState(() =>
    Array.isArray(dataToEdit?.days) ? dataToEdit.days.map(normalizeDay) : []
  );

  // BUGFIX: if the parent refetches / swaps data, re-sync — but ONLY when
  // the source actually changed, so we never clobber the user's edits.
  const lastSignature = useRef(dataSignature);
  useEffect(() => {
    if (dataSignature && dataSignature !== lastSignature.current) {
      lastSignature.current = dataSignature;
      setDayConfigs(dataToEdit.days.map(normalizeDay));
    }
  }, [dataSignature, dataToEdit]);

  // Modal state
  const [activeActivityModalDay, setActiveActivityModalDay] = useState(null);
  const [activeMealModalDay, setActiveMealModalDay] = useState(null);
  const [showSavingModal, setShowSavingModal] = useState(false);
  const [savingMsg, setSavingMsg] = useState("Preparing to save...");

  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  // BUGFIX: restore commission from the saved pricing snapshot
  const [officeCommission, setOfficeCommission] = useState(() =>
    dataToEdit?.pricing?.commission_percentage != null
      ? String(dataToEdit.pricing.commission_percentage)
      : "0"
  );
  const [customCommission, setCustomCommission] = useState("");

  const pricing = useItineraryPricing(dayConfigs, clientInfo);
  const commissionPercentage =
    officeCommission === "custom" ? parseFloat(customCommission) || 0 : parseFloat(officeCommission) || 0;
  const commissionAmount = (pricing.subtotal * commissionPercentage) / 100;
  const grandTotal = pricing.subtotal + commissionAmount;
  const perPerson = pricing.totalTravellers > 0 ? grandTotal / pricing.totalTravellers : 0;

  // Keep parent in sync so Step 1 <-> Step 2 navigation doesn't discard edits
  useEffect(() => {
    if (typeof onUpdateDays === "function") onUpdateDays(dayConfigs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayConfigs]);

  // ==========================================================
  // Day numbering with nights spanning
  // ==========================================================
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
        let excessDays = currentTourLength - MAX_TOUR_DAYS;
        while (excessDays > 0 && updated.length > index + 2) {
          const removedRow = updated.splice(updated.length - 2, 1)[0];
          excessDays -= removedRow.nights;
        }
        toast.info("Adjusted subsequent days to fit tour length.");
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

      const autoDest = accPayload?.destination_id
        ? { id: accPayload.destination_id, name: accPayload.destination_name }
        : currentConfig.autoFilledDestination;

      updated[index] = {
        ...currentConfig,
        accommodation: accPayload,
        // BUGFIX: keep rooms chosen inside the accommodation picker in sync
        selectedRooms: accPayload?.selected_rooms || currentConfig.selectedRooms,
        autoFilledDestination: autoDest,
        destination: autoDest || currentConfig.destination,
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
        selectedMeals: exists
          ? updated[index].selectedMeals.filter((m) => m !== meal)
          : [...updated[index].selectedMeals, meal],
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
  // BULK SAVE — payload exactly matches EditItinerarySerializer
  // ==========================================================
  const handleEditBulkSave = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    const totalTourDays =
      enrichedDays[enrichedDays.length - 1]?.endDaySpan ||
      dayConfigs.reduce((sum, item) => sum + item.nights, 0) + 1;

    const payload = {
      client_info: {
        tour_title: clientInfo.tour_title,
        tour_type: clientInfo.tour_type,
        tour_length: totalTourDays,
        tour_start_date: clientInfo.tour_start_date,
        country_visited: clientInfo.country_visited || "",
        start_destination: clientInfo.start_destination,
        end_destination: clientInfo.end_destination,
        request_info: clientInfo.request_info || "",
        travellers: clientInfo.travellers || [],
        rooms: clientInfo.rooms || [],
      },
      days: enrichedDays.map((d) => ({
        day_number: d.dayIndex,
        nights: d.nights,
        destination_id: d.destination
          ? typeof d.destination === "object" ? d.destination.id : d.destination
          : null,
        accommodation_id: d.accommodation
          ? typeof d.accommodation === "object"
            ? d.accommodation.accommodation_id || d.accommodation.id
            : d.accommodation
          : null,
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
          // BUGFIX: backend returns `meal` (id) + `meal_name`, not `meal_id`
          meal_id: meal.meal_id ?? (typeof meal.meal === "object" ? meal.meal?.id : meal.meal),
          is_optional: meal.is_optional !== undefined ? meal.is_optional : true,
          price: meal.price ?? 0,
        })),
        selected_rooms: (d.selectedRooms || []).map((room) => ({
          // BUGFIX: was sending the SelectedDayRoom row id instead of room_type id
          room_type_id: room.room_type_id ?? (typeof room.room_type === "object" ? room.room_type?.id : room.room_type),
          quantity: room.quantity ?? 1,
        })),
      })),
      change_summary: "Updated via Edit Itinerary Form",
      commission_percentage:
        parseFloat(officeCommission === "custom" ? customCommission : officeCommission) || 0,
    };

    // Validation before sending
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
      const errorMsg =
        errData?.message ||
        errData?.non_field_errors?.[0] ||
        errData?.days?.[0] ||
        errData?.client_info?.[0] ||
        "Failed to save itinerary. Check all required fields.";
      toast.error(typeof errorMsg === "string" ? errorMsg : "Failed to save itinerary.");
      setTimeout(() => setShowSavingModal(false), 1500);
    }
  };

  // ==========================================================
  // Helpers
  // ==========================================================
  const calculateDateForDay = (startDateStr, dayOffset) => {
    if (!startDateStr) return "";
    const date = new Date(startDateStr);
    date.setDate(date.getDate() + (dayOffset - 1));
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  if (!dataToEdit) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Loading itinerary workspace...</p>
      </div>
    );
  }

  const totalTourDays = enrichedDays[enrichedDays.length - 1]?.endDaySpan || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ============ Header ============ */}
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

        {/* ============ Day-by-Day ============ */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Day-by-Day Itinerary</h2>
            <span className="text-xs text-slate-400">Showing {enrichedDays.length} itinerary blocks</span>
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
                {/* Card header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-base">
                      {dayIndex}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2 flex-wrap">
                        {dayTitle}
                        {isMultiNight && (
                          <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full border border-indigo-500/40">
                            {nightCount} Nights Stay
                          </span>
                        )}
                        {isLastDay && !dayConfig.accommodation && (
                          <span className="py-1 px-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>
                              <span className="py-[2px] px-[6px] rounded-3xl bg-amber-400/15 border border-dashed border-amber-400/30">Departure Day</span> No accommodation
                            </span>
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3 text-indigo-400" />
                        {dateDisplay}
                      </p>
                    </div>
                  </div>

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

                {/* Accommodation & Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                      Accommodation Setup
                    </div>
                    {/* PREFILL: pass existing accommodation + rooms */}
                    <AccommodationComponentOnly
                      clientId={clientId}
                      dayIndex={dayIndex}
                      initialAccommodation={dayConfig.accommodation}
                      initialSelectedRooms={dayConfig.selectedRooms}
                      onChangeSelectedData={(payload) => handleAccommodationChange(index, payload)}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      Destination Setup
                    </div>
                    {/* PREFILL: pass existing destination */}
                    <DestinationComponentOnly
                      clientId={clientId}
                      autoFilledDestination={dayConfig.autoFilledDestination}
                      initialDestination={dayConfig.destination}
                      onSelect={(destObj) => handleDestinationSelect(index, destObj)}
                    />
                  </div>
                </div>

                {/* Activities & Optional Meals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
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
                    {dayConfig.activities.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2 text-center">
                        No activities added for {dayTitle}.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2 py-1">
                        {dayConfig.activities.map((act, idx) => (
                          <span key={act.id || idx} className="px-2.5 py-1 bg-slate-900 border border-slate-700/60 rounded-lg text-xs text-slate-300">
                            {act.activity_type_name || act.activity_type_title || `Activity #${idx + 1}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

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
                    {dayConfig.optionalMeals.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2 text-center">No optional meals specified.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2 py-1">
                        {dayConfig.optionalMeals.map((m, idx) => (
                          <span key={m.id || idx} className="px-2.5 py-1 bg-slate-900 border border-slate-700/60 rounded-lg text-xs text-slate-300">
                            {m.meal_name || `Meal #${idx + 1}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modals — PREFILL existing values */}
                {activeActivityModalDay === index && (
                  <ActivitiesPopUpComponent
                    isOpen={true}
                    onClose={() => setActiveActivityModalDay(null)}
                    dayIndex={dayIndex}
                    initialActivities={dayConfig.activities}
                    onSaveActivities={(updated) => handleSaveActivities(index, updated)}
                  />
                )}

                {activeMealModalDay === index && (
                  <OptionalMealComponentPopUp
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

        {/* ============ Pricing Summary ============ */}
        <div className="relative overflow-hidden bg-slate-900/95 backdrop-blur-2xl border border-slate-800/80 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="absolute -top-24 -left-20 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
            <h3 className="text-slate-300 font-bold text-xs uppercase tracking-widest">Pricing Summary</h3>
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

          <div className="flex flex-col lg:flex-row items-center justify-between gap-5 relative z-10">
            <div className="flex flex-row items-center justify-between sm:justify-start gap-6 sm:gap-8 w-full lg:w-auto">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Grand Total</span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 tracking-tight mt-0.5">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Per Person</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-extrabold text-white tracking-tight">${perPerson.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-400 font-medium">({pricing.totalTravellers} pax)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-slate-800 to-slate-800/90 hover:from-indigo-950/50 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-indigo-400" />
              View Breakdown & Add Commission
            </button>
          </div>
        </div>

        {/* ============ Footer actions ============ */}
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
              onClick={handleEditBulkSave}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              <CheckCircle2 className="w-4 h-4" /> Save & Generate Itinerary
            </button>
          </div>
        </div>

        {/* Saving overlay */}
        {showSavingModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
              <div className="w-10 h-10 bg-indigo-950/50 border border-indigo-800/50 rounded-xl flex items-center justify-center text-indigo-400">
                {savingMsg.includes("Failed") ? <AlertTriangle className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {savingMsg.includes("Failed") ? "Save Failed" : "Saving Itinerary"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{savingMsg}</p>
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
          onSave={handleEditBulkSave}
        />
      )}
    </div>
  );
}







