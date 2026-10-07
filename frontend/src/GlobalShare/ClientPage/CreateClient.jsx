import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../Apis/api';
import { AuthenticationContext } from '../../Apis/AuthProvider';
import { User, Mail, Phone, Globe, ChevronDown, Loader2, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import {COUNTRIES} from '../../Constants/Countries';

const SALUTATIONS = ['Mr', 'Mrs', 'Ms', 'Prof', 'Dr'];
const SOURCE_OPTIONS = ['Website', 'Facebook', 'Instagram', 'Agent'];

export default function CreateClientInformationGlobal() {
    const navigate = useNavigate();
        const {refreshAuth} = useContext(AuthenticationContext);

    //____COMPANY DATA____
    const [companyData, setCompanyData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);


    // ── Form State ──
    const [salutation, setSalutation] = useState('');
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [email, setEmail] = useState(''); 
    const [country, setCountry] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [source, setSource] = useState('');

    // ── UI State ──
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [touched, setTouched] = useState({
        salutation: false,
        fName: false,
        lName: false,
        email: false,
        country: false,
        phone: false,
        source: false,
        selectedCompany: false,
    });

    const [showSuccess, setShowSuccess] = useState(false);
    // ── Refs ──
    const countryRef = useRef(null);


    // =============1. FETCHING. ===============
    const fetchShortCompanyInfo = async ()=>{
      setIsFetching(true);
      try{
         const resp = await api.get("clients/company/list/")
         setCompanyData(resp.data);
      }catch(error){
        const errorMsg = error.response?.data?.detail?.error?.message || "Something went wrong";
        toast.error(errorMsg);
      }finally{
        setIsFetching(false);
      }
    }

    useEffect(()=>{
      fetchShortCompanyInfo();
    },[])

    const filteredCountries = COUNTRIES.filter((c) =>
        c.toLowerCase().includes(country.toLowerCase())
    );

    // ── Click Outside: close country dropdown ──
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (countryRef.current && !countryRef.current.contains(event.target)) {
                setIsCountryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ── Validation ──
    const validateField = (field, value) => {
        switch (field) {
            case 'salutation':
                return value ? '' : 'Please select a salutation.';
            case 'fName':
                return value.trim() ? '' : 'First name is required.';
            case 'lName':
                return value.trim() ? '' : 'Last name is required.';
            case 'email':
                if (!value.trim()) return 'Email is required.';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
                return '';
            case 'country':
                return value.trim() ? '' : 'Please select your country.';

            case 'selectedCompany':
                return value.trim() ? '' : 'Please select a company.';
            case 'phone':
                if (!value.trim()) return 'Phone number is required.';
                if (!/^[\+\d\s\-\(\)]{7,20}$/.test(value.trim())) return 'Enter a valid phone number.';
                return '';
            case 'source':
                return value ? '' : 'Please select how you heard about us.';
            default:
                return '';
        }
    };

    const getFieldError = (field) => {
        const valueMap = {
            salutation,
            fName,
            lName,
            email,
            country,
            phone,
            source,
            selectedCompany,
        };
        if (!touched[field]) return '';
        return validateField(field, valueMap[field]);
    };
 
    const isFormValid = () => {
        const fields = ['salutation', 'fName', 'lName', 'email', 'country', 'phone', 'source','selectedCompany'];
        return fields.every((field) => {
            const valueMap = { salutation, fName, lName, email, country, phone, source, selectedCompany };
            return validateField(field, valueMap[field]) === '';
        });
    };

    // ── Handlers ──
    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleSelectCountry = (selected) => {
        setCountry(selected);
        setIsCountryOpen(false);
        setTouched((prev) => ({ ...prev, country: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark all fields as touched to show errors
        setTouched({
            salutation: true,
            fName: true,
            lName: true,
            email: true,
            country: true,
            phone: true,
            source: true,
            selectedCompany: true

        });

        if (!isFormValid()) {
            toast.error('Please fix the highlighted fields before continuing.');
            return;
        }
      

        setIsSubmitting(true);
        try {
           const resp =   await api.post('clients/create/clients/', {
                email,
                salutation,
                first_name: fName,
                last_name: lName,
                country,
                phone,
                company: selectedCompany,
                source, 
            });
            toast.success('Client information saved successfully!');
            const user =  await refreshAuth();
            setShowSuccess(true);

            setTimeout(() => {  
              
              if (user?.role === "MANAGER"){
                      navigate(`/dashboard/manager/clients/create/request/${resp.data.id}`, { replace: true })
               }else if (user?.role === "STAFF"){
                      navigate(`/staff/dashboard/clients/create/request/${resp.data.id}`, { replace: true })
               }else{
                  navigate("/", {replace: true});
               }

                }, 1000);
        } catch (error) {
            const message = error.response?.data?.detail || 'Check your network connection.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };
 
  

   // ── Render ──
return (
  <div className="min-h-screen bg-[#EFE8DA] text-[#0F2A2E] font-sans selection:bg-[#E8772E] selection:text-[#0F2A2E] relative overflow-hidden">

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
          <aside className="relative lg:col-span-2 min-h-[430px] bg-[#0F2A2E] overflow-hidden">

            {/* Full-bleed image — stretches to exactly match the form height */}
            <img
              src="/elephantIMG.jpg"
              alt="SafariGen — start your client profile"
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
                <span className="h-1.5 w-1.5 rounded-full bg-[#E8772E] animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F2B544]">
                  Step 1 / 3
                </span>
                <span className="h-3 w-px bg-[#F6F1E7]/25" />
                <span className="text-[11px] font-semibold text-[#F6F1E7]/85">
                  Client info
                </span>
              </div>

              {/* Headline + progress */}
              <div className="space-y-5">
                <h2 className="font-serif text-[27px] sm:text-[32px] lg:text-[36px] font-bold leading-[1.12] tracking-tight text-[#FDFBF6]">
                  Let's start with your{" "}
                  <span className="italic text-[#F2B544]">client's details</span>.
                </h2>

                <p className="max-w-md text-sm leading-relaxed text-[#F6F1E7]/70">
                  A few basics is all we need to begin shaping their personalised itinerary.
                </p>

                {/* Progress indicators */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="h-[3px] w-10 bg-[#E8772E]" />
                  <span className="h-[3px] w-10 bg-[#F6F1E7]/20" />
                  <span className="h-[3px] w-10 bg-[#F6F1E7]/20" />
                  <span className="ml-2 text-[11px] font-medium tracking-wide text-[#F6F1E7]/55">
                    Client details
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

            {/* Card header */}
            <header className="relative pb-6 mb-7 border-b border-[#E4DCCB]">
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-8 bg-[#E8772E]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#B34F12]">
                  Step one
                </span>
              </div>

              <h1 className="font-serif text-[26px] sm:text-[30px] font-bold tracking-tight text-[#0F2A2E]">
                Client information
              </h1>

              <p className="text-xs sm:text-sm text-[#6B6459] mt-1.5">
                Fields marked with <span className="text-[#B34F12] font-semibold">*</span> are required.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── Row: Salutation + First + Last ── */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">

                {/* Salutation */}
                <div className="sm:col-span-3 space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                    Salutation <span className="text-[#B34F12]">*</span>
                  </label>
                  <div className="relative group">
                    <select
                      value={salutation}
                      onChange={(e) => setSalutation(e.target.value)}
                      onBlur={() => handleBlur("salutation")}
                      className={`w-full bg-white border px-4 py-3 pr-10 text-sm text-[#0F2A2E] appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 ${
                        getFieldError("salutation")
                          ? "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-[#8E2A1F]/20"
                          : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-[#E8772E]/20"
                      }`}
                    >
                      <option value="">Select…</option>
                      {SALUTATIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] pointer-events-none transition-colors group-focus-within:text-[#E8772E]" />
                  </div>
                  {getFieldError("salutation") && (
                    <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                      {getFieldError("salutation")}
                    </p>
                  )}
                </div>

                {/* First Name */}
                <div className="sm:col-span-4 space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                    First name <span className="text-[#B34F12]">*</span>
                  </label>
                  <input
                    type="text"
                    value={fName}
                    onChange={(e) => setFName(e.target.value)}
                    onBlur={() => handleBlur("fName")}
                    placeholder="John"
                    className={`w-full bg-white border px-4 py-3 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 transition-all duration-200 focus:outline-none focus:ring-2 ${
                      getFieldError("fName")
                        ? "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-[#8E2A1F]/20"
                        : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-[#E8772E]/20"
                    }`}
                  />
                  {getFieldError("fName") && (
                    <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                      {getFieldError("fName")}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="sm:col-span-5 space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                    Last name <span className="text-[#B34F12]">*</span>
                  </label>
                  <input
                    type="text"
                    value={lName}
                    onChange={(e) => setLName(e.target.value)}
                    onBlur={() => handleBlur("lName")}
                    placeholder="Mark"
                    className={`w-full bg-white border px-4 py-3 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 transition-all duration-200 focus:outline-none focus:ring-2 ${
                      getFieldError("lName")
                        ? "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-[#8E2A1F]/20"
                        : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-[#E8772E]/20"
                    }`}
                  />
                  {getFieldError("lName") && (
                    <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                      {getFieldError("lName")}
                    </p>
                  )}
                </div>
              </div>

              {/* ── Email ── */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                  Email address <span className="text-[#B34F12]">*</span>
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-colors group-focus-within:text-[#E8772E]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="you@example.com"
                    className={`w-full bg-white border pl-11 pr-4 py-3 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 transition-all duration-200 focus:outline-none focus:ring-2 ${
                      getFieldError("email")
                        ? "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-[#8E2A1F]/20"
                        : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-[#E8772E]/20"
                    }`}
                  />
                </div>
                {getFieldError("email") && (
                  <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                    {getFieldError("email")}
                  </p>
                )}
              </div>

              {/* ── Country ── */}
              <div className="space-y-1.5 relative" ref={countryRef}>
                <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                  Country <span className="text-[#B34F12]">*</span>
                </label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-colors group-focus-within:text-[#E8772E]" />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setIsCountryOpen(true);
                    }}
                    onFocus={() => setIsCountryOpen(true)}
                    onBlur={() => handleBlur("country")}
                    placeholder="e.g. Mexico"
                    className={`w-full bg-white border  pl-11 pr-4 py-3 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 transition-all duration-200 focus:outline-none focus:ring-2 ${
                      getFieldError("country")
                        ? "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-[#8E2A1F]/20"
                        : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-[#E8772E]/20"
                    }`}
                    autoComplete="off"
                  />
                  <ChevronDown
                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-transform duration-200 ${
                      isCountryOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isCountryOpen && country && (
                  <ul className="absolute z-30 w-full mt-1.5 bg-white border border-[#E4DCCB] rounded-xl max-h-60 overflow-y-auto shadow-[0_12px_32px_-8px_rgba(15,42,46,0.18)] custom-scrollbar">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((c) => (
                        <li
                          key={c}
                          onClick={() => handleSelectCountry(c)}
                          className="px-4 py-2.5 text-sm text-[#0F2A2E] hover:bg-[#FCE9DA] hover:text-[#B34F12] cursor-pointer transition-colors duration-150 flex items-center gap-2"
                        >
                          {c}
                          {c === country && (
                            <CheckCircle2 className="w-4 h-4 text-[#E8772E] ml-auto" />
                          )}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2.5 text-sm text-[#6B6459] italic">
                        No country found
                      </li>
                    )}
                  </ul>
                )}
                {getFieldError("country") && (
                  <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                    {getFieldError("country")}
                  </p>
                )}
              </div>

              {/* ── Phone ── */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                  Phone number <span className="text-[#B34F12]">*</span>
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-colors group-focus-within:text-[#E8772E]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    placeholder="+1 234 567 8900"
                    className={`w-full bg-white border pl-11 pr-4 py-3 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 transition-all duration-200 focus:outline-none focus:ring-2 ${
                      getFieldError("phone")
                        ? "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-[#8E2A1F]/20"
                        : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-[#E8772E]/20"
                    }`}
                  />
                </div>
                {getFieldError("phone") && (
                  <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                    {getFieldError("phone")}
                  </p>
                )}
              </div>

                {/* ── Company ── */}
                {/* ── Company Selection ── */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                  Company for this Client <span className="text-[#B34F12]">*</span>
                </label>
                
                <div className="relative group">
                  {/* Loading State */}
                  {isFetching ? (
                    <div className="flex items-center justify-center p-4 border border-dashed border-gray-300 bg-gray-50">
                      <span className="text-sm text-gray-500 animate-pulse">Loading companies...</span>
                    </div>
                  ) : companyData.length > 0 ? (
                    /* ✅ Company List as Selectable Cards */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {companyData.map((comp) => (
                        <div
                          key={comp.id}
                          onClick={() => {
                            setSelectedCompany(comp.id);
                            setCompanyError(""); // Futa error user akichagua
                          }}
                          className={`flex items-center space-x-3 p-3 border  cursor-pointer transition-all duration-200 
                            ${selectedCompany === comp.id 
                              ? 'border-[#E8772E] bg-[#E8772E]/5 ring-1 ring-[#E8772E]' 
                              : 'border-gray-200 hover:border-[#E8772E]/50 hover:bg-gray-50'
                            }`}
                        >
                          {/* ✅ Logo (comp.logo badala ya comp.log.url) */}
                          <img 
                            src={comp.logo || 'https://via.placeholder.com/32?text=C'} 
                            className="w-8 h-8 rounded-full object-cover border border-gray-200 bg-white" 
                            alt={comp.name} 
                          />
                          <span className="flex-1 text-sm font-medium text-[#0F2A2E] truncate">
                            {comp.name}
                          </span>
                          
                          {/* ✅ Check Icon */}
                          {selectedCompany === comp.id && (
                            <CheckCircle2 className="w-5 h-5 text-[#E8772E] flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* ✅ Empty State */
                    <div className="p-4 border border-dashed border-red-200 bg-red-50  text-center">
                      <p className="text-sm text-[#8E2A1F]">
                        You do not belong to any verified company  or Your companies not verified. Please contact your administrator.
                      </p>
                    </div>
                  )}
                </div>
                {getFieldError("selectedCompany") && (
                  <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                    {getFieldError("selectedCompany")}
                  </p>
                )}
              </div>

              {/* ── Source (Radio Cards) ── */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                  Source ? <span className="text-[#B34F12]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {SOURCE_OPTIONS.map((src) => {
                    const isSelected = source === src;
                    return (
                      <label
                        key={src}
                        onClick={() => {
                          setSource(src);
                          setTouched((prev) => ({ ...prev, source: true }));
                        }}
                        className={`relative flex items-center justify-between p-3.5 border cursor-pointer transition-all duration-200 select-none ${
                          isSelected
                            ? "bg-[#FCE9DA] border-[#E8772E]/60 text-[#0F2A2E] shadow-sm shadow-[#E8772E]/10 ring-1 ring-[#E8772E]/30"
                            : "bg-white border-[#E4DCCB] text-[#6B6459] hover:border-[#0F2A2E]/25 hover:text-[#0F2A2E] hover:bg-[#F6F1E7]/60"
                        } ${
                          getFieldError("source") && !isSelected
                            ? "border-[#8E2A1F]/40"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="source"
                          value={src}
                          checked={isSelected}
                          onChange={() => {}}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium truncate">{src}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                            isSelected
                              ? "border-[#E8772E] bg-[#E8772E]"
                              : "border-[#E4DCCB] bg-white"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0F2A2E] animate-in zoom-in-50" />
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                {getFieldError("source") && (
                  <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                    {getFieldError("source")}
                  </p>
                )}
              </div>

              {/* ─── Submit Button ─── */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative flex items-center justify-center gap-2.5 bg-[#E8772E] text-[#0F2A2E] font-semibold py-3.5 px-6  text-sm sm:text-base
                             transition-all duration-300
                             hover:bg-[#D4661F] hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                             active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                             disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:hover:bg-[#E9E3D6]
                             shadow-lg shadow-[#E8772E]/25
                             focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Save &amp; continue
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
        <div className="bg-white border border-[#E4DCCB] rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_20px_60px_-15px_rgba(15,42,46,0.3)] space-y-5">

          {/* Icon badge */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-[#1E5A3B]/20 blur-md" />
              <div className="relative w-16 h-16 bg-[#E3F1E8] border border-[#1E5A3B]/20 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-[#1E5A3B]" />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-[#0F2A2E]">
              Request created!
            </h2>
            <p className="text-xs text-[#6B6459] leading-relaxed">
              Client request information saved successfully.
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#F6F1E7] rounded-full h-1.5 overflow-hidden border border-[#E4DCCB]">
            <div className="h-full bg-gradient-to-r from-[#E8772E] to-[#F2B544] animate-pulse w-full" />
          </div>

          <p className="text-[11px] text-[#6B6459]">
            Redirecting to itinerary builder…
          </p>
        </div>
      </div>
    )}

    {/* ─── Global styles for custom scrollbar ─── */}
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