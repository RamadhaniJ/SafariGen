import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import api from "../../Apis/api";
import {
  Sparkles,
  X,
  ChevronDown,
  CheckCircle2,
  Loader2,
  ArrowRight,
  User2,
  Mail,
  Eye,
  EyeOff,
  Lock,
  Building2,
  Globe2,
  Info,
} from "lucide-react";
import GlobalLoader from "../../Component/Loader";

export default function ManagerCreateStaffPoUp({ open, onClose, onSuccess }) {
  // --- STATE ---
  const [companiesData, setCompaniesData] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);

  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]); // array of UUIDs

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ============ FETCH MANAGER COMPANIES ============
  const fetchShortCompaniesData = async () => {
    setCompaniesLoading(true);
    try {
      const resp = await api.get("account/users/list/companies-data");
      setCompaniesData(Array.isArray(resp.data) ? resp.data : resp.data?.results || []);
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail ||
        "Something went wrong fetching companies.";
      toast.error(errorMsg);
    } finally {
      setCompaniesLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchShortCompaniesData();
  }, [open]);

  // ============ ESC + SCROLL LOCK ============
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && !submitting && onClose?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, submitting, onClose]);

  // ============ RESET ============
  const resetForm = () => {
    setFName("");
    setLName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setSelectedCompanies([]);
    setErrors({});
  };

  const handleClose = () => {
    if (submitting) return;
    resetForm();
    onClose?.();
  };

  // ============ TOGGLE COMPANY ============
  const toggleCompany = (companyId) => {
    setSelectedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
    setErrors((p) => ({ ...p, companies: null }));
  };

  // ============ VALIDATION ============
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fname.trim() || fname.trim().length < 2) {
      newErrors.fname = "First name is required (min 2 characters).";
    }
    if (!lname.trim() || lname.trim().length < 2) {
      newErrors.lname = "Last name is required (min 2 characters).";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.trim().length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (selectedCompanies.length === 0) {
      newErrors.companies = "Assign staff to at least one company.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============ SUBMIT ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the validation errors below.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        email: email.trim(),
        full_name: `${fname.trim()} ${lname.trim()}`,
        password,
        companies: selectedCompanies, // array of UUIDs — DRF inataka hivi
      };

      await api.post("account/manager/staff/create/", payload);

      toast.success("Staff added successfully!");
      resetForm();
      onSuccess?.();
    } catch (error) {
      let apiMessage = "Staff creation failed. Please try again.";
      if (error?.response?.data) {
        const data = error.response.data;
        if (typeof data === "string") apiMessage = data;
        else if (data.detail) {
          apiMessage = Array.isArray(data.detail)
            ? data.detail.join(" ")
            : data.detail;
        } else if (typeof data === "object") {
          const firstKey = Object.keys(data)[0];
          if (firstKey) {
            const firstError = data[firstKey];
            const fieldName = firstKey
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());
            apiMessage = Array.isArray(firstError)
              ? `${firstError[0]}`
              : `${firstError}`;
          }
        }
      } else if (error?.message) apiMessage = error.message;
      toast.error(apiMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  // ---------- Styles ----------
  const inputBase =
    "w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border text-[#0F2A2E] placeholder:text-[#6B6459]/60 text-sm focus:outline-none transition-all disabled:bg-[#F6F1E7] disabled:cursor-not-allowed";
  const inputOk =
    "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20";
  const inputErr =
    "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-2 focus:ring-[#8E2A1F]/20";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A2E]/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
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
                Add New Staff
              </h2>
              <p className="text-[11px] text-[#6B6459]">
                Create an account for a team member
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="p-2 rounded-lg text-[#6B6459] hover:text-[#0F2A2E] hover:bg-[#F6F1E7] transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===== FORM ===== */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5" noValidate>
          {/* Row 1: First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="First Name *" error={errors.fname}>
              <div className="relative">
                <User2 className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fname}
                  onChange={(e) => {
                    setFName(e.target.value);
                    setErrors((p) => ({ ...p, fname: null }));
                  }}
                  className={`${inputBase} ${errors.fname ? inputErr : inputOk}`}
                  placeholder="e.g. John"
                  disabled={submitting}
                />
              </div>
            </Field>

            <Field label="Last Name *" error={errors.lname}>
              <div className="relative">
                <User2 className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={lname}
                  onChange={(e) => {
                    setLName(e.target.value);
                    setErrors((p) => ({ ...p, lname: null }));
                  }}
                  className={`${inputBase} ${errors.lname ? inputErr : inputOk}`}
                  placeholder="e.g. Doe"
                  disabled={submitting}
                />
              </div>
            </Field>
          </div>

          {/* Row 2: Email & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Email *" error={errors.email}>
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
                  placeholder="staff@mail.com"
                  disabled={submitting}
                />
              </div>
            </Field>

            <Field label="Password *" error={errors.password}>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => ({ ...p, password: null }));
                  }}
                  className={`${inputBase} pr-11 ${
                    errors.password ? inputErr : inputOk
                  }`}
                  placeholder="••••••••"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6459] hover:text-[#0F2A2E] transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </Field>
          </div>

          {/* ===== COMPANY SELECTION ===== */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                Assign Companies *
              </label>
              {selectedCompanies.length > 0 && (
                <span className="text-[10px] font-semibold text-[#B34F12]">
                  {selectedCompanies.length} selected
                </span>
              )}
            </div>

            {companiesLoading ? (
              <div className="flex items-center justify-center py-8 bg-white rounded-xl border border-[#E4DCCB]">
                <Loader2 className="w-4 h-4 text-[#E8772E] animate-spin" />
              </div>
            ) : companiesData.length > 0 ? (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {companiesData.map((company) => {
                  const isSelected = selectedCompanies.includes(company.id);
                  const logoSrc =
                    typeof company.logo === "string"
                      ? company.logo
                      : company.logo?.url || null;
                  const cleanWebsite = (company.website || "")
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "");

                  return (
                    <button
                      key={company.id}
                      type="button"
                      onClick={() => toggleCompany(company.id)}
                      disabled={submitting}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#FCE9DA] border-[#E8772E] shadow-sm"
                          : "bg-white border-[#E4DCCB] hover:border-[#E8772E]/40 hover:bg-[#F6F1E7]/60"
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      {/* Logo */}
                      <div className="w-11 h-11 shrink-0 rounded-lg bg-[#F6F1E7] border border-[#E4DCCB] overflow-hidden flex items-center justify-center">
                        {logoSrc ? (
                          <img
                            src={logoSrc}
                            alt={company.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-[#E8772E]">
                            {(company.name || "?").charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#0F2A2E] truncate">
                          {company.name}
                        </h4>
                        {cleanWebsite && (
                          <div className="flex items-center gap-1 text-[11px] text-[#6B6459] truncate">
                            <Globe2 className="w-3 h-3 shrink-0" />
                            <span className="truncate">{cleanWebsite}</span>
                          </div>
                        )}
                      </div>

                      {/* Checkbox */}
                      <div
                        className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-[#E8772E] border-[#E8772E]"
                            : "border-[#E4DCCB] bg-white"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-start gap-2.5 px-4 py-4 rounded-xl bg-white border border-dashed border-[#E4DCCB]">
                <Info className="w-4 h-4 text-[#B34F12] shrink-0 mt-0.5" />
                <div className="text-xs text-[#6B6459] leading-relaxed">
                  You don't have any <b>verified</b> companies yet. You can only
                  assign staff to verified companies.{" "}
                  <a
                    href="/subscriptions"
                    className="text-[#B34F12] font-semibold hover:text-[#E8772E] underline"
                  >
                    Learn more
                  </a>
                </div>
              </div>
            )}

            {errors.companies && (
              <p className="text-xs text-[#8E2A1F]">{errors.companies}</p>
            )}
          </div>

          {/* ===== ACTIONS ===== */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-[#E4DCCB] text-[#0F2A2E] text-sm font-semibold hover:bg-[#F6F1E7] transition-all disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
                    type="submit"
                    disabled={submitting || companiesData.length === 0}
                    className="w-full flex-1 py-3 px-4 rounded-xl bg-[#E8772E] text-[#0F2A2E] font-semibold text-sm
                                hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/25 transition-all
                                active:bg-[#B34F12] active:text-white active:scale-[0.99]
                                disabled:bg-[#eece89] disabled:text-[#A39C8F] disabled:shadow-none
                                disabled:cursor-not-allowed disabled:hover:bg-[#E9E3D6]
                                flex items-center justify-center gap-2 cursor-pointer
                                focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                    >
                {submitting ? (
                    <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding staff...
                    </>
                ) : (
                    <>
                    Add Staff
                    <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>


          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B6459] pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#E8772E]" />
            Staff will receive access to selected companies immediately.
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   Helpers
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