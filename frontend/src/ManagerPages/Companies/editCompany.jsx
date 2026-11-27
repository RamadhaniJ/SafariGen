import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import api from "../../Apis/api";
import { COUNTRIES } from "../../Constants/Countries";
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
  Lock,
  Info,
  Mail,
  PhoneCall,
  MapPin,
  MessageCircle,
  Share2,
  Car,
} from "lucide-react";

// Social links shown to guests on quotes and PDFs (each one optional).
const SOCIAL_FIELDS = [
  { key: "facebook_url", label: "Facebook", placeholder: "facebook.com/yourcompany" },
  { key: "instagram_url", label: "Instagram", placeholder: "instagram.com/yourcompany" },
  { key: "tiktok_url", label: "TikTok", placeholder: "tiktok.com/@yourcompany" },
  { key: "youtube_url", label: "YouTube", placeholder: "youtube.com/@yourcompany" },
  { key: "twitter_url", label: "X (Twitter)", placeholder: "x.com/yourcompany" },
  { key: "threads_url", label: "Threads", placeholder: "threads.net/@yourcompany" },
];
const EMPTY_SOCIALS = Object.fromEntries(SOCIAL_FIELDS.map((f) => [f.key, ""]));

export default function ManagerEditCompanyPoUp({
  open,
  company,
  onClose,
  onSuccess,
}) {
  const countryRef = useRef(null);


  const BLOCKED_DOMAINS = [
   "gmail.com","yahoo.com", "outlook.com", "hotmail.com",
  "icloud.com", "aol.com", "protonmail.com", "mail.com",
];


  // --- STATE ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
    
  const [logo, setLogo] = useState(null); // new file (kama mtumiaji akibadilisha)
  const [logoPreview, setLogoPreview] = useState(null); // URL ya preview
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");
  const [certIncorporation, setCertIncorporation] = useState(null);
  const [certPreview, setCertPreview] = useState(null);
  const [taxCertificate, setTaxCertificate] = useState(null);
  const [taxPreview, setTaxPreview] = useState(null);
  const [taxNumber, setTaxNumber] = useState("");
  const [vehicleRate, setVehicleRate] = useState("");
  const [address, setAddress] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [socials, setSocials] = useState(EMPTY_SOCIALS);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const isVerified = company?.status === "VERIFIED";


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



  // --- PREFILL FROM PROP ---
  useEffect(() => {
    if (!open || !company) return;
    setName(company.name || "");

    setEmail(company.email || "");
    setPhoneNumber(company.phone_number || "");

    setWebsite(company.website || "");
    setCountry(company.country || "");
    setTaxNumber(company.tax_id_number || "");
    setVehicleRate(company.vehicle_rate_per_day ?? "");
    setAddress(company.address || "");
    setWhatsapp(company.whatsapp_number || "");
    setSocials(Object.fromEntries(SOCIAL_FIELDS.map((f) => [f.key, company[f.key] || ""])));

    // Preview existing files
    setLogoPreview(company.logo || null);
    setCertPreview(company.certificate_of_incorporation || null);
    setTaxPreview(company.tax_id_certificate || null);

    // Reset new file selections
    setLogo(null);
    setCertIncorporation(null);
    setTaxCertificate(null);
    setErrors({});
  }, [open, company]);

  // --- DROPDOWN OUTSIDE CLICK ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- ESC + SCROLL LOCK ---
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

  // --- HELPERS ---
  const getFileName = (field) => {
    if (!field) return null;
    if (typeof field === "string") {
      const parts = field.split("/").filter(Boolean);
      return parts[parts.length - 1] || field;
    }
    return field?.name || null;
  };

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(country.toLowerCase())
  );

  const handleSelectCountry = (selected) => {
    setCountry(selected);
    setIsCountryOpen(false);
    setErrors((prev) => ({ ...prev, country: null }));
  };

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

  // --- VALIDATION (files SI lazima kwenye edit) ---
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

    if (!website.trim()) {
      newErrors.website = "Company website is required";
    } else if (!urlRegex.test(website)) {
      newErrors.website = "Enter a valid website URL (e.g., https://example.com)";
    }

    if (!country.trim()) newErrors.country = "Operating country is required";
    // Locked on verified companies, so it can't be fixed here — don't block saving.
    if (!isVerified && !taxNumber.trim()) newErrors.taxNumber = "Tax ID number is required";

    // Vehicle price: optional, but a sensible number if filled in.
    if (String(vehicleRate).trim() !== "") {
      const n = Number(vehicleRate);
      if (!Number.isFinite(n) || n < 0) newErrors.vehicle_rate_per_day = "Enter a price of 0 or more";
    }

    // Social links: a link if filled in (https:// is added automatically).
    SOCIAL_FIELDS.forEach(({ key, label }) => {
      const value = (socials[key] || "").trim();
      if (value && !urlRegex.test(value)) newErrors[key] = `Enter a valid ${label} link`;
    });

    // Hakuna validation ya files hapa — ni optional kwenye edit

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company?.id) return;

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
      formData.append("vehicle_rate_per_day", String(vehicleRate).trim());
      formData.append("address", address.trim());
      formData.append("whatsapp_number", whatsapp.trim());
      SOCIAL_FIELDS.forEach(({ key }) => formData.append(key, formatUrl(socials[key] || "")));

      // Ongeza files TU kama mtumiaji amechagua mpya
      if (logo) formData.append("logo", logo);
      if (certIncorporation)
        formData.append("certificate_of_incorporation", certIncorporation);
      if (taxCertificate) formData.append("tax_id_certificate", taxCertificate);

      const res = await api.patch(`account/users/update/company/${company.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const repriced = res?.data?.repriced_quotes || [];
      toast.success(
        repriced.length
          ? `Company updated. ${repriced.length} open quote${repriced.length > 1 ? "s were" : " was"} re-priced with the new vehicle price.`
          : "Company updated successfully!"
      );
      onSuccess?.(); // 🔑 refresh parent list
    } catch (error) {
      let apiMessage = "Update failed. Please try again.";
      if (error?.response?.data) {
        const data = error.response.data;
        if (typeof data === "string") apiMessage = data;
        else if (data.detail) {
          apiMessage = Array.isArray(data.detail)
            ? data.detail.join(" ")
            : data.detail;
        } else if (typeof data === "object") {
          // Show each field's error under that field too (e.g. a bad Instagram link).
          setErrors((p) => ({
            ...p,
            ...Object.fromEntries(
              Object.entries(data).map(([k, v]) => [k, Array.isArray(v) ? v[0] : String(v)])
            ),
          }));
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

  if (!open || !company) return null;

  // ---------- Styles ----------
  const inputBase =
    "w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border text-[#0F2A2E] placeholder:text-[#6B6459]/60 text-sm focus:outline-none transition-all disabled:bg-[#F6F1E7] disabled:text-[#6B6459] disabled:cursor-not-allowed";
  const inputOk =
    "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20";
  const inputErr =
    "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-2 focus:ring-[#8E2A1F]/20";
  const fileInputBase =
    "w-full pl-3 pr-3 py-2 rounded-xl bg-white border text-[#0F2A2E] text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#E8772E] file:text-white hover:file:bg-[#B34F12] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A2E]/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => !loading && onClose?.()}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#F6F1E7] border border-[#E4DCCB] rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200"
      >
        {/* ===== HEADER ===== */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 sm:px-8 py-4 bg-white border-b border-[#E4DCCB]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0F2A2E] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#F2B544]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F2A2E]">
                Edit Company
              </h2>
              <p className="text-[11px] text-[#6B6459] truncate max-w-[240px]">
                {company.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => !loading && onClose?.()}
            disabled={loading}
            className="p-2 rounded-lg text-[#6B6459] hover:text-[#0F2A2E] hover:bg-[#F6F1E7] transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===== VERIFIED INFO BANNER ===== */}
        {isVerified && (
          <div className="mx-6 sm:mx-8 mt-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-[#F2B544]/15 border border-[#F2B544]/40">
            <Lock className="w-4 h-4 text-[#B34F12] shrink-0 mt-0.5" />
            <div className="text-xs text-[#B34F12] leading-relaxed">
              <span className="font-bold">Verified company.</span> Some fields
              (name, certificate of incorporation, tax certificate, tax ID) are
              locked and cannot be changed.
            </div>
          </div>
        )}

        {/* ===== FORM ===== */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5" noValidate>
          {/* Row 1: Name & Logo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Company Name *" error={errors.name}>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  disabled={isVerified}
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
                  disabled={isVerified}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: null }));
                  }}
                  className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                  placeholder="safari@experts.io"
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
                  disabled={isVerified}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setErrors((p) => ({ ...p, phone_number: null }));
                  }}
                  className={`${inputBase} ${errors.phone_number ? inputErr : inputOk}`}
                  placeholder="+1 233 121 211"
                />
              </div>
            </Field>

            <Field label="Company Logo" error={errors.logo}>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) =>
                  handleFileChange(e, setLogo, setLogoPreview, "logo", [
                    "jpg",
                    "jpeg",
                    "png",
                    "webp",
                  ])
                }
                className={`${fileInputBase} ${
                  errors.logo ? "border-[#8E2A1F]" : "border-[#E4DCCB]"
                }`}
              />
              {logoPreview && (
                <div className="mt-2 flex items-center gap-3 bg-white p-2 rounded-lg border border-[#E4DCCB]">
                  {typeof logoPreview === "string" &&
                  /\.(jpg|jpeg|png|webp)$/i.test(logoPreview) ? (
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      className="h-12 w-12 object-cover rounded-lg border border-[#E4DCCB]"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg border border-[#E4DCCB] bg-[#F6F1E7] flex items-center justify-center text-[#E8772E] font-bold">
                      {(company?.name || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-[#6B6459] min-w-0">
                    <ImageIcon className="w-3.5 h-3.5 text-[#B34F12] shrink-0" />
                    <span className="truncate">
                      {logo?.name || getFileName(logoPreview) || "Current logo"}
                    </span>
                    {!logo && (
                      <span className="text-[10px] italic">(current)</span>
                    )}
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
                  className={`${inputBase} pr-10 ${
                    errors.country ? inputErr : inputOk
                  }`}
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

          {/* Pricing used for this company's quotes */}
          <div className="rounded-2xl border border-[#0F2A2E]/10 bg-[#0F2A2E]/[0.02] p-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-[#0F2A2E] flex items-center gap-2">
                <Car className="w-4 h-4" /> Pricing
              </p>
              <p className="text-xs text-[#6B6459] mt-1">
                Used when your quotes are priced. Leave empty to use the SafariGen default.
              </p>
            </div>
            <Field label="Vehicle price per day (USD)" error={errors.vehicle_rate_per_day}>
              <div className="relative">
                <span className="text-sm text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  value={vehicleRate}
                  onChange={(e) => {
                    setVehicleRate(e.target.value);
                    setErrors((p) => ({ ...p, vehicle_rate_per_day: null }));
                  }}
                  className={`${inputBase} ${errors.vehicle_rate_per_day ? inputErr : inputOk}`}
                  placeholder="e.g. 280"
                />
              </div>
            </Field>
            <p className="text-xs text-[#6B6459]">
              Changing this re-prices your open quotes straight away (drafts, sent, and changes requested).
              Accepted, rejected and archived quotes keep their price.
            </p>
          </div>

          {/* Guest-facing contact details & social media (all optional) */}
          <div className="rounded-2xl border border-[#0F2A2E]/10 bg-[#0F2A2E]/[0.02] p-5 space-y-5">
            <div>
              <p className="text-sm font-semibold text-[#0F2A2E] flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Shown to your guests
              </p>
              <p className="text-xs text-[#6B6459] mt-1">
                These appear on every quote page and PDF. Leave a field empty to hide it.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Office Address" error={errors.address}>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={address}
                    maxLength={255}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`${inputBase} ${errors.address ? inputErr : inputOk}`}
                    placeholder="Sekei Rd, Arusha"
                  />
                </div>
              </Field>
              <Field label="WhatsApp Number" error={errors.whatsapp_number}>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={whatsapp}
                    maxLength={20}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className={`${inputBase} ${errors.whatsapp_number ? inputErr : inputOk}`}
                    placeholder="+255 700 000 000"
                  />
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
                <Field key={key} label={label} error={errors[key]}>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      inputMode="url"
                      value={socials[key]}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSocials((p) => ({ ...p, [key]: value }));
                        setErrors((p) => ({ ...p, [key]: null }));
                      }}
                      className={`${inputBase} ${errors[key] ? inputErr : inputOk}`}
                      placeholder={placeholder}
                    />
                  </div>
                </Field>
              ))}
            </div>
          </div>

          {/* Row 3: Tax Number & Cert Incorporation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Tax ID Number *" error={errors.taxNumber}>
              <div className="relative">
                <Hash className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={taxNumber}
                  disabled={isVerified}
                  onChange={(e) => {
                    setTaxNumber(e.target.value);
                    setErrors((p) => ({ ...p, taxNumber: null }));
                  }}
                  className={`${inputBase} ${
                    errors.taxNumber ? inputErr : inputOk
                  }`}
                  placeholder="e.g. 123-456-789"
                />
              </div>
            </Field>

            <Field
              label="Certificate of Incorporation"
              error={errors.certIncorporation}
              hint={isVerified ? "Locked on verified company" : ""}
            >
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={isVerified}
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
                  errors.certIncorporation ? "border-[#8E2A1F]" : "border-[#E4DCCB]"
                }`}
              />
              {certPreview && (
                <FilePreview
                  name={
                    certIncorporation?.name || getFileName(certPreview)
                  }
                  isCurrent={!certIncorporation}
                />
              )}
            </Field>
          </div>

          {/* Row 4: Tax Certificate */}
          <Field
            label="Tax ID Certificate"
            error={errors.taxCertificate}
            hint={isVerified ? "Locked on verified company" : ""}
          >
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={isVerified}
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
                errors.taxCertificate ? "border-[#8E2A1F]" : "border-[#E4DCCB]"
              }`}
            />
            {taxPreview && (
              <FilePreview
                name={taxCertificate?.name || getFileName(taxPreview)}
                isCurrent={!taxCertificate}
              />
            )}
          </Field>

          {/* ===== ACTIONS ===== */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => !loading && onClose?.()}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-[#E4DCCB] text-[#0F2A2E] text-sm font-semibold hover:bg-[#F6F1E7] transition-all disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex-1 py-3 px-4 rounded-xl bg-[#E8772E] text-white font-semibold text-sm hover:bg-[#B34F12] shadow-lg shadow-[#E8772E]/25 transition-all active:scale-[0.99] disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E8772E] focus:ring-offset-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Save Changes
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B6459] pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#E8772E]" />
            Changes will be reviewed if sensitive fields are updated.
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   Helpers
   ============================================================ */
function Field({ label, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
          {label}
        </label>
        {hint && (
          <span className="text-[9px] text-[#6B6459] inline-flex items-center gap-1">
            <Info className="w-3 h-3" />
            {hint}
          </span>
        )}
      </div>
      {children}
      {error && <p className="text-xs text-[#8E2A1F]">{error}</p>}
    </div>
  );
}

function FilePreview({ name, isCurrent }) {
  if (!name) return null;
  return (
    <div className="mt-2 flex items-center gap-2 text-xs text-[#6B6459] bg-white p-2 rounded-lg border border-[#E4DCCB]">
      <FileText className="w-4 h-4 text-[#B34F12] shrink-0" />
      <span className="truncate">{name}</span>
      {isCurrent && (
        <span className="text-[10px] italic shrink-0">(current)</span>
      )}
    </div>
  );
}