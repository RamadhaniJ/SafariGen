import { useState, useEffect, useCallback, useRef } from "react";
import api from "../../Apis/api";
import { toast } from "sonner";
import { 
  Search, X, Plus, Trash2, Clock, MapPin, Bus, 
  DollarSign, ShieldAlert, Check, Loader2, Sparkles 
} from "lucide-react";

export default function ActivitiesPopUpComponent({ 
  isOpen, 
  onClose, 
  dayIndex = 1, 
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

  const [stagedActivities, setStagedActivities] = useState([]);
  const STORAGE_KEY = `day_${dayIndex}_activities_draft`;
  
  // Ref for debouncing location search
  const locationSearchTimeoutRef = useRef(null);

  // ==========================================
  // 1. LOCAL STORAGE SYNC
  // ==========================================
  useEffect(() => {
    if (isOpen) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* --- MODAL HEADER --- */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Day {dayIndex} Activities</h3>
              <p className="text-xs text-slate-400">Add transfers, game drives & optional excursions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- MODAL BODY --- */}
        <div className="p-5 space-y-5 overflow-y-auto">
          
          {/* 1. PICK ACTIVITY TYPE */}
          <div className="relative">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Activity Type</label>
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search activity (e.g. Game Drive, Transfer)..."
                value={activityTypeQuery}
                onChange={(e) => {
                  setActivityTypeQuery(e.target.value);
                  if (selectedActivityType) setSelectedActivityType(null);
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {isTypesLoading && <Loader2 className="absolute right-3 w-4 h-4 text-indigo-400 animate-spin" />}
            </div>

            {isTypesDropdownOpen && activityTypesData.length > 0 && (
              <div className="absolute z-30 left-0 right-0 mt-1 bg-slate-900 border border-slate-800 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-800/60">
                {activityTypesData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectType(item)}
                    className="p-3 cursor-pointer text-xs hover:bg-slate-800/60 flex items-center justify-between text-slate-200"
                  >
                    <span className="font-medium">{item.title}</span>
                    {item.involve_transport && (
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 flex items-center gap-1">
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
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <Bus className="w-4 h-4" /> Transport Route Details
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['start', 'via', 'end'].map((field) => (
                  <div key={field} className="relative">
                    <label className="text-[11px] text-slate-400 mb-1 block capitalize">{field === 'via' ? 'Via (Optional)' : `To (${field === 'start' ? 'Start' : 'Destination'})`}</label>
                    <input
                      type="text"
                      placeholder={field === 'start' ? "e.g. Arusha" : field === 'via' ? "e.g. Karatu" : "e.g. Serengeti"}
                      value={field === 'start' ? startLocQuery : field === 'via' ? viaLocQuery : endLocQuery}
                      onChange={(e) => handleLocationInputChange(e.target.value, field)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    {activeLocField === field && locationResults.length > 0 && (
                      <div className="absolute z-20 left-0 right-0 mt-1 bg-slate-900 border border-slate-800 rounded-lg shadow-lg max-h-36 overflow-y-auto">
                        {locationResults.map((loc) => (
                          <div key={loc.id} onClick={() => handleSelectLocation(loc, field)} className="p-2 text-xs text-slate-200 hover:bg-slate-800 cursor-pointer">
                            {loc.location_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Transit Fee Toggle */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIncludeTransitFee(!includeTransitFee)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${includeTransitFee ? 'bg-indigo-600' : 'bg-slate-800'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${includeTransitFee ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-xs text-slate-300">Include Park Transit Fee</span>
                </div>

                {includeTransitFee && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="number"
                      placeholder="Base Rate ($)"
                      value={transitFee}
                      onChange={(e) => setTransitFee(e.target.value)}
                      className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <select 
                      value={transitFeePer} 
                      onChange={(e) => setTransitFeePer(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Pax">Per Pax</option>
                      <option value="Group">Per Group</option>
                      <option value="Vehicle">Per Vehicle</option>
                    </select>
                    <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded">
                      * Multiplied by pax/vehicles later
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Activity Location / Spot</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Ngorongoro Crater Floor, Seronera Airstrip..."
                  value={mainLocationQuery}
                  onChange={(e) => handleLocationInputChange(e.target.value, 'main')}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {activeLocField === 'main' && locationResults.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-slate-900 border border-slate-800 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                  {locationResults.map((loc) => (
                    <div key={loc.id} onClick={() => handleSelectLocation(loc, 'main')} className="p-2.5 text-xs text-slate-200 hover:bg-slate-800 cursor-pointer">
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
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">Time / Moment</label>
              <select
                value={moment}
                onChange={(e) => setMoment(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="1_MORNING">Morning Excursion</option>
                <option value="2_AFTERNOON">Afternoon Excursion</option>
                <option value="3_EVENING">Evening / Sundowner</option>
                <option value="4_NIGHT">Night Safari</option>
                <option value="5_FULL_DAY">Full Day Activity</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Optional Activity?</label>
                <button
                  type="button"
                  onClick={() => setIsOptional(!isOptional)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${isOptional ? 'bg-indigo-600' : 'bg-slate-800'}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${isOptional ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>

              {isOptional ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Base Price ($)"
                    value={optionalPrice}
                    onChange={(e) => setOptionalPrice(e.target.value)}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value={pricePer}
                    onChange={(e) => setPricePer(e.target.value)}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="PerPersonal">Per Person</option>
                    <option value="PerGroup">Per Group</option>
                    <option value="PerVehicle">Per Vehicle</option>
                  </select>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 py-2 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500" /> Included in base itinerary
                </div>
              )}
            </div>
          </div>

          {/* ADD TO LIST BUTTON */}
          <button
            type="button"
            onClick={handleAddActivity}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-indigo-400" /> Add Activity to Day {dayIndex}
          </button>

          {/* --- STAGED ACTIVITIES DRAFT LIST --- */}
          {stagedActivities.length > 0 && (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Staged Activities ({stagedActivities.length})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {stagedActivities.map((act) => (
                  <div key={act.temp_id} className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl flex items-start justify-between text-xs group hover:border-slate-600 transition-colors">
                    <div className="space-y-1 flex-1">
                      <div className="font-semibold text-slate-200 flex items-center gap-2 flex-wrap">
                        <span>{act.activity_type_title}</span>
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                          {act.moment.replace("_", " ")}
                        </span>
                        {act.is_optional && (
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                            Optional
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                        {act.involve_transport ? (
                          <span className="truncate">
                            {act.start_location_name} ➔ {act.via_location_name ? `${act.via_location_name} ➔ ` : ''}{act.end_location_name}
                          </span>
                        ) : (
                          <span className="truncate">{act.main_location_name || "Location set"}</span>
                        )}
                      </div>
                      {(act.transit_fee_included || act.is_optional) && (
                        <div className="text-[10px] text-emerald-400 font-mono mt-1">
                          {act.transit_fee_included && `Transit: $${act.transit_fee}/${act.transit_fee_per} `}
                          {act.is_optional && `| Optional: $${act.optional_activity_price}/${act.price_per}`}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveActivity(act.temp_id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10 shrink-0"
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
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" /> Save & Close Draft
          </button>
        </div>
      </div>
    </div>
  );
}