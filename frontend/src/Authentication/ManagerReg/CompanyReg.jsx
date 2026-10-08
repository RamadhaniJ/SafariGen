import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../Apis/api";
import { COUNTRIES } from "../../Constants/Countries";
import { AuthenticationContext } from "../../Apis/AuthProvider";

import {
    Building2,
    Globe,
    ChevronDown,
    CheckCircle2,
    Sparkles,
    ArrowRight,
    Loader2,
    FileText,
    Image as ImageIcon,
    Hash,
    Mail,
    PhoneCall
} from "lucide-react";

export default function CompanyDetailsStep3Page() {
    const navigate = useNavigate();
    const countryRef = useRef(null);

    const BLOCKED_DOMAINS = [
   "gmail.com","yahoo.com", "outlook.com", "hotmail.com",
  "icloud.com", "aol.com", "protonmail.com", "mail.com",
];

    // --- STATE MANAGEMENT ---
    const [name, setName] = useState("");

    const [email, setEmail] = useState("");
    const [phone_number, setPhoneNumber] = useState("");

    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [website, setWebsite] = useState("");
    const [country, setCountry] = useState("");
    const [certIncorporation, setCertIncorporation] = useState(null);
    const [certPreview, setCertPreview] = useState(null);
    const [taxCertificate, setTaxCertificate] = useState(null);
    const [taxPreview, setTaxPreview] = useState(null);
    const [taxNumber, setTaxNumber] = useState("");

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isCountryOpen, setIsCountryOpen] = useState(false);


  const {refreshAuth} = useContext(AuthenticationContext);


    const isPersonalEmail = (email) => {
      const domain = email.split("@")[1]?.toLowerCase();
      return BLOCKED_DOMAINS.includes(domain);
};



    // --- DROPDOWN LOGIC ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (countryRef.current && !countryRef.current.contains(event.target)) {
                setIsCountryOpen(false);
            }
        }; 
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCountries = COUNTRIES.filter((c) =>
        c.toLowerCase().includes(country.toLowerCase())
    );

    const handleSelectCountry = (selected) => {
        setCountry(selected);
        setIsCountryOpen(false);
        setErrors((prev) => ({ ...prev, country: null }));
    };

    // --- FILE HANDLING HELPER ---
    const handleFileChange = (e, setFile, setPreview, errorKey, allowedTypes) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Check Extension
        const ext = file.name.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(ext)) {
            setErrors(prev => ({ ...prev, [errorKey]: `Only ${allowedTypes.join(', ')} files are allowed.` }));
            return;
        }

        // 2. Check Size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, [errorKey]: "Max allowed size is 5 MB" }));
            return;
        }

        setFile(file);
        setPreview(URL.createObjectURL(file));
        setErrors(prev => ({ ...prev, [errorKey]: null }));
    };



    //-------- FORMAT URL ......
   const formatUrl = (url) => {
            const trimmed = url.trim();
            if (!trimmed) return "";
            if (/^https?:\/\//i.test(trimmed)) {
                return trimmed;
            }
            return `https://${trimmed}`;
        };

    // --- VALIDATION ---
    const validate = () => {
        const newErrors = {};
        const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!name.trim() || name.trim().length < 2) {
            newErrors.name = "Company name is required (min 2 characters)";
        }

        if (!email.trim()) {
           newErrors.email = "Enter your company email address.";
       
        } else if (!emailRegex.test(email.trim())) {
        newErrors.email = "Enter a valid email address.";
        } else if (isPersonalEmail(email.trim())) {
        newErrors.email = "Please use your official company email address.";
        }

        if (!phone_number.trim()){
           newErrors.phone_number = "Enter your company phone number.";
        }


        if (!logo) {
            newErrors.logo = "Company logo is required";
        }

        if (!website.trim()) {
            newErrors.website = "Company website is required";
        } else if (!urlRegex.test(website.trim())) {
            newErrors.website = "Enter a valid website (e.g., abc.com or myapp.ac.tz)";
        }

        if (!country.trim()) {
            newErrors.country = "Operating country is required";
        }
        if (!certIncorporation) {
            newErrors.certIncorporation = "Certificate of incorporation is required";
        }
        if (!taxCertificate) {
            newErrors.taxCertificate = "Tax ID certificate is required";
        }
        if (!taxNumber.trim()) {
            newErrors.taxNumber = "Tax ID number is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- SUBMIT HANDLER ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix the validation errors below.");
            return;
        }

        setLoading(true);

        try {
            // MUHIMU: Tumia FormData kwa ajili ya File Uploads (multipart/form-data)
            
            const formattedWebsite = formatUrl(website);
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone_number", phone_number);
            formData.append("website", formattedWebsite);
            formData.append("country", country);
            formData.append("tax_id_number", taxNumber);

            if (logo) formData.append("logo", logo);
            if (certIncorporation) formData.append("certificate_of_incorporation", certIncorporation);
            if (taxCertificate) formData.append("tax_id_certificate", taxCertificate);

            const resp = await api.post("account/users/create/company", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Company registered successfully! Welcome aboard.");
            const user =  await refreshAuth();

            if (user?.role === "MANAGER"){
                navigate("/dashboard/manager", {replace: true});

            }else{
                navigate("/", {replace: true});
            }

        } catch (error) {
            let apiMessage = "Registration failed. Please try again.";

            if (error?.response?.data) {
                const data = error.response.data;
                if (typeof data === "string") {
                    apiMessage = data;
                } else if (data.detail) {
                    apiMessage = Array.isArray(data.detail) ? data.detail.join(" ") : data.detail;
                } else if (typeof data === "object") {
                    const firstKey = Object.keys(data)[0];
                    if (firstKey) {
                        const firstError = data[firstKey];
                        const fieldName = firstKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        apiMessage = Array.isArray(firstError) ? `${fieldName}: ${firstError[0]}` : `${fieldName}: ${firstError}`;
                    }
                }
            } else if (error?.message) {
                apiMessage = error.message;
            }

            toast.error(apiMessage);
        } finally {
            setLoading(false);
        }
    };

  

  // ---------- Reusable input classes ----------
  const inputBase =
    "w-full pl-11 pr-4 py-3 bg-white border text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 transition-all duration-200 focus:outline-none focus:ring-2";
  const inputOk =
    "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-[#E8772E]/20";
  const inputErr =
    "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-[#8E2A1F]/20";

  const fileInputBase =
    "w-full pl-3 pr-3 py-2.5 bg-white border text-sm text-[#0F2A2E] file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#E8772E] file:text-[#0F2A2E] hover:file:bg-[#D4661F] transition-all duration-200 cursor-pointer focus:outline-none";

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

          {/* Book body — two facing pages */}
          <div className="relative grid grid-cols-1 lg:grid-cols-5 items-stretch border border-[#D9CFBA] bg-[#FDFBF6] shadow-[0_40px_90px_-45px_rgba(15,42,46,0.6)]">

            {/* ─── LEFT PAGE — Brand & Step Indicator ─── */}
            <aside className="relative lg:col-span-2 min-h-[520px] bg-[#0F2A2E] overflow-hidden">

              {/* Full-bleed image */}
              <img
                src="/cultural_Image.jpg"
                alt="SafariGen — set up your company profile"
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

                {/* Back + Logo */}
                <div className="space-y-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-[#F6F1E7]/70 hover:text-[#F6F1E7] text-xs font-semibold uppercase tracking-wider transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                  >
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    Back
                  </button>

                  <Link
                    to="/"
                    className="inline-flex items-center gap-1 w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8772E]"
                  >
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#E8772E]">
                      Safari<span className="text-[#FDFBF6]">Gen</span>
                    </span>
                  </Link>
                </div>

                {/* Headline + value props */}
                <div className="space-y-6">

                  {/* Step badge */}
                  <div className="inline-flex w-fit items-center gap-2.5 border border-[#F6F1E7]/20 bg-[#0F2A2E]/60 px-3.5 py-2 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F2B544]">
                      Step 3 / 3
                    </span>
                    <span className="h-3 w-px bg-[#F6F1E7]/25" />
                    <span className="text-[11px] font-semibold text-[#F6F1E7]/85">
                      Company details
                    </span>
                  </div>

                  <h2 className="font-serif text-[26px] sm:text-[30px] lg:text-[34px] font-bold leading-[1.12] tracking-tight text-[#FDFBF6]">
                    Let's set up your{" "}
                    <span className="italic text-[#F2B544]">
                      company profile
                    </span>
                    .
                  </h2>

                  <div className="space-y-3 text-sm text-[#F6F1E7]/80">
                    {[
                      "Verify your business for trust and credibility.",
                      "Unlock advanced team collaboration features.",
                      "Start building professional itineraries immediately.",
                    ].map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 text-[#F2B544] shrink-0" />
                        <span className="leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Copyright footer */}
                <div className="text-[11px] tracking-wide text-[#F6F1E7]/40">
                  © {new Date().getFullYear()} SafariGen. All rights reserved.
                </div>
              </div>
            </aside>

            {/* ─── RIGHT PAGE — Company Form ─── */}
            <section className="relative lg:col-span-3 bg-[#FDFBF6] p-6 sm:p-9 lg:p-12">

              {/* Gutter shadow — inner edge of the right page */}
              <div
                aria-hidden
                className="hidden lg:block absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-[#0F2A2E]/10 via-[#0F2A2E]/[0.03] to-transparent pointer-events-none z-10"
              />

              {/* Mobile logo */}
              <div className="lg:hidden mb-6 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8772E]"
                >
                  <span className="text-3xl font-black tracking-tight text-[#E8772E]">
                    Safari<span className="text-[#0F2A2E]">Gen</span>
                  </span>
                </Link>
              </div>

              {/* Card header */}
              <header className="relative pb-6 mb-7 border-b border-[#E4DCCB]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px w-8 bg-[#E8772E]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#B34F12]">
                    Final step
                  </span>
                </div>

                <h1 className="font-serif text-[26px] sm:text-[30px] font-bold tracking-tight text-[#0F2A2E]">
                  Company details
                </h1>

                <p className="text-xs sm:text-sm text-[#6B6459] mt-1.5">
                  Provide your official business information for verification.
                  Fields marked with{" "}
                  <span className="text-[#B34F12] font-semibold">*</span> are
                  required.
                </p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                {/* ── Row 1: Name + Email ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                      Company name <span className="text-[#B34F12]">*</span>
                    </label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-colors group-focus-within:text-[#E8772E]" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrors((prev) => ({ ...prev, name: null }));
                        }}
                        placeholder="e.g. Safari Experts Ltd"
                        autoComplete="organization"
                        className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                      Company email <span className="text-[#B34F12]">*</span>
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-colors group-focus-within:text-[#E8772E]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors((prev) => ({ ...prev, email: null }));
                        }}
                        placeholder="safari@experts.io"
                        autoComplete="email"
                        className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* ── Row 2: Phone + Logo ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                      Phone number <span className="text-[#B34F12]">*</span>
                    </label>
                    <div className="relative group">
                      <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-colors group-focus-within:text-[#E8772E]" />
                      <input
                        type="tel"
                        value={phone_number}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          setErrors((prev) => ({ ...prev, phone_number: null }));
                        }}
                        placeholder="+255 656 992 991"
                        autoComplete="tel"
                        className={`${inputBase} ${errors.phone_number ? inputErr : inputOk}`}
                      />
                    </div>
                    {errors.phone_number && (
                      <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                        {errors.phone_number}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                      Company logo <span className="text-[#B34F12]">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(e) =>
                        handleFileChange(
                          e,
                          setLogo,
                          setLogoPreview,
                          "logo",
                          ["jpg", "jpeg", "png", "webp"]
                        )
                      }
                      className={`${fileInputBase} ${
                        errors.logo ? "border-[#8E2A1F]" : "border-[#E4DCCB]"
                      }`}
                    />
                    {errors.logo && (
                      <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                        {errors.logo}
                      </p>
                    )}
                    {logoPreview && (
                      <div className="mt-2 flex items-center gap-3 bg-white p-2 border border-[#E4DCCB]">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="h-11 w-11 object-cover border border-[#E4DCCB]"
                        />
                        <div className="flex items-center gap-1.5 text-xs text-[#6B6459] min-w-0">
                          <ImageIcon className="w-3.5 h-3.5 text-[#B34F12] shrink-0" />
                          <span className="truncate">{logo?.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Row 3: Website + Country ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                      Website <span className="text-[#B34F12]">*</span>
                    </label>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-colors group-focus-within:text-[#E8772E]" />
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => {
                          setWebsite(e.target.value);
                          setErrors((prev) => ({ ...prev, website: null }));
                        }}
                        placeholder="https://www.example.com"
                        autoComplete="url"
                        className={`${inputBase} ${errors.website ? inputErr : inputOk}`}
                      />
                    </div>
                    {errors.website && (
                      <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                        {errors.website}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 relative" ref={countryRef}>
                    <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                      Operating country <span className="text-[#B34F12]">*</span>
                    </label>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-colors group-focus-within:text-[#E8772E]" />
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                          setIsCountryOpen(true);
                          setErrors((prev) => ({ ...prev, country: null }));
                        }}
                        onFocus={() => setIsCountryOpen(true)}
                        placeholder="e.g. Tanzania"
                        autoComplete="off"
                        className={`${inputBase} pr-11 ${errors.country ? inputErr : inputOk}`}
                      />
                      <ChevronDown
                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-transform duration-200 ${
                          isCountryOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {isCountryOpen && country && (
                      <ul className="absolute z-30 w-full mt-1.5 bg-white border border-[#E4DCCB] max-h-60 overflow-y-auto shadow-[0_12px_32px_-8px_rgba(15,42,46,0.18)] custom-scrollbar">
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
                    {errors.country && (
                      <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>

                {/* ── Row 4: Tax ID + Cert of Incorporation ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                      Tax ID number <span className="text-[#B34F12]">*</span>
                    </label>
                    <div className="relative group">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-colors group-focus-within:text-[#E8772E]" />
                      <input
                        type="text"
                        value={taxNumber}
                        onChange={(e) => {
                          setTaxNumber(e.target.value);
                          setErrors((prev) => ({ ...prev, taxNumber: null }));
                        }}
                        placeholder="e.g. 123-456-789"
                        className={`${inputBase} ${errors.taxNumber ? inputErr : inputOk}`}
                      />
                    </div>
                    {errors.taxNumber && (
                      <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                        {errors.taxNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                      Certificate of incorporation{" "}
                      <span className="text-[#B34F12]">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileChange(
                          e,
                          setCertIncorporation,
                          setCertPreview,
                          "certIncorporation",
                          ["pdf", "jpg", "jpeg", "png"]
                        )
                      }
                      className={`${fileInputBase} ${
                        errors.certIncorporation
                          ? "border-[#8E2A1F]"
                          : "border-[#E4DCCB]"
                      }`}
                    />
                    {errors.certIncorporation && (
                      <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                        {errors.certIncorporation}
                      </p>
                    )}
                    {certPreview && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6B6459] bg-white p-2 border border-[#E4DCCB]">
                        <FileText className="w-4 h-4 text-[#B34F12] shrink-0" />
                        <span className="truncate">{certIncorporation.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Row 5: Tax ID Certificate (full width) ── */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                    Tax ID certificate <span className="text-[#B34F12]">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileChange(
                        e,
                        setTaxCertificate,
                        setTaxPreview,
                        "taxCertificate",
                        ["pdf", "jpg", "jpeg", "png"]
                      )
                    }
                    className={`${fileInputBase} ${
                      errors.taxCertificate
                        ? "border-[#8E2A1F]"
                        : "border-[#E4DCCB]"
                    }`}
                  />
                  {errors.taxCertificate && (
                    <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                      {errors.taxCertificate}
                    </p>
                  )}
                  {taxPreview && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6B6459] bg-white p-2 border border-[#E4DCCB]">
                      <FileText className="w-4 h-4 text-[#B34F12] shrink-0" />
                      <span className="truncate">{taxCertificate.name}</span>
                    </div>
                  )}
                </div>

                {/* ── Submit ── */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative flex items-center justify-center gap-2.5 bg-[#E8772E] text-[#0F2A2E] font-semibold py-3.5 px-6 text-sm sm:text-base
                               transition-all duration-300
                               hover:bg-[#D4661F] hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                               active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                               disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:hover:bg-[#E9E3D6]
                               shadow-lg shadow-[#E8772E]/25
                               focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing…
                      </>
                    ) : (
                      <>
                        Submit &amp; finish
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>

                {/* ── Trust badge ── */}
                <div className="flex items-center justify-center gap-2 pt-1 text-[11px] tracking-wide text-[#6B6459]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E8772E]" />
                  Your business information is encrypted and reviewed securely.
                </div>
              </form>
            </section>

            {/* ─── The Spine ─── */}
            <div
              aria-hidden
              className="hidden lg:block absolute inset-y-0 left-[40%] w-px bg-[#0F2A2E]/20 z-10 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* ─── Global custom scrollbar for country dropdown ─── */}
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