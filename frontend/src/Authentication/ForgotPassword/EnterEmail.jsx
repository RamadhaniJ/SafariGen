import { use, useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../Apis/api";

import { 
    Mail,  
    CheckCircle2, 
    ArrowRight,
    Loader2,
    ShieldCheck,
    ArrowLeft,
    KeyRound
} from "lucide-react";


export default function EnterEmailToResetPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        document.title = "Forgot password | SafariGen";    
        return () => {
          document.title = "SafariGen | Automated Safari Itinerary & Tour Pricing";
        };
      }, []);
    



    const validate = () => {
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!email.trim()) {
            newErrors.email = "Enter your email address";
        } else if (!emailRegex.test(email.trim())) {
            newErrors.email = "Enter a valid email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix the validation errors below.");
            return;
        }

        setLoading(true);

        try {

            const resp = await api.post("account/users/password-reset/email",
                {
                    email: email,
                }
            );
            
            sessionStorage.setItem("reset_email", email);
            navigate("/validate-email-otp", {
            state: { email: email },
            replace: true,
        });
     


            
            

        } catch (error) { 
            let apiMessage = "Network connection Error. Please try again.";

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
                        const fieldName = firstKey.charAt(0).toUpperCase() + firstKey.slice(1);
                        
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
    <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] flex font-sans selection:bg-[#E8772E] selection:text-[#0F2A2E] relative overflow-hidden">

        {/* Ambient background washes */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#E8772E]/10 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#F2B544]/15 blur-[140px]" />

        {/* Centered wrapper */}
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

                    {/* Icon badge */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-2xl bg-[#E8772E]/20 blur-md" />
                            <div className="relative w-14 h-14 rounded-2xl bg-[#FCE9DA] border border-[#E8772E]/20 flex items-center justify-center">
                                <KeyRound className="w-6 h-6 text-[#B34F12]" />
                            </div>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center space-y-2 mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F2A2E]">
                            Forgot your password?
                        </h2>
                            <p className="text-sm text-[#6B6459] leading-relaxed">
                                Enter your account email, and we'll send you an OTP code.
                            </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                        {/* Email Address */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#E8772E]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors({ ...errors, email: null });
                                    }}
                                    placeholder="alex@company.com"
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border text-[#0F2A2E] placeholder:text-[#6B6459]/50 text-sm focus:outline-none transition-all ${
                                        errors.email
                                            ? "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-2 focus:ring-[#8E2A1F]/20"
                                            : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20"
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-[#8E2A1F] flex items-center gap-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Submit Button — Savannah night text on ember (WCAG-safe) */}
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
                                    Sending reset link...
                                </>
                            ) : (
                                <>
                                    Send reset link
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 pt-1">
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
                    </form>
                </div>

                {/* Trust footer */}
                <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B6459] mt-6">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E8772E]" />
                    We'll never share your email with anyone.
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