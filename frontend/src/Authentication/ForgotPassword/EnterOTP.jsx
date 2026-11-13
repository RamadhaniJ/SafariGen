import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

export default function EnterOTPToResetPasswordPage({ email: emailProp }) {
  const location = useLocation();
  const navigate = useNavigate();


  const email = emailProp || location.state?.email || sessionStorage.getItem("reset_email")

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  // ---------- Redirect kama hakuna email ----------
  useEffect(() => {
    document.title = "Forgot password | SafariGen";  
    if (!email) {
      toast.error("Please enter your email first.");
      navigate("/reset-password", { replace: true });
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
     const resp =  await api.post("account/users/password-reset/opt", {
        email,
        otp_code: code,
      });

    sessionStorage.setItem("reset_token", resp.data.reset_token);

      toast.success(`${resp.data.message}! 🎉`);

      navigate("/reset-password-confirmation", 
        { 
             state: { reset_token :  resp.data.reset_token },
             replace: true 

            }
    );
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
     const resp =   await api.post("account/users/password-reset/resend", { email });
      toast.success(resp.data.message);
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
                  <Mail className="w-6 h-6 text-[#B34F12]" />
                </div>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2A2E]">
              Check your inbox
            </h2>

            <p className="text-[#6B6459] text-sm leading-relaxed max-w-xs mx-auto">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-[#0F2A2E] break-all">
                {email || "your email"}
              </span>
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
                  className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold rounded-xl bg-white border-2 text-[#0F2A2E] caret-[#E8772E] transition-all duration-200 outline-none
                    ${
                      error
                        ? "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-4 focus:ring-[#8E2A1F]/15"
                        : digit
                        ? "border-[#E8772E]/60 focus:border-[#E8772E] focus:ring-4 focus:ring-[#E8772E]/15 shadow-sm shadow-[#E8772E]/10"
                        : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-4 focus:ring-[#E8772E]/15 focus:-translate-y-0.5"
                    }
                    disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:cursor-not-allowed
                  `}
                />
              ))}
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center justify-center gap-2 text-sm text-[#8E2A1F] font-medium bg-[#FBE5E2] border border-[#8E2A1F]/20 rounded-xl px-3 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8E2A1F] shrink-0" />
                {error}
              </div>
            )}

            {/* Verify button — Savannah night text on ember (WCAG-safe) */}
            <button
              type="submit"
              disabled={loading || !codeComplete}
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
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Verify code
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <span className="h-px flex-1 bg-[#E4DCCB]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B6459]">
              Didn't get it?
            </span>
            <span className="h-px flex-1 bg-[#E4DCCB]" />
          </div>

          {/* Resend + Change email */}
          <div className="flex items-center justify-between text-sm">
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
              onClick={() => navigate("/reset-password")}
              className="flex items-center gap-1 text-[#6B6459] hover:text-[#0F2A2E] transition-colors
                         rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Change email
            </button>
          </div>
        </div>

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B6459] mt-6">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E8772E]" />
          Secure verification — never share this code with anyone.
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