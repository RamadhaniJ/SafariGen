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
import { toast } from "react-toastify";

export default function AccommodationComponentGlobal({ 
    clientId,
    initialAccommodation = null,
    initialSelectedRooms = [],
    onChangeSelectedData
 }) {
    // --- State Management ---
    const [accommodationQuery, setAccommodationQuery] = useState( initialAccommodation?.name || "");
    const [accommodationData, setAccommodationData] = useState([]);

    const [selectedAccommodation, setSelectedAccommodation] = useState(initialAccommodation);
    const [isAccLoading, setIsAccLoading] = useState(false);

    // Dropdown & Modal Visibility States
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dynamic Draft Rooms State inside Modal
    const [draftRooms, setDraftRooms] = useState(initialSelectedRooms);

    // Confirmed Data State (Saved state after clicking 'Save & Apply')
    const [confirmedData, setConfirmedData] = useState(()=>{
        if (initialAccommodation){
            return {
                accommodation_id : initialAccommodation.id || initialAccommodation.accommodation_id,
                accommodation_name : initialAccommodation.name,
                selected_rooms : initialSelectedRooms
            };
        }
        return null;
    });

    const dropdownWrapperRef = useRef(null);
    const justSelectedRef = useRef(false);

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
            const errorMsg = error.response?.data;
            if (errorMsg?.detail){
                toast.error(errorMsg?.detail)
            }else if (errorMsg && typeof errorMsg === "object"){
                Object.entries(errorMsg).forEach(([val, msg])=>{
                    const text = Array.isArray(msg) ? msg.join(", ") : String(msg)
                    toast.error(`${val} : ${text}`)
                })
            }else {
               toast.error("Failed to search accommodations");
            }
            setAccommodationData([]);
        } finally {
            setIsAccLoading(false);
        }
    }, [clientId]);

    useEffect(() => {

        if (justSelectedRef.current){
            justSelectedRef.current = false;
            return;
        }

        if (confirmedData) return;

        const timer = setTimeout(() => {
            if (accommodationQuery.trim().length >= 2) {
                liveSearchAccommodation(accommodationQuery);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [accommodationQuery, liveSearchAccommodation, confirmedData]);

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




    // ============================================
    // 1.1 FETCH FULL ROOM RATES 
    // =============================================
    const fetchFullAccommodationDetails = async ()=>{
            setIsAccLoading(true);
            try{
                
                const resp = await api.get(`accommodation/searching/accommodations/`, {
                params: {
                    client_id: clientId || "",
                    search: selectedAccommodation.name || "",
                }
            });

            const results = resp.data || [];
            const fullData = results.find(
                item => item.id === selectedAccommodation.id || item.id === selectedAccommodation.accommodation_id
            );

            if (fullData){
                setSelectedAccommodation(fullData);
            }else{
                    toast.warning("Could not load room details for this accommodation.");
            }

        } catch (error) {
            console.error("Failed to fetch accommodation details", error);
            const errorMsg = error.response?.data;
            if (errorMsg?.detail){
                toast.error(errorMsg?.detail)
            }else if (errorMsg && typeof errorMsg === "object"){
                Object.entries(errorMsg).forEach(([val, msg])=>{
                    const text = Array.isArray(msg) ? msg.join(", ") : String(msg)
                    toast.error(`${val} : ${text}`)
                })
            }else {
                toast.error("Failed to load room options.");
            }
        } finally {
            setIsAccLoading(false);
        }
    };

    useEffect(()=>{

     if (isModalOpen && selectedAccommodation && ! selectedAccommodation.available_room_rates){
             fetchFullAccommodationDetails();
        }

    }, [isModalOpen, selectedAccommodation, clientId]);

    

    // ==========================================
    // 2. SELECTION & ROOM POPULATION LOGIC
    // ==========================================
    const handleSelectAccommodation = (item) => {
        justSelectedRef.current = true;
        setSelectedAccommodation(item);
        setIsDropdownOpen(false);

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
        setIsModalOpen(true);
    };

    const handleClear = () => {
        justSelectedRef.current = false;
        setAccommodationQuery("");
        setSelectedAccommodation(null);
        setAccommodationData([]);
        setDraftRooms([]);
        setConfirmedData(null);
        setIsDropdownOpen(false);
        setIsModalOpen(false);

        if (onChangeSelectedData) {
            onChangeSelectedData(null);
        }
    };

    // ==========================================
    // 3. ROOM MANAGEMENT HANDLERS
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
            const matched = availableRates.find((rate) => String(rate.room_type_id) === String(r.room_type_id));
            if (matched) {
                const price = parseFloat(matched.price_per_night || 0);
                const quantity = parseFloat(r.number || 1);
                
                const cost = price * quantity 
                roomTotal += cost;
                breakdown.push({
                    room_name: matched.room_name,
                    meal_plan: matched.meal_plan,
                    price_per_night: price,
                    quantity: quantity,
                    subtotal: cost
                });
            }
        });

        let concessionTotal = 0;
        if (concession && concession.is_inside_park) {
            concessionTotal = ( parseFloat(concession.total_adult_concession || 0)) + (parseFloat(concession.total_child_concession || 0));
        }

        return {
            roomTotal,
            concessionTotal,
            grandTotal: roomTotal + concessionTotal,
            breakdown
        };
    }, [selectedAccommodation, draftRooms]);

    // ==========================================
    // 5. SAVE & CONFIRM
    // ==========================================
    const handleConfirmSelection = () => {
        if (!selectedAccommodation) return;

        justSelectedRef.current = true;
        setAccommodationQuery(selectedAccommodation.name);

        const payload = {
            accommodation_id: selectedAccommodation.id,
            accommodation_name: selectedAccommodation.name,
            featured_image: selectedAccommodation.featured_image,
            destination_id: selectedAccommodation.destination || null,
            destination_name: selectedAccommodation.destination_name || null,
            selected_rooms: draftRooms,
            pricing_details: pricing
        };

        setConfirmedData(payload);
        setIsModalOpen(false);

        if (onChangeSelectedData) {
            onChangeSelectedData(payload);
        }

        toast.success(`${selectedAccommodation.name} saved successfully!`);
    };

    const handleCancelModal = () => {
        setIsModalOpen(false);
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
                <div className="relative flex items-center group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B6459] transition-colors group-focus-within:text-[#E8772E]">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        className={`w-full bg-white border  pl-10 pr-28 py-3.5 text-sm font-medium text-[#0F2A2E] placeholder:text-[#6B6459]/50 focus:outline-none focus:ring-2 transition-all
                            ${
                                confirmedData
                                    ? "border-[#1E5A3B] focus:ring-[#1E5A3B]/20"
                                    : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-[#E8772E]/20"
                            }`}
                        placeholder="Type to search hotel or lodge..."
                        value={accommodationQuery}
                        onChange={(e) => {
                            setAccommodationQuery(e.target.value);
                            if (confirmedData){ 
                                 setConfirmedData(null);
                                 justSelectedRef.current = false;
                                 }
                        }}
                        onFocus={() => {
                            if ( !confirmedData && accommodationData.length > 0) setIsDropdownOpen(true);
                        }}
                    />

                    <div className="absolute right-3 flex items-center gap-2">
                        {isAccLoading && (
                            <Loader2 className="w-4 h-4 text-[#E8772E] animate-spin" />
                        )}
                        {accommodationQuery && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="p-1.5 rounded-lg text-[#6B6459] hover:text-[#0F2A2E] hover:bg-[#F6F1E7] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        {confirmedData && (
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="text-[11px] font-bold text-[#B34F12] hover:text-[#E8772E] bg-[#FCE9DA] hover:bg-[#F8DAC2] px-3 py-1.5 rounded-sm border border-[#E8772E]/30 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                            >
                                Edit rooms
                            </button>
                        )}
                    </div>
                </div>

                {/* SEARCH RESULTS DROPDOWN */}
                {isDropdownOpen && accommodationData.length > 0 && (
                    <div className="absolute z-40 left-0 right-0 mt-2 bg-white border border-[#E4DCCB] shadow-[0_12px_32px_-8px_rgba(15,42,46,0.18)] max-h-64 overflow-y-auto divide-y divide-[#E4DCCB]/60 custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                        {accommodationData.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleSelectAccommodation(item)}
                                className="p-3 cursor-pointer text-xs transition-colors flex items-center justify-between hover:bg-[#FCE9DA]"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {item.featured_image ? (
                                        <img
                                            src={item.featured_image}
                                            alt={item.name}
                                            className="w-11 h-11 rounded-lg object-cover border border-[#E4DCCB] shrink-0"
                                        />
                                    ) : (
                                        <div className="w-11 h-11 rounded-lg bg-[#F6F1E7] border border-[#E4DCCB] flex items-center justify-center shrink-0">
                                            <Building2 className="w-4 h-4 text-[#6B6459]" />
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className="font-bold text-[#0F2A2E] flex items-center gap-2 truncate">
                                            <span className="truncate">{item.name}</span>
                                        </span>
                                        <span className="text-[11px] text-[#6B6459] flex items-center gap-1.5 truncate">
                                            <span className="font-medium">{item.tag_label || "Hotel"}</span>
                                            {item.destination_name && (
                                                <>
                                                    <span className="text-[#E4DCCB]">•</span>
                                                    <span>{item.destination_name}</span>
                                                </>
                                            )}
                                            {item.park_status === "InsidePark" && (
                                                <>
                                                    <span className="text-[#E4DCCB]">•</span>
                                                    <span className="text-[#1E5A3B] font-semibold">Inside park</span>
                                                </>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A2E]/75 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white border border-[#E4DCCB] w-full max-w-xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(15,42,46,0.3)] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-[#E4DCCB] bg-[#F6F1E7]/50">
                            <div className="flex items-center gap-3 min-w-0">
                                {selectedAccommodation.featured_image ? (
                                    <img
                                        src={selectedAccommodation.featured_image}
                                        alt=""
                                        className="w-11 h-11 rounded-xl object-cover border border-[#E4DCCB] shrink-0"
                                    />
                                ) : (
                                    <div className="w-11 h-11 rounded-xl bg-[#FCE9DA] border border-[#E8772E]/20 flex items-center justify-center shrink-0">
                                        <Building2 className="w-5 h-5 text-[#B34F12]" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <h3 className="text-base font-bold text-[#0F2A2E] truncate">
                                        {selectedAccommodation.name}
                                    </h3>
                                    <p className="text-xs text-[#6B6459] flex items-center gap-1.5 truncate">
                                        <span className="font-medium">{selectedAccommodation.tag_label}</span>
                                        {selectedAccommodation.park_status === "InsidePark" && (
                                            <>
                                                <span className="text-[#E4DCCB]">•</span>
                                                <span className="text-[#1E5A3B] font-semibold">Inside park</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleCancelModal}
                                className="p-2 text-[#6B6459] hover:text-[#0F2A2E] bg-transparent hover:bg-[#F6F1E7] rounded-lg transition-colors shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar">

                            <div className="flex items-center justify-between pb-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-[#6B6459] flex items-center gap-2">
                                    <Bed className="w-4 h-4 text-[#E8772E]" /> Selected rooms
                                </label>
                                <span className="text-xs font-mono font-bold text-[#B34F12] bg-[#FCE9DA] px-2.5 py-1  border border-[#E8772E]/20">
                                    {draftRooms.reduce((acc, curr) => acc + (Number(curr.number || curr.quantity) || 0), 0)} Total
                                </span>
                            </div>

                            {/* Room Rows */}
                            <div className="space-y-3">
                                {isAccLoading ? (
                                        <div className="flex items-center justify-center py-8 text-[#6B6459] text-xs">
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                Loading room options...
                                        </div> 
                                ):(
                                    <>
                                 {draftRooms.map((item, index) => (
                                    <div key={item.room_type_id} className="flex items-center gap-3 p-3  bg-[#F6F1E7]/60 border border-[#E4DCCB] hover:border-[#E4DCCB]/80 transition-all">

                                        {/* Room Quantity Dropdown */}
                                        <div className="relative w-28 shrink-0">
                                            <select
                                                value={item.number || item.quantity || 1}
                                                onChange={(e) => handleRoomChange(index, "number", parseInt(e.target.value))}
                                                className="w-full appearance-none bg-white border border-[#E4DCCB]  pl-3 pr-7 py-2 text-xs font-bold text-[#0F2A2E] focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 cursor-pointer transition-all"
                                            >
                                                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                                                    <option key={num} value={num}>
                                                        {num} Room{num > 1 ? 's' : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B6459] pointer-events-none" />
                                        </div>

                                        {/* Room Type Selector */}
                                        <div className="relative flex-1 min-w-0">
                                            <select
                                                value={item.room_type_id}
                                                onChange={(e) => handleRoomChange(index, "room_type_id", e.target.value)}
                                                className="w-full appearance-none bg-white border border-[#E4DCCB]  pl-3 pr-7 py-2 text-xs font-bold text-[#0F2A2E] focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 cursor-pointer transition-all truncate"
                                            >
                                                {(selectedAccommodation.available_room_rates || []).map((room) => (
                                                    <option key={room.room_type_id} value={room.room_type_id}>
                                                        {room.room_name} (${room.price_per_night}/night — {room.meal_plan})
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B6459] pointer-events-none" />
                                        </div>

                                        {/* Remove Room Button */}
                                        {draftRooms.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveRoom(index)}
                                                className="p-2 text-[#6B6459]/60 hover:text-[#8E2A1F] hover:bg-[#FBE5E2]  transition-colors shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                              </>
                            )}
                            </div>

                            {/* Add Room Button */}
                            <button
                                type="button"
                                onClick={handleAddRoom}
                                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-[#F6F1E7] hover:bg-[#FCE9DA] border border-dashed border-[#E4DCCB] hover:border-[#E8772E]/40 text-[#6B6459] hover:text-[#B34F12] text-xs font-bold  transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                            >
                                <Plus size={14} />
                                <span>Add another room type</span>
                            </button>

                            {/* Dynamic Live Pricing Calculation */}
                            <div className="mt-4 pt-4 border-t border-[#E4DCCB] space-y-3">
                                {selectedAccommodation.calculated_concesion_fee?.is_inside_park && (
                                    <div className="flex items-center justify-between text-xs text-[#7A4E08] bg-[#FDF4DD] border border-[#F2B544]/30 p-3 ">
                                        <span className="flex items-center gap-2 font-semibold">
                                            <ShieldAlert className="w-4 h-4" />
                                            Park concession fee
                                        </span>
                                        <span className="font-mono font-bold">
                                            +${pricing.concessionTotal.toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-xs text-[#6B6459] pt-1">
                                    <span className="font-medium">Accommodation base night rate:</span>
                                    <span className="font-mono text-[#0F2A2E] font-bold">
                                        ${pricing.roomTotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center text-sm font-bold text-[#0F2A2E] bg-[#E3F1E8] border border-[#1E5A3B]/20 p-3 ">
                                    <span className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-[#1E5A3B]" />
                                        Total night cost
                                    </span>
                                    <span className="font-mono text-base text-[#1E5A3B]">
                                        ${pricing.grandTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-[#E4DCCB] bg-[#F6F1E7]/50 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancelModal}
                                className="px-4 py-2.5 text-xs font-semibold text-[#0F2A2E] bg-white border border-[#E4DCCB] hover:bg-[#F6F1E7]  transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSelection}
                                className="px-5 py-2.5 text-xs font-bold text-[#0F2A2E] bg-[#E8772E]  flex items-center gap-1.5 cursor-pointer transition-all
                                           hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/25
                                           hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                                           active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                            >
                                <Check className="w-4 h-4" />
                                Save & apply selection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom scrollbar */}
            <style>{`
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