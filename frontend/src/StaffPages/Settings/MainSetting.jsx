import { useState } from "react";
import {
  ShieldCheck,
  Bell,
  Share2,
  Sparkles,
  Settings,
} from "lucide-react";
import ChangePasswordComponentGlobal from "../../GlobalShare/SettingsShare/changePassword";
import NotificationComponentGlobal from "../../GlobalShare/SettingsShare/Notification";
import InvitationComponentGlobal from "../../GlobalShare/SettingsShare/Invitation";
import CustomizationComponentGlobal from "../../GlobalShare/SettingsShare/Customization";

/* ── Tab definitions ────────────────────────────────────────────── */
const TABS = [
  {
    id: "password",
    label: "Change password",
    icon: ShieldCheck,
    description: "Update your login credentials",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Control what updates you receive",
  },
  {
    id: "invitation",
    label: "Invitations",
    icon: Share2,
    description: "Refer friends and earn rewards",
  },
  {
    id: "customization",
    label: "Customization",
    icon: Sparkles,
    description: "Personalize your itineraries",
  },
];

export default function MainStaffSettingPage() {
  // ── Tab state ──
  const [activeTab, setActiveTab] = useState("password");

  const activeTabData = TABS.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] font-sans selection:bg-[#E8772E] selection:text-[#0F2A2E] relative overflow-x-hidden">

      {/* Ambient brand washes */}
      <div className="pointer-events-none fixed -top-40 -right-40 w-[520px] h-[520px] bg-[#E8772E]/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none fixed -bottom-40 -left-40 w-[520px] h-[520px] bg-[#F2B544]/12 blur-[150px] rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">

        {/* ── Page Header ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-3xl  bg-[#E8772E] flex items-center justify-center shadow-md shadow-[#E8772E]/25 shrink-0">
              <Settings className="w-5 h-5 text-[#0F2A2E]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F2A2E]">
                Staff settings
              </h1>
              <p className="text-sm text-[#6B6459] mt-0.5">
                Manage your account, notifications, referrals, and personalization.
              </p>
            </div>
          </div>
        </div>

        {/* ── Tab navigation ── */}
        <div className="bg-white border border-[#E4DCCB] p-2 shadow-[0_1px_2px_rgba(15,42,46,0.04)]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">

            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center justify-center gap-2 px-3 py-3 rounded-md text-xs font-bold transition-all duration-300 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] ${
                    isActive
                      ? "bg-[#E8772E] text-[#0F2A2E] shadow-md shadow-[#E8772E]/25"
                      : "bg-transparent text-[#6B6459] hover:bg-[#F6F1E7] hover:text-[#0F2A2E]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <span className="truncate">{tab.label}</span>

                  {/* Active dot */}
                  {isActive && (
                    <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#0F2A2E] shrink-0" />
                  )}
                </button>
              );
            })}

          </div>
        </div>


        {/* ── Tab content ── */}
        <div
          key={activeTab}
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {activeTab === "password" && <ChangePasswordComponentGlobal />}
          {activeTab === "notifications" && <NotificationComponentGlobal />}
          {activeTab === "invitation" && <InvitationComponentGlobal />}
          {activeTab === "customization" && <CustomizationComponentGlobal />}
        </div>

      </div>
    </div>
  );
}