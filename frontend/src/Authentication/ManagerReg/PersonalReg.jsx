
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../Apis/api";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Loader2,
  User2Icon,
  ShieldCheck,
} from "lucide-react";



export default function PersonalDetailStep1Page() {
  const navigate = useNavigate();

  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fName.trim() || fName.trim().length < 2) {
      newErrors.fName = "Enter your first name (at least 2 characters).";
    }
    if (!lName.trim() || lName.trim().length < 2) {
      newErrors.lName = "Enter your last name (at least 2 characters).";
    }

    if (!email.trim()) {
      newErrors.email = "Enter your email address.";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

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
        full_name: `${fName.trim()} ${lName.trim()}`,
        email: email.trim().toLowerCase(),
        password1: password,
        password2: confirmPassword,
      };

      await api.post("account/users/register", payload);

      toast.success("Account created! Check your email for the OTP.");


      navigate("/verify-email", {
        state: { email: payload.email },
        replace: true,
      });

    } catch (error) {
      let apiMessage = "Registration failed. Please try again.";

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
    <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] flex font-sans selection:bg-[#E8772E] selection:text-[#0F2A2E]">
      {/* ---------- LEFT PANEL: Brand & Value Prop ---------- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F2A2E] p-12 flex-col justify-between overflow-hidden">
        {/* Glow overlays */}
        <div className="absolute top-0 -left-10 w-96 h-96 bg-[#E8772E]/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F2B544]/10 blur-[120px] pointer-events-none" />

        {/* Step indicator */}
        {/* <div className="relative z-10 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-[#F2B544]/80">
          <span className="px-2.5 py-1 rounded-full bg-[#E8772E]/15 border border-[#E8772E]/30 text-[#F2B544]">
            Step 1 / 3
          </span>
          <span>Personal Information</span>
        </div> */}

        {/* Logo */}
        <div className="relative z-10 mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8772E] rounded"
          >
            <span className="text-3xl font-black tracking-tight text-[#E8772E]">
              Safari<span className="text-[#F6F1E7]">Gen</span>
            </span>
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg my-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8772E]/10 border border-[#E8772E]/30 text-[#F2B544] text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
               Step 1 / 3 : Personal Information
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-[#F6F1E7]">
            Start your journey to{" "}
            <span className="text-[#F2B544]">automated itinerary</span> workflows.
          </h1>

          <div className="space-y-4 text-[#F6F1E7]/80 text-sm">
            {[
              "Turn raw booking data into clean schedules in seconds.",
              "Seamless real-time team and group collaboration.",
              "Direct client-ready handoffs with custom branding.",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#F2B544] shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-[#F6F1E7]/40">
          © {new Date().getFullYear()} SafariGen Ltd. All rights reserved.
        </div>
      </div>

      {/* ---------- RIGHT PANEL: Sign Up Form ---------- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8 relative z-10">
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
              Create your account
            </h2>
            <p className="text-[#6B6459] text-sm">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-[#B34F12] hover:text-[#E8772E] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] rounded"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* First + Last name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                  First Name
                </label>
                <div className="relative">
                  <User2Icon className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fName}
                    onChange={(e) => {
                      setFName(e.target.value);
                      clearError("fName");
                    }}
                    placeholder="Juma"
                    className={`${inputBase} ${errors.fName ? inputErr : inputOk}`}
                  />
                </div>
                {errors.fName && (
                  <p className="text-xs text-[#8E2A1F]">{errors.fName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                  Last Name
                </label>
                <div className="relative">
                  <User2Icon className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={lName}
                    onChange={(e) => {
                      setLName(e.target.value);
                      clearError("lName");
                    }}
                    placeholder="Mushi"
                    className={`${inputBase} ${errors.lName ? inputErr : inputOk}`}
                  />
                </div>
                {errors.lName && (
                  <p className="text-xs text-[#8E2A1F]">{errors.lName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                 Email Address 
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  placeholder="juma@gmail.com"
                  className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-[#8E2A1F]">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
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
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2" />
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
              className="w-full py-3 px-4 rounded-xl bg-[#E8772E] text-[#0F2A2E] font-semibold text-sm hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/30 transition-all active:bg-[#B34F12] active:text-white active:scale-[0.99] disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B6459]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E8772E]" />
            Your data is encrypted and never shared.
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-[#6B6459] leading-relaxed">
            By signing up, you agree to our{" "}
            <a
              href="#"
              className="underline text-[#B34F12] hover:text-[#E8772E] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] rounded"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline text-[#B34F12] hover:text-[#E8772E] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] rounded"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}