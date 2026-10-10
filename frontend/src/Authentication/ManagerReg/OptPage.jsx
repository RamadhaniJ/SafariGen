import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../Apis/api";

import {
  Mail,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function VerifyEmailByOTPpage({ email: emailProp }) {
  const location = useLocation();
  const navigate = useNavigate();

  // email inaweza kutoka props au location.state (kutoka register page)
  const email = emailProp || location.state?.email;

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  // ---------- Redirect kama hakuna email ----------
  useEffect(() => {
    document.title = "OTP Verify | SafariGen";
    if (!email) {
      toast.error("Please register first.");
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  // ---------- Auto-focus input ya kwanza ----------
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // ---------- Cooldown countdown ----------
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);



  // ---------- Handle typing ----------
  const handleChange = (index, value) => {
    // Chukua digit ya mwisho tu (kama mtu ametype haraka)
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned && value !== "") return;

    const next = [...digits];
    next[index] = cleaned.slice(-1);
    setDigits(next);
    setError("");

    // Sogeza mbele kama digit imewekwa
    if (cleaned && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit kama zote zimejazwa
    if (next.every((d) => d !== "")) {
      submitOTP(next.join(""));
    }
  };

  // ---------- Handle backspace ----------
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        // Futa digit ya sasa
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        // Rudi nyuma na futa
        const next = [...digits];
        next[index - 1] = "";
        setDigits(next);
        inputRefs.current[index - 1]?.focus();
      }
      setError("");
    }

    // Arrow keys navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ---------- Handle paste (6-digit code nzima) ----------
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setDigits(next);
    setError("");

    // Focus input ya mwisho iliyojaa
    const lastIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[lastIndex]?.focus();

    if (pasted.length === OTP_LENGTH) {
      submitOTP(pasted);
    }
  };

  // ---------- Submit OTP ----------
  const submitOTP = async (code) => {
    if (code.length !== OTP_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try { 
      await api.post("account/users/verify/email-opt", {
        email,
        otp_code: code,
      });

      toast.success("Email verified! 🎉");
      navigate("/company-details", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.otp_code?.[0] ||
        "Invalid or expired code. Try again.";

      setError(msg);
      toast.error(msg);

      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitOTP(digits.join(""));
  };

  // ---------- Resend OTP ----------
  const handleResend = async () => {
    if (cooldown > 0 || resending) return;

    setResending(true);
    try { 
      await api.post("account/users/resend-otp", { email });
      toast.success("New code sent! Check your inbox.");
      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      const retryAfter = err?.response?.data?.retry_after;
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Could not resend code. Try again.";
      toast.error(msg);
      if (retryAfter) setCooldown(retryAfter);
    } finally {
      setResending(false);
    }
  };

  

  const codeComplete = digits.every((d) => d !== "");

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

            {/* ─── LEFT PAGE — Brand & Step Indicator ─── */}
            <aside className="relative lg:col-span-2 min-h-[480px] bg-[#0F2A2E] overflow-hidden">

              {/* Full-bleed image */}
              <img
                src="/lion_image_step_two.webp"
                alt="SafariGen — verify your email"
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

                  {/* Step badge */}
                  <div className="inline-flex w-fit items-center gap-2.5 border border-[#F6F1E7]/20 bg-[#0F2A2E]/60 px-3.5 py-2 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F2B544]">
                      Step 2 / 3
                    </span>
                    <span className="h-3 w-px bg-[#F6F1E7]/25" />
                    <span className="text-[11px] font-semibold text-[#F6F1E7]/85">
                      Verify email
                    </span>
                  </div>

                  <h2 className="font-serif text-[26px] sm:text-[30px] lg:text-[34px] font-bold leading-[1.12] tracking-tight text-[#FDFBF6]">
                    Verify your email to{" "}
                    <span className="italic text-[#F2B544]">activate</span>{" "}
                    your account.
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
                  © {new Date().getFullYear()} SafariGen Ltd. All rights reserved.
                </div>
              </div>
            </aside>

            {/* ─── RIGHT PAGE — OTP Form ─── */}
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
                    Email verification
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  {/* Icon badge */}
                  <div className="w-12 h-12 shrink-0 bg-[#FCE9DA] border border-[#E4DCCB] flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#B34F12]" />
                  </div>

                  <div className="flex-1">
                    <h1 className="font-serif text-[26px] sm:text-[28px] font-bold tracking-tight text-[#0F2A2E] leading-tight">
                      Check your inbox
                    </h1>
                    <p className="text-xs sm:text-sm text-[#6B6459] mt-1.5 leading-relaxed">
                      We sent a 6-digit code to{" "}
                      <span className="font-semibold text-[#0F2A2E] break-all">
                        {email || "your email"}
                      </span>
                      . The code expires in{" "}
                      <strong className="text-[#0F2A2E]">5 minutes</strong>.
                    </p>
                  </div>
                </div>
              </header>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* ── OTP inputs ── */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                    Verification code
                  </label>

                  <div
                    className="flex items-center justify-center gap-2 sm:gap-3"
                    onPaste={handlePaste}
                  >
                    {digits.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (inputRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onFocus={(e) => e.target.select()}
                        disabled={loading}
                        aria-label={`OTP digit ${i + 1}`}
                        className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold bg-white border text-[#0F2A2E] caret-[#E8772E] transition-all duration-200 outline-none focus:ring-2
                          ${
                            error
                              ? "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-[#8E2A1F]/20"
                              : digit
                              ? "border-[#E8772E]/60 focus:border-[#E8772E] focus:ring-[#E8772E]/20"
                              : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-[#E8772E]/20"
                          }
                          disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:cursor-not-allowed
                        `}
                      />
                    ))}
                  </div>
                </div>

                {/* ── Error message ── */}
                {error && (
                  <p className="text-xs text-[#8E2A1F] text-center font-medium animate-in slide-in-from-top-1">
                    {error}
                  </p>
                )}

                {/* ── Verify button ── */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading || !codeComplete}
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
                        Verifying…
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        Verify email
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* ── Resend + Change email ── */}
              <div className="flex items-center justify-between text-xs sm:text-sm pt-5 mt-6 border-t border-[#E4DCCB]">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || cooldown > 0}
                  className="flex items-center gap-1.5 text-[#B34F12] hover:text-[#E8772E] font-semibold
                             transition-colors disabled:text-[#A39C8F] disabled:cursor-not-allowed
                             focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`}
                  />
                  {cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : resending
                    ? "Sending…"
                    : "Resend code"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="flex items-center gap-1 text-[#6B6459] hover:text-[#0F2A2E] transition-colors
                             focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Change email
                </button>
              </div>

              {/* ── Trust badge ── */}
              <div className="flex items-center justify-center gap-2 pt-5 mt-2 text-[11px] tracking-wide text-[#6B6459]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E8772E]" />
                Secure verification — never share this code with anyone.
              </div>
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