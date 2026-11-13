import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../Apis/api";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { AuthenticationContext } from "../Apis/AuthProvider";

export default function LogInPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { refreshAuth } = useContext(AuthenticationContext);

  // ── Validation ──
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Enter your email address";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Enter your password";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  useEffect(() => {
    document.title = "Sign In | SafariGen";
    
    return () => {
      document.title = "SafariGen | Automated Safari Itinerary & Tour Pricing";
    };
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the validation errors below.");
      return;
    }

    setLoading(true);


    try {

      try{
          await api.post("account/users/logout", {}, {
            _skipInterceptor: true 
          }); 
        
      }catch(logoutError){
        console.log("Logout Crash: ", logoutError)
      }


      const resp = await api.post("account/users/login", {
        email,
        password,
      });

      toast.success(resp.data.message);
      const user = await refreshAuth();

      if (user?.role === "MANAGER") {
        navigate("/dashboard/manager", { replace: true });
      } else if (user?.role === "STAFF") {
        navigate("/staff/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      let apiMessage = "Network connection Error. Please try again.";

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

          {/* Book body — two facing pages, equal height */}
          <div className="relative grid grid-cols-1 lg:grid-cols-5 items-stretch border border-[#D9CFBA] bg-[#FDFBF6] shadow-[0_40px_90px_-45px_rgba(15,42,46,0.6)]">

            {/* ─── LEFT PAGE — Brand & Value Prop ─── */}
            <aside className="relative lg:col-span-2 min-h-[480px] bg-[#0F2A2E] overflow-hidden">

              {/* Full-bleed image */}
              <img
                src="/serengeti_zebras.jpg"
                alt="SafariGen — welcome back"
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

                {/* Logo */}
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8772E]"
                >
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#E8772E]">
                    Safari<span className="text-[#FDFBF6]">Gen</span>
                  </span>
                </Link>

                {/* Headline + value props */}
                <div className="space-y-6">
                  <h2 className="font-serif text-[26px] sm:text-[30px] lg:text-[34px] font-bold leading-[1.12] tracking-tight text-[#FDFBF6]">
                    Bring your workflows{" "}
                    <span className="italic text-[#F2B544]">
                      all in one place
                    </span>
                    .
                  </h2>

                  <div className="space-y-3 text-sm text-[#F6F1E7]/80">
                    {[
                      "Turn raw booking data into clean schedules in seconds.",
                      "Seamless real-time team and group collaboration.",
                      "Direct client-ready handoffs with custom branding.",
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

            {/* ─── RIGHT PAGE — Login Form ─── */}
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
                    Sign in
                  </span>
                </div>

                <h1 className="font-serif text-[26px] sm:text-[30px] font-bold tracking-tight text-[#0F2A2E]">
                  Welcome back
                </h1>

                <p className="text-xs sm:text-sm text-[#6B6459] mt-1.5">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-[#B34F12] hover:text-[#E8772E] font-semibold transition-colors border-b border-dashed border-[#B34F12]/40 hover:border-[#E8772E] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                  >
                    Create one
                  </Link>
                </p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>

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
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email)
                          setErrors({ ...errors, email: null });
                      }}
                      placeholder="alex@company.com"
                      autoComplete="email"
                      className={`w-full bg-white border pl-11 pr-4 py-3 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.email
                          ? "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-[#8E2A1F]/20"
                          : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-[#E8772E]/20"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* ── Password ── */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                      Password <span className="text-[#B34F12]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => navigate("/reset-password")}
                      className="text-[11px] font-semibold tracking-wider text-[#B34F12] hover:text-[#E8772E] border-b border-dashed border-[#B34F12]/40 hover:border-[#E8772E] transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-colors group-focus-within:text-[#E8772E]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password)
                          setErrors({ ...errors, password: null });
                      }}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className={`w-full bg-white border pl-11 pr-11 py-3 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.password
                          ? "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-[#8E2A1F]/20"
                          : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-[#E8772E]/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6459] hover:text-[#0F2A2E] transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-[#8E2A1F] mt-1 animate-in slide-in-from-top-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* ── Submit ── */}
                <div className="pt-1">
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
                        Signing in…
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>

                {/* ── Trust badge ── */}
                <div className="flex items-center justify-center gap-2 pt-1 text-[11px] tracking-wide text-[#6B6459]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E8772E]" />
                  Your credentials are encrypted and never shared.
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
    </div>
  );
}