import { useState } from "react";
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
    Loader2
} from "lucide-react";

export default function SignUpPage() {
    const navigate = useNavigate();

    const [cName, setCName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        const phoneRegex = /^(?:\+255|0)[67]\d{8}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!cName.trim() || cName.trim().length < 2) {
            newErrors.cName = "Enter your company name (at least 2 characters)";
        }

        if (!email.trim()) {
            newErrors.email = "Enter your email address";
        } else if (!emailRegex.test(email.trim())) {
            newErrors.email = "Enter a valid email address";
        }

        if (!phone.trim()) {
            newErrors.phone = "Enter phone number";
        } else if (!phoneRegex.test(phone.trim().replace(/\s+/g, ""))) {
            newErrors.phone = "Enter a valid phone number (e.g., +255 7XX XXX XXX)";
        }

        if (!password) {
            newErrors.password = "Enter your password";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
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
            const resp = await api.post("account/users/register", 
                {
                    company_name: cName,
                    email : email,
                    phone_number: phone,
                    password1: password,
                    password2: confirmPassword
                 })
            
            toast.success("Account created successfully! Welcome aboard.");
            navigate("/login");
        } catch (error) {
            let apiMessage = "Registration failed. Please try again.";

            if (error?.response?.data) {
                const data = error.response.data;

                if (typeof data === "string") {
                    // Kama backend imerudisha string moja kwa moja
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
        <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-fuchsia-500 selection:text-white">
            {/* LEFT PANEL: Brand & Value Prop (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 border-r border-slate-800/80 p-12 flex-col justify-between overflow-hidden">
                {/* Glow Overlay */}
                <div className="absolute top-0 -left-10 w-96 h-96 bg-fuchsia-600/20 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 blur-[120px] pointer-events-none" />

                {/* Logo */}
                <div className="relative z-10">
                    <Link to="/" className="inline-flex items-center gap-1">
                        <span className="text-3xl font-black tracking-tight text-fuchsia-500">
                            Ip<span className="text-white">s</span>
                        </span>
                    </Link>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-lg my-auto space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-950/60 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-semibold tracking-wide uppercase">
                        <Sparkles className="w-3.5 h-3.5" />
                        Join 1,000+ Travel Leaders
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
                        Start your journey to automated itinerary workflows.
                    </h1>

                    <div className="space-y-4 text-slate-300 text-sm">
                        {[
                            "Turn raw booking data into clean schedules in seconds.",
                            "Seamless real-time team and group collaboration.",
                            "Direct client-ready handoffs with custom branding."
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-fuchsia-400 shrink-0" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer / Copyright */}
                <div className="relative z-10 text-xs text-slate-500">
                    © {new Date().getFullYear()} Ips Inc. All rights reserved.
                </div>
            </div>

            {/* RIGHT PANEL: Sign Up Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Mobile Glow */}
                <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-sm h-64 bg-fuchsia-600/15 blur-[90px] pointer-events-none" />

                <div className="w-full max-w-md space-y-8 relative z-10">
                    {/* Header */}
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-white">
                            Create your account
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {/* Company Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                Company Name
                            </label>
                            <div className="relative">
                                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={cName}
                                    onChange={(e) => {
                                        setCName(e.target.value);
                                        if (errors.cName) setErrors({ ...errors, cName: null });
                                    }}
                                    placeholder="ABC Travel Ltd."
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none transition-all ${
                                        errors.cName
                                            ? "border-red-500 focus:ring-1 focus:ring-red-500"
                                            : "border-slate-800 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500"
                                    }`}
                                />
                            </div>
                            {errors.cName && <p className="text-xs text-red-400">{errors.cName}</p>}
                        </div>

                        {/* Email Address */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors({ ...errors, email: null });
                                    }}
                                    placeholder="alex@company.com"
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none transition-all ${
                                        errors.email
                                            ? "border-red-500 focus:ring-1 focus:ring-red-500"
                                            : "border-slate-800 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500"
                                    }`}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                        if (errors.phone) setErrors({ ...errors, phone: null });
                                    }}
                                    placeholder="+255 7XX XXX XXX"
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none transition-all ${
                                        errors.phone
                                            ? "border-red-500 focus:ring-1 focus:ring-red-500"
                                            : "border-slate-800 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500"
                                    }`}
                                />
                            </div>
                            {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors({ ...errors, password: null });
                                    }}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none transition-all ${
                                        errors.password
                                            ? "border-red-500 focus:ring-1 focus:ring-red-500"
                                            : "border-slate-800 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                                    }}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none transition-all ${
                                        errors.confirmPassword
                                            ? "border-red-500 focus:ring-1 focus:ring-red-500"
                                            : "border-slate-800 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-semibold text-sm hover:from-fuchsia-500 hover:to-purple-500 shadow-lg shadow-fuchsia-500/20 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Your Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Terms */}
                    <p className="text-center text-xs text-slate-500 leading-relaxed">
                        By signing up, you agree to our{" "}
                        <a href="#" className="underline hover:text-slate-300">Terms of Service</a>{" "}
                        and{" "}
                        <a href="#" className="underline hover:text-slate-300">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}