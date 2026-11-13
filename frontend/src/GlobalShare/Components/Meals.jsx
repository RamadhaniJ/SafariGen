import { useEffect, useState, useRef, useCallback } from "react";
import api from "../../Apis/api";
import { toast } from "react-toastify";
import {
  Search, X, Plus, Trash2, Utensils, Check, Sparkles,
  DollarSign, Pencil, XCircle
} from "lucide-react";

export default function OptionalMealComponentGlobal({
  isOpen,
  onClose,
  dayIndex = 1,
  dayId,                                   
  initialMeals = [],
  onSaveMeals,
}) {
  if (!isOpen) return null;

  const STORAGE_KEY = `optional_meals_draft_${dayId || `day_${dayIndex}`}`;

  // --- STATES ---
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mealLoad, setMealLoad] = useState(false);
  const [mealData, setMealData] = useState([]);

  const [isOptional, setIsOptional] = useState(true);
  const [mealPrice, setMealPrice] = useState("");

  const [draftMealList, setDraftMealList] = useState(initialMeals || []);
  const [editingTempId, setEditingTempId] = useState(null); // NEW

  // --- REFS ---
  const justSelectedRef = useRef(false);
  const hydratedRef = useRef(false); // NEW — prevents re-hydration on every parent render

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

    // Read draft FIRST — don't delete before reading
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setDraftMealList(parsed);
          return;
        }
      } catch (e) {
        console.error("Error parsing meal draft", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    // Fallback to parent-supplied list
    setDraftMealList(initialMeals || []);
  }, [isOpen, STORAGE_KEY, initialMeals]);

  const updateLocalStorage = (newList) => {
    setDraftMealList(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  // ==========================================
  // 2. SEARCH MEALS
  // ==========================================
  const fetchOptionalMeal = useCallback(async () => {
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
      const errorMsg = error.response?.data;
      if (errorMsg?.detail){
        toast.error(errorMsg?.detail)
      }else if (errorMsg && typeof errorMsg === "object"){
        Object.entries(errorMsg).forEach(([val, msg])=>{
          const text = Array.isArray(msg) ? msg.join(", ") : String(msg);
          toast.error(`${val} : ${text}`);
        })
      }else{
          toast.error("Search failed. Please try again.");
      }
    } finally {
      setMealLoad(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }
    if (selectedMealPlan) return;
    if (editingTempId) return; // don't search while editing

    const timer = setTimeout(() => {
      fetchOptionalMeal();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedMealPlan, editingTempId, fetchOptionalMeal]);

  // ==========================================
  // 3. RESET / EDIT / SELECT
  // ==========================================
  const resetForm = useCallback(() => {
    justSelectedRef.current = false;
    setSelectedMealPlan(null);
    setSearchQuery("");
    setIsOptional(true);
    setMealPrice("");
    setMealData([]);
    setEditingTempId(null);
  }, []);

  const handleClearSearch = () => resetForm();

  const handleSelectMeal = (item) => {
    justSelectedRef.current = true;
    setSelectedMealPlan(item);
    setSearchQuery(item.name);
    setMealData([]);
  };

  const handleEditMeal = (meal) => {
    setEditingTempId(meal.temp_id);
    justSelectedRef.current = true;

    if (meal.meal_id) {
      // We only stored id + name — reconstruct minimal object
      setSelectedMealPlan({ id: meal.meal_id, name: meal.meal_name });
    } else {
      setSelectedMealPlan(null);
    }
    setSearchQuery(meal.meal_name || "");
    setIsOptional(!!meal.is_optional);
    setMealPrice(meal.is_optional ? String(meal.price ?? "") : "");
    setMealData([]);
  };

  const handleCancelEdit = () => resetForm();

  // ==========================================
  // 4. ADD OR UPDATE
  // ==========================================
  const handleAddOrUpdateMeal = () => {
    if (!selectedMealPlan && !searchQuery.trim()) {
      toast.error("Please select or enter a meal name.");
      return;
    }
    if (isOptional && (!mealPrice || parseFloat(mealPrice) < 0)) {
      toast.error("Please enter a valid price for the optional meal.");
      return;
    }

    const data = {
      meal_id: selectedMealPlan ? selectedMealPlan.id : null,
      meal_name: selectedMealPlan ? selectedMealPlan.name : searchQuery.trim(),
      is_optional: isOptional,
      price: isOptional ? parseFloat(mealPrice).toFixed(2) : "0.00",
    };

    let updatedList;
    if (editingTempId) {
      updatedList = draftMealList.map((m) =>
        m.temp_id === editingTempId ? { ...data, temp_id: editingTempId } : m
      );
      toast.success("Meal updated!");
    } else {
      updatedList = [
        ...draftMealList,
        {
          ...data,
          temp_id: `meal_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        },
      ];
      toast.success(`${data.meal_name} added to draft!`);
    }

    updateLocalStorage(updatedList);
    resetForm();
  };

  // ==========================================
  // 5. DELETE & SAVE
  // ==========================================
  const handleDeleteMeal = (tempId) => {
    const updated = draftMealList.filter((m) => m.temp_id !== tempId);
    updateLocalStorage(updated);
    if (editingTempId === tempId) resetForm();
    toast.info("Meal removed from draft.");
  };

  const handleSaveAndClose = () => {
    if (onSaveMeals) onSaveMeals(draftMealList);
    toast.success(`Saved ${draftMealList.length} meals for Day ${dayIndex}`);
    localStorage.removeItem(STORAGE_KEY);
    onClose();
  };

  // ==========================================
  // 6. RENDER
  // ==========================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F2A2E]/75 backdrop-blur-md p-4">
      <div className="bg-white border border-[#E4DCCB] w-full max-w-2xl shadow-[0_20px_60px_-15px_rgba(15,42,46,0.3)] overflow-hidden flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="p-5 border-b border-[#E4DCCB] flex items-center justify-between bg-[#F6F1E7]/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FCE9DA] border border-[#E8772E]/20 flex items-center justify-center text-[#B34F12]">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2A2E]">
                Day {dayIndex} — Meal plans & optionals
              </h2>
              <p className="text-xs text-[#6B6459]">
                {editingTempId
                  ? "Editing a meal — update or cancel"
                  : "Search and attach custom or optional meals for this day."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#6B6459] hover:text-[#0F2A2E] hover:bg-[#F6F1E7] rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* EDITING BANNER */}
        {editingTempId && (
          <div className="px-5 py-2.5 bg-[#FDF4DD] border-b border-[#F2B544]/40 flex items-center justify-between text-xs">
            <span className="font-semibold text-[#7A4E08] flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5" /> Editing mode — changes will update the staged meal
            </span>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="font-bold text-[#8E2A1F] hover:underline flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" /> Cancel
            </button>
          </div>
        )}

        {/* BODY */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">

          {/* SEARCH & SELECT */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-widest block">
              Search meal plan
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B6459]">
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
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6B6459] hover:text-[#0F2A2E]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {mealLoad && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white border border-[#E4DCCB] rounded-2xl z-20 text-xs text-[#6B6459] shadow-lg">
                  Searching meals...
                </div>
              )}

              {!mealLoad && !selectedMealPlan && !editingTempId && mealData.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E4DCCB] z-20 max-h-48 overflow-y-auto shadow-lg divide-y divide-[#E4DCCB]/60">
                  {mealData.map((data) => (
                    <div
                      key={data.id}
                      onClick={() => handleSelectMeal(data)}
                      className="p-3 hover:bg-[#FCE9DA] text-sm text-[#0F2A2E] cursor-pointer flex items-center justify-between"
                    >
                      <span className="font-semibold">{data.name}</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#E8772E] opacity-60" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* TOGGLE & PRICE */}
          <div className="p-4 bg-[#F6F1E7]/60 border border-[#E4DCCB] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsOptional(!isOptional)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isOptional ? "bg-[#E8772E]" : "bg-[#E4DCCB]"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
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
                      className="w-full pl-6 pr-3 py-1.5 bg-white border border-[#E4DCCB] text-xs text-[#0F2A2E] focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ADD / UPDATE BUTTON */}
            <div className="pt-3 flex flex-col sm:flex-row justify-end gap-2 border-t border-[#E4DCCB]">
              {editingTempId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#E4DCCB] text-[#0F2A2E] text-xs font-semibold hover:bg-[#F6F1E7]"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleAddOrUpdateMeal}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#E8772E] text-[#0F2A2E] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#D4661F] transition-all shadow-lg shadow-[#E8772E]/25"
              >
                {editingTempId ? (
                  <><Check className="w-4 h-4" /> Update meal</>
                ) : (
                  <><Plus className="w-4 h-4" /> Add meal to list</>
                )}
              </button>
            </div>
          </div>

          {/* DRAFT LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#6B6459] uppercase tracking-widest">
                Added meals for day {dayIndex} ({draftMealList.length})
              </label>
            </div>

            {draftMealList.length > 0 ? (
              <div className="space-y-2">
                {draftMealList.map((item) => {
                  const isBeingEdited = editingTempId === item.temp_id;
                  return (
                    <div
                      key={item.temp_id}
                      className={`p-3 border flex items-center justify-between text-xs transition-colors ${
                        isBeingEdited
                          ? "bg-[#FDF4DD] border-[#F2B544]"
                          : "bg-white border-[#E4DCCB] hover:border-[#E8772E]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#FCE9DA] flex items-center justify-center shrink-0">
                          <Utensils className="w-4 h-4 text-[#B34F12]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#0F2A2E] truncate flex items-center gap-2">
                            {item.meal_name}
                            {isBeingEdited && (
                              <span className="text-[9px] font-bold uppercase tracking-widest bg-[#FCE9DA] text-[#B34F12] px-1.5 py-0.5 border border-[#E8772E]/40">
                                Editing
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${
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

                      <div className="flex items-center gap-2 shrink-0">
                        {item.is_optional && (
                          <span className="font-mono text-xs font-bold text-[#1E5A3B]">
                            +${item.price}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEditMeal(item)}
                          className="text-[#6B6459] hover:text-[#B34F12] hover:bg-[#FCE9DA] p-2 rounded-lg transition-colors"
                          title="Edit meal"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMeal(item.temp_id)}
                          className="text-[#6B6459]/60 hover:text-[#8E2A1F] hover:bg-[#FBE5E2] p-2 rounded-lg transition-colors"
                          title="Remove meal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
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

        {/* FOOTER */}
        <div className="p-4 border-t border-[#E4DCCB] bg-[#F6F1E7]/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#E4DCCB] hover:bg-[#F6F1E7] text-[#0F2A2E] text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="px-5 py-2.5 bg-[#E8772E] text-[#0F2A2E] text-xs font-bold flex items-center gap-2 hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/25"
          >
            <Check className="w-4 h-4" /> Save & close
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e4dccb; border-radius: 999px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4c9b0; }
      `}</style>
    </div>
  );
}
