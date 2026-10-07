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
    <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] flex font-sans selection:bg-[#E8772E] selection:text-[#0F2A2E]">
      {/* ================= LEFT PANEL ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F2A2E] p-12 flex-col justify-between overflow-hidden">
        <div className="absolute top-0 -left-10 w-96 h-96 bg-[#E8772E]/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F2B544]/10 blur-[120px] pointer-events-none" />

        {/* Step indicator */}
        <div className="relative z-10 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-[#F2B544]/80">
          <span className="px-2.5 py-1 rounded-full bg-[#E8772E]/15 border border-[#E8772E]/30 text-[#F2B544]">
            Step 2 / 3
          </span>
          <span>Verify Email Address</span>
        </div>

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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8772E]/15 border border-[#E8772E]/30 text-[#F2B544] text-xs font-semibold tracking-wide uppercase">
                        <Sparkles className="w-3.5 h-3.5" />
                        Step 2 of 3: Email Address Verification
                    </div>

          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-[#F6F1E7]">
            Verify your email to{" "}
            <span className="text-[#F2B544]">activate</span> your account.
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

        <div className="relative z-10 text-xs text-[#F6F1E7]/40">
          © {new Date().getFullYear()} SafariGen Ltd. All rights reserved.
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
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
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FCE9DA] border border-[#E4DCCB] flex items-center justify-center">
              <Mail className="w-7 h-7 text-[#B34F12]" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#0F2A2E]">
              Check your inbox
            </h2>

            <p className="text-[#6B6459] text-sm leading-relaxed">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-[#0F2A2E] break-all">
                {email || "your email"}
              </span>
              . The code expires in{" "}
              <strong className="text-[#0F2A2E]">5 minutes</strong>.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP inputs */}
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
                  className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold rounded-xl bg-white border-2 text-[#0F2A2E] caret-[#E8772E] transition-all outline-none
                    ${
                      error
                        ? "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-4 focus:ring-[#8E2A1F]/15"
                        : digit
                        ? "border-[#E8772E]/60 focus:border-[#E8772E] focus:ring-4 focus:ring-[#E8772E]/15"
                        : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-4 focus:ring-[#E8772E]/15"
                    }
                    disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:cursor-not-allowed
                  `}
                />
              ))}
            </div>

            {/* Error message */}
            {error && (
              <div className="text-center text-sm text-[#8E2A1F] font-medium">
                {error}
              </div>
            )}

            {/* Verify button — Savannah night text on ember (WCAG-safe) */}
            <button
              type="submit"
              disabled={loading || !codeComplete}
              className="w-full py-3 px-4 rounded-xl bg-[#E8772E] text-[#0F2A2E] font-semibold text-sm
                         hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/30 transition-all
                         active:bg-[#B34F12] active:text-white active:scale-[0.99]
                         disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:shadow-none disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 cursor-pointer
                         focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Verify Email
                </>
              )}
            </button>
          </form>

          {/* Resend + Change email */}
          <div className="flex items-center justify-between text-sm pt-2 border-t border-[#E4DCCB]">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="flex items-center gap-1.5 text-[#B34F12] hover:text-[#E8772E] font-semibold
                         transition-colors disabled:text-[#A39C8F] disabled:cursor-not-allowed
                         rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`}
              />
              {cooldown > 0
                ? `Resend in ${cooldown}s`
                : resending
                ? "Sending..."
                : "Resend code"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="flex items-center gap-1 text-[#6B6459] hover:text-[#0F2A2E] transition-colors
                         rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Change email
            </button>
          </div>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B6459]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E8772E]" />
            Secure verification — never share this code with anyone.
          </div>
        </div>
      </div>
    </div>
  );
}