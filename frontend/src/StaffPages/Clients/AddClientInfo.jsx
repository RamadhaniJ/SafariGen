import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../Apis/api';
import { User, Mail, Phone, Globe, ChevronDown, Loader2, CheckCircle2 } from 'lucide-react';
import {COUNTRIES} from '../../Constants/Countries';

const SALUTATIONS = ['Mr', 'Mrs', 'Ms', 'Prof', 'Dr'];
const SOURCE_OPTIONS = ['Website', 'Facebook', 'Instagram', 'Agent'];

export default function CreateClientInformationPage() {
    const navigate = useNavigate();

    // ── Form State ──
    const [salutation, setSalutation] = useState('');
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [email, setEmail] = useState(''); 
    const [country, setCountry] = useState('');
    const [phone, setPhone] = useState('');
    const [source, setSource] = useState('');

    // ── UI State ──
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [touched, setTouched] = useState({
        salutation: false,
        fName: false,
        lName: false,
        email: false,
        country: false,
        phone: false,
        source: false,
    });

    const [showSuccess, setShowSuccess] = useState(false);
    // ── Refs ──
    const countryRef = useRef(null);

    const filteredCountries = COUNTRIES.filter((c) =>
        c.toLowerCase().includes(country.toLowerCase())
    );

    // ── Click Outside: close country dropdown ──
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (countryRef.current && !countryRef.current.contains(event.target)) {
                setIsCountryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ── Validation ──
    const validateField = (field, value) => {
        switch (field) {
            case 'salutation':
                return value ? '' : 'Please select a salutation.';
            case 'fName':
                return value.trim() ? '' : 'First name is required.';
            case 'lName':
                return value.trim() ? '' : 'Last name is required.';
            case 'email':
                if (!value.trim()) return 'Email is required.';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
                return '';
            case 'country':
                return value.trim() ? '' : 'Please select your country.';
            case 'phone':
                if (!value.trim()) return 'Phone number is required.';
                if (!/^[\+\d\s\-\(\)]{7,20}$/.test(value.trim())) return 'Enter a valid phone number.';
                return '';
            case 'source':
                return value ? '' : 'Please select how you heard about us.';
            default:
                return '';
        }
    };

    const getFieldError = (field) => {
        const valueMap = {
            salutation,
            fName,
            lName,
            email,
            country,
            phone,
            source,
        };
        if (!touched[field]) return '';
        return validateField(field, valueMap[field]);
    };
 
    const isFormValid = () => {
        const fields = ['salutation', 'fName', 'lName', 'email', 'country', 'phone', 'source'];
        return fields.every((field) => {
            const valueMap = { salutation, fName, lName, email, country, phone, source };
            return validateField(field, valueMap[field]) === '';
        });
    };

    // ── Handlers ──
    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleSelectCountry = (selected) => {
        setCountry(selected);
        setIsCountryOpen(false);
        setTouched((prev) => ({ ...prev, country: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark all fields as touched to show errors
        setTouched({
            salutation: true,
            fName: true,
            lName: true,
            email: true,
            country: true,
            phone: true,
            source: true,
        });

        if (!isFormValid()) {
            toast.error('Please fix the highlighted fields before continuing.');
            return;
        }
        const payload = {
               email,
                salutation,
                first_name: fName,
                last_name: lName,
                country,
                phone,
                source,
        }
        
        console.log(payload);

        setIsSubmitting(true);
        try {
           const resp =   await api.post('clients/create/clients/', {
                email,
                salutation,
                first_name: fName,
                last_name: lName,
                country,
                phone,
                source,
            });
            toast.success('Client information saved successfully!');
            setShowSuccess(true);
            setTimeout(() => navigate(`/staff/dashboard/create/client/request/${resp.data.id}`, { replace: true }), 1000);
        } catch (error) {
            const message = error.response?.data?.detail || 'Check your network connection.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };
 
    // ── Render ──
    return (
        <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-5xl mx-auto">
                {/* ─── Card ─── */}
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl shadow-2xl shadow-fuchsia-500/5 p-6 sm:p-8 transition-all duration-300">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* ── Row: Salutation + First + Last ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                            {/* Salutation */}
                            <div className="sm:col-span-3 space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Salutation <span className="text-fuchsish-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={salutation}
                                        onChange={(e) => setSalutation(e.target.value)}
                                        onBlur={() => handleBlur('salutation')}
                                        className={`w-full bg-slate-950 border rounded-xl px-4 py-3 pr-10 text-sm text-slate-100 appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 ${
                                            getFieldError('salutation')
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-slate-800 focus:border-fuchsia-500 focus:ring-fuchsia-500/20'
                                        }`}
                                    >
                                        <option value="" className="bg-slate-950 text-slate-500">
                                            Select…
                                        </option>
                                        {SALUTATIONS.map((s) => (
                                            <option key={s} value={s} className="bg-slate-950 text-slate-100">
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                </div>
                                {getFieldError('salutation') && (
                                    <p className="text-xs text-red-400 mt-1 animate-in slide-in-from-top-1">
                                        {getFieldError('salutation')}
                                    </p>
                                )}
                            </div>

                            {/* First Name */}
                            <div className="sm:col-span-4 space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    First Name <span className="text-fuchsia-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={fName}
                                    onChange={(e) => setFName(e.target.value)}
                                    onBlur={() => handleBlur('fName')}
                                    placeholder="John"
                                    className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 ${
                                        getFieldError('fName')
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                            : 'border-slate-800 focus:border-fuchsia-500 focus:ring-fuchsia-500/20'
                                    }`}
                                />
                                {getFieldError('fName') && (
                                    <p className="text-xs text-red-400 mt-1 animate-in slide-in-from-top-1">
                                        {getFieldError('fName')}
                                    </p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="sm:col-span-5 space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Last Name <span className="text-fuchsia-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={lName}
                                    onChange={(e) => setLName(e.target.value)}
                                    onBlur={() => handleBlur('lName')}
                                    placeholder="Mark"
                                    className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 ${
                                        getFieldError('lName')
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                            : 'border-slate-800 focus:border-fuchsia-500 focus:ring-fuchsia-500/20'
                                    }`}
                                />
                                {getFieldError('lName') && (
                                    <p className="text-xs text-red-400 mt-1 animate-in slide-in-from-top-1">
                                        {getFieldError('lName')}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ── Email ── */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Email Address <span className="text-fuchsia-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => handleBlur('email')}
                                    placeholder="you@example.com"
                                    className={`w-full bg-slate-950 border rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 ${
                                        getFieldError('email')
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                            : 'border-slate-800 focus:border-fuchsia-500 focus:ring-fuchsia-500/20'
                                    }`}
                                />
                            </div>
                            {getFieldError('email') && (
                                <p className="text-xs text-red-400 mt-1 animate-in slide-in-from-top-1">
                                    {getFieldError('email')}
                                </p>
                            )}
                        </div>

                        {/* ── Country ── */}
                        <div className="space-y-1.5" ref={countryRef}>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Country <span className="text-fuchsia-500">*</span>
                            </label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => {
                                        setCountry(e.target.value);
                                        setIsCountryOpen(true);
                                    }}
                                    onFocus={() => setIsCountryOpen(true)}
                                    onBlur={() => handleBlur('country')}
                                    placeholder="e.g. Mexico"
                                    className={`w-full bg-slate-950 border rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 ${
                                        getFieldError('country')
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                            : 'border-slate-800 focus:border-fuchsia-500 focus:ring-fuchsia-500/20'
                                    }`}
                                    autoComplete="off"
                                />
                                <ChevronDown
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-transform duration-200 ${
                                        isCountryOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </div>

                            {isCountryOpen && country && (
                                <ul className="absolute z-20 w-11/12 mt-1.5 bg-slate-950 border border-slate-800 rounded-xl max-h-60 overflow-y-auto shadow-2xl shadow-slate-950/80 custom-scrollbar">
                                    {filteredCountries.length > 0 ? (
                                        filteredCountries.map((c) => (
                                            <li
                                                key={c}
                                                onClick={() => handleSelectCountry(c)}
                                                className="px-4 py-2.5 text-sm text-slate-300 hover:bg-fuchsia-600 hover:text-white cursor-pointer transition-colors duration-150 flex items-center gap-2"
                                            >
                                                {c}
                                                {c === country && (
                                                    <CheckCircle2 className="w-4 h-4 text-fuchsia-400 ml-auto" />
                                                )}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="px-4 py-2.5 text-sm text-slate-500 italic">
                                            No country found
                                        </li>
                                    )}
                                </ul>
                            )}
                            {getFieldError('country') && (
                                <p className="text-xs text-red-400 mt-1 animate-in slide-in-from-top-1">
                                    {getFieldError('country')}
                                </p>
                            )}
                        </div>

                        {/* ── Phone ── */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Phone Number <span className="text-fuchsia-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    onBlur={() => handleBlur('phone')}
                                    placeholder="+1 234 567 8900"
                                    className={`w-full bg-slate-950 border rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 ${
                                        getFieldError('phone')
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                            : 'border-slate-800 focus:border-fuchsia-500 focus:ring-fuchsia-500/20'
                                    }`}
                                />
                            </div>
                            {getFieldError('phone') && (
                                <p className="text-xs text-red-400 mt-1 animate-in slide-in-from-top-1">
                                    {getFieldError('phone')}
                                </p>
                            )}
                        </div>

                        {/* ── Source (Radio Cards) ── */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                How did you hear about us? <span className="text-fuchsia-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {SOURCE_OPTIONS.map((src) => {
                                    const isSelected = source === src;
                                    return (
                                        <label
                                            key={src}
                                            onClick={() => {
                                                setSource(src);
                                                setTouched((prev) => ({ ...prev, source: true }));
                                            }}
                                            className={`relative flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200 select-none ${
                                                isSelected
                                                    ? 'bg-fuchsia-950/40 border-fuchsia-500/70 text-white shadow-lg shadow-fuchsia-500/10 ring-1 ring-fuchsia-500/40'
                                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-900/50'
                                            } ${getFieldError('source') && !isSelected ? 'border-red-500/40' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="source"
                                                value={src}
                                                checked={isSelected}
                                                onChange={() => {}}
                                                className="sr-only"
                                            />
                                            <span className="text-sm font-medium truncate">{src}</span>
                                            <div
                                                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                                                    isSelected
                                                        ? 'border-fuchsia-500 bg-fuchsia-500'
                                                        : 'border-slate-700 bg-slate-950'
                                                }`}
                                            >
                                                {isSelected && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-in zoom-in-50" />
                                                )}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                            {getFieldError('source') && (
                                <p className="text-xs text-red-400 mt-1 animate-in slide-in-from-top-1">
                                    {getFieldError('source')}
                                </p>
                            )}
                        </div>

                        {/* ─── Submit Button ─── */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full relative flex items-center justify-center gap-2.5 bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-400 disabled:from-fuchsia-700 disabled:to-fuchsia-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 disabled:shadow-none disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        Save & Continue
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>


                  {showSuccess && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl shadow-fuchsia-500/20 space-y-4">
                        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
                          <CheckCircle2 className="w-9 h-9" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">Request Created!</h2>
                          <p className="text-xs text-slate-400 mt-1">
                            Client request information saved successfully.
                          </p>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                          <div className="h-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 animate-pulse w-full" />
                        </div>
                        <p className="text-[11px] text-slate-500">Redirecting to itinerary builder...</p>
                      </div>
                    </div>
                  )}

            {/* ─── Global styles for custom scrollbar ─── */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #3b3b5c;
                    border-radius: 999px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #5b5b7c;
                }
            `}</style>
        </div>
    );
}