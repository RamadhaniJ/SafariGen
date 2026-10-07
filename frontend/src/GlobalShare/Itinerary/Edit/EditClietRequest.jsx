import { useState } from "react";
import { Users, Bed, Plus, Trash2, Calendar, MapPin, ArrowRight, ChevronDown, Globe, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import DestinationComponentGlobal from "../../Components/Destination";
import normalizeDestinationInputHelper from "../Helpers/EditingHelpers";

const TOUR_TYPES = ["Group Tour", "Solo Tour", "Private Tour", "Family Tour", "Luxury Tour", "Budget Tour"];
const TOUR_LENGTH_OPTIONS = Array.from({ length: 45 }, (_, i) => i + 1);
const AVAILABLE_COUNTRIES = ["Tanzania", "Kenya", "Uganda", "Rwanda", "South Africa", "Zambia", "Botswana"];

export default function ClientRequestInformationEditingGlobal({ dataToEdit, clientId, onNext, onUpdate }) {

    // 1. Initialize state from dataToEdit
    const [formData, setFormData] = useState({
        tour_title: dataToEdit?.client_info?.tour_title || "",
        tour_type: dataToEdit?.client_info?.tour_type || "Private Tour",
        tour_length: dataToEdit?.client_info?.tour_length || 7,
        country_visited: dataToEdit?.client_info?.country_visited || "Tanzania",
        tour_start_date: dataToEdit?.client_info?.tour_start_date || "",

        start_destination: normalizeDestinationInputHelper(
             dataToEdit?.client_info?.start_destination,
             dataToEdit?.client_info?.start_destination_name || null,
              ),
        end_destination: normalizeDestinationInputHelper( 
                dataToEdit?.client_info?.end_destination,
                dataToEdit?.client_info.end_destination_name,
             ),

        request_info: dataToEdit?.client_info?.request_info || "",
        travellers: dataToEdit?.client_info?.travellers || [{ age_category: "ADULT", is_resident: false, number: 2 }],
        rooms: dataToEdit?.client_info?.rooms || [{ label: "DOUBLE", number: 1 }]
    });



    // 2. Helper to update specific field and notify parent
    const handleChange = (field, value) => {
        const updated = { ...formData, [field]: value };
        setFormData(updated);
        onUpdate(updated); 
    };

    const handleArrayChange = (arrayName, index, field, value) => {
        const updatedArray = [...formData[arrayName]];
        updatedArray[index] = { ...updatedArray[index], [field]: value };
        const updated = { ...formData, [arrayName]: updatedArray };
        setFormData(updated);
        onUpdate(updated);
    };

    const addItem = (arrayName, defaultItem) => {
        const updated = { ...formData, [arrayName]: [...formData[arrayName], defaultItem] };
        setFormData(updated);
        onUpdate(updated);
    };

    const removeItem = (arrayName, index) => {
        if (formData[arrayName].length <= 1) return;
        const updatedArray = formData[arrayName].filter((_, i) => i !== index);
        const updated = { ...formData, [arrayName]: updatedArray };
        setFormData(updated);
        onUpdate(updated);
    };

    // 3. Dynamic Handlers: Countries Visited (Comma-separated string)
    const toggleCountry = (country) => {
        const currentCountries = formData.country_visited 
            ? formData.country_visited.split(",").map(c => c.trim()).filter(Boolean) 
            : [];
        
        let newCountries;
        if (currentCountries.includes(country)) {
            newCountries = currentCountries.filter(c => c !== country);
        } else {
            newCountries = [...currentCountries, country];
        }
        
        handleChange('country_visited', newCountries.join(", "));
    };

    const isCountrySelected = (country) => {
        const currentCountries = formData.country_visited 
            ? formData.country_visited.split(",").map(c => c.trim()).filter(Boolean) 
            : [];
        return currentCountries.includes(country);
    };

    // 4. Calculate total travellers for display
    const totalTravellers = formData.travellers.reduce((acc, curr) => acc + Number(curr.number || 0), 0);

    // 5. Validation before moving to next step
    const handleNext = () => {
        if (!formData.tour_title.trim()) return toast.error("Tour title is required");
        if (!formData.tour_start_date) return toast.error("Start date is required");
        if (!formData.start_destination) return toast.error("Start destination is required");
        if (!formData.end_destination) return toast.error("End destination is required");
        if (!formData.country_visited.trim()) return toast.error("At least one country must be selected");
        onNext(); 
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="bg-white border border-[#E4DCCB] p-6 sm:p-8 space-y-8 shadow-sm">
                
                {/* Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-[#E4DCCB]">
                    <div className="p-2 bg-[#1E5A3B]/10 rounded-lg">
                        <Users className="w-5 h-5 text-[#1E5A3B]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#0F2A2E]">Client Request Information</h2>
                        <p className="text-sm text-[#6B6459]">Update the core details of this safari request</p>
                    </div>
                </div>

                {/* Tour Title */}
                <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                        Tour Title <span className="text-[#8E2A1F]">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.tour_title}
                        onChange={(e) => handleChange('tour_title', e.target.value)}
                        placeholder="e.g., 7 Days Serengeti Migration Safari"
                        className="w-full bg-white border border-[#E4DCCB] px-4 py-3 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all duration-200"
                    />
                </div>
 
                {/* Tour Type */}
                <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                        Tour Type <span className="text-[#8E2A1F]">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {TOUR_TYPES.map(type => (
                            <button 
                                key={type} 
                                type="button" 
                                onClick={() => handleChange('tour_type', type)}
                                className={`px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                                    formData.tour_type === type 
                                    ? 'bg-[#E8772E] text-white border-[#E8772E] shadow-md shadow-[#E8772E]/20' 
                                    : 'bg-white text-[#6B6459] border-[#E4DCCB] hover:border-[#E8772E] hover:text-[#E8772E]'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Countries Visited */}
                <div className="space-y-3">
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                        <Globe className="w-3.5 h-3.5 text-[#1E5A3B]" /> Visited Countries <span className="text-[#8E2A1F]">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_COUNTRIES.map((country) => {
                            const isSelected = isCountrySelected(country);
                            return (
                                <button
                                    key={country}
                                    type="button"
                                    onClick={() => toggleCountry(country)}
                                    className={`px-3.5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                                        isSelected
                                            ? "bg-[#1E5A3B]/10 border-[#1E5A3B]/40 text-[#1E5A3B] shadow-sm"
                                            : "bg-white border-[#E4DCCB] text-[#6B6459] hover:border-[#E8772E] hover:text-[#E8772E]"
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        {country}
                                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                
                {/* Destinations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                      <MapPin className="w-3.5 h-3.5 text-[#1E5A3B]" /> Start Destination <span className="text-[#8E2A1F]">*</span>
                    </label>
                    <DestinationComponentGlobal
                      onSelect={(id) => handleChange('start_destination', id)}
                      initialValue={formData.start_destination}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                      <MapPin className="w-3.5 h-3.5 text-[#8E2A1F]" /> End Destination <span className="text-[#8E2A1F]">*</span>
                    </label>
                    <DestinationComponentGlobal
                      onSelect={(id) => handleChange('end_destination', id)}
                      initialValue={formData.end_destination}
                    />
                  </div>
                </div>

                {/* Length & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                            Tour Length (Days) <span className="text-[#8E2A1F]">*</span>
                        </label>
                        <div className="relative">
                            <select 
                                value={formData.tour_length} 
                                onChange={(e) => handleChange('tour_length', parseInt(e.target.value))}
                                className="w-full bg-white border border-[#E4DCCB] px-4 py-3 text-sm text-[#0F2A2E] outline-none cursor-pointer focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all duration-200 appearance-none"
                            >
                                {TOUR_LENGTH_OPTIONS.map(num => <option key={num} value={num}>{num} Days</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                            Start Date <span className="text-[#8E2A1F]">*</span>
                        </label>
                        <div className="relative">
                            <input 
                                type="date" 
                                value={formData.tour_start_date} 
                                onChange={(e) => handleChange('tour_start_date', e.target.value)}
                                className="w-full bg-white border border-[#E4DCCB] px-4 py-3 text-sm text-[#0F2A2E] outline-none cursor-pointer focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all duration-200 [color-scheme:light]" 
                            />
                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Travellers */}
                <div className="bg-white border border-[#E4DCCB] p-5 space-y-4 shadow-[0_1px_2px_rgba(15,42,46,0.04)]">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCB]">
                        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                            <Users className="w-4 h-4 text-[#E8772E]" /> Travellers
                        </label>
                        <span className="text-xs font-mono text-[#B34F12] bg-[#FCE9DA] px-2.5 py-1 border border-[#E8772E]/20">
                            {totalTravellers} Total
                        </span>
                    </div>

                    <div className="space-y-3">
                        {formData.travellers.map((item, index) => (
                            <div
                                key={index}
                                className="group flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-[#F6F1E7]/50 border border-[#E4DCCB] hover:border-[#E8772E]/40 transition-all duration-200"
                            >
                                {/* Quantity */}
                                <div className="relative w-full sm:w-20">
                                    <select
                                        value={item.number}
                                        onChange={(e) => handleArrayChange('travellers', index, 'number', parseInt(e.target.value))}
                                        className="w-full appearance-none bg-white border border-[#E4DCCB] pl-3 pr-7 py-2 text-xs font-semibold text-[#0F2A2E] focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 cursor-pointer transition-all duration-200"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].map((num) => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B6459] pointer-events-none" />
                                </div>

                                {/* Category */}
                                <div className="relative flex-1 w-full">
                                    <select
                                        value={item.age_category}
                                        onChange={(e) => handleArrayChange('travellers', index, 'age_category', e.target.value)}
                                        className="w-full appearance-none bg-white border border-[#E4DCCB] pl-3 pr-7 py-2 text-xs font-semibold text-[#0F2A2E] focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 cursor-pointer transition-all duration-200"
                                    >
                                        <option value="ADULT">Adults (16+ yrs)</option>
                                        <option value="CHILD">Children (5-15 yrs)</option>
                                        <option value="INFANT">Infants (0-4 yrs)</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B6459] pointer-events-none" />
                                </div>

                                {/* Resident toggle */}
                                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-1 sm:pt-0">
                                    <button
                                        type="button"
                                        onClick={() => handleArrayChange('travellers', index, 'is_resident', !item.is_resident)}
                                        className={`relative rounded-2xl inline-flex h-6 w-11 items-center transition-colors duration-200 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] ${
                                            item.is_resident ? "bg-[#E8772E]" : "bg-[#E4DCCB]"
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                                                item.is_resident ? "translate-x-6" : "translate-x-1"
                                            }`}
                                        />
                                    </button>
                                    <span className="text-[11px] font-medium text-[#6B6459] w-20 text-right">
                                        {item.is_resident ? "Resident" : "Non-Resident"}
                                    </span>
                                </div>

                                {/* Delete */}
                                {formData.travellers.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem('travellers', index)}
                                        className="p-2 text-[#6B6459]/60 hover:text-[#8E2A1F] hover:bg-[#8E2A1F]/10 transition-colors self-end sm:self-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => addItem('travellers', { age_category: "ADULT", is_resident: false, number: 1 })}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-[#F6F1E7] hover:bg-[#FCE9DA] border border-dashed border-[#E4DCCB] hover:border-[#E8772E]/40 text-[#6B6459] hover:text-[#B34F12] text-xs font-semibold transition-all duration-200 cursor-pointer"
                    >
                        <Plus size={14} />
                        <span>Add traveller category</span>
                    </button>
                </div>

                {/* Rooms */}
                <div className="bg-white border border-[#E4DCCB] p-5 space-y-4 shadow-[0_1px_2px_rgba(15,42,46,0.04)]">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCB]">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80 flex items-center gap-2">
                            <Bed className="w-4 h-4 text-[#1E5A3B]" /> Rooms
                        </label>
                    </div>
                    <div className="space-y-3">
                        {formData.rooms.map((item, index) => (
                            <div key={index} className="flex flex-wrap items-center gap-3 p-3 bg-[#F6F1E7]/50 border border-[#E4DCCB] hover:border-[#E8772E]/40 transition-all duration-200">
                                <select 
                                    value={item.number} 
                                    onChange={(e) => handleArrayChange('rooms', index, 'number', parseInt(e.target.value))}
                                    className="bg-white border border-[#E4DCCB] px-3 py-2 text-xs text-[#0F2A2E] outline-none focus:border-[#E8772E] w-20 cursor-pointer"
                                >
                                    {[1,2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                                <select 
                                    value={item.label} 
                                    onChange={(e) => handleArrayChange('rooms', index, 'label', e.target.value)}
                                    className="bg-white border border-[#E4DCCB] px-3 py-2 text-xs text-[#0F2A2E] outline-none focus:border-[#E8772E] flex-1 cursor-pointer"
                                >
                                    <option value="SINGLE">Single Room</option>
                                    <option value="DOUBLE">Double Room</option>
                                    <option value="TWIN">Twin Room</option>
                                    <option value="TRIPLE">Triple Room</option>
                                    <option value="FAMILY">Family Room</option>
                                </select>
                                {formData.rooms.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => removeItem('rooms', index)} 
                                        className="p-2 text-[#6B6459] hover:text-[#8E2A1F] hover:bg-[#8E2A1F]/10 transition-all cursor-pointer ml-auto"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => addItem('rooms', { label: "DOUBLE", number: 1 })}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-[#F6F1E7] hover:bg-[#FCE9DA] border border-dashed border-[#E4DCCB] hover:border-[#E8772E]/40 text-[#6B6459] hover:text-[#B34F12] text-xs font-semibold transition-all duration-200 cursor-pointer"
                    >
                        <Plus size={14} />
                        <span>Add room type</span>
                    </button>
                </div>

                {/* Special Notes */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                    Special Client Notes
                  </label>
                  <textarea
                    rows={4}
                    value={formData.request_info}
                    onChange={(e) => handleChange('request_info', e.target.value)}
                    placeholder="Dietary requirements, physical limitations, honeymoon preferences..."
                    className="w-full bg-white border border-[#E4DCCB] p-4 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/60 focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Next Button */}
                <button 
                    onClick={handleNext}
                    className="w-full py-4 bg-[#E8772E] hover:bg-[#B34F12] text-white font-semibold text-sm shadow-lg shadow-[#E8772E]/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-8 group"
                >
                    <span>Continue to Day by Day Itinerary</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}