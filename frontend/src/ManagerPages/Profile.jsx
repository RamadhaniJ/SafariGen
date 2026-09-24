import { useEffect, useState } from "react";
import api from "../Apis/api";
import GlobalLoader from "../Component/Loader";
import { toast } from "sonner";
import { 
    User, 
    Building2, 
    Mail, 
    Phone, 
    Calendar, 
    ShieldCheck, 
    ShieldAlert, 
    Camera, 
    Save, 
    Loader2, 
    Sparkles 
} from "lucide-react";

export default function ManagerProfilePage() {
    const [fname, setFName] = useState("");
    const [lname, setLName] = useState("");
    const [about, setAbout] = useState("");

    const [avatar, setAvatar] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [initialLoading, setInitialLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [managerData, setManagerData] = useState(null);

    const fetchManagerData = async () => {
        setInitialLoading(true);
        try {  
            const resp = await api.get("account/manager/profile/");
            const data = resp.data;
            setManagerData(data);

            if (data.full_name) {
                const nameParts = data.full_name.trim().split(" ");
                setFName(nameParts[0] || "");
                setLName(nameParts.slice(1).join(" ") || "");
            }

            setAbout(data.about || data.about_me || "");
            if (data.avatar) {
                setPreviewUrl(data.avatar);
            }
        } catch (error) {
            let apiMessage = "Network connection error. Please try again.";

            if (error?.response?.data) {
                const data = error.response.drata;

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
                // Kama hakuna response kutoka server (Network Error)
                apiMessage = error.message;
            }

            toast.error(apiMessage);
        
        } finally {
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchManagerData();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB");
                return;
            }
            setAvatar(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fname.trim()) {
            toast.error("First name is required");
            return;
        }

        setSaving(true);
        try {
            const fullName = `${fname.trim()} ${lname.trim()}`.trim();

            const formData = new FormData();
            formData.append("full_name", fullName);
            formData.append("about_me", about);

            if (avatar) {
                formData.append("avatar", avatar);
            }

            const resp = await api.patch("account/manager/profile/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Profile updated successfully!");
            setManagerData(resp.data);
            setAvatar(null); // Reset file object after success
        } catch (error) {
            const errorMsg = error.response?.data?.detail || "Failed to update profile";
            toast.error(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    if (initialLoading) {
        return <GlobalLoader />;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10 font-sans selection:bg-fuchsia-500 selection:text-white">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* PAGE HEADER */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-extrabold tracking-tight text-white">
                                Manager Profile
                            </h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Manage your personal details, workspace bio, and account status.
                        </p>
                    </div>

                    {/* Verification Status Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
                        {managerData?.is_verified ? (
                            <>
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-400">Verified Account</span>
                            </>
                        ) : (
                            <>
                                <ShieldAlert className="w-4 h-4 text-amber-400" />
                                <span className="text-amber-400">Unverified Account</span>
                            </>
                        )}
                    </div>
                </div>

                {/* MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: ACCOUNT OVERVIEW CARD */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6 text-center sm:text-left">
                            
                            {/* Avatar Picker */}
                            <div className="flex flex-col items-center justify-center space-y-3">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-800 flex items-center justify-center shadow-xl shadow-fuchsia-500/10">
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Avatar preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-4xl font-black text-fuchsia-500">
                                                {fname ? fname.charAt(0).toUpperCase() : "M"}
                                            </span>
                                        )}
                                    </div>

                                    {/* Upload Overlay */}
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute inset-0 rounded-2xl bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-xs font-medium text-slate-200"
                                    >
                                        <Camera className="w-6 h-6 mb-1 text-fuchsia-400" />
                                        <span>Change Image</span>
                                    </label>
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-500">JPG, PNG or WEBP. Max 5MB.</p>
                            </div>

                            {/* Info Details List */}
                            <div className="space-y-4 pt-4 border-t border-slate-800/80 text-sm">
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Building2 className="w-4 h-4 text-fuchsia-400 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] text-slate-500 uppercase font-semibold">Company</p>
                                        <p className="font-medium text-white truncate">{managerData?.company_name || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-300">
                                    <Mail className="w-4 h-4 text-fuchsia-400 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] text-slate-500 uppercase font-semibold">Email</p>
                                        <p className="font-medium text-white truncate">{managerData?.email || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-300">
                                    <Phone className="w-4 h-4 text-fuchsia-400 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] text-slate-500 uppercase font-semibold">Phone</p>
                                        <p className="font-medium text-white truncate">{managerData?.phone_number || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-300">
                                    <Calendar className="w-4 h-4 text-fuchsia-400 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] text-slate-500 uppercase font-semibold">Joined At</p>
                                        <p className="font-medium text-white truncate">
                                            {managerData?.joined_at ? new Date(managerData.joined_at).toLocaleDateString() : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: EDIT PROFILE FORM */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6">
                            <div className="flex items-center gap-2 pb-4 border-b border-slate-800/80">
                                <Sparkles className="w-4 h-4 text-fuchsia-400" />
                                <h2 className="text-lg font-bold text-white">Personal Information</h2>
                            </div>

                            {/* First & Last Name */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={fname}
                                            onChange={(e) => setFName(e.target.value)}
                                            placeholder="Jane"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={lname}
                                            onChange={(e) => setLName(e.target.value)}
                                            placeholder="Doe"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* About Me */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                    About Me
                                </label>
                                <textarea
                                    rows={5}
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                    placeholder="Write a short bio about your role, experience, or department..."
                                    className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-semibold text-sm hover:from-fuchsia-500 hover:to-purple-500 shadow-lg shadow-fuchsia-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving Changes...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Update Profile
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}