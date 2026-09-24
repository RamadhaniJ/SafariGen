import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { 
    X, 
    Search, 
    Loader2, 
    Bed, 
    ChevronDown, 
    Trash2, 
    Plus, 
    DollarSign, 
    ShieldAlert, 
    Check, 
    Building2 
} from "lucide-react";
import api from "../../Apis/api";
import { toast } from "sonner";

export default function AccommodationComponentOnly({ clientId, onChangeSelectedData }) {
    // --- State Management ---
    const [accommodationQuery, setAccommodationQuery] = useState("");
    const [accommodationData, setAccommodationData] = useState([]);
    const [selectedAccommodation, setSelectedAccommodation] = useState(null);
    const [isAccLoading, setIsAccLoading] = useState(false);
    
    // Dropdown & Modal Visibility States
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dynamic Draft Rooms State inside Modal
    const [draftRooms, setDraftRooms] = useState([]);
    
    // Confirmed Data State (Saved state after clicking 'Save & Apply')
    const [confirmedData, setConfirmedData] = useState(null);

    const dropdownWrapperRef = useRef(null);

    // ==========================================
    // 1. LIVE SEARCH API CALL (Debounce 300ms)
    // ==========================================
    const liveSearchAccommodation = useCallback(async (queryText) => {
        if (!queryText.trim()) {
            setAccommodationData([]);
            setIsDropdownOpen(false);
            return;
        }

        setIsAccLoading(true);
        try {
            const resp = await api.get(`accommodation/searching/accommodations/`, {
                params: {
                    client_id: clientId || "",
                    search: queryText.trim(),
                }
            });
            const results = resp.data || [];
            setAccommodationData(results);
            setIsDropdownOpen(results.length > 0);
        } catch (error) {
            const errorMsg = error.response?.data?.detail?.message || "Failed to search accommodations";
            toast.error(errorMsg);
            setAccommodationData([]);
        } finally {
            setIsAccLoading(false);
        }
    }, [clientId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (accommodationQuery.trim().length >= 2) {
                liveSearchAccommodation(accommodationQuery);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [accommodationQuery, liveSearchAccommodation]);

    // Close search dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownWrapperRef.current && !dropdownWrapperRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ==========================================
    // 2. SELECTION & ROOM POPULATION LOGIC
    // ==========================================
    const handleSelectAccommodation = (item) => {
        setSelectedAccommodation(item);
        setIsDropdownOpen(false);

        // Prepare Room Defaults
        const availableRates = item.available_room_rates || [];
        const clientDefaults = item.default_client_rooms || [];

        let initialRooms = [];
        if (clientDefaults.length > 0 && availableRates.length > 0) {
            initialRooms = clientDefaults.map((def) => {
                const matchedRate = availableRates.find(
                    (r) => r.room_name.toLowerCase().includes(def.room_label.toLowerCase())
                ) || availableRates[0];

                return {
                    room_type_id: matchedRate.room_type_id,
                    number: def.number || 1
                };
            });
        } else if (availableRates.length > 0) {
            initialRooms = [{ room_type_id: availableRates[0].room_type_id, number: 1 }];
        }

        setDraftRooms(initialRooms);
        setIsModalOpen(true); // Open the Modal immediately
    };

    const handleClear = () => {
        setAccommodationQuery("");
        setSelectedAccommodation(null);
        setAccommodationData([]);
        setDraftRooms([]);
        setConfirmedData(null);
        setIsDropdownOpen(false);
        setIsModalOpen(false);

        // Reset Parent Component State
        if (onChangeSelectedData) {
            onChangeSelectedData(null);
        }
    };

    // ==========================================
    // 3. ROOM MANAGEMENT HANDLERS (Inside Modal)
    // ==========================================
    const handleRoomChange = (index, field, value) => {
        const updated = [...draftRooms];
        updated[index][field] = value;
        setDraftRooms(updated);
    };

    const handleAddRoom = () => {
        const availableRates = selectedAccommodation?.available_room_rates || [];
        if (availableRates.length > 0) {
            setDraftRooms([
                ...draftRooms,
                { room_type_id: availableRates[0].room_type_id, number: 1 }
            ]);
        }
    };

    const handleRemoveRoom = (index) => {
        setDraftRooms(draftRooms.filter((_, i) => i !== index));
    };

    // ==========================================
    // 4. DYNAMIC PRICING ENGINE
    // ==========================================
    const pricing = useMemo(() => {
        if (!selectedAccommodation) return { roomTotal: 0, concessionTotal: 0, grandTotal: 0, breakdown: [] };

        const availableRates = selectedAccommodation.available_room_rates || [];
        const concession = selectedAccommodation.calculated_concesion_fee;

        let roomTotal = 0;
        const breakdown = [];

        draftRooms.forEach((r) => {
            const matched = availableRates.find((rate) => rate.room_type_id === r.room_type_id);
            if (matched) {
                const cost = parseFloat(matched.price_per_night || 0) * parseInt(r.number || 0);
                roomTotal += cost;
                breakdown.push({
                    room_name: matched.room_name,
                    meal_plan: matched.meal_plan,
                    price_per_night: matched.price_per_night,
                    quantity: r.number,
                    subtotal: cost
                });
            }
        });

        let concessionTotal = 0;
        if (concession && concession.is_inside_park) {
            concessionTotal = (concession.total_adult_concession || 0) + (concession.total_child_concession || 0);
        }

        return {
            roomTotal,
            concessionTotal,
            grandTotal: roomTotal + concessionTotal,
            breakdown
        };
    }, [selectedAccommodation, draftRooms]);

    // ==========================================
    // 5. SAVE & CONFIRM (Send to Parent Component)
    // ==========================================
    const handleConfirmSelection = () => {
        if (!selectedAccommodation) return;

        setAccommodationQuery(selectedAccommodation.name);

        const payload = {
            // Accommodation details
            accommodation_id: selectedAccommodation.id,
            accommodation_name: selectedAccommodation.name,
            featured_image: selectedAccommodation.featured_image,

            // Destination details (for auto-filling destination component in parent)
            destination_id: selectedAccommodation.destination || null,
            destination_name: selectedAccommodation.destination_name || null,

            // Room selections & pricing summary for Day-by-Day breakdown
            selected_rooms: draftRooms,
            pricing_details: pricing
        };

        setConfirmedData(payload);
        setIsModalOpen(false);

        // Notify parent component
        if (onChangeSelectedData) {
            onChangeSelectedData(payload);
        }

        toast.success(`${selectedAccommodation.name} saved successfully!`);
    };

    const handleCancelModal = () => {
        setIsModalOpen(false);
        // If user didn't have confirmed data previously, clear out current un-saved selection
        if (!confirmedData) {
            setAccommodationQuery("");
            setSelectedAccommodation(null);
            setDraftRooms([]);
        }
    };

    return (
        <div className="w-full space-y-4">
            
            {/* --- ACCOMMODATION SEARCH INPUT & DROPDOWN --- */}
            <div className="relative" ref={dropdownWrapperRef}>
                {/* <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Accommodation
                </label> */}

                <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-24 py-4 text-sm font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="Type to search hotel or lodge..."
                        value={accommodationQuery}
                        onChange={(e) => {
                            setAccommodationQuery(e.target.value);
                            if (confirmedData) setConfirmedData(null);
                        }}
                        onFocus={() => {
                            if (accommodationData.length > 0) setIsDropdownOpen(true);
                        }}
                    />

                    <div className="absolute right-3 flex items-center gap-2">
                        {isAccLoading && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                        {accommodationQuery && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        {confirmedData && (
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded-md border border-indigo-500/30 transition-all"
                            >
                                Edit Rooms
                            </button>
                        )}
                    </div>
                </div>

                {/* SEARCH RESULTS DROPDOWN */}
                {isDropdownOpen && accommodationData.length > 0 && (
                    <div className="absolute z-40 left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-h-64 overflow-y-auto divide-y divide-slate-800/60 backdrop-blur-xl">
                        {accommodationData.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleSelectAccommodation(item)}
                                className="p-3 cursor-pointer text-xs transition-colors flex items-center justify-between hover:bg-slate-800/60"
                            >
                                <div className="flex items-center gap-3">
                                    {item.featured_image ? (
                                        <img src={item.featured_image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-slate-700/50 shrink-0" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 shrink-0">No Img</div>
                                    )}
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-semibold text-slate-200 flex items-center gap-2">
                                            {item.name}
                                            {item.is_sponsored && (
                                                <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/30 font-normal">
                                                    Sponsored
                                                </span>
                                            )}
                                        </span>
                                        <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                            {item.tag_label || "Hotel"}
                                            {item.destination_name && <span>• {item.destination_name}</span>}
                                            {item.park_status === "InsidePark" && (
                                                <span className="text-emerald-400">• Inside Park</span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* ========================================== */}
            {/* --- ACCOMMODATION ROOMS SELECTION MODAL --- */}
            {/* ========================================== */}
            {isModalOpen && selectedAccommodation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                {selectedAccommodation.featured_image && (
                                    <img src={selectedAccommodation.featured_image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                )}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-100">{selectedAccommodation.name}</h3>
                                    <p className="text-xs text-slate-400">{selectedAccommodation.tag_label} {selectedAccommodation.park_status === "InsidePark" && (
                                                <span className="text-emerald-400 font-semibold">• Inside Park</span>
                                            )}
                                     </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleCancelModal}
                                className="p-1.5 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 space-y-4 overflow-y-auto">
                            
                            <div className="flex items-center justify-between pb-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <Bed className="w-4 h-4 text-indigo-400" /> Selected Rooms
                                </label>
                                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                                    {draftRooms.reduce((acc, curr) => acc + Number(curr.number || 0), 0)} Rooms Total
                                </span>
                            </div>

                            {/* Room Rows */}
                            <div className="space-y-3">
                                {draftRooms.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-700 transition-all">
                                        
                                        {/* Room Quantity Dropdown */}
                                        <div className="relative w-28">
                                            <select
                                                value={item.number}
                                                onChange={(e) => handleRoomChange(index, "number", parseInt(e.target.value))}
                                                className="w-full appearance-none bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-7 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                                            >
                                                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                                                    <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                        </div>

                                        {/* Room Type Selector */}
                                        <div className="relative flex-1">
                                            <select
                                                value={item.room_type_id}
                                                onChange={(e) => handleRoomChange(index, "room_type_id", e.target.value)}
                                                className="w-full appearance-none bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-7 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                                            >
                                                {(selectedAccommodation.available_room_rates || []).map((room) => (
                                                    <option key={room.room_type_id} value={room.room_type_id}>
                                                        {room.room_name} (${room.price_per_night}/night - {room.meal_plan})
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                        </div>

                                        {/* Remove Room Button */}
                                        {draftRooms.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveRoom(index)}
                                                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Add Room Button */}
                            <button
                                type="button"
                                onClick={handleAddRoom}
                                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-800/50 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-400 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                            >
                                <Plus size={14} />
                                <span>Add Another Room Type</span>
                            </button>

                            {/* Dynamic Live Pricing Calculation */}
                            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                                {selectedAccommodation.calculated_concesion_fee?.is_inside_park && (
                                    <div className="flex items-center justify-between text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                                        <span className="flex items-center gap-1.5">
                                            <ShieldAlert className="w-4 h-4" /> Park Concession Fee
                                        </span>
                                        <span className="font-mono font-bold">+${pricing.concessionTotal.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                                    <span>Accommodation Base Night Rate:</span>
                                    <span className="font-mono text-slate-200 font-semibold">${pricing.roomTotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                                    <span className="flex items-center gap-1">
                                        <DollarSign className="w-4 h-4" /> Total Night Cost
                                    </span>
                                    <span className="font-mono text-base">${pricing.grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer (Action Buttons) */}
                        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancelModal}
                                className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSelection}
                                className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                            >
                                Save & Apply Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}