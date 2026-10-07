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
    Sparkles, 
    User2,
    TimerIcon
} from "lucide-react";

export default function ManagerProfilePage() {

    const [phone_number, setPhoneNumber] = useState("");
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
 

            setAbout(data.about || data.about_me || "");
            setPhoneNumber(data.phone_number || "");
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

        if (!phone_number.trim()) {
            toast.error("Phone number is required");
            return;
        }

        setSaving(true);
        try {

            const formData = new FormData();
            formData.append("phone_number", phone_number);
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
  <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] p-5 sm:p-6 lg:p-10 font-sans selection:bg-[#E8772E] selection:text-[#0F2A2E] relative overflow-hidden">

    {/* Ambient brand washes */}
    <div className="pointer-events-none absolute -top-40 -right-40 w-[520px] h-[520px] bg-[#E8772E]/10 blur-[150px]" />
    <div className="pointer-events-none absolute -bottom-40 -left-40 w-[520px] h-[520px] bg-[#F2B544]/12 blur-[150px]" />

    <div className="max-w-6xl mx-auto space-y-8 relative z-10">

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E4DCCB]">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F2A2E]">
            Manage Your Profile
          </h1>
          <p className="text-[#6B6459] text-sm">
            Manage your personal details, workspace bio, and account status.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        {/* LEFT COLUMN: ACCOUNT OVERVIEW CARD */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 sm:p-7  bg-white border border-[#E4DCCB] shadow-[0_1px_2px_rgba(15,42,46,0.04)] space-y-6 text-center sm:text-left">

            {/* Avatar Picker */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="relative group">
                {/* Soft ember glow behind avatar */}
                <div className="absolute inset-0 rounded-2xl bg-[#E8772E]/20 blur-md" />

                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#E8772E]/30 bg-[#FCE9DA] flex items-center justify-center shadow-sm">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-black text-[#B34F12]">
                      {managerData?.full_name
                        ? managerData?.full_name.charAt(0).toUpperCase()
                        : "M"}
                    </span>
                  )}
                </div>

                {/* Upload Overlay */}
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 rounded-2xl bg-[#0F2A2E]/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-xs font-medium text-[#F6F1E7]"
                >
                  <Camera className="w-6 h-6 mb-1 text-[#F2B544]" />
                  <span>Change image</span>
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="text-[11px] text-[#6B6459]">
                JPG, PNG or WEBP. Max 5MB.
              </p>
            </div>

            {/* Info Details List */}
            <div className="space-y-4 pt-5 border-t border-[#E4DCCB] text-sm">

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FCE9DA] flex items-center justify-center shrink-0">
                  <User2 className="w-4 h-4 text-[#B34F12]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-[#6B6459] uppercase font-bold tracking-wider">
                    Full name
                  </p>
                  <p className="font-semibold text-[#0F2A2E] truncate">
                    {managerData?.full_name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FCE9DA] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#B34F12]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-[#6B6459] uppercase font-bold tracking-wider">
                    Email
                  </p>
                  <p className="font-semibold text-[#0F2A2E] truncate">
                    {managerData?.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FCE9DA] flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-[#B34F12]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-[#6B6459] uppercase font-bold tracking-wider">
                    Joined at
                  </p>
                  <p className="font-semibold text-[#0F2A2E] truncate">
                    {managerData?.joined_at
                      ? new Date(managerData.joined_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FCE9DA] flex items-center justify-center shrink-0">
                  <TimerIcon className="w-4 h-4 text-[#B34F12]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-[#6B6459] uppercase font-bold tracking-wider">
                    Last updated
                  </p>
                  <p className="font-semibold text-[#0F2A2E] truncate">
                    {managerData?.updated_at
                      ? new Date(managerData.updated_at).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: EDIT PROFILE FORM */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8  bg-white border border-[#E4DCCB] shadow-[0_1px_2px_rgba(15,42,46,0.04)] space-y-6"
          >
            {/* Section header */}
            <div className="flex items-center gap-3 pb-4 border-b border-[#E4DCCB]">
              <div className="w-9 h-9 rounded-xl bg-[#FCE9DA] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#B34F12]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0F2A2E]">
                  Personal information
                </h2>
                <p className="text-xs text-[#6B6459]">
                  Update your contact details and profile bio.
                </p>
              </div>
            </div>

            {/* Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                  Phone number
                </label>
                <div className="relative group">
                  <Phone className="w-4 h-4 text-[#6B6459] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#E8772E]" />
                  <input
                    type="text"
                    value={phone_number}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+255 732 323 232"
                    className="w-full pl-10 pr-4 py-2.5  bg-white border border-[#E4DCCB] text-[#0F2A2E] placeholder:text-[#6B6459]/60 text-sm focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* About Me */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#0F2A2E]/80">
                About me
              </label>
              <textarea
                rows={5}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Write a short bio about your role, experience, or department..."
                className="w-full p-4 bg-white border border-[#E4DCCB] text-[#0F2A2E] placeholder:text-[#6B6459]/60 text-sm focus:outline-none focus:border-[#E8772E] focus:ring-2 focus:ring-[#E8772E]/20 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#E8772E] text-[#0F2A2E] font-semibold text-sm
                           hover:bg-[#D4661F] shadow-lg shadow-[#E8772E]/25 transition-all
                           hover:shadow-xl hover:shadow-[#E8772E]/30 hover:-translate-y-0.5
                           active:bg-[#B34F12] active:text-white active:translate-y-0 active:scale-[0.99]
                           disabled:bg-[#E9E3D6] disabled:text-[#A39C8F] disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:hover:bg-[#E9E3D6]
                           cursor-pointer focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  </div>
)

}