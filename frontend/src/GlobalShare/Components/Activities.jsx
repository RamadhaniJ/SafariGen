import { useState, useEffect, useCallback, useRef } from "react";
import api from "../../Apis/api";
import { toast } from "sonner";
import { 
  Search, X, Plus, Trash2, Clock, MapPin, Bus, 
  ChevronDown, ShieldAlert, Check, Loader2, Sparkles 
} from "lucide-react";

export default function ActivitiesComponentGlobal({ 
  isOpen, 
  onClose, 
  dayIndex = 1, 
  initialActivities = [],
  onSaveActivities 
}) {
  if (!isOpen) return null;

  // --- STATE MANAGEMENT ---
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

  // Pricing & Options
  const [includeTransitFee, setIncludeTransitFee] = useState(false);
  const [transitFee, setTransitFee] = useState("");
  const [transitFeePer, setTransitFeePer] = useState("Pax"); // Default to Pax
  
  const [isOptional, setIsOptional] = useState(false);
  const [optionalPrice, setOptionalPrice] = useState("");
  const [pricePer, setPricePer] = useState("PerPersonal");
  const [moment, setMoment] = useState("1_MORNING");

  const [stagedActivities, setStagedActivities] = useState(initialActivities);
  const STORAGE_KEY = `day_${dayIndex}_activities_draft`;
  
  // Ref for debouncing location search
  const locationSearchTimeoutRef = useRef(null);

  // ==========================================
  // 1. LOCAL STORAGE SYNC
  // ==========================================
  useEffect(() => {
    if (isOpen) {
      setStagedActivities(initialActivities);
      localStorage.removeItem(STORAGE_KEY);
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        try {
          setStagedActivities(JSON.parse(savedDraft));
        } catch (e) {
          console.error("Failed to parse local storage activities", e);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }, [isOpen, STORAGE_KEY]);

  const updateLocalStorage = (newActivitiesList) => {
    setStagedActivities(newActivitiesList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newActivitiesList));
  };

  // ==========================================
  // 2. LIVE SEARCH API CALLS
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
        params: { search: query.trim() }
      });
      setActivityTypesData(resp.data || []);
      setIsTypesDropdownOpen(true);
    } catch (error) {
      toast.error("Failed to search activity types");
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
        params: { search: query.trim() }
      });
      setLocationResults(resp.data || []);
    } catch (error) {
      toast.error("Failed to search location");
    } finally {
      setIsLocLoading(false);
    }
  }, []);

  // FIXED: Proper debouncing using useRef
  const handleLocationInputChange = (value, fieldName) => {
    if (fieldName === 'main') { setMainLocationQuery(value); setSelectedMainLocation(null); }
    if (fieldName === 'start') { setStartLocQuery(value); setSelectedStartLoc(null); }
    if (fieldName === 'via') { setViaLocQuery(value); setSelectedViaLoc(null); }
    if (fieldName === 'end') { setEndLocQuery(value); setSelectedEndLoc(null); }

    if (locationSearchTimeoutRef.current) {
      clearTimeout(locationSearchTimeoutRef.current);
    }
    
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

  // 3.1 CLEAR HANDLE
  //============================================
  const handleClearActivityTypeSearch = ()=>{
    setActivityTypeQuery("");
    setSelectedActivityType(null);
    setActivityTypesData([]);
  }

  const handleSelectLocation = (locationItem, fieldName) => {
    if (fieldName === 'main') {
      setSelectedMainLocation(locationItem);
      setMainLocationQuery(locationItem.location_name);
    } else if (fieldName === 'start') {
      setSelectedStartLoc(locationItem);
      setStartLocQuery(locationItem.location_name);
    } else if (fieldName === 'via') {
      setSelectedViaLoc(locationItem);
      setViaLocQuery(locationItem.location_name);
    } else if (fieldName === 'end') {
      setSelectedEndLoc(locationItem);
      setEndLocQuery(locationItem.location_name);
    }
    setLocationResults([]);
    setActiveLocField(null);
  };

  // ==========================================
  // 4. ADD ACTIVITY TO STAGED LIST
  // ==========================================
  const handleAddActivity = () => {
    if (!selectedActivityType) {
      toast.error("Please pick an activity type");
      return;
    }

    if (showFromViaTo && (!selectedStartLoc || !selectedEndLoc)) {
      toast.error("Transport activities require both 'Start' and 'End' locations");
      return;
    }

    if (!showFromViaTo && !selectedMainLocation) {
      toast.error("Please select a location for this activity");
      return;
    }

    if (isOptional && (!optionalPrice || parseFloat(optionalPrice) <= 0)) {
      toast.error("Please enter a valid price for optional activity");
      return;
    }

    // FIXED: Data structure now perfectly matches Backend Serializer expectations
    const newActivity = {
      temp_id: Date.now(), // For React UI rendering only
      activity_type_id: selectedActivityType.id,
      activity_type_title: selectedActivityType.title,
      involve_transport: showFromViaTo,

      // Store IDs for Backend, and Names for local UI display
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
      transit_fee_per: includeTransitFee ? transitFeePer : null, // FIXED: Added this
      
      is_optional: isOptional,
      optional_activity_price: isOptional ? parseFloat(optionalPrice || 0) : null, // FIXED: Renamed from 'price'
      price_per: isOptional ? pricePer : null,
    };

    const updatedList = [...stagedActivities, newActivity];
    updateLocalStorage(updatedList);
    toast.success("Activity added to draft!");

    // Reset Form Fields
    setSelectedActivityType(null);
    setActivityTypeQuery("");
    setMainLocationQuery(""); setSelectedMainLocation(null);
    setStartLocQuery(""); setSelectedStartLoc(null);
    setViaLocQuery(""); setSelectedViaLoc(null);
    setEndLocQuery(""); setSelectedEndLoc(null);
    setIncludeTransitFee(false);
    setTransitFee("");
    setTransitFeePer("Pax");
    setIsOptional(false);
    setOptionalPrice("");
  };

  const handleRemoveActivity = (tempId) => {
    const updatedList = stagedActivities.filter((item) => item.temp_id !== tempId);
    updateLocalStorage(updatedList);
  };

  const handleSaveAndClose = () => {
    if (onSaveActivities) {
      onSaveActivities(stagedActivities);
    }
    toast.success(`Saved ${stagedActivities.length} activities for Day ${dayIndex}`);
    localStorage.removeItem(STORAGE_KEY); // Clear draft after successful save
    onClose();
  };


  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A2E]/75 backdrop-blur-md animate-in fade-in duration-200">
    <div className="bg-white border border-[#E4DCCB]  w-full max-w-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(15,42,46,0.3)] flex flex-col max-h-[90vh]">

      {/* --- MODAL HEADER --- */}
      <div className="flex items-center justify-between p-5 border-b border-[#E4DCCB] bg-[#F6F1E7]/50">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11  bg-[#FCE9DA] border border-[#E8772E]/20 flex items-center justify-center text-[#B34F12]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F2A2E]">
              Day {dayIndex} Activities
            </h3>
            <p className="text-xs text-[#6B6459]">
              Add transfers, game drives & optional excursions
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-[#6B6459] hover:text-[#0F2A2E] bg-transparent hover:bg-[#F6F1E7] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

   

      {/* --- MODAL BODY --- */}
      <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar">

        {/* 1. PICK ACTIVITY TYPE */}
        <div className="relative">
          <label className="text-xs font-semibold uppercase tracking-widest text-[#0F2A2E]/80 mb-1.5 block">
            Activity type
          </label>
          <div className="relative flex items-center group">
            <Search className="absolute left-3.5 w-4 h-4 text-[#6B6459] pointer-events-none transition-colors group-focus-within:text-[#E8772E]" />
            <input
              type="text"
              placeholder="Search activity (e.g. Game Drive, Transfer)..."
              value={activityTypeQuery}
              onChange={(e) => {
                setActivityTypeQuery(e.target.value);
                if (selectedActivityType) setSelectedActivityType(null);
              }}
              className="w-full bg-white border border-[#E4DCCB] pl-10 pr-10 py-2.5 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all"
            />
            {activityTypeQuery && (
              <button
                  type="button"
                  onClick={handleClearActivityTypeSearch}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6B6459] hover:text-[#0F2A2E] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] rounded"
                >
                  <X className="w-4 h-4" />
              </button>
            )}
            {isTypesLoading && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white border border-[#E4DCCB] z-20 text-xs text-[#6B6459] shadow-[0_12px_32px_-8px_rgba(15,42,46,0.18)]">
                  Searching activities...
                </div>
            )}
          </div>

          {isTypesDropdownOpen && activityTypesData.length > 0 && (
            <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-[#E4DCCB] shadow-[0_12px_32px_-8px_rgba(15,42,46,0.18)] max-h-48 overflow-y-auto divide-y divide-[#E4DCCB]/60 custom-scrollbar">
              {activityTypesData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectType(item)}
                  className="p-3 cursor-pointer text-sm hover:bg-[#FCE9DA] flex items-center justify-between text-[#0F2A2E] transition-colors group/item"
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

        {/* 2. LOCATIONS SECTION */}
        {showFromViaTo ? (
          <div className="p-4 bg-[#F6F1E7]/60 border border-[#E4DCCB] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1D4E68]">
              <div className="w-7 h-7 bg-[#E2EEF4] flex items-center justify-center">
                <Bus className="w-4 h-4 text-[#1D4E68]" />
              </div>
              <span className="uppercase tracking-widest">Transport route details</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['start', 'via', 'end'].map((field) => (
                <div key={field} className="relative">
                  <label className="text-[11px] font-semibold text-[#6B6459] mb-1 block uppercase tracking-widest">
                    {field === 'via' ? 'Via (optional)' : `To (${field === 'start' ? 'Start' : 'Destination'})`}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      field === 'start'
                        ? "e.g. Arusha"
                        : field === 'via'
                        ? "e.g. Karatu"
                        : "e.g. Serengeti"
                    }
                    value={
                      field === 'start'
                        ? startLocQuery
                        : field === 'via'
                        ? viaLocQuery
                        : endLocQuery
                    }
                    onChange={(e) => handleLocationInputChange(e.target.value, field)}
                    className="w-full bg-white border border-[#E4DCCB] px-3 py-2 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all"
                  />
                  {activeLocField === field && locationResults.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 mt-1.5 bg-white border border-[#E4DCCB] shadow-[0_12px_32px_-8px_rgba(15,42,46,0.18)] max-h-36 overflow-y-auto custom-scrollbar">
                      {locationResults.map((loc) => (
                        <div
                          key={loc.id}
                          onClick={() => handleSelectLocation(loc, field)}
                          className="p-2.5 text-sm text-[#0F2A2E] hover:bg-[#FCE9DA] hover:text-[#B34F12] cursor-pointer transition-colors"
                        >
                          {loc.location_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Transit Fee Toggle */}
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E4DCCB]">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIncludeTransitFee(!includeTransitFee)}
                  className={`relative rounded-3xl inline-flex h-5 w-10 items-center l transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] ${
                    includeTransitFee ? 'bg-[#E8772E]' : 'bg-[#E4DCCB]'
                  }`}
                >
                  <span
                    className={`inline-block rounded-full h-3.5 w-3.5 transform l bg-white shadow-sm transition-transform duration-200 ${
                      includeTransitFee ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-xs font-semibold text-[#0F2A2E]">
                  Include park transit fee
                </span>
              </div>

              {includeTransitFee && (
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="number"
                    placeholder="Base Rate ($)"
                    value={transitFee}
                    onChange={(e) => setTransitFee(e.target.value)}
                    className="w-28 bg-white border border-[#E4DCCB] px-2.5 py-1.5 text-xs text-[#0F2A2E] font-mono placeholder:text-[#6B6459]/50 focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all"
                  />
                  <select
                    value={transitFeePer}
                    onChange={(e) => setTransitFeePer(e.target.value)}
                    className="bg-white border border-[#E4DCCB] px-2 py-1.5 text-xs text-[#0F2A2E] font-semibold focus:outline-none focus:border-[#E8772E] cursor-pointer transition-all"
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
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] pointer-events-none transition-colors group-focus-within:text-[#E8772E]" />
              <input
                type="text"
                placeholder="e.g. Ngorongoro Crater Floor, Seronera Airstrip..."
                value={mainLocationQuery}
                onChange={(e) => handleLocationInputChange(e.target.value, 'main')}
                className="w-full bg-white border border-[#E4DCCB] pl-10 pr-4 py-2.5 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all"
              />
            </div>

            {activeLocField === 'main' && locationResults.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-1.5 bg-white border border-[#E4DCCB] shadow-[0_12px_32px_-8px_rgba(15,42,46,0.18)] max-h-40 overflow-y-auto custom-scrollbar">
                {locationResults.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => handleSelectLocation(loc, 'main')}
                    className="p-2.5 text-sm text-[#0F2A2E] hover:bg-[#FCE9DA] hover:text-[#B34F12] cursor-pointer transition-colors"
                  >
                    {loc.location_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
 
        {/* 3. MOMENT & OPTIONAL FEES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-[#0F2A2E]/80 mb-1.5 block">
              Time / Moment
            </label>
            <div className="relative">
              <select
                value={moment}
                onChange={(e) => setMoment(e.target.value)}
                className="w-full bg-white border border-[#E4DCCB] px-3 py-2.5 text-sm text-[#0F2A2E] font-medium focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 cursor-pointer transition-all appearance-none pr-9"
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
              <label className="text-xs font-semibold uppercase tracking-widest text-[#0F2A2E]/80 block">
                Optional activity?
              </label>
              <button
                type="button"
                onClick={() => setIsOptional(!isOptional)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] ${
                  isOptional ? 'bg-[#E8772E]' : 'bg-[#E4DCCB]'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    isOptional ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {isOptional ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Base Price ($)"
                  value={optionalPrice}
                  onChange={(e) => setOptionalPrice(e.target.value)}
                  className="w-1/2 bg-white border border-[#E4DCCB] px-3 py-2 text-sm text-[#0F2A2E] font-mono placeholder:text-[#6B6459]/50 focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all"
                />
                <select
                  value={pricePer}
                  onChange={(e) => setPricePer(e.target.value)}
                  className="w-1/2 bg-white border border-[#E4DCCB] px-2 py-2 text-sm text-[#0F2A2E] font-semibold focus:outline-none focus:border-[#E8772E] cursor-pointer transition-all"
                >
                  <option value="PerPersonal">Per Person</option>
                  <option value="PerGroup">Per Group</option>
                  <option value="PerVehicle">Per Vehicle</option>
                </select>
              </div>
            ) : (
              <div className="text-[11px] font-semibold text-[#1E5A3B] py-2.5 px-3 flex items-center gap-2 bg-[#E3F1E8] border border-[#1E5A3B]/20" >
                <Check className="w-3.5 h-3.5" /> Included in base itinerary
              </div>
            )}
          </div>
        </div>

        {/* ADD TO LIST BUTTON */}
        <button
          type="button"
          onClick={handleAddActivity}
          className="w-full py-3 bg-[#E8772E] text-[#0F2A2E] font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer
                     hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/25
                     hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                     active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
        >
          <Plus className="w-4 h-4" /> Add activity to day {dayIndex}
        </button>

        {/* --- STAGED ACTIVITIES DRAFT LIST --- */}
        {stagedActivities.length > 0 && (
          <div className="pt-3 border-t border-[#E4DCCB] space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#6B6459] block">
              Staged activities ({stagedActivities.length})
            </span>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {stagedActivities.map((act) => (
                <div
                  key={act.temp_id}
                  className="p-3 bg-white border border-[#E4DCCB] flex items-start justify-between text-xs group hover:border-[#E8772E]/40 transition-colors"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="font-bold text-[#0F2A2E] flex items-center gap-2 flex-wrap">
                      <span className="truncate">{act.activity_type_title}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-[#F6F1E7] text-[#6B6459] px-2 py-0.5 border border-[#E4DCCB]">
                        {act.moment.replace("_", " ")}
                      </span>
                      {act.is_optional && (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-[#FDF4DD] text-[#7A4E08] px-2 py-0.5 border border-[#F2B544]/30">
                          Optional
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#6B6459] flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#E8772E] shrink-0" />
                      {act.involve_transport ? (
                        <span className="truncate">
                          {act.start_location_name} ➔ {act.via_location_name ? `${act.via_location_name} ➔ ` : ''}{act.end_location_name}
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

                  <button
                    type="button"
                    onClick={() => handleRemoveActivity(act.temp_id)}
                    className="text-[#6B6459]/60 hover:text-[#8E2A1F] hover:bg-[#FBE5E2] transition-colors p-2 rounded-lg shrink-0 ml-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                    title="Remove activity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL FOOTER --- */}
      <div className="p-4 border-t border-[#E4DCCB] bg-[#F6F1E7]/50 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 text-xs font-semibold text-[#0F2A2E] bg-white border border-[#E4DCCB] hover:bg-[#F6F1E7] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveAndClose}
          className="px-5 py-2.5 text-xs font-bold text-[#0F2A2E] bg-[#E8772E] flex items-center gap-1.5 cursor-pointer transition-all
                     hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/25
                     hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                     active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
        >
          <Check className="w-4 h-4" /> Save & close draft
        </button>
      </div>

      {/* Custom scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e4dccb;
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d4c9b0;
        }
      `}</style>
    </div>
  </div>
);
}