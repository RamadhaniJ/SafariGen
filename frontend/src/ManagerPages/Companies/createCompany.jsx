
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import api from "../../Apis/api";
import {
  Sparkles,
  X,
  Building2,
  Globe,
  Hash,
  ChevronDown,
  CheckCircle2,
  ImageIcon,
  FileText,
  Loader2,
  ArrowRight,
  Mail,
  PhoneCall,
} from "lucide-react";

import { COUNTRIES } from "../../Constants/Countries";



export default function ManagerCreateCompanyPoUp({ open, onClose, onSuccess }) {
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


   const isPersonalEmail = (email) => {
      const domain = email.split("@")[1]?.toLowerCase();
      return BLOCKED_DOMAINS.includes(domain);
   
    };

    const formatUrl = (url) => {
        const trimmed = url.trim();
            if (!trimmed) return "";
            if (/^https?:\/\//i.test(trimmed)) {
                return trimmed;
            }
            return `https://${trimmed}`;
        };


  // --- DROPDOWN LOGIC ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- ESC to close + body scroll lock ---
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && !loading && onClose?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, loading, onClose]);

  // --- RESET ON CLOSE ---
  const resetForm = () => {
    setName("");
    setLogo(null);
    setLogoPreview(null);
    setWebsite("");
    setCountry("");
    setCertIncorporation(null);
    setCertPreview(null);
    setTaxCertificate(null);
    setTaxPreview(null);
    setTaxNumber("");
    setErrors({});
    setIsCountryOpen(false);
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose?.();
  };

  // --- COUNTRY FILTER ---
  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(country.toLowerCase())
  );

  const handleSelectCountry = (selected) => {
    setCountry(selected);
    setIsCountryOpen(false);
    setErrors((prev) => ({ ...prev, country: null }));
  };

  // --- FILE HANDLING ---
  const handleFileChange = (e, setFile, setPreview, errorKey, allowedTypes) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowedTypes.includes(ext)) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: `Only ${allowedTypes.join(", ")} files are allowed.`,
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [errorKey]: "Max allowed size is 5 MB" }));
      return;
    }

    setFile(file);
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, [errorKey]: null }));
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


    if (!logo) newErrors.logo = "Company logo is required";
   
    if (!website.trim()) {
      newErrors.website = "Company website is required";
    } else if (!urlRegex.test(website.trim())) {
      newErrors.website = "Enter a valid website URL (e.g., https://example.com)";
    }

    if (!country.trim()) newErrors.country = "Operating country is required";
    if (!certIncorporation) {
      newErrors.certIncorporation = "Certificate of incorporation is required";
    }
    if (!taxCertificate) {
      newErrors.taxCertificate = "Tax ID certificate is required";
    }
    if (!taxNumber.trim()) newErrors.taxNumber = "Tax ID number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the validation errors below.");
      return;
    }

    setLoading(true);

    try {
      const formattedWebsite = formatUrl(website);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone_number", phone_number);
      formData.append("website", formattedWebsite);
      formData.append("country", country);
      formData.append("tax_id_number", taxNumber);
      if (logo) formData.append("logo", logo);
      if (certIncorporation)
        formData.append("certificate_of_incorporation", certIncorporation);
      if (taxCertificate) formData.append("tax_id_certificate", taxCertificate);

      await api.post("account/users/create/company", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Company registered successfully!");
      resetForm();
      onSuccess?.(); // 🔑 muhimu: inaruhusu parent kufetch upya list
    } catch (error) {
      let apiMessage = "Registration failed. Please try again.";
      if (error?.response?.data) {
        const data = error.response.data;
        if (typeof data === "string") apiMessage = data;
        else if (data.detail) {
          apiMessage = Array.isArray(data.detail) ? data.detail.join(" ") : data.detail;
        } else if (typeof data === "object") {
          const firstKey = Object.keys(data)[0];
          if (firstKey) {
            const firstError = data[firstKey];
            const fieldName = firstKey
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());
            apiMessage = Array.isArray(firstError)
              ? `${fieldName}: ${firstError[0]}`
              : `${fieldName}: ${firstError}`;
          }
        }
      } else if (error?.message) apiMessage = error.message;
      toast.error(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  // Guard: usi-render kama popup haipo open
  if (!open) return null;

  // ---------- Styles ----------
  const inputBase =
    "w-full pl-10 pr-4 py-2.5  bg-white border text-[#0F2A2E] placeholder:text-[#6B6459]/60 text-sm focus:outline-none transition-all";
  const inputOk =
    "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20";
  const inputErr =
    "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-2 focus:ring-[#8E2A1F]/20";
  const fileInputBase =
    "w-full pl-3 pr-3 py-2 rounded-md bg-white border text-[#0F2A2E] text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#E8772E] file:text-white hover:file:bg-[#B34F12] transition-all cursor-pointer";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A2E]/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#F6F1E7] border border-[#E4DCCB] rounded-sm shadow-2xl relative animate-in zoom-in-95 duration-200"
      >
        {/* ===== HEADER ===== */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 sm:px-8 py-4 bg-white border-b border-[#E4DCCB]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0F2A2E] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#F2B544]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F2A2E]">
                Add New Company
              </h2>
              <p className="text-[11px] text-[#6B6459]">
                Fill the details to register your business
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 rounded-lg text-[#6B6459] hover:text-[#0F2A2E] hover:bg-[#F6F1E7] transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===== FORM ===== */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5" noValidate>
          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Company Name *" error={errors.name}>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((p) => ({ ...p, name: null }));
                  }}
                  className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                  placeholder="e.g. Safari Experts Ltd"
                />
              </div>
            </Field>

            <Field label="Company Email *" error={errors.email}>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((p) => ({ ...p, email: null }));
                      }}
                      className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                      placeholder="safari@experts.ai"
                    />
                </div>
            </Field>
          </div>

          {/* Row 1.1  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Phone Number *" error={errors.phone_number}>
              <div className="relative">
                <PhoneCall className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone_number}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setErrors((p) => ({ ...p, phone_number: null }));
                  }}
                  className={`${inputBase} ${errors.phone_number ? inputErr : inputOk}`}
                  placeholder="+1 901 323 422"
                />
              </div>
            </Field>

            <Field label="Company Logo *" error={errors.logo}>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) =>
                  handleFileChange(e, setLogo, setLogoPreview, "logo", [
                    "jpg", "jpeg", "png", "webp",
                  ])
                }
                className={`${fileInputBase} ${errors.logo ? "border-[#8E2A1F]" : "border-[#E4DCCB]"}`}
              />
              {logoPreview && (
                <div className="mt-2 flex items-center gap-3 bg-white p-2 rounded-lg border border-[#E4DCCB]">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="h-12 w-12 object-cover rounded-lg border border-[#E4DCCB]"
                  />
                  <div className="flex items-center gap-2 text-xs text-[#6B6459] min-w-0">
                    <ImageIcon className="w-3.5 h-3.5 text-[#B34F12] shrink-0" />
                    <span className="truncate">{logo?.name}</span>
                  </div>
                </div>
              )}
            </Field>
          </div>

          {/* Row 2: Website & Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Website *" error={errors.website}>
              <div className="relative">
                <Globe className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => {
                    setWebsite(e.target.value);
                    setErrors((p) => ({ ...p, website: null }));
                  }}
                  className={`${inputBase} ${errors.website ? inputErr : inputOk}`}
                  placeholder="https://www.example.com"
                />
              </div>
            </Field>

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
                    setErrors((p) => ({ ...p, country: null }));
                  }}
                  onFocus={() => setIsCountryOpen(true)}
                  className={`${inputBase} pr-10 ${errors.country ? inputErr : inputOk}`}
                  placeholder="e.g. Tanzania"
                  autoComplete="off"
                />
                <ChevronDown
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-transform ${
                    isCountryOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isCountryOpen && country && (
                <ul className="absolute z-20 w-full mt-1.5 bg-white border border-[#E4DCCB] rounded-xl max-h-48 overflow-y-auto shadow-lg">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((c) => (
                      <li
                        key={c}
                        onClick={() => handleSelectCountry(c)}
                        className="px-4 py-2 text-sm text-[#0F2A2E] hover:bg-[#FCE9DA] hover:text-[#B34F12] cursor-pointer flex items-center justify-between"
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
              {errors.country && (
                <p className="text-xs text-[#8E2A1F]">{errors.country}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Tax ID Number *" error={errors.taxNumber}>
              <div className="relative">
                <Hash className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={taxNumber}
                  onChange={(e) => {
                    setTaxNumber(e.target.value);
                    setErrors((p) => ({ ...p, taxNumber: null }));
                  }}
                  className={`${inputBase} ${errors.taxNumber ? inputErr : inputOk}`}
                  placeholder="e.g. 123-456-789"
                />
              </div>
            </Field>

            <Field label="Certificate of Incorporation *" error={errors.certIncorporation}>
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
                className={`${fileInputBase} ${errors.certIncorporation ? "border-[#8E2A1F]" : "border-[#E4DCCB]"}`}
              />
              {certPreview && (
                <FilePreview name={certIncorporation?.name} />
              )}
            </Field>
          </div>

          {/* Row 4: Tax Certificate */}
          <Field label="Tax ID Certificate *" error={errors.taxCertificate}>
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
              className={`${fileInputBase} ${errors.taxCertificate ? "border-[#8E2A1F]" : "border-[#E4DCCB]"}`}
            />
            {taxPreview && <FilePreview name={taxCertificate?.name} />}
          </Field>

          {/* ===== ACTIONS ===== */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-3 bg-white border border-[#E4DCCB] text-[#0F2A2E] text-sm font-semibold hover:bg-[#F6F1E7] transition-all disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex-1 py-3 px-4 bg-[#E8772E] text-white font-semibold text-sm hover:bg-[#B34F12] shadow-lg shadow-[#E8772E]/25 transition-all active:scale-[0.99] disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E8772E] focus:ring-offset-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Create Company
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B6459] pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#E8772E]" />
            Your business information is encrypted and reviewed securely.
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   Small reusable helpers
   ============================================================ */
function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-[#8E2A1F]">{error}</p>}
    </div>
  );
}

function FilePreview({ name }) {
  if (!name) return null;
  return (
    <div className="mt-2 flex items-center gap-2 text-xs text-[#6B6459] bg-white p-2 rounded-lg border border-[#E4DCCB]">
      <FileText className="w-4 h-4 text-[#B34F12] shrink-0" />
      <span className="truncate">{name}</span>
    </div>
  );
}