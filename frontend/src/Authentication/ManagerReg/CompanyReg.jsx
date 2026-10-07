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
        "w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border text-[#0F2A2E] placeholder:text-[#6B6459]/60 text-sm focus:outline-none transition-all";
    const inputOk =
        "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20";
    const inputErr =
        "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-2 focus:ring-[#8E2A1F]/20";

    const fileInputBase =
        "w-full pl-3 pr-3 py-2 rounded-xl bg-white border text-[#0F2A2E] text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#E8772E] file:text-[#0F2A2E] hover:file:bg-[#D4661F] transition-all cursor-pointer";

    return (
        <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] flex font-sans selection:bg-[#E8772E] selection:text-[#0F2A2E]">
            {/* ================= LEFT PANEL: Brand & Value Prop ================= */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F2A2E] p-12 flex-col justify-between overflow-hidden">
                {/* Soft brand glows */}
                <div className="absolute top-0 -left-10 w-96 h-96 bg-[#E8772E]/20 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F2B544]/10 blur-[120px] pointer-events-none" />

                <div className="relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-[#F6F1E7]/70 hover:text-[#F6F1E7] mb-4 flex items-center gap-2 text-sm transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                    >
                        ← Back
                    </button>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8772E] rounded"
                    >
                        <span className="text-3xl font-black tracking-tight text-[#E8772E]">
                            Safari<span className="text-[#F6F1E7]">Gen</span>
                        </span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg my-auto space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8772E]/15 border border-[#E8772E]/30 text-[#F2B544] text-xs font-semibold tracking-wide uppercase">
                        <Sparkles className="w-3.5 h-3.5" />
                        Step 3 of 3: Company Details
                    </div> 
                    <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-[#F6F1E7]">
                        Let's set up your{" "}
                        <span className="text-[#F2B544]">company profile</span>.
                    </h1>
                    <div className="space-y-4 text-[#F6F1E7]/80 text-sm">
                        {[
                            "Verify your business for trust and credibility.",
                            "Unlock advanced team collaboration features.",
                            "Start building professional itineraries immediately.",
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-[#F2B544] shrink-0" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-xs text-[#F6F1E7]/40">
                    © {new Date().getFullYear()} SafariGen Ltd. All rights reserved.
                </div>
            </div>

            {/* ================= RIGHT PANEL: Form ================= */}
            <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
                {/* Mobile soft glow */}
                <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-sm h-64 bg-[#FCE9DA] blur-[90px] pointer-events-none" />

                <div className="w-full max-w-2xl space-y-8 relative z-10 py-4 lg:py-0">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8772E] rounded"
                        >
                            <span className="text-3xl font-black tracking-tight text-[#E8772E]">
                                Safari<span className="text-[#0F2A2E]">Gen</span>
                            </span>
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-[#0F2A2E]">
                            Company Details
                        </h2>
                        <p className="text-[#6B6459] text-sm">
                            Provide your official business information for verification.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                        {/* Row 1: Name & Logo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                                    Company Name *
                                </label>
                                <div className="relative">
                                    <Building2 className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            setErrors(prev => ({ ...prev, name: null }));
                                        }}
                                        className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                                        placeholder="e.g. Safari Experts Ltd"
                                    />
                                </div>
                                {errors.name && <p className="text-xs text-[#8E2A1F]">{errors.name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                                    Company Email *
                                </label>
                               <div className="relative">
                                    <Mail className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setErrors(prev => ({ ...prev, email: null }));
                                        }}
                                        className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                                        placeholder="safari@experts.io"
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-[#8E2A1F]">{errors.email}</p>}
                            </div>
                        </div>

                    {/* Row 2: Phone Number & Logo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                                    Phone Number *
                                </label>
                                <div className="relative">
                                    <PhoneCall className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="tel"
                                        value={phone_number}
                                        onChange={(e) => {
                                            setPhoneNumber(e.target.value);
                                            setErrors(prev => ({ ...prev, phone_number: null }));
                                        }}
                                        className={`${inputBase} ${errors.phone_number ? inputErr : inputOk}`}
                                        placeholder="+255 656 992 991"
                                    />
                                </div>
                                {errors.phone_number && <p className="text-xs text-[#8E2A1F]">{errors.phone_number}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                                    Company Logo *
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        onChange={(e) => handleFileChange(e, setLogo, setLogoPreview, "logo", ["jpg", "jpeg", "png", "webp"])}
                                        className={`${fileInputBase} ${errors.logo ? "border-[#8E2A1F]" : "border-[#E4DCCB]"}`}
                                    />
                                </div>
                                {errors.logo && <p className="text-xs text-[#8E2A1F]">{errors.logo}</p>}
                                {logoPreview && (
                                    <div className="mt-2 flex items-center gap-3 bg-white p-2 rounded-lg border border-[#E4DCCB]">
                                        <img
                                            src={logoPreview}
                                            alt="Logo Preview"
                                            className="h-12 w-12 object-cover rounded-lg border border-[#E4DCCB]"
                                        />
                                        <div className="flex items-center gap-2 text-xs text-[#6B6459]">
                                            <ImageIcon className="w-3.5 h-3.5 text-[#B34F12]" />
                                            <span className="truncate">{logo?.name}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>







                        {/* Row 2: Website & Country */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                                    Website *
                                </label>
                                <div className="relative">
                                    <Globe className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="url"
                                        value={website}
                                        onChange={(e) => {
                                            setWebsite(e.target.value);
                                            setErrors(prev => ({ ...prev, website: null }));
                                        }}
                                        className={`${inputBase} ${errors.website ? inputErr : inputOk}`}
                                        placeholder="https://www.example.com"
                                    />
                                </div>
                                {errors.website && <p className="text-xs text-[#8E2A1F]">{errors.website}</p>}
                            </div>

                            <div className="space-y-1.5 relative" ref={countryRef}>
                                <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                                    Operating Country *
                                </label>
                                <div className="relative">
                                    <Globe className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={country}
                                        onChange={(e) => {
                                            setCountry(e.target.value);
                                            setIsCountryOpen(true);
                                            setErrors(prev => ({ ...prev, country: null }));
                                        }}
                                        onFocus={() => setIsCountryOpen(true)}
                                        className={`${inputBase} pr-10 ${errors.country ? inputErr : inputOk}`}
                                        placeholder="e.g. Tanzania"
                                        autoComplete="off"
                                    />
                                    <ChevronDown
                                        className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-transform ${
                                            isCountryOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </div>

                                {isCountryOpen && country && (
                                    <ul className="absolute z-20 w-64 mt-1.5 bg-white border border-[#E4DCCB] rounded-xl max-h-48 overflow-y-auto shadow-lg shadow-[#0F2A2E]/5">
                                        {filteredCountries.length > 0 ? (
                                            filteredCountries.map((c) => (
                                                <li
                                                    key={c}
                                                    onClick={() => handleSelectCountry(c)}
                                                    className="px-4 py-2 text-sm text-[#0F2A2E] hover:bg-[#FCE9DA] hover:text-[#B34F12] cursor-pointer transition-colors flex items-center justify-between"
                                                >
                                                    {c}
                                                    {c === country && (
                                                        <CheckCircle2 className="w-4 h-4 text-[#E8772E]" />
                                                    )}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="px-4 py-2 text-sm text-[#6B6459] italic">
                                                No country found
                                            </li>
                                        )}
                                    </ul>
                                )}
                                {errors.country && <p className="text-xs text-[#8E2A1F]">{errors.country}</p>}
                            </div>
                        </div>

                        {/* Row 3: Tax Number & Cert of Incorporation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                                    Tax ID Number *
                                </label>
                                <div className="relative">
                                    <Hash className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={taxNumber}
                                        onChange={(e) => {
                                            setTaxNumber(e.target.value);
                                            setErrors(prev => ({ ...prev, taxNumber: null }));
                                        }}
                                        className={`${inputBase} ${errors.taxNumber ? inputErr : inputOk}`}
                                        placeholder="e.g. 123-456-789"
                                    />
                                </div>
                                {errors.taxNumber && <p className="text-xs text-[#8E2A1F]">{errors.taxNumber}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                                    Certificate of Incorporation *
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileChange(e, setCertIncorporation, setCertPreview, "certIncorporation", ["pdf", "jpg", "jpeg", "png"])}
                                        className={`${fileInputBase} ${errors.certIncorporation ? "border-[#8E2A1F]" : "border-[#E4DCCB]"}`}
                                    />
                                </div>
                                {errors.certIncorporation && (
                                    <p className="text-xs text-[#8E2A1F]">{errors.certIncorporation}</p>
                                )}
                                {certPreview && (
                                    <div className="mt-2 flex items-center gap-2 text-xs text-[#6B6459] bg-white p-2 rounded-lg border border-[#E4DCCB]">
                                        <FileText className="w-4 h-4 text-[#B34F12] shrink-0" />
                                        <span className="truncate">{certIncorporation.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Row 4: Tax Certificate */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                                Tax ID Certificate *
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileChange(e, setTaxCertificate, setTaxPreview, "taxCertificate", ["pdf", "jpg", "jpeg", "png"])}
                                    className={`${fileInputBase} ${errors.taxCertificate ? "border-[#8E2A1F]" : "border-[#E4DCCB]"}`}
                                />
                            </div>
                            {errors.taxCertificate && (
                                <p className="text-xs text-[#8E2A1F]">{errors.taxCertificate}</p>
                            )}
                            {taxPreview && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-[#6B6459] bg-white p-2 rounded-lg border border-[#E4DCCB]">
                                    <FileText className="w-4 h-4 text-[#B34F12] shrink-0" />
                                    <span className="truncate">{taxCertificate.name}</span>
                                </div>
                            )}
                        </div>

                        {/* Submit Button — one primary action per screen */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 rounded-xl bg-[#E8772E] text-[#0F2A2E] font-semibold text-sm
                                       hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/25 transition-all
                                       active:bg-[#B34F12] active:text-white active:scale-[0.99]
                                       disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:shadow-none disabled:cursor-not-allowed
                                       flex items-center justify-center gap-2 mt-4 cursor-pointer
                                       focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Submit &amp; Finish
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        {/* Trust footer */}
                        <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B6459] pt-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#E8772E]" />
                            Your business information is encrypted and reviewed securely.
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}