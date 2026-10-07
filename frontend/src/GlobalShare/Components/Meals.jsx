import { useEffect, useState, useRef } from "react";
import api from "../../Apis/api";
import { toast } from "sonner";
import { Search, X, Plus, Trash2, Utensils, Check, Sparkles, DollarSign } from "lucide-react";

export default function OptionalMealComponentGlobal({
  isOpen,
  onClose,
  dayIndex = 1,
  initialMeals = [],
  onSaveMeals
}) {
  if (!isOpen) return null;

  const STORAGE_KEY = `day_${dayIndex}_optional_meals_draft`;

  // --- STATES ---
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mealLoad, setMealLoad] = useState(false);
  const [mealData, setMealData] = useState([]);

  const [isOptional, setIsOptional] = useState(true);
  const [mealPrice, setMealPrice] = useState("");

  const [draftMealList, setDraftMealList] = useState(initialMeals);

  // --- REFS ---
  const justSelectedRef = useRef(false); // ✅ NEW — guard for "this searchQuery change came from a selection"

  // 1. Soma LocalStorage wakati Modal inapofunguka
  useEffect(() => {
    if (isOpen) {
      setDraftMealList(initialMeals);
      localStorage.removeItem(STORAGE_KEY);
      
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
      const resp = await api.get(
        `meals/live/search/optional/meal/?search=${encodeURIComponent(searchQuery)}`
      );
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
    // ✅ NEW — skip if this searchQuery change came from a selection
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }

    // ✅ NEW — don't search if a meal is already selected
    if (selectedMealPlan) return;

    const timer = setTimeout(() => {
      fetchOptionalMeal();
    }, 300);

    return () => clearTimeout(timer); 
  }, [searchQuery, selectedMealPlan]);

  const handleClearSearch = () => {
    justSelectedRef.current = false; // ✅ reset guard
    setSearchQuery("");
    setSelectedMealPlan(null);
    setMealData([]);
  };

  const handleSelectMeal = (item) => {
    justSelectedRef.current = true; // ✅ flag BEFORE setSearchQuery so effect skips
    setSelectedMealPlan(item);
    setSearchQuery(item.name);
    setMealData([]);
  };

  // 3. ONGEZA MEAL KWENYE DRAFT
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

    toast.success(`${newMealEntry.meal_name} added to draft!`);

    // Reset form
    justSelectedRef.current = false;
    setSearchQuery("");
    setSelectedMealPlan(null);
    setMealPrice("");
    setIsOptional(true);
    setMealData([]);
  };

  // 4. DELETE MEAL
  const handleDeleteMeal = (tempId) => {
    const updated = draftMealList.filter((item) => item.temp_id !== tempId);
    setDraftMealList(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    toast.info("Meal removed from draft.");
  };

  // 5. SAVE & CLOSE
  const handleSaveAndClose = () => {
    if (onSaveMeals) {
      onSaveMeals(draftMealList);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F2A2E]/75 backdrop-blur-md p-4 transition-all">
      <div className="bg-white border border-[#E4DCCB] w-full max-w-2xl shadow-[0_20px_60px_-15px_rgba(15,42,46,0.3)] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

        {/* MODAL HEADER */}
        <div className="p-5 border-b border-[#E4DCCB] flex items-center justify-between bg-[#F6F1E7]/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FCE9DA] border border-[#E8772E]/20 flex items-center justify-center text-[#B34F12]">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2A2E] flex items-center gap-2">
                Day {dayIndex} — Meal plans & optionals
              </h2>
              <p className="text-xs text-[#6B6459]">
                Search and attach custom or optional meals for this day.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#6B6459] hover:text-[#0F2A2E] hover:bg-[#F6F1E7] rounded-xl transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">

          {/* SEARCH & SELECT SECTION */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-widest block">
              Search meal plan
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B6459] transition-colors group-focus-within:text-[#E8772E]">
                <Search className="w-4 h-4" />
              </div>
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedMealPlan) {
                    setSelectedMealPlan(null);
                    justSelectedRef.current = false;
                  }
                }}
                onFocus={() => {
                  if (!selectedMealPlan && searchQuery.trim().length >= 2 && mealData.length > 0) {
                    // optional: reopen on focus if results are cached
                  }
                }}
                type="text"
                placeholder="e.g. Bush Dinner, Hot Lunch, Sunset Cocktail..."
                className={`w-full pl-10 pr-10 py-3 bg-white border text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 focus:outline-none focus:ring-2 transition-all ${
                  selectedMealPlan
                    ? "border-[#1E5A3B] focus:ring-[#1E5A3B]/20"
                    : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-[#E8772E]/20"
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6B6459] hover:text-[#0F2A2E] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* LIVE SEARCH RESULTS DROPDOWN */}
              {mealLoad && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white border border-[#E4DCCB] rounded-2xl z-20 text-xs text-[#6B6459] shadow-[0_12px_32px_-8px_rgba(15,42,46,0.18)]">
                  Searching meals...
                </div>
              )}

              {!mealLoad && !selectedMealPlan && mealData.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E4DCCB] z-20 max-h-48 overflow-y-auto shadow-[0_12px_32px_-8px_rgba(15,42,46,0.18)] divide-y divide-[#E4DCCB]/60 custom-scrollbar">
                  {mealData.map((data) => (
                    <div
                      key={data.id}
                      onClick={() => handleSelectMeal(data)}
                      className="p-3 hover:bg-[#FCE9DA] text-sm text-[#0F2A2E] cursor-pointer transition-colors flex items-center justify-between group/item"
                    >
                      <span className="font-semibold">{data.name}</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#E8772E] opacity-60 group-hover/item:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* TOGGLE & PRICE CONTROLS */}
          <div className="p-4 bg-[#F6F1E7]/60 border border-[#E4DCCB] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              {/* TOGGLE IS_OPTIONAL */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsOptional(!isOptional)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] ${
                    isOptional ? "bg-[#E8772E]" : "bg-[#E4DCCB]"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      isOptional ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <div>
                  <span className="text-xs font-bold text-[#0F2A2E] block">
                    {isOptional ? "Optional meal (extra pay)" : "Standard meal (included)"}
                  </span>
                  <span className="text-[11px] text-[#6B6459]">
                    {isOptional ? "Client will be charged extra" : "Included in base itinerary package"}
                  </span>
                </div>
              </div>

              {/* INPUT PRICE (IF OPTIONAL) */}
              {isOptional && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-[#6B6459] whitespace-nowrap">
                    Price (USD):
                  </label>
                  <div className="relative w-32">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#6B6459]">
                      <DollarSign className="w-3 h-3" />
                    </div>
                    <input
                      value={mealPrice}
                      onChange={(e) => setMealPrice(e.target.value)}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-6 pr-3 py-1.5 bg-white border border-[#E4DCCB] text-xs text-[#0F2A2E] placeholder:text-[#6B6459]/50 focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ADD BUTTON */}
            <div className="pt-3 flex justify-end border-t border-[#E4DCCB]">
              <button
                type="button"
                onClick={handleAddOtherMeal}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#E8772E] text-[#0F2A2E] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer
                           hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/25
                           hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                           active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
              >
                <Plus className="w-4 h-4" />
                Add meal to list
              </button>
            </div>
          </div>

          {/* DRAFT MEALS LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#6B6459] uppercase tracking-widest">
                Added meals for day {dayIndex} ({draftMealList.length})
              </label>
            </div>

            {draftMealList.length > 0 ? (
              <div className="space-y-2">
                {draftMealList.map((item) => (
                  <div
                    key={item.temp_id}
                    className="p-3 bg-white border border-[#E4DCCB] flex items-center justify-between text-xs hover:border-[#E8772E]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#FCE9DA] flex items-center justify-center shrink-0">
                        <Utensils className="w-4 h-4 text-[#B34F12]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#0F2A2E] truncate">
                          {item.meal_name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                              item.is_optional
                                ? "bg-[#FDF4DD] text-[#7A4E08] border border-[#F2B544]/30"
                                : "bg-[#E3F1E8] text-[#1E5A3B] border border-[#1E5A3B]/20"
                            }`}
                          >
                            {item.is_optional ? "Optional" : "Included"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {item.is_optional && (
                        <span className="font-mono text-xs font-bold text-[#1E5A3B]">
                          +${item.price}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteMeal(item.temp_id)}
                        className="text-[#6B6459]/60 hover:text-[#8E2A1F] hover:bg-[#FBE5E2] p-2  transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                        title="Remove meal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-[#E4DCCB] bg-[#F6F1E7]/40 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-white border border-[#E4DCCB] flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-[#6B6459]" />
                </div>
                <p className="text-xs text-[#6B6459]">
                  No meals added to day {dayIndex} draft yet.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-[#E4DCCB] bg-[#F6F1E7]/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#E4DCCB] hover:bg-[#F6F1E7] text-[#0F2A2E] text-xs font-semibold transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="px-5 py-2.5 bg-[#E8772E] text-[#0F2A2E] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer
                       hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/25
                       hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                       active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
          >
            <Check className="w-4 h-4" />
            Save & close
          </button>
        </div> 

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
  );
}

