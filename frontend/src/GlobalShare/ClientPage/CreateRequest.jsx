import { useEffect, useState, useContext } from "react";
import { 
  Users, Bed, Plus, Trash2, CheckCircle2, 
  Calendar, MapPin, ArrowRight, Loader2, 
  Globe, ChevronDown, UserCheck
} from "lucide-react";
import { toast } from "sonner";
import api from "../../Apis/api";
import DestinationComponentGlobal from "../Components/Destination";
import { useNavigate, useParams } from "react-router-dom";
import GlobalLoader from "../../Component/Loader";
import { AuthenticationContext } from "../../Apis/AuthProvider";

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

export default function CreateClientRequestInformationGlobal() {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const { refreshAuth } = useContext(AuthenticationContext);
 
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

      start_destination: startDestination?.id || startDestination,
      end_destination: endDestination?.id || endDestination,

      request_info: requestInfo,
      travellers: travellers,
      room_selected: rooms
    };

    try {
      const resp = await api.post("clients/create/clients/request/", payload);
      
      setShowSuccess(true);
      const user =  await refreshAuth();

      setTimeout(() => {

              if (user?.role === "MANAGER"){
                      navigate(`/dashboard/manager/clients/preview/${resp.data.id}`, { replace: true })
               }else if (user?.role === "STAFF"){
                      navigate(`/staff/dashboard/clients/preview/${resp.data.id}`, { replace: true })
               }else{
                  navigate("/", {replace: true});
               }
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
     <GlobalLoader/>
    );
  }

 





  // ── Render ──
return (
  <div className="min-h-screen bg-[#EFE8DA] text-[#0F2A2E] font-sans selection:bg-[#E8772E] selection:text-[#0F2A2E] relative overflow-x-hidden">

    {/* Ambient brand washes */}
    <div className="pointer-events-none absolute -top-40 -right-40 w-[520px] h-[520px] bg-[#E8772E]/12 blur-[150px]" />
    <div className="pointer-events-none absolute -bottom-40 -left-40 w-[520px] h-[520px] bg-[#F2B544]/15 blur-[150px]" />

    <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">

      {/* ══════════════ THE OPEN BOOK ══════════════ */}
      <div className="relative">

        {/* Stacked page edges peeking out from under the spread */}
        <div
          aria-hidden
          className="hidden lg:block absolute -left-2.5 -right-2.5 top-2.5 -bottom-2.5 bg-[#E6DDCA] border border-[#D8CDB6]"
        />
        <div
          aria-hidden
          className="hidden lg:block absolute -left-5 -right-5 top-5 -bottom-5 bg-[#DDD2BB] border border-[#CEC1A6]"
        />

        {/* Book body — two facing pages, equal height, square corners */}
        <div className="relative grid grid-cols-1 lg:grid-cols-5 items-stretch border border-[#D9CFBA] bg-[#FDFBF6] shadow-[0_40px_90px_-45px_rgba(15,42,46,0.6)]">

          {/* ─── LEFT PAGE ─── */}
          <aside className="relative lg:col-span-2 min-h-[460px] bg-[#0F2A2E] overflow-hidden">

            {/* Full-bleed image — stretches to exactly match the form height */}
            <img
              src="/honemoons.webp"
              alt="SafariGen — new safari request"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Legibility overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08191C] via-[#0F2A2E]/50 to-[#0F2A2E]/10" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F2A2E]/45 via-transparent to-transparent" />

            {/* Gutter shadow — inner edge of the left page */}
            <div
              aria-hidden
              className="hidden lg:block absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-black/60 via-black/15 to-transparent z-10"
            />

            {/* Page content */}
            <div className="relative z-10 flex h-full flex-col justify-between gap-10 p-6 sm:p-8 lg:p-10">

              {/* Step badge */}
              <div className="inline-flex w-fit items-center gap-2.5 border border-[#F6F1E7]/20 bg-[#0F2A2E]/60 px-3.5 py-2 backdrop-blur-md">
                <span className="h-1.5 w-1.5 l bg-[#E8772E] animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F2B544]">
                  Step 2 / 3
                </span>
                <span className="h-3 w-px bg-[#F6F1E7]/25" />
                <span className="text-[11px] font-semibold text-[#F6F1E7]/85">
                  New Safari Request
                </span>
              </div>

              {/* Premium client card */}
              {clientInfo && (
                <div className="flex items-center gap-4 border border-[#E4DCCB]/15 bg-[#0F2A2E]/55 px-4 py-3.5 backdrop-blur-xl shadow-xl shadow-[#0F2A2E]/40">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#E8772E] text-sm font-bold text-[#0F2A2E] shadow-md shadow-[#E8772E]/30">
                    {clientInfo.first_name?.[0]}{clientInfo.last_name?.[0]}
                  </div>

                  <div className="flex min-w-0 flex-col">
                    <p className="truncate text-sm font-semibold text-[#FDFBF6]">
                      {clientInfo.salutation ? `${clientInfo.salutation}. ` : ""}
                      {clientInfo.first_name} {clientInfo.last_name}
                    </p>
                    <p className="truncate text-xs font-medium text-[#F6F1E7]/55">
                      {clientInfo.email}
                    </p>
                  </div>

                  <div className="mx-1 hidden h-8 w-px bg-[#E4DCCB]/15 sm:block" />

                  <span className="hidden shrink-0 border border-[#E8772E]/25 bg-[#E8772E]/15 px-2.5 py-1 text-xs font-medium text-[#F2B544] sm:inline-block">
                    {clientInfo.country || "Global"}
                  </span>
                </div>
              )}

              {/* Headline + progress */}
              <div className="space-y-5">
                <h2 className="font-serif text-[27px] sm:text-[32px] lg:text-[36px] font-bold leading-[1.12] tracking-tight text-[#FDFBF6]">
                  Let's continue with your{" "}
                  <span className="italic text-[#F2B544]">client's request</span>.
                </h2>

                <p className="max-w-md text-sm leading-relaxed text-[#F6F1E7]/70">
                  Shape the journey — dates, destinations, travellers and the details that matter.
                </p>

                {/* Progress indicators */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="h-[3px] w-10 bg-[#F6F1E7]/20" />
                  <span className="h-[3px] w-10 bg-[#E8772E]" />
                  <span className="h-[3px] w-10 bg-[#F6F1E7]/20" />
                  <span className="ml-2 text-[11px] font-medium tracking-wide text-[#F6F1E7]/55">
                    Client request information
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* ─── RIGHT PAGE ─── */}
          <section className="relative lg:col-span-3 bg-[#FDFBF6] p-6 sm:p-9 lg:p-12">

            {/* Gutter shadow — inner edge of the right page */}
            <div
              aria-hidden
              className="hidden lg:block absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-[#0F2A2E]/10 via-[#0F2A2E]/[0.03] to-transparent pointer-events-none z-10"
            />

            {/* Page header */}
            <header className="relative pb-6 mb-8 border-b border-[#E4DCCB]">
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-8 bg-[#E8772E]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#B34F12]">
                  Step two
                </span>
              </div>

              <h1 className="font-serif text-[26px] sm:text-[30px] font-bold tracking-tight text-[#0F2A2E]">
                New safari request
              </h1>

              <p className="text-xs sm:text-sm text-[#6B6459] mt-1.5">
                Fields marked with <span className="text-[#B34F12] font-semibold">*</span> are required.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="relative space-y-9">

              {/* ══ 01 · Tour overview ══ */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold text-[#E8772E]">01</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6B6459]">
                    Tour overview
                  </span>
                  <span className="h-px flex-1 bg-[#E4DCCB]" />
                </div>

                {/* Tour Title */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                    Tour title <span className="text-[#B34F12]">*</span>
                  </label>
                  <input
                    type="text"
                    value={tourTitle}
                    onChange={(e) => setTourTitle(e.target.value)}
                    placeholder="e.g. 7-Day Serengeti & Ngorongoro Crater Safari"
                    className="w-full bg-white border border-[#E4DCCB] px-4 py-3 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all duration-200"
                  />
                </div>

                {/* Tour Type Pills */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                    Tour type <span className="text-[#B34F12]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TOUR_TYPES.map((type) => {
                      const active = tourType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setTourType(type)}
                          className={`px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                            active
                              ? "bg-[#FCE9DA] border border-[#E8772E]/60 text-[#0F2A2E] shadow-sm shadow-[#E8772E]/10 ring-1 ring-[#E8772E]/30"
                              : "bg-white border border-[#E4DCCB] text-[#6B6459] hover:border-[#0F2A2E]/25 hover:text-[#0F2A2E] hover:bg-[#F6F1E7]/60"
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ══ 02 · Logistics ══ */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold text-[#E8772E]">02</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6B6459]">
                    Logistics
                  </span>
                  <span className="h-px flex-1 bg-[#E4DCCB]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Tour Length */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                      Tour length <span className="text-[#B34F12]">*</span>
                    </label>
                    <div className="relative group">
                      <select
                        value={tourLength}
                        onChange={(e) => setTourLength(e.target.value)}
                        className="w-full appearance-none bg-white border border-[#E4DCCB] pl-4 pr-10 py-3 text-sm text-[#0F2A2E] focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 cursor-pointer transition-all duration-200"
                      >
                        {TOUR_LENGTH_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] pointer-events-none transition-colors group-focus-within:text-[#E8772E]" />
                    </div>

                    {tourLength === "custom" && (
                      <input
                        type="number"
                        min="1"
                        placeholder="Enter total days (e.g. 15)"
                        value={customTourLength}
                        onChange={(e) => setCustomTourLength(e.target.value)}
                        className="w-full mt-3 bg-white border border-[#E4DCCB] px-4 py-2.5 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all duration-200"
                      />
                    )}
                  </div>

                  {/* Start Date */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                      <Calendar className="w-3.5 h-3.5 text-[#E8772E]" /> Start date{" "}
                      <span className="text-[#B34F12]">*</span>
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] pointer-events-none transition-colors group-focus-within:text-[#E8772E]" />
                      <input
                        type="date"
                        value={tourStartDate}
                        onChange={(e) => setTourStartDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full bg-white border border-[#E4DCCB] pl-10 pr-4 py-3 text-sm text-[#0F2A2E] focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 cursor-pointer transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ══ 03 · Route ══ */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold text-[#E8772E]">03</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6B6459]">
                    Route
                  </span>
                  <span className="h-px flex-1 bg-[#E4DCCB]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                      <MapPin className="w-3.5 h-3.5 text-[#1E5A3B]" /> Start destination{" "}
                      <span className="text-[#B34F12]">*</span>
                    </label>
                    <DestinationComponentGlobal
                      onSelect={(id) => setStartDestination(id)}
                      initialValue={startDestination}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                      <MapPin className="w-3.5 h-3.5 text-[#8E2A1F]" /> End destination{" "}
                      <span className="text-[#B34F12]">*</span>
                    </label>
                    <DestinationComponentGlobal
                      onSelect={(id) => setEndDestination(id)}
                      initialValue={endDestination}
                    />
                  </div>
                </div>

                {/* Countries Visited */}
                <div className="space-y-3">
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                    <Globe className="w-3.5 h-3.5 text-[#1D4E68]" /> Visited countries{" "}
                    <span className="text-[#B34F12]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_COUNTRIES.map((country) => {
                      const isSelected = selectedCountries.includes(country);
                      return (
                        <button
                          key={country}
                          type="button"
                          onClick={() => toggleCountry(country)}
                          className={`px-3.5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-[#E2EEF4] border border-[#1D4E68]/40 text-[#1D4E68] shadow-sm ring-1 ring-[#1D4E68]/20"
                              : "bg-white border border-[#E4DCCB] text-[#6B6459] hover:border-[#0F2A2E]/25 hover:text-[#0F2A2E] hover:bg-[#F6F1E7]/60"
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

              {/* ══ 04 · Travellers & rooms ══ */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold text-[#E8772E]">04</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6B6459]">
                    Travellers &amp; rooms
                  </span>
                  <span className="h-px flex-1 bg-[#E4DCCB]" />
                </div>

                {/* ── Travellers ── */}
                <div className="bg-white border border-[#E4DCCB]  p-5 space-y-4 shadow-[0_1px_2px_rgba(15,42,46,0.04)]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCB]">
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                      <Users className="w-4 h-4 text-[#E8772E]" /> Travellers
                    </label>
                    <span className="text-xs font-mono text-[#B34F12] bg-[#FCE9DA] px-2.5 py-1 l border border-[#E8772E]/20">
                      {travellers.reduce((acc, curr) => acc + Number(curr.number || 0), 0)} Total
                    </span>
                  </div>

                  <div className="space-y-3">
                    {travellers.map((item, index) => (
                      <div
                        key={index}
                        className="group flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3  bg-[#F6F1E7]/50 border border-[#E4DCCB] hover:border-[#E4DCCB]/80 transition-all duration-200"
                      >
                        {/* Quantity */}
                        <div className="relative w-full sm:w-20">
                          <select
                            value={item.number}
                            onChange={(e) => handleTravellerChange(index, "number", parseInt(e.target.value))}
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
                            onChange={(e) => handleTravellerChange(index, "age_category", e.target.value)}
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
                            onClick={() => handleTravellerChange(index, "is_resident", !item.is_resident)}
                            className={`relative rounded-2xl inline-flex h-6 w-11 items-center l transition-colors duration-200 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] ${
                              item.is_resident ? "bg-[#E8772E]" : "bg-[#E4DCCB]"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-3xl  bg-white shadow-sm transition duration-200 ease-in-out ${
                                item.is_resident ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                          <span className="text-[11px] font-medium text-[#6B6459] w-20 text-right">
                            {item.is_resident ? "Resident" : "Non-Resident"}
                          </span>
                        </div>

                        {/* Delete */}
                        {travellers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTraveller(index)}
                            className="p-2 text-[#6B6459]/60 hover:text-[#8E2A1F] hover:bg-[#FBE5E2]  transition-colors self-end sm:self-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
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
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-[#F6F1E7] hover:bg-[#FCE9DA] border border-dashed border-[#E4DCCB] hover:border-[#E8772E]/40 text-[#6B6459] hover:text-[#B34F12] text-xs font-semibold transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                  >
                    <Plus size={14} />
                    <span>Add traveller category</span>
                  </button>
                </div>

                {/* ── Rooms ── */}
                <div className="bg-white border border-[#E4DCCB]  p-5 space-y-4 shadow-[0_1px_2px_rgba(15,42,46,0.04)]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E4DCCB]">
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                      <Bed className="w-4 h-4 text-[#F2B544]" /> Rooms
                    </label>
                    <span className="text-xs font-mono text-[#7A4E08] bg-[#FDF4DD] px-2.5 py-1 l border border-[#F2B544]/30">
                      {rooms.reduce((acc, curr) => acc + Number(curr.number || 0), 0)} Total
                    </span>
                  </div>

                  <div className="space-y-3">
                    {rooms.map((item, index) => (
                      <div
                        key={index}
                        className="group flex items-center gap-3 p-3 bg-[#F6F1E7]/50 border border-[#E4DCCB] hover:border-[#E4DCCB]/80 transition-all duration-200"
                      >
                        <div className="relative w-20">
                          <select
                            value={item.number}
                            onChange={(e) => handleRoomChange(index, "number", parseInt(e.target.value))}
                            className="w-full appearance-none bg-white border border-[#E4DCCB] pl-3 pr-7 py-2 text-xs font-semibold text-[#0F2A2E] focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 cursor-pointer transition-all duration-200"
                          >
                            {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B6459] pointer-events-none" />
                        </div>

                        <div className="relative flex-1">
                          <select
                            value={item.label}
                            onChange={(e) => handleRoomChange(index, "label", e.target.value)}
                            className="w-full appearance-none bg-white border border-[#E4DCCB] pl-3 pr-7 py-2 text-xs font-semibold text-[#0F2A2E] focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 cursor-pointer transition-all duration-200"
                          >
                            <option value="SINGLE">Single Room</option>
                            <option value="DOUBLE">Double Room</option>
                            <option value="TWIN">Twin Room</option>
                            <option value="TRIPLE">Triple Room</option>
                            <option value="FAMILY">Family Room</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6B6459] pointer-events-none" />
                        </div>

                        {rooms.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRoom(index)}
                            className="p-2 text-[#6B6459]/60 hover:text-[#8E2A1F] hover:bg-[#FBE5E2] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
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
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-[#F6F1E7] hover:bg-[#FDF4DD] border border-dashed border-[#E4DCCB] hover:border-[#F2B544]/60 text-[#6B6459] hover:text-[#7A4E08] text-xs font-semibold transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                  >
                    <Plus size={14} />
                    <span>Add room choice</span>
                  </button>
                </div>
              </div>

              {/* ══ 05 · Notes & submit ══ */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold text-[#E8772E]">05</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6B6459]">
                    Notes
                  </span>
                  <span className="h-px flex-1 bg-[#E4DCCB]" />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                    Special client notes
                  </label>
                  <textarea
                    rows={4}
                    value={requestInfo}
                    onChange={(e) => setRequestInfo(e.target.value)}
                    placeholder="Dietary requirements, physical limitations, honeymoon preferences..."
                    className="w-full bg-white border border-[#E4DCCB]  p-4 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full py-4 px-6 bg-[#E8772E] text-[#0F2A2E] font-semibold text-sm
                             shadow-lg shadow-[#E8772E]/25 transition-all duration-300
                             hover:bg-[#D4661F] hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                             active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                             disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:hover:bg-[#E9E3D6]
                             flex items-center justify-center gap-2 cursor-pointer
                             focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving Safari Request…</span>
                    </>
                  ) : (
                    <>
                      <span>Save &amp; Proceed to Day-by-Day Setup</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* ─── The Spine: hairline seam where the two pages meet ─── */}
          <div
            aria-hidden
            className="hidden lg:block absolute inset-y-0 left-[40%] w-px bg-[#0F2A2E]/20 z-10 pointer-events-none"
          />
        </div>
      </div>
    </div>

    {/* ─── Success Modal ─── */}
    {showSuccess && (
      <div className="fixed inset-0 bg-[#0F2A2E]/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
        <div className="bg-white border border-[#E4DCCB]  p-8 max-w-sm w-full text-center shadow-[0_20px_60px_-15px_rgba(15,42,46,0.3)] space-y-5 animate-in zoom-in-95 duration-300">

          {/* Icon badge with soft glow */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0  bg-[#1E5A3B]/20 blur-md" />
              <div className="relative w-16 h-16 bg-[#E3F1E8] border border-[#1E5A3B]/20  flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#1E5A3B]" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-[#0F2A2E]">
              Request created
            </h2>
            <p className="text-sm text-[#6B6459] leading-relaxed">
              Client request information saved successfully.
            </p>
          </div>

          <div className="w-full bg-[#F6F1E7] l h-1 overflow-hidden border border-[#E4DCCB]">
            <div className="h-full bg-gradient-to-r from-[#E8772E] to-[#F2B544] animate-pulse w-full l" />
          </div>

          <p className="text-xs text-[#6B6459] font-medium">
            Redirecting to itinerary builder…
          </p>
        </div>
      </div>
    )}
  </div>
);
}