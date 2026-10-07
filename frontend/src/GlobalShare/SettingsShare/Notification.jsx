import { useState } from "react";
import {
  Tag,
  Bell,
  Megaphone,
  Sparkles,
  Inbox,
  Check,
} from "lucide-react";

/* ── Reusable Toggle ───────────────────────────────────────────── */
function ToggleSwitch({ enabled, onToggle, label }) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] ${
          enabled ? "bg-[#E8772E]" : "bg-[#E4DCCB]"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span
        className={`text-[11px] font-bold uppercase tracking-widest w-8 text-right ${
          enabled ? "text-[#1E5A3B]" : "text-[#6B6459]"
        }`}
      >
        {enabled ? "On" : "Off"}
      </span>
    </div>
  );
}

/* ── Reusable Notification Row ─────────────────────────────────── */
function NotificationRow({ icon: Icon, title, description, enabled, onToggle }) {
  return (
    <div className="group flex items-center justify-between gap-4 p-4  bg-white border border-[#E4DCCB] hover:border-[#E8772E]/40 hover:shadow-[0_4px_16px_-8px_rgba(232,119,46,0.25)] transition-all duration-300">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Icon chip */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
            enabled
              ? "bg-[#FCE9DA] border-[#E8772E]/25 text-[#B34F12]"
              : "bg-[#F6F1E7] border-[#E4DCCB] text-[#6B6459] group-hover:border-[#E8772E]/30"
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>

        {/* Text */}
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#0F2A2E] truncate">
            {title}
          </h3>
          <p className="text-[11px] text-[#6B6459] mt-0.5 truncate">
            {description}
          </p>
        </div>
      </div>

      <ToggleSwitch
        enabled={enabled}
        onToggle={onToggle}
        label={`Toggle ${title}`}
      />
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */
export default function NotificationComponentGlobal() {
  const [notifications, setNotifications] = useState([
    {
      id: "system",
      icon: Bell,
      title: "System Notifications",
      description: "Important updates about your account and security.",
      enabled: true,
    },
    {
      id: "deals",
      icon: Megaphone,
      title: "Deals & Promotions",
      description: "Exclusive offers, seasonal discounts, and safari deals.",
      enabled: true,
    },
    {
      id: "templates",
      icon: Sparkles,
      title: "Template Recommendations",
      description: "Suggested itinerary templates based on your activity.",
      enabled: false,
    },
    {
      id: "other",
      icon: Inbox,
      title: "Other Notifications",
      description: "Weekly digests, tips, and platform announcements.",
      enabled: false,
    },
  ]);

  const handleToggle = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const enabledCount = notifications.filter((n) => n.enabled).length;

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] font-sans selection:bg-[#E8772E] selection:text-[#0F2A2E] relative overflow-x-hidden">

      {/* Ambient brand washes */}
      <div className="pointer-events-none fixed -top-40 -right-40 w-[520px] h-[520px] bg-[#E8772E]/10 blur-[150px] rounded-full" />
      <div className="pointer-events-none fixed -bottom-40 -left-40 w-[520px] h-[520px] bg-[#F2B544]/12 blur-[150px] rounded-full" />

      <div className="max-w-2xl relative z-10 space-y-8">

        {/* ── Header ── */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F2A2E]">
                System notifications
              </h1>
              <p className="text-sm text-[#6B6459]">
                Choose what updates you want to receive and how often.
              </p>
            </div>

            {/* Enabled counter chip */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E4DCCB] shadow-[0_1px_2px_rgba(15,42,46,0.04)]">
              <Check className="w-3.5 h-3.5 text-[#1E5A3B]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B6459]">
                Active
              </span>
              <span className="font-mono text-xs font-bold text-[#B34F12]">
                {enabledCount} / {notifications.length}
              </span>
            </div>
          </div>
        </div>

        {/* ── Notification rows ── */}
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationRow
              key={n.id}
              icon={n.icon}
              title={n.title}
              description={n.description}
              enabled={n.enabled}
              onToggle={() => handleToggle(n.id)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}