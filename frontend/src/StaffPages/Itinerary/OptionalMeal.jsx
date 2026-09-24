import { useEffect, useState } from "react";
import api from "../../Apis/api";
import { toast } from "sonner";
import { Search, X, Plus, Trash2, Utensils, Check, Sparkles, DollarSign } from "lucide-react";

export default function OptionalMealComponentPopUp({
  isOpen,
  onClose,
  dayIndex = 1,
  onSaveMeals
}) {
  if (!isOpen) return null;

  const STORAGE_KEY = `day_${dayIndex}_optional_meals_draft`;

  // --- STATES ---
  const [selectedMealPlan, setSelectedMealPlan] = useState(null); // { id, name }
  const [searchQuery, setSearchQuery] = useState("");
  const [mealLoad, setMealLoad] = useState(false);
  const [mealData, setMealData] = useState([]);

  const [isOptional, setIsOptional] = useState(true);
  const [mealPrice, setMealPrice] = useState("");

  // Orodha ya meals zilizohifadhiwa kwa siku hii (Draft)
  const [draftMealList, setDraftMealList] = useState([]);

  // 1. Soma LocalStorage wakati Modal inapofunguka
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setDraftMealList(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing meal draft", e);
        }
      }
    }
  }, [isOpen, STORAGE_KEY]);

  // 2. Fetch Meals kutoka Backend (Search API)
  const fetchOptionalMeal = async () => {
    if (searchQuery.trim() === "") {
      setMealData([]);
      return;
    }

    setMealLoad(true);
    try {
      // Tunatuma search query parameter kwenye API yako
      const resp = await api.get(`meals/live/search/optional/meal/?search=${encodeURIComponent(searchQuery)}`);
      setMealData(resp.data);
    } catch (error) {
      const errorMsg = error.response?.data?.detail?.message || "Something went wrong fetching meals";
      toast.error(errorMsg);
    } finally {
      setMealLoad(false);
    }
  };

  // Debounce effect kwa ajili ya live search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOptionalMeal();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedMealPlan(null);
    setMealData([]);
  };

  // On Select Meal kutoka Dropdown Results
  const handleSelectMeal = (item) => {
    setSelectedMealPlan(item);
    setSearchQuery(item.name);
    setMealData([]); // Funga dropdown result list
  };

  // 3. ONGEZA MEAL KWENYE DRAFT (LOCAL STORAGE)
  const handleAddOtherMeal = () => {
    if (!selectedMealPlan && !searchQuery.trim()) {
      toast.error("Please select or enter a meal name.");
      return;
    }

    if (isOptional && (!mealPrice || parseFloat(mealPrice) < 0)) {
      toast.error("Please enter a valid price for the optional meal.");
      return;
    }

    const newMealEntry = {
      temp_id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      meal_id: selectedMealPlan ? selectedMealPlan.id : null,
      meal_name: selectedMealPlan ? selectedMealPlan.name : searchQuery.trim(),
      is_optional: isOptional,
      price: isOptional ? parseFloat(mealPrice).toFixed(2) : "0.00"
    };

    const updatedList = [...draftMealList, newMealEntry];
    setDraftMealList(updatedList);

    // Save mara moja kwenye LocalStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

    toast.success(`${newMealEntry.meal_name} added to draft!`);

    // Clear Form inputs
    setSearchQuery("");
    setSelectedMealPlan(null);
    setMealPrice("");
    setIsOptional(true);
  };

  // 4. DELETE MEAL FROM LOCAL STORAGE
  const handleDeleteMeal = (tempId) => {
    const updated = draftMealList.filter((item) => item.temp_id !== tempId);
    setDraftMealList(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    toast.info("Meal removed from draft.");
  };

  // 5. SAVE & CLOSE MODAL
  const handleSaveAndClose = () => {
    if (onSaveMeals) {
      onSaveMeals(draftMealList);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 transition-all">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Day {dayIndex} - Meal Plans & Optionals
              </h2>
              <p className="text-xs text-slate-400">Search and attach custom or optional meals for this day.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* SEARCH & SELECT SECTION */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Search Meal Plan
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedMealPlan) setSelectedMealPlan(null);
                }}
                type="text"
                placeholder="e.g. Bush Dinner, Hot Lunch, Sunset Cocktail..."
                className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* LIVE SEARCH RESULTS DROPDOWN */}
              {mealLoad && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-slate-900 border border-slate-800 rounded-2xl z-20 text-xs text-slate-400">
                  Searching meals...
                </div>
              )}

              {!mealLoad && mealData.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl z-20 max-h-48 overflow-y-auto shadow-xl divide-y divide-slate-800/50">
                  {mealData.map((data) => (
                    <div
                      key={data.id}
                      onClick={() => handleSelectMeal(data)}
                      className="p-3 hover:bg-indigo-600/10 hover:text-indigo-300 text-xs text-slate-200 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium">{data.name}</span>
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 opacity-60" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* TOGGLE & PRICE CONTROLS */}
          <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* TOGGLE IS_OPTIONAL */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsOptional(!isOptional)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    isOptional ? "bg-indigo-600" : "bg-slate-800"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      isOptional ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">
                    {isOptional ? "Optional Meal (Extra Pay)" : "Standard Meal (Included)"}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {isOptional ? "Client will be charged extra" : "Included in base itinerary package"}
                  </span>
                </div>
              </div>

              {/* INPUT PRICE (IF OPTIONAL) */}
              {isOptional && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 whitespace-nowrap">Price (USD):</label>
                  <div className="relative w-32">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500 text-xs">
                      $
                    </div>
                    <input
                      value={mealPrice}
                      onChange={(e) => setMealPrice(e.target.value)}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-6 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ADD BUTTON */}
            <div className="pt-2 flex justify-end border-t border-slate-800/60">
              <button
                type="button"
                onClick={handleAddOtherMeal}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" />
                Add Meal to List
              </button>
            </div>
          </div>

          {/* DRAFT MEALS LIST (WHAT HAS BEEN ADDED) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Added Meals for Day {dayIndex} ({draftMealList.length})
              </label>
            </div>

            {draftMealList.length > 0 ? (
              <div className="space-y-2">
                {draftMealList.map((item) => (
                  <div
                    key={item.temp_id}
                    className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800 rounded-xl text-indigo-400">
                        <Utensils className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200">{item.meal_name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                              item.is_optional
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            {item.is_optional ? "Optional" : "Included"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {item.is_optional && (
                        <span className="font-mono text-xs font-bold text-emerald-400">
                          +${item.price}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteMeal(item.temp_id)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                        title="Remove meal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-dashed border-slate-800 text-center space-y-1">
                <Utensils className="w-6 h-6 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500">No meals added to Day {dayIndex} draft yet.</p>
              </div>
            )}
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            <Check className="w-4 h-4" />
            Save & Close
          </button>
        </div>

      </div>
    </div>
  );
}