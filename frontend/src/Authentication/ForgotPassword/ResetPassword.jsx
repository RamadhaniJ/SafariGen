
import { useState , useEffect} from "react";
import { Link, useNavigate , useLocation} from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../Apis/api";

import {
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ShieldCheck,
  ArrowLeft

} from "lucide-react";



export default function PasswordResetPage({ reset_token: tokenProp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = tokenProp || location.state?.reset_token || sessionStorage.getItem("reset_token");


  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------- Clear individual errors ----------
  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // ---------- Validation ----------
  const validate = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = "Enter your password.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };




    useEffect(() => {
        document.title = "Forgot password | SafariGen";    
        return () => {
          document.title = "SafariGen | Automated Safari Itinerary & Tour Pricing";
        };
      }, []);
    


  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the validation errors below.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        reset_token : token,
        password1: password,
        password2: confirmPassword,
      };

      await api.post("account/users/password-reset/confirmation", payload);
      
      sessionStorage.removeItem("reset_token");
      sessionStorage.removeItem("reset_email");

      toast.success("Password reset successfully. Please sign in.");


      navigate("/", {
        replace: true,
      });

    } catch (error) {
      let apiMessage = "Reset password failed. Please try again.";

      if (error?.response?.data) {
        const data = error.response.data;

        if (typeof data === "string") {
          apiMessage = data;
        } else if (data.detail) {
          apiMessage = Array.isArray(data.detail)
            ? data.detail.join(" ")
            : data.detail;
        } else if (typeof data === "object") {
          const firstKey = Object.keys(data)[0];
          if (firstKey) {
            const firstError = data[firstKey];
            const fieldName =
              firstKey.charAt(0).toUpperCase() + firstKey.slice(1);

            if (Array.isArray(firstError)) {
              apiMessage = `${fieldName}: ${firstError[0]}`;
            } else if (typeof firstError === "string") {
              apiMessage = `${fieldName}: ${firstError}`;
            }
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

  const inputBase =
  "w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border text-[#0F2A2E] placeholder:text-[#6B6459]/60 text-sm focus:outline-none transition-all";
const inputOk =
  "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20";
const inputErr =
  "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-2 focus:ring-[#8E2A1F]/20";

return (
  <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] flex font-sans selection:bg-[#E8772E] selection:text-[#0F2A2E] relative overflow-hidden">

    {/* Ambient brand washes */}
    <div className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] bg-[#E8772E]/12 blur-[150px]" />
    <div className="pointer-events-none absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-[#F2B544]/18 blur-[150px]" />
    <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#FCE9DA]/40 blur-[120px]" />

    <div className="w-full flex items-center justify-center p-5 sm:p-8 lg:p-12 relative z-10">
      <div className="w-full max-w-md">

        {/* Brand mark */}
        <Link
          to="/"
          className="flex items-center justify-center gap-1 mb-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8772E] rounded"
        >
          <span className="text-3xl font-black tracking-tight text-[#E8772E]">
            Safari<span className="text-[#0F2A2E]">Gen</span>
          </span>
        </Link>

        {/* Card */}
        <div className="relative bg-white rounded-2xl border border-[#E4DCCB] shadow-[0_8px_32px_-12px_rgba(15,42,46,0.12)] p-7 sm:p-9">

          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            {/* Icon badge with soft glow */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-[#E8772E]/25 blur-md" />
                <div className="relative w-14 h-14 rounded-2xl bg-[#FCE9DA] border border-[#E8772E]/25 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-[#B34F12]" />
                </div>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2A2E]">
              Set a new password
            </h2>

            <p className="text-[#6B6459] text-sm leading-relaxed max-w-xs mx-auto">
                Choose a strong, unique password to secure your account.
            </p>

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                New Password
              </label>
              <div className="relative group">
                <Lock className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#E8772E]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                  }}
                  placeholder="••••••••"
                  className={`${inputBase} pr-10 ${errors.password ? inputErr : inputOk}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6459] hover:text-[#0F2A2E] transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[#8E2A1F]">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#E8772E]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearError("confirmPassword");
                  }}
                  placeholder="••••••••"
                  className={`${inputBase} pr-10 ${
                    errors.confirmPassword ? inputErr : inputOk
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6459] hover:text-[#0F2A2E] transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-[#8E2A1F]">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit — Savannah night text on ember (WCAG-safe) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#E8772E] text-[#0F2A2E] font-semibold text-sm
                         hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/25 transition-all
                         hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                         active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                         disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 cursor-pointer
                         focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  Reset password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <span className="h-px flex-1 bg-[#E4DCCB]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B6459]">
              or
            </span>
            <span className="h-px flex-1 bg-[#E4DCCB]" />
          </div>

          {/* Back to login */}
          <Link
            to="/"
            className="w-full py-3 px-4 rounded-xl bg-white border border-[#E4DCCB] text-[#0F2A2E] font-medium text-sm
                       hover:bg-[#F6F1E7] hover:border-[#0F2A2E]/20 transition-all
                       flex items-center justify-center gap-2
                       focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B6459] mt-6">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E8772E]" />
          Your password is encrypted end-to-end.
        </div>

        {/* Copyright */}
        <p className="text-center text-[11px] text-[#6B6459]/70 mt-4">
          © {new Date().getFullYear()} SafariGen Ltd. All rights reserved.
        </p>
      </div>
    </div>
  </div>
)
}