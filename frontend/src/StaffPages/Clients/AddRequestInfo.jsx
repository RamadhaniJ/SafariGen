import { useEffect, useState } from "react";
import { 
  Users, Bed, Plus, Trash2, CheckCircle2, 
  Calendar, MapPin, ArrowRight, Loader2, 
  Globe, ChevronDown, UserCheck
} from "lucide-react";
import { toast } from "sonner";
import api from "../../Apis/api";
import DestinationComponent from "./DestinationSearch";
import { useNavigate, useParams } from "react-router-dom";

const TOUR_TYPES = [
  "Group Tour", "Solo Tour", "Private Tour",
  "Family Tour", "Luxury Tour", "Budget Tour"
];

const TOUR_LENGTH_OPTIONS = [
  { value: 1, label: "1 Day Safari" },
  { value: 2, label: "2 Days / 1 Night" },
  { value: 3, label: "3 Days / 2 Nights" },
  { value: 4, label: "4 Days / 3 Nights" },
  { value: 5, label: "5 Days / 4 Nights" },
  { value: 6, label: "6 Days / 5 Nights" },
  { value: 7, label: "7 Days / 6 Nights" },
  { value: 8, label: "8 Days / 7 Nights" },
  { value: 9, label: "9 Days / 8 Nights" },
  { value: 10, label: "10 Days / 9 Nights" },
  { value: 12, label: "12 Days / 11 Nights" },
  { value: 14, label: "14 Days / 13 Nights" },
  { value: "custom", label: "Custom Duration..." }
];

const AVAILABLE_COUNTRIES = [
  "Tanzania", "Kenya", "Uganda", "Rwanda", 
  "South Africa", "Zambia", "Botswana"
];

export default function CreateClientRequestInformationPage() {
  const navigate = useNavigate();
  const { clientId } = useParams();
 
  // Client Details State
  const [clientInfo, setClientInfo] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  // Form Fields State 
  const [tourTitle, setTourTitle] = useState("");
  const [tourType, setTourType] = useState("Private Tour");
  const [tourLength, setTourLength] = useState(7);
  const [customTourLength, setCustomTourLength] = useState("");
  const [selectedCountries, setSelectedCountries] = useState(["Tanzania"]);
  const [tourStartDate, setTourStartDate] = useState("");
  const [startDestination, setStartDestination] = useState(null);
  const [endDestination, setEndDestination] = useState(null);
  const [requestInfo, setRequestInfo] = useState("");

  // Dynamic Array States
  const [travellers, setTravellers] = useState([
    { age_category: "ADULT", is_resident: false, number: 2 }
  ]);

  const [rooms, setRooms] = useState([
    { label: "DOUBLE", number: 1 }
  ]);

  // Submission & Validation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 1. Fetch Client Profile Details
  useEffect(() => {
    const fetchClientInfo = async () => {
      setIsFetching(true);
      try {
        const resp = await api.get(`clients/update/clients/${clientId}/`);
        setClientInfo(resp.data);
      } catch (error) {
        toast.error(error?.response?.data?.detail || "Failed to fetch client profile");
      } finally {
        setIsFetching(false);
      }
    };

    if (clientId) fetchClientInfo();
  }, [clientId]);

  // Dynamic Handlers: Countries Visited
  const toggleCountry = (country) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
  };

  // Dynamic Handlers: Travellers
  const handleAddTraveller = () => {
    setTravellers((prev) => [
      ...prev,
      { age_category: "ADULT", is_resident: false, number: 1 }
    ]);
  };

  const handleRemoveTraveller = (index) => {
    if (travellers.length <= 1) return;
    setTravellers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTravellerChange = (index, field, value) => {
    setTravellers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Dynamic Handlers: Rooms
  const handleAddRoom = () => {
    setRooms((prev) => [...prev, { label: "SINGLE", number: 1 }]);
  };

  const handleRemoveRoom = (index) => {
    if (rooms.length <= 1) return;
    setRooms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRoomChange = (index, field, value) => {
    setRooms((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Form Validation
  const validateForm = () => {
    if (!tourTitle.trim()) {
      toast.error("Please enter a tour title");
      return false;
    }
    if (!tourStartDate) {
      toast.error("Please select a tour start date");
      return false;
    }
    if (!startDestination || !endDestination) {
      toast.error("Please select both start and end destinations");
      return false;
    }
    if (selectedCountries.length === 0) {
      toast.error("Select at least one country visited");
      return false;
    }
    return true;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const finalLength = tourLength === "custom" ? parseInt(customTourLength) || 1 : parseInt(tourLength);

    const payload = {
      client_requested: clientId,
      tour_title: tourTitle,
      tour_type: tourType,
      tour_length: finalLength,
      country_visited: selectedCountries.join(", "),
      tour_start_date: tourStartDate,
      start_destination: startDestination,
      end_destination: endDestination,
      request_info: requestInfo,
      travellers: travellers,
      room_selected: rooms
    };

    try {
      const resp = await api.post("clients/create/clients/request/", payload);
      console.log(payload);
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate(`/staff/dashboard/client/preview/information/${resp.data.id || resp.id}`, { replace: true });
      }, 1500);
    } catch (error) {
      const errDetail = error.response?.data;
      if (typeof errDetail === "object") {
        Object.entries(errDetail).forEach(([key, val]) => {
          toast.error(`${key.toUpperCase()}: ${Array.isArray(val) ? val[0] : val}`);
        });
      } else {
        toast.error("Failed to submit safari request. Please verify inputs.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-fuchsia-500" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Loading Client Information</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-gray-950 text-slate-200 font-sans selection:bg-fuchsia-500/30 selection:text-fuchsia-200 relative overflow-x-hidden">
      
      {/* Ultra-subtle Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-fuchsia-900/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-900/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
              New Safari Request
            </h1>
            {/* <p className="text-sm text-slate-500">Configure the itinerary details and logistics for your client.</p> */}
          </div>

          {/* Premium Client Card */}
          {clientInfo && (
            <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl shadow-black/20">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-fuchsia-900/20">
                {clientInfo.first_name?.[0]}{clientInfo.last_name?.[0]}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-slate-100">
                  {clientInfo.salutation ? `${clientInfo.salutation}. ` : ""}{clientInfo.first_name} {clientInfo.last_name}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {clientInfo.email}
                </p>
              </div>
              <div className="h-8 w-px bg-white/10 mx-1" />
              <span className="text-xs font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                {clientInfo.country || "Global"}
              </span>
            </div>
          )}
        </div>

        {/* Main Form Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1  gap-8">
          
          {/* Left Column: Essential Tour Configurations */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Tour Title */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Tour Title <span className="text-fuchsia-500">*</span>
              </label>
              <input
                type="text"
                value={tourTitle}
                onChange={(e) => setTourTitle(e.target.value)}
                placeholder="e.g. 7-Day Serengeti & Ngorongoro Crater Safari"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500/50 transition-all duration-200"
              />
            </div>

            {/* Tour Type Pills */}
            <div className="space-y-3">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Tour Type <span className="text-fuchsia-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {TOUR_TYPES.map((type) => {
                  const active = tourType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTourType(type)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        active
                          ? "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/30 ring-1 ring-fuchsia-500"
                          : "bg-white/[0.03] text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-200 hover:bg-white/[0.05]"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tour Length & Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  Tour Length <span className="text-fuchsia-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={tourLength}
                    onChange={(e) => setTourLength(e.target.value)}
                    className="w-full appearance-none bg-white/[0.03] border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500/50 cursor-pointer transition-all duration-200"
                  >
                    {TOUR_LENGTH_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
                {tourLength === "custom" && (
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter total days (e.g. 15)"
                    value={customTourLength}
                    onChange={(e) => setCustomTourLength(e.target.value)}
                    className="w-full mt-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500/50 transition-all duration-200"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-fuchsia-400" /> Start Date <span className="text-fuchsia-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type="date"
                    value={tourStartDate}
                    onChange={(e) => setTourStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500/50 cursor-pointer transition-all duration-200 [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* Destinations Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Start Destination <span className="text-fuchsia-500">*</span>
                </label>
                <DestinationComponent
                  onSelect={(id) => setStartDestination(id)}
                  initialValue={startDestination}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" /> End Destination <span className="text-fuchsia-500">*</span>
                </label>
                <DestinationComponent
                  onSelect={(id) => setEndDestination(id)}
                  initialValue={endDestination}
                />
              </div>
            </div>

            {/* Countries Visited */}
            <div className="space-y-3">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" /> Visited Countries <span className="text-fuchsia-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_COUNTRIES.map((country) => {
                  const isSelected = selectedCountries.includes(country);
                  return (
                    <button
                      key={country}
                      type="button"
                      onClick={() => toggleCountry(country)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600/90 text-white border border-indigo-500 shadow-md shadow-indigo-900/20"
                          : "bg-white/[0.03] text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-200"
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

          </div>

          {/* Right Column: Travellers, Rooms & Submissions */}
          <div className="lg:col-span-5 space-y-6">

            {/* Travellers Section */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4 backdrop-blur-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Users className="w-4 h-4 text-fuchsia-400" /> Travellers
                </label>
                <span className="text-xs font-mono text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  {travellers.reduce((acc, curr) => acc + Number(curr.number || 0), 0)} Total
                </span>
              </div>

              <div className="space-y-3">
                {travellers.map((item, index) => (
                  <div key={index} className="group flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-200">
                    
                    {/* Quantity */}
                    <div className="relative w-full sm:w-20">
                      <select
                        value={item.number}
                        onChange={(e) => handleTravellerChange(index, "number", parseInt(e.target.value))}
                        className="w-full appearance-none bg-gray-900 border border-white/10 rounded-lg pl-3 pr-7 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/30 cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                    </div>

                    {/* Category */}
                    <div className="relative flex-1 w-full">
                      <select
                        value={item.age_category}
                        onChange={(e) => handleTravellerChange(index, "age_category", e.target.value)}
                        className="w-full appearance-none bg-gray-900 border border-white/10 rounded-lg pl-3 pr-7 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/30 cursor-pointer"
                      >
                        <option value="ADULT">Adults (16+ yrs)</option>
                        <option value="CHILD">Children (5-15 yrs)</option>
                        <option value="INFANT">Infants (0-4 yrs)</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                    </div>

                    {/* Elegant Toggle Switch */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-1 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => handleTravellerChange(index, "is_resident", !item.is_resident)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 ${
                          item.is_resident ? 'bg-fuchsia-600' : 'bg-slate-800'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                          item.is_resident ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                      <span className="text-[11px] font-medium text-slate-500 w-16 text-right">
                        {item.is_resident ? "Resident" : "Non-Resident."}
                      </span>
                    </div>

                    {/* Delete Action */}
                    {travellers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTraveller(index)}
                        className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors self-end sm:self-center"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddTraveller}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-white/[0.03] hover:bg-white/[0.06] border border-dashed border-white/10 hover:border-fuchsia-500/30 text-slate-400 hover:text-fuchsia-400 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Traveller Category</span>
              </button>
            </div>

            {/* Rooms Section */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4 backdrop-blur-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Bed className="w-4 h-4 text-indigo-400" /> Rooms
                </label>
                <span className="text-xs font-mono text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  {rooms.reduce((acc, curr) => acc + Number(curr.number || 0), 0)} Total
                </span>
              </div>

              <div className="space-y-3">
                {rooms.map((item, index) => (
                  <div key={index} className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-200">
                    <div className="relative w-20">
                      <select
                        value={item.number}
                        onChange={(e) => handleRoomChange(index, "number", parseInt(e.target.value))}
                        className="w-full appearance-none bg-gray-900 border border-white/10 rounded-lg pl-3 pr-7 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                    </div>

                    <div className="relative flex-1">
                      <select
                        value={item.label}
                        onChange={(e) => handleRoomChange(index, "label", e.target.value)}
                        className="w-full appearance-none bg-gray-900 border border-white/10 rounded-lg pl-3 pr-7 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 cursor-pointer"
                      >
                        <option value="SINGLE">Single Room</option>
                        <option value="DOUBLE">Double Room</option>
                        <option value="TWIN">Twin Room</option>
                        <option value="TRIPLE">Triple Room</option>
                        <option value="FAMILY">Family Room</option>
                      </select> 
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                    </div>

                    {rooms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRoom(index)}
                        className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddRoom}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-white/[0.03] hover:bg-white/[0.06] border border-dashed border-white/10 hover:border-indigo-500/30 text-slate-400 hover:text-indigo-400 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Room Choice</span>
              </button>
            </div>

            {/* Special Instructions / Notes */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Special Client Notes
              </label>
              <textarea
                rows={4}
                value={requestInfo}
                onChange={(e) => setRequestInfo(e.target.value)}
                placeholder="Dietary requirements, physical limitations, honeymoon preferences..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500/50 transition-all duration-200 resize-none"
              />
            </div>

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full py-4 px-6 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-2xl shadow-xl shadow-fuchsia-900/20 hover:shadow-fuchsia-900/40 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving Safari Request...</span>
                </>
              ) : (
                <>
                  <span>Save & Proceed to Day-by-Day Setup</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>

          </div>
        </form>
      </div>

      {/* Success Modal Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-[#0F0F11] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl shadow-fuchsia-900/20 space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Request Created</h2>
              <p className="text-sm text-slate-400">
                Client request information saved successfully.
              </p>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 animate-pulse w-full rounded-full" />
            </div>
            <p className="text-xs text-slate-500 font-medium">Redirecting to itinerary builder...</p>
          </div>
        </div>
      )}
    </div>
  );
}