import { use, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../Apis/api";

import { 
    Building2, 
    Mail, 
    Phone, 
    Lock, 
    Eye, 
    EyeOff, 
    Sparkles, 
    CheckCircle2, 
    ArrowRight,
    Loader2,
    ShieldCheck
} from "lucide-react";

import { AuthenticationContext } from "../Apis/AuthProvider";

export default function LogInPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const {refreshAuth} = useContext(AuthenticationContext);


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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix the validation errors below.");
            return;
        }

        setLoading(true);

        try {

            const resp = await api.post("account/users/login",
                {
                    email: email,
                    password : password,
                }
            );


            toast.success(resp.data.message);
            const user =  await refreshAuth();


            if (user?.role === "MANAGER"){
                navigate("/dashboard/manager", {replace: true});

            }else if (user?.role === "STAFF"){
                navigate("/staff/dashboard", {replace: true})

            }else{
                navigate("/", {replace: true});
            }

            
            

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
  <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] flex font-sans selection:bg-[#E8772E] selection:text-[#0F2A2E]">

    {/* LEFT PANEL: Brand & Value Prop (Hidden on mobile) */}
    <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F2A2E] p-12 flex-col justify-between overflow-hidden">
      {/* Glow Overlay */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-[#E8772E]/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F2B544]/10 blur-[120px] pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8772E] rounded"
        >
          <span className="text-3xl font-black tracking-tight text-[#E8772E]">
            Ip<span className="text-[#F6F1E7]">s</span>
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-lg my-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-[#F6F1E7]">
          Bring your workflows{" "}
          <span className="text-[#F2B544]">all in one place</span>.
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

      {/* Footer / Copyright */}
      <div className="relative z-10 text-xs text-[#F6F1E7]/40">
        © {new Date().getFullYear()} Ips Inc. All rights reserved.
      </div>
    </div>

    {/* RIGHT PANEL: Login Form */}
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
      {/* Mobile Glow */}
      <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-sm h-64 bg-[#FCE9DA] blur-[90px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Mobile logo */}
        <div className="lg:hidden text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8772E] rounded"
          >
            <span className="text-3xl font-black tracking-tight text-[#E8772E]">
              Ip<span className="text-[#0F2A2E]">s</span>
            </span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center lg:text-left space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-[#0F2A2E]">
            Welcome Back
          </h2>
          <p className="text-[#6B6459] text-sm">
            You don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#B34F12] hover:text-[#E8772E] font-semibold transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
            >
              create one
            </Link>
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
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border text-[#0F2A2E] placeholder:text-[#6B6459]/60 text-sm focus:outline-none transition-all ${
                  errors.email
                    ? "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-2 focus:ring-[#8E2A1F]/20"
                    : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-[#8E2A1F]">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                Password
              </label>
              <button
                type="button"
                onClick={() => navigate("/reset-password")}
                className="text-xs font-semibold tracking-wider text-[#B34F12] hover:text-[#E8772E] border-b border-dashed border-[#B34F12]/40 hover:border-[#E8772E] transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative group">
              <Lock className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#E8772E]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border text-[#0F2A2E] placeholder:text-[#6B6459]/60 text-sm focus:outline-none transition-all ${
                  errors.password
                    ? "border-[#8E2A1F] focus:border-[#8E2A1F] focus:ring-2 focus:ring-[#8E2A1F]/20"
                    : "border-[#E4DCCB] focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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

          {/* Submit Button — Savannah night text on ember (WCAG-safe) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#E8772E] text-[#0F2A2E] font-semibold text-sm
                       hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/25 transition-all
                       hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                       active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                       disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2 cursor-pointer mt-2
                       focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B6459] pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E8772E]" />
          Your credentials are encrypted and never shared.
        </div>
      </div>
    </div>
  </div>
);
}