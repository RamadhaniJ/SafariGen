import { useState, useEffect, useRef } from "react";
import api from "../../Apis/api";
import { COUNTRIES } from "../../Constants/Countries";
import { toast } from "sonner";
import {
    Edit3,
    X,
    ChevronDown,
    Globe,
    CheckCircle2,
    Phone,
} from "lucide-react";

const SALUTATIONS = ["Mr", "Mrs", "Ms", "Prof", "Dr"];
const SOURCE_OPTIONS = ["Website", "Facebook", "Instagram", "Agent"];

export default function EditClientInfoComponentGlobal({
    isOpen,
    client,
    companyData = [],
    loadingCompanies = false,
    onClose,
    onUpdate,
}) {
    // ── Form state ─────────────────────────────────────────────
    const [salutation, setSalutation] = useState("");
    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [phone, setPhone] = useState("");
    const [source, setSource] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [companyError, setCompanyError] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const countryRef = useRef(null);

    // ── Hydrate form when modal opens with a client ────────────
    useEffect(() => {
        if (!isOpen || !client) return;
        setSalutation(client.salutation || "");
        setFName(client.first_name || "");
        setLName(client.last_name || "");
        setEmail(client.email || "");
        setCountry(client.country || "");
        setPhone(client.phone || "");
        setSource(client.source || "");
        setSelectedCompany(client.company_id || client.company || "");
        setCompanyError("");
        setIsCountryOpen(false);
    }, [isOpen, client]);

    // ── Close country dropdown on outside click ────────────────
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (countryRef.current && !countryRef.current.contains(event.target)) {
                setIsCountryOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ── Early return AFTER hooks (important!) ──────────────────
    if (!isOpen || !client) return null;

    const filteredCountries = (COUNTRIES || []).filter((c) =>
        c.toLowerCase().includes(country.toLowerCase())
    );

    const handleSelectCountry = (selected) => {
        setCountry(selected);
        setIsCountryOpen(false);
    };

    // ── Submit update ──────────────────────────────────────────
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCompany) {
            setCompanyError("Please select a company for this client.");
            return;
        }

        setIsEditing(true);

        const payload = {
            salutation,
            first_name: fName,
            last_name: lName,
            email,
            country,
            phone,
            source,
            company: selectedCompany,
        };

        try {
            const resp = await api.put(
                `clients/update/clients/${client.id}/`,
                payload
            );
            toast.success("Client updated successfully.");
            onUpdate?.(resp.data);   // notify parent
            onClose?.();             // close modal
        } catch (err) {
            if (err.response?.data) {
                const errors = err.response.data;
                const errorMsg =
                    typeof errors === "object"
                        ? Object.values(errors).flat().join(" ")
                        : "Update failed";
                toast.error(errorMsg);
            } else {
                toast.error("Check your internet connection");
            }
        } finally {
            setIsEditing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#0F2A2E]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white border border-[#E4DCCB] rounded-2xl p-6 max-w-xl w-full shadow-[0_20px_60px_-15px_rgba(15,42,46,0.3)] space-y-6 my-8 overflow-y-auto max-h-screen animate-in zoom-in-95 duration-200">

                {/* ── Header ───────────────────────────────────── */}
                <div className="flex items-center justify-between border-b border-[#E4DCCB] pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#FCE9DA] flex items-center justify-center">
                            <Edit3 className="w-4 h-4 text-[#B34F12]" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-[#0F2A2E]">
                                Edit client information
                            </h3>
                            <p className="text-xs text-[#6B6459]">
                                Update personal and source profile details.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#6B6459] hover:text-[#0F2A2E] p-1.5 rounded-lg hover:bg-[#F6F1E7] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-4">

                    {/* Salutation */}
                    <div>
                        <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-widest mb-1.5">
                            Salutation <span className="text-[#B34F12]">*</span>
                        </label>
                        <div className="relative">
                            <select
                                required
                                value={salutation}
                                onChange={(e) => setSalutation(e.target.value)}
                                className="w-full bg-white border border-[#E4DCCB] rounded-xl px-4 py-3 text-sm text-[#0F2A2E] focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Select salutation…</option>
                                {SALUTATIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] pointer-events-none" />
                        </div>
                    </div>

                    {/* Names */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-widest mb-1.5">
                                First name <span className="text-[#B34F12]">*</span>
                            </label>
                            <input
                                type="text"
                                value={fName}
                                onChange={(e) => setFName(e.target.value)}
                                required
                                className="w-full bg-white border border-[#E4DCCB] rounded-xl px-4 py-3 text-sm text-[#0F2A2E] focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-widest mb-1.5">
                                Last name <span className="text-[#B34F12]">*</span>
                            </label>
                            <input
                                type="text"
                                value={lName}
                                onChange={(e) => setLName(e.target.value)}
                                required
                                className="w-full bg-white border border-[#E4DCCB] rounded-xl px-4 py-3 text-sm text-[#0F2A2E] focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-widest mb-1.5">
                            Email address <span className="text-[#B34F12]">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-white border border-[#E4DCCB] rounded-xl px-4 py-3 text-sm text-[#0F2A2E] focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all"
                        />
                    </div>

                    {/* Country autocomplete */}
                    <div className="relative" ref={countryRef}>
                        <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-widest mb-1.5">
                            Country <span className="text-[#B34F12]">*</span>
                        </label>
                        <div className="relative group">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-colors group-focus-within:text-[#E8772E]" />
                            <input
                                type="text"
                                value={country}
                                onChange={(e) => {
                                    setCountry(e.target.value);
                                    setIsCountryOpen(true);
                                }}
                                onFocus={() => setIsCountryOpen(true)}
                                required
                                placeholder="Search or select country..."
                                className="w-full bg-white border border-[#E4DCCB] rounded-xl pl-11 pr-10 py-3 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all"
                            />
                            <ChevronDown
                                className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-transform duration-200 pointer-events-none ${
                                    isCountryOpen ? "rotate-180" : ""
                                }`}
                            />
                        </div>

                        {isCountryOpen && (
                            <ul className="absolute z-30 w-full mt-1.5 bg-white border border-[#E4DCCB] rounded-xl max-h-48 overflow-y-auto shadow-[0_12px_32px_-8px_rgba(15,42,46,0.18)] py-1">
                                {filteredCountries.length > 0 ? (
                                    filteredCountries.map((c) => (
                                        <li
                                            key={c}
                                            onClick={() => handleSelectCountry(c)}
                                            className="px-4 py-2 text-sm text-[#0F2A2E] hover:bg-[#FCE9DA] hover:text-[#B34F12] cursor-pointer transition-colors flex items-center justify-between"
                                        >
                                            <span>{c}</span>
                                            {c === country && (
                                                <CheckCircle2 className="w-4 h-4 text-[#E8772E]" />
                                            )}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-2.5 text-xs text-[#6B6459] italic">
                                        No country found
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-widest mb-1.5">
                            Phone number <span className="text-[#B34F12]">*</span>
                        </label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6459] transition-colors group-focus-within:text-[#E8772E]" />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                placeholder="+1 234 567 8900"
                                className="w-full bg-white border border-[#E4DCCB] rounded-xl pl-11 pr-4 py-3 text-sm text-[#0F2A2E] placeholder:text-[#6B6459]/50 focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Company Selection */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-wider">
                            Company for this Client <span className="text-[#B34F12]">*</span>
                        </label>

                        {loadingCompanies ? (
                            <div className="flex items-center justify-center p-4 border border-dashed border-[#E4DCCB] bg-[#F6F1E7]/50 rounded-xl">
                                <span className="text-sm text-[#6B6459] animate-pulse">
                                    Loading companies...
                                </span>
                            </div>
                        ) : companyData.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {companyData.map((comp) => {
                                    const isSelected = selectedCompany === comp.id;
                                    return (
                                        <button
                                            type="button"
                                            key={comp.id}
                                            onClick={() => {
                                                setSelectedCompany(comp.id);
                                                setCompanyError("");
                                            }}
                                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                                                isSelected
                                                    ? "border-[#E8772E] bg-[#E8772E]/5 ring-1 ring-[#E8772E]"
                                                    : "border-[#E4DCCB] hover:border-[#E8772E]/50 hover:bg-[#F6F1E7]/60"
                                            }`}
                                        >
                                            <img
                                                src={comp.logo || "https://via.placeholder.com/32?text=C"}
                                                alt={comp.name}
                                                loading="lazy"
                                                className="w-8 h-8 rounded-full object-cover border border-[#E4DCCB] bg-white shrink-0"
                                            />
                                            <span className="flex-1 text-sm font-medium text-[#0F2A2E] truncate">
                                                {comp.name}
                                            </span>
                                            {isSelected && (
                                                <CheckCircle2 className="w-5 h-5 text-[#E8772E] shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-4 border border-dashed border-[#8E2A1F]/25 bg-[#FBE5E2]/40 rounded-xl text-center">
                                <p className="text-sm text-[#8E2A1F]">
                                    You don't belong to any verified company, or your companies aren't verified. Please contact your administrator.
                                </p>
                            </div>
                        )}

                        {companyError && (
                            <p className="text-xs font-medium text-[#8E2A1F]">
                                {companyError}
                            </p>
                        )}
                    </div>

                    {/* Source */}
                    <div>
                        <label className="block text-xs font-semibold text-[#0F2A2E]/80 uppercase tracking-widest mb-1.5">
                            Source <span className="text-[#B34F12]">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {SOURCE_OPTIONS.map((src) => {
                                const isSelected = source === src;
                                return (
                                    <button
                                        type="button"
                                        key={src}
                                        onClick={() => setSource(src)}
                                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                            isSelected
                                                ? "bg-[#FCE9DA] border-[#E8772E]/60 text-[#0F2A2E] shadow-sm shadow-[#E8772E]/10 ring-1 ring-[#E8772E]/30"
                                                : "bg-white border-[#E4DCCB] text-[#6B6459] hover:border-[#0F2A2E]/25 hover:text-[#0F2A2E] hover:bg-[#F6F1E7]/60"
                                        }`}
                                    >
                                        <span className="text-xs font-semibold">{src}</span>
                                        <div
                                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                                                isSelected
                                                    ? "border-[#E8772E] bg-[#E8772E]"
                                                    : "border-[#E4DCCB] bg-white"
                                            }`}
                                        >
                                            {isSelected && (
                                                <div className="w-1 h-1 rounded-full bg-[#0F2A2E]" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E4DCCB]">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isEditing}
                            className="px-4 py-2.5 text-xs font-semibold text-[#0F2A2E] bg-white border border-[#E4DCCB] hover:bg-[#F6F1E7] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isEditing}
                            className="px-5 py-2.5 text-xs font-semibold text-[#0F2A2E] bg-[#E8772E] rounded-xl transition-all
                                       hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/25
                                       hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                                       active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                                       disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed
                                       cursor-pointer
                                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                        >
                            {isEditing ? "Saving changes..." : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}