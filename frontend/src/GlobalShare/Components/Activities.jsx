import { useState, useEffect, useCallback, useRef } from "react";
import api from "../../Apis/api";
import { toast } from "react-toastify";
import {
  Search, X, Plus, Trash2, MapPin, Bus, ChevronDown,
  Check, Sparkles, Pencil, XCircle
} from "lucide-react";

export default function ActivitiesComponentGlobal({
  isOpen,
  onClose,
  dayIndex = 1,
  dayId,                              
  initialActivities = [],
  onSaveActivities,
}) {
  if (!isOpen) return null;

  // --- STATE ---
  const [activityTypeQuery, setActivityTypeQuery] = useState("");
  const [selectedActivityType, setSelectedActivityType] = useState(null);
  const [activityTypesData, setActivityTypesData] = useState([]);
  const [isTypesLoading, setIsTypesLoading] = useState(false);
  const [isTypesDropdownOpen, setIsTypesDropdownOpen] = useState(false);

  const [showFromViaTo, setShowFromViaTo] = useState(false);

  const [mainLocationQuery, setMainLocationQuery] = useState("");
  const [selectedMainLocation, setSelectedMainLocation] = useState(null);
  const [startLocQuery, setStartLocQuery] = useState("");
  const [selectedStartLoc, setSelectedStartLoc] = useState(null);
  const [viaLocQuery, setViaLocQuery] = useState("");
  const [selectedViaLoc, setSelectedViaLoc] = useState(null);
  const [endLocQuery, setEndLocQuery] = useState("");
  const [selectedEndLoc, setSelectedEndLoc] = useState(null);

  const [locationResults, setLocationResults] = useState([]);
  const [isLocLoading, setIsLocLoading] = useState(false);
  const [activeLocField, setActiveLocField] = useState(null);

  const [includeTransitFee, setIncludeTransitFee] = useState(false);
  const [transitFee, setTransitFee] = useState("");
  const [transitFeePer, setTransitFeePer] = useState("Pax");

  const [isOptional, setIsOptional] = useState(false);
  const [optionalPrice, setOptionalPrice] = useState("");
  const [pricePer, setPricePer] = useState("PerPersonal");
  const [moment, setMoment] = useState("1_MORNING");

  const [stagedActivities, setStagedActivities] = useState(initialActivities || []);
  const [editingTempId, setEditingTempId] = useState(null); // NEW: which activity we're editing

  const STORAGE_KEY = `activities_draft_${dayId || `day_${dayIndex}`}`;
  const locationSearchTimeoutRef = useRef(null);
  const hydratedRef = useRef(false); // prevents re-hydration on every render

  // ==========================================
  // 1. HYDRATE ON OPEN (fixed)
  // ==========================================
  useEffect(() => {
    if (!isOpen) {
      hydratedRef.current = false;
      return;
    }
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    // 1. Prefer draft (unsaved work) — read FIRST, don't remove
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (Array.isArray(parsed)) {
          setStagedActivities(parsed);
          return;
        }
      } catch (e) {
        console.error("Invalid draft, discarding", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // 2. Fallback to what the parent already has
    setStagedActivities(initialActivities || []);
  }, [isOpen, STORAGE_KEY, initialActivities]);

  const updateLocalStorage = (newList) => {
    setStagedActivities(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  // ==========================================
  // 2. SEARCH APIS (unchanged)
  // ==========================================
  const searchActivityTypes = useCallback(async (query) => {
    if (!query.trim()) {
      setActivityTypesData([]);
      setIsTypesDropdownOpen(false);
      return;
    }
    setIsTypesLoading(true);
    try {
      const resp = await api.get("activities/live/search/activity/types/", {
        params: { search: query.trim() },
      });
      setActivityTypesData(resp.data || []);
      setIsTypesDropdownOpen(true);
    } catch (error) {
          const errorMsg = error.response?.data;
          if (errorMsg?.detail){
            toast.error(errorMsg?.detail)
          }else if (errorMsg && typeof errorMsg === "object"){
            Object.entries(errorMsg).forEach(([val, msg])=>{
              const text = Array.isArray(msg) ? msg.join(", ") : String(msg);
              toast.error(`${val} : ${text}`);
            })
          }else{
            toast.error("Failed to search activity types");
          }
    } finally {
      setIsTypesLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activityTypeQuery.trim() && !selectedActivityType) {
        searchActivityTypes(activityTypeQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [activityTypeQuery, selectedActivityType, searchActivityTypes]);

  const searchLocations = useCallback(async (query, fieldName) => {
    if (!query.trim()) {
      setLocationResults([]);
      setActiveLocField(null);
      return;
    }
    setIsLocLoading(true);
    setActiveLocField(fieldName);
    try {
      const resp = await api.get("activities/live/search/activity/location/", {
        params: { search: query.trim() },
      });
      setLocationResults(resp.data || []);
    } catch (error) {
          const errorMsg = error.response?.data;
          if (errorMsg?.detail){
            toast.error(errorMsg?.detail)
          }else if (errorMsg && typeof errorMsg === "object"){
            Object.entries(errorMsg).forEach(([val, msg])=>{
              const text = Array.isArray(msg) ? msg.join(", ") : String(msg);
              toast.error(`${val} : ${text}`);
            })
          }else{
             toast.error("Failed to search location");
          }
    } finally {
      setIsLocLoading(false);
    }
  }, []);

  const handleLocationInputChange = (value, fieldName) => {
    if (fieldName === "main") { setMainLocationQuery(value); setSelectedMainLocation(null); }
    if (fieldName === "start") { setStartLocQuery(value); setSelectedStartLoc(null); }
    if (fieldName === "via") { setViaLocQuery(value); setSelectedViaLoc(null); }
    if (fieldName === "end") { setEndLocQuery(value); setSelectedEndLoc(null); }

    if (locationSearchTimeoutRef.current) clearTimeout(locationSearchTimeoutRef.current);
    locationSearchTimeoutRef.current = setTimeout(() => {
      searchLocations(value, fieldName);
    }, 300);
  };

  // ==========================================
  // 3. SELECTION HANDLERS
  // ==========================================
  const handleSelectType = (item) => {
    setSelectedActivityType(item);
    setActivityTypeQuery(item.title);
    setShowFromViaTo(item.involve_transport);
    setIsTypesDropdownOpen(false);
  };

  const handleClearActivityTypeSearch = () => {
    setActivityTypeQuery("");
    setSelectedActivityType(null);
    setActivityTypesData([]);
  };

  const handleSelectLocation = (locItem, fieldName) => {
    if (fieldName === "main") { setSelectedMainLocation(locItem); setMainLocationQuery(locItem.location_name); }
    else if (fieldName === "start") { setSelectedStartLoc(locItem); setStartLocQuery(locItem.location_name); }
    else if (fieldName === "via") { setSelectedViaLoc(locItem); setViaLocQuery(locItem.location_name); }
    else if (fieldName === "end") { setSelectedEndLoc(locItem); setEndLocQuery(locItem.location_name); }
    setLocationResults([]);
    setActiveLocField(null);
  };

  // ==========================================
  // 4. RESET / EDIT / SAVE / DELETE
  // ==========================================
  const resetForm = useCallback(() => {
    setSelectedActivityType(null);
    setActivityTypeQuery("");
    setMainLocationQuery(""); setSelectedMainLocation(null);
    setStartLocQuery(""); setSelectedStartLoc(null);
    setViaLocQuery(""); setSelectedViaLoc(null);
    setEndLocQuery(""); setSelectedEndLoc(null);
    setShowFromViaTo(false);
    setIncludeTransitFee(false);
    setTransitFee("");
    setTransitFeePer("Pax");
    setIsOptional(false);
    setOptionalPrice("");
    setMoment("1_MORNING");
    setEditingTempId(null);
  }, []);

  const handleEditActivity = (act) => {
    setEditingTempId(act.temp_id);

    setSelectedActivityType({
      id: act.activity_type_id,
      title: act.activity_type_title,
      involve_transport: act.involve_transport,
    });
    setActivityTypeQuery(act.activity_type_title || "");
    setShowFromViaTo(!!act.involve_transport);

    if (act.involve_transport) {
      setSelectedStartLoc(act.start_location_id ? { id: act.start_location_id, location_name: act.start_location_name } : null);
      setStartLocQuery(act.start_location_name || "");
      setSelectedViaLoc(act.via_location_id ? { id: act.via_location_id, location_name: act.via_location_name } : null);
      setViaLocQuery(act.via_location_name || "");
      setSelectedEndLoc(act.end_location_id ? { id: act.end_location_id, location_name: act.end_location_name } : null);
      setEndLocQuery(act.end_location_name || "");
    } else {
      setSelectedMainLocation(act.main_location_id ? { id: act.main_location_id, location_name: act.main_location_name } : null);
      setMainLocationQuery(act.main_location_name || "");
    }

    setMoment(act.moment || "1_MORNING");
    setIncludeTransitFee(!!act.transit_fee_included);
    setTransitFee(act.transit_fee != null ? String(act.transit_fee) : "");
    setTransitFeePer(act.transit_fee_per || "Pax");
    setIsOptional(!!act.is_optional);
    setOptionalPrice(act.optional_activity_price != null ? String(act.optional_activity_price) : "");
    setPricePer(act.price_per || "PerPersonal");
  };

  const handleCancelEdit = () => resetForm();

  const handleAddOrUpdateActivity = () => {
    if (!selectedActivityType) return toast.error("Please pick an activity type");
    if (showFromViaTo && (!selectedStartLoc || !selectedEndLoc))
      return toast.error("Transport activities require both Start and End");
    if (!showFromViaTo && !selectedMainLocation)
      return toast.error("Please select a location");
    if (isOptional && (!optionalPrice || parseFloat(optionalPrice) <= 0))
      return toast.error("Enter a valid optional price");

    const data = {
      activity_type_id: selectedActivityType.id,
      activity_type_title: selectedActivityType.title,
      involve_transport: showFromViaTo,
      main_location_id: selectedMainLocation?.id || null,
      main_location_name: selectedMainLocation?.location_name || "",
      start_location_id: selectedStartLoc?.id || null,
      start_location_name: selectedStartLoc?.location_name || "",
      via_location_id: selectedViaLoc?.id || null,
      via_location_name: selectedViaLoc?.location_name || "",
      end_location_id: selectedEndLoc?.id || null,
      end_location_name: selectedEndLoc?.location_name || "",
      moment,
      transit_fee_included: includeTransitFee,
      transit_fee: includeTransitFee ? parseFloat(transitFee || 0) : null,
      transit_fee_per: includeTransitFee ? transitFeePer : null,
      is_optional: isOptional,
      optional_activity_price: isOptional ? parseFloat(optionalPrice || 0) : null,
      price_per: isOptional ? pricePer : null,
    };

    let updatedList;
    if (editingTempId) {
      updatedList = stagedActivities.map((a) =>
        a.temp_id === editingTempId ? { ...data, temp_id: editingTempId } : a
      );
      toast.success("Activity updated!");
    } else {
      updatedList = [
        ...stagedActivities,
        { ...data, temp_id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 9)}` },
      ];
      toast.success("Activity added to draft!");
    }

    updateLocalStorage(updatedList);
    resetForm();
  };

  const handleRemoveActivity = (tempId) => {
    const updatedList = stagedActivities.filter((a) => a.temp_id !== tempId);
    updateLocalStorage(updatedList);
    if (editingTempId === tempId) resetForm();
  };

  const handleSaveAndClose = () => {
    if (onSaveActivities) onSaveActivities(stagedActivities);
    toast.success(`Saved ${stagedActivities.length} activities for Day ${dayIndex}`);
    localStorage.removeItem(STORAGE_KEY); // clear draft — parent now has it
    onClose();
  };

  // ==========================================
  // 5. RENDER
  // ==========================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A2E]/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-[#E4DCCB] w-full max-w-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(15,42,46,0.3)] flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-[#E4DCCB] bg-[#F6F1E7]/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#FCE9DA] border border-[#E8772E]/20 flex items-center justify-center text-[#B34F12]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F2A2E]">
                Day {dayIndex} Activities
              </h3>
              <p className="text-xs text-[#6B6459]">
                {editingTempId ? "Editing an activity — update or cancel" : "Add transfers, game drives & optional excursions"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#6B6459] hover:text-[#0F2A2E] bg-transparent hover:bg-[#F6F1E7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* EDITING BANNER */}
        {editingTempId && (
          <div className="px-5 py-2.5 bg-[#FDF4DD] border-b border-[#F2B544]/40 flex items-center justify-between text-xs">
            <span className="font-semibold text-[#7A4E08] flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5" />
              Editing mode — changes will update the staged activity
            </span>
            <button
              onClick={handleCancelEdit}
              className="font-bold text-[#8E2A1F] hover:underline flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" /> Cancel
            </button>
          </div>
        )}

        {/* BODY */}
        <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar">

          {/* 1. ACTIVITY TYPE */}
          <div className="relative">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#0F2A2E]/80 mb-1.5 block">
              Activity type
            </label>
            <div className="relative flex items-center group">
              <Search className="absolute left-3.5 w-4 h-4 text-[#6B6459] pointer-events-none" />
              <input
                type="text"
                placeholder="Search activity (e.g. Game Drive, Transfer)..."
                value={activityTypeQuery}
                onChange={(e) => {
                  setActivityTypeQuery(e.target.value);
                  if (selectedActivityType) setSelectedActivityType(null);
                }}
                className="w-full bg-white border border-[#E4DCCB] pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20"
              />
              {activityTypeQuery && (
                <button
                  type="button"
                  onClick={handleClearActivityTypeSearch}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6B6459] hover:text-[#0F2A2E]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {isTypesLoading && (
              <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white border border-[#E4DCCB] z-20 text-xs text-[#6B6459]">
                Searching activities...
              </div>
            )}
            {isTypesDropdownOpen && activityTypesData.length > 0 && (
              <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-[#E4DCCB] shadow-lg max-h-48 overflow-y-auto divide-y divide-[#E4DCCB]/60">
                {activityTypesData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectType(item)}
                    className="p-3 cursor-pointer text-sm hover:bg-[#FCE9DA] flex items-center justify-between"
                  >
                    <span className="font-semibold">{item.title}</span>
                    {item.involve_transport && (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-[#E2EEF4] text-[#1D4E68] px-2 py-0.5 border border-[#1D4E68]/20 flex items-center gap-1">
                        <Bus className="w-3 h-3" /> Transport
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. LOCATIONS */}
          {showFromViaTo ? (
            <div className="p-4 bg-[#F6F1E7]/60 border border-[#E4DCCB] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1D4E68]">
                <div className="w-7 h-7 bg-[#E2EEF4] flex items-center justify-center">
                  <Bus className="w-4 h-4 text-[#1D4E68]" />
                </div>
                <span className="uppercase tracking-widest">Transport route details</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {["start", "via", "end"].map((field) => (
                  <div key={field} className="relative">
                    <label className="text-[11px] font-semibold text-[#6B6459] mb-1 block uppercase tracking-widest">
                      {field === "via" ? "Via (optional)" : `To (${field === "start" ? "Start" : "Destination"})`}
                    </label>
                    <input
                      type="text"
                      placeholder={field === "start" ? "e.g. Arusha" : field === "via" ? "e.g. Karatu" : "e.g. Serengeti"}
                      value={field === "start" ? startLocQuery : field === "via" ? viaLocQuery : endLocQuery}
                      onChange={(e) => handleLocationInputChange(e.target.value, field)}
                      className="w-full bg-white border border-[#E4DCCB] px-3 py-2 text-sm focus:outline-none focus:border-[#E8772E]"
                    />
                    {activeLocField === field && locationResults.length > 0 && (
                      <div className="absolute z-20 left-0 right-0 mt-1.5 bg-white border border-[#E4DCCB] shadow-lg max-h-36 overflow-y-auto">
                        {locationResults.map((loc) => (
                          <div
                            key={loc.id}
                            onClick={() => handleSelectLocation(loc, field)}
                            className="p-2.5 text-sm hover:bg-[#FCE9DA] cursor-pointer"
                          >
                            {loc.location_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E4DCCB]">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIncludeTransitFee(!includeTransitFee)}
                    className={`relative rounded-3xl inline-flex h-5 w-10 items-center transition-colors ${
                      includeTransitFee ? "bg-[#E8772E]" : "bg-[#E4DCCB]"
                    }`}
                  >
                    <span className={`inline-block rounded-full h-3.5 w-3.5 bg-white shadow-sm transition-transform ${
                      includeTransitFee ? "translate-x-5" : "translate-x-1"
                    }`} />
                  </button>
                  <span className="text-xs font-semibold">Include park transit fee</span>
                </div>
                {includeTransitFee && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="number"
                      placeholder="Base Rate ($)"
                      value={transitFee}
                      onChange={(e) => setTransitFee(e.target.value)}
                      className="w-28 bg-white border border-[#E4DCCB] px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-[#E8772E]"
                    />
                    <select
                      value={transitFeePer}
                      onChange={(e) => setTransitFeePer(e.target.value)}
                      className="bg-white border border-[#E4DCCB] px-2 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#E8772E]"
                    >
                      <option value="Pax">Per Pax</option>
                      <option value="Group">Per Group</option>
                      <option value="Vehicle">Per Vehicle</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative">
              <label className="text-xs font-semibold uppercase tracking-widest text-[#0F2A2E]/80 mb-1.5 block">
                Activity location / spot
              </label>
              <div className="relative group">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Ngorongoro Crater Floor, Seronera Airstrip..."
                  value={mainLocationQuery}
                  onChange={(e) => handleLocationInputChange(e.target.value, "main")}
                  className="w-full bg-white border border-[#E4DCCB] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#E8772E]"
                />
              </div>
              {activeLocField === "main" && locationResults.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1.5 bg-white border border-[#E4DCCB] shadow-lg max-h-40 overflow-y-auto">
                  {locationResults.map((loc) => (
                    <div
                      key={loc.id}
                      onClick={() => handleSelectLocation(loc, "main")}
                      className="p-2.5 text-sm hover:bg-[#FCE9DA] cursor-pointer"
                    >
                      {loc.location_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. MOMENT & OPTIONAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[#0F2A2E]/80 mb-1.5 block">
                Time / Moment
              </label>
              <div className="relative">
                <select
                  value={moment}
                  onChange={(e) => setMoment(e.target.value)}
                  className="w-full bg-white border border-[#E4DCCB] px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-[#E8772E] appearance-none pr-9"
                >
                  <option value="1_MORNING">Morning Excursion</option>
                  <option value="2_AFTERNOON">Afternoon Excursion</option>
                  <option value="3_EVENING">Evening / Sundowner</option>
                  <option value="4_NIGHT">Night Safari</option>
                  <option value="5_FULL_DAY">Full Day Activity</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#0F2A2E]/80">
                  Optional activity?
                </label>
                <button
                  type="button"
                  onClick={() => setIsOptional(!isOptional)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                    isOptional ? "bg-[#E8772E]" : "bg-[#E4DCCB]"
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 bg-white rounded-full shadow-sm transition-transform ${
                    isOptional ? "translate-x-5" : "translate-x-1"
                  }`} />
                </button>
              </div>
              {isOptional ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Base Price ($)"
                    value={optionalPrice}
                    onChange={(e) => setOptionalPrice(e.target.value)}
                    className="w-1/2 bg-white border border-[#E4DCCB] px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#E8772E]"
                  />
                  <select
                    value={pricePer}
                    onChange={(e) => setPricePer(e.target.value)}
                    className="w-1/2 bg-white border border-[#E4DCCB] px-2 py-2 text-sm font-semibold focus:outline-none focus:border-[#E8772E]"
                  >
                    <option value="PerPersonal">Per Person</option>
                    <option value="PerGroup">Per Group</option>
                    <option value="PerVehicle">Per Vehicle</option>
                  </select>
                </div>
              ) : (
                <div className="text-[11px] font-semibold text-[#1E5A3B] py-2.5 px-3 flex items-center gap-2 bg-[#E3F1E8] border border-[#1E5A3B]/20">
                  <Check className="w-3.5 h-3.5" /> Included in base itinerary
                </div>
              )}
            </div>
          </div>

          {/* 4. ADD / UPDATE BUTTON */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddOrUpdateActivity}
              className="flex-1 py-3 bg-[#E8772E] text-[#0F2A2E] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#D4661F] transition-all shadow-lg shadow-[#E8772E]/25"
            >
              {editingTempId ? (
                <>
                  <Check className="w-4 h-4" /> Update activity
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Add activity to day {dayIndex}
                </>
              )}
            </button>
            {editingTempId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-3 bg-white border border-[#E4DCCB] text-[#0F2A2E] text-sm font-semibold hover:bg-[#F6F1E7]"
              >
                Cancel
              </button>
            )}
          </div>

          {/* 5. STAGED LIST */}
          {stagedActivities.length > 0 && (
            <div className="pt-3 border-t border-[#E4DCCB] space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#6B6459] block">
                Staged activities ({stagedActivities.length})
              </span>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {stagedActivities.map((act) => {
                  const isBeingEdited = editingTempId === act.temp_id;
                  return (
                    <div
                      key={act.temp_id}
                      className={`p-3 border flex items-start justify-between text-xs group transition-colors ${
                        isBeingEdited
                          ? "bg-[#FDF4DD] border-[#F2B544]"
                          : "bg-white border-[#E4DCCB] hover:border-[#E8772E]/40"
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="font-bold text-[#0F2A2E] flex items-center gap-2 flex-wrap">
                          <span className="truncate">{act.activity_type_title}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-[#F6F1E7] text-[#6B6459] px-2 py-0.5 border border-[#E4DCCB]">
                            {act.moment.replace(/_/g, " ")}
                          </span>
                          {act.is_optional && (
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-[#FDF4DD] text-[#7A4E08] px-2 py-0.5 border border-[#F2B544]/30">
                              Optional
                            </span>
                          )}
                          {isBeingEdited && (
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-[#FCE9DA] text-[#B34F12] px-2 py-0.5 border border-[#E8772E]/40">
                              Editing
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#6B6459] flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-[#E8772E] shrink-0" />
                          {act.involve_transport ? (
                            <span className="truncate">
                              {act.start_location_name} ➔ {act.via_location_name ? `${act.via_location_name} ➔ ` : ""}{act.end_location_name}
                            </span>
                          ) : (
                            <span className="truncate">{act.main_location_name || "Location set"}</span>
                          )}
                        </div>
                        {(act.transit_fee_included || act.is_optional) && (
                          <div className="text-[10px] font-mono font-semibold text-[#1E5A3B] bg-[#E3F1E8] border border-[#1E5A3B]/15 px-2 py-1 inline-flex flex-wrap items-center gap-1">
                            {act.transit_fee_included && `Transit: $${act.transit_fee}/${act.transit_fee_per}`}
                            {act.transit_fee_included && act.is_optional && <span className="text-[#1E5A3B]/40">|</span>}
                            {act.is_optional && `Optional: $${act.optional_activity_price}/${act.price_per}`}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handleEditActivity(act)}
                          className="text-[#6B6459] hover:text-[#B34F12] hover:bg-[#FCE9DA] p-2 rounded-lg transition-colors"
                          title="Edit activity"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveActivity(act.temp_id)}
                          className="text-[#6B6459]/60 hover:text-[#8E2A1F] hover:bg-[#FBE5E2] p-2 rounded-lg transition-colors"
                          title="Delete activity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-[#E4DCCB] bg-[#F6F1E7]/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-[#0F2A2E] bg-white border border-[#E4DCCB] hover:bg-[#F6F1E7]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="px-5 py-2.5 text-xs font-bold text-[#0F2A2E] bg-[#E8772E] flex items-center gap-1.5 hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/25"
          >
            <Check className="w-4 h-4" /> Save & close draft
          </button>
        </div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e4dccb; border-radius: 999px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4c9b0; }
        `}</style>
      </div>
    </div>
  );
}