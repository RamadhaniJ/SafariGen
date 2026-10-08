import { Link } from "react-router-dom";
import {
  Users,
  Compass,
  UserPlus,
  UserCheck,
  Sparkles,
  ArrowUpRight,
  CreditCard,
  ExternalLink,
  Plus,
  TagIcon,
  CompassIcon,
} from "lucide-react";

import { AuthenticationContext } from "../Apis/AuthProvider";
import { useContext } from "react";

export default function StaffDashboardPage() {
  // Replace with real  user context or backend props

  const {email, fullName, userRole, Logout} = useContext(AuthenticationContext);

  const user = {
    name: fullName,
    email: email,
    role: `${userRole}`,
  };

  const stats = [
    {
      title: "Total Staff Members",
      value: "-",
      change: " this month",
      icon: Users,
      chipBg: "bg-[#FCE9DA]",
      chipText: "text-[#B34F12]",
      accent: "bg-[#E8772E]",
    },
    {
      title: "Active Itineraries",
      value: "-",
      change: " pending approval",
      icon: Compass,
      chipBg: "bg-[#E3F1E8]",
      chipText: "text-[#1E5A3B]",
      accent: "bg-[#1E5A3B]",
    },
    {
      title: "Draft Itineraries",
      value: "-",
      change: "Renews in 24 days",
      icon: CreditCard,
      chipBg: "bg-[#FDF4DD]",
      chipText: "text-[#7A4E08]",
      accent: "bg-[#F2B544]",
    },
  ];


  const quickActions = [
  {
    title: "Create Safari Quote",
    description: "Build a custom day-by-day safari itinerary and pricing in seconds.",
    path: "/staff/dashboard/quote/create/gate/",
    icon: CompassIcon,
    badge: "Builder", 
  },
  {
    title: "Quote History",
    description: "View, track, and manage all saved client quotes.",
    path: "/staff/dashboard/quotes/list/",
    icon: TagIcon,
    badge: "Quotes",
  },
  {
    title: "Account Settings",
    description: "Update personal details, password, and preferences.",
    path: "/staff/dashboard/profile/",
    icon: UserCheck,
    badge: "Account",
  },
];


  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#0F2A2E] p-5 sm:p-6 lg:p-10 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER / WELCOME BAR */}
        <header className="relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 lg:p-8 rounded-2xl bg-white border border-[#E4DCCB]/80 shadow-[0_1px_2px_rgba(15,42,46,0.04)]">
          {/* Soft accent wash */}
          <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[#FDF4DD] blur-3xl opacity-70" />

          <div className="relative space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#0F2A2E]">
              Staff Dashboard
            </h1>
            <p className="text-sm text-[#6B6459] leading-relaxed">
              Welcome back,{" "}
              <span className="text-[#0F2A2E] font-semibold">{user.name}</span>{" "}
              — here's what's happening today.
            </p>
          </div>

          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Single primary action on the screen */}
            <Link
              to="/staff/dashboard/quote/create/gate/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E8772E] text-[#0F2A2E] font-medium text-sm px-4 py-2.5 shadow-sm shadow-[#E8772E]/20 transition-all duration-200 hover:bg-[#D4661F] hover:shadow-md hover:shadow-[#E8772E]/25 active:bg-[#B34F12] active:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
            > 
              <Plus className="w-4 h-4" />
              Generate quote
            </Link>

            {/* Profile badge */}
            <div className="flex items-center gap-3 bg-[#F6F1E7]/70 p-2 pr-4 rounded-xl border border-[#E4DCCB]">
              <div className="w-10 h-10 rounded-lg bg-[#FCE9DA] text-[#B34F12] font-bold flex items-center justify-center text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#0F2A2E] truncate">
                  {user.name}
                </span>
                <span className="text-[11px] text-[#6B6459] truncate">
                  {email}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* OVERVIEW / METRICS */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold tracking-widest text-[#6B6459] uppercase">
              System Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="group relative overflow-hidden p-6 rounded-2xl bg-white border border-[#E4DCCB]/80 shadow-[0_1px_2px_rgba(15,42,46,0.04)] transition-all duration-300 hover:border-[#E4DCCB] hover:shadow-[0_4px_20px_-8px_rgba(15,42,46,0.12)] hover:-translate-y-0.5"
                >
                  {/* Subtle top accent bar */}
                  <span
                    className={`absolute top-0 left-0 right-0 h-[3px] ${stat.accent} opacity-80`}
                  />

                  <div className="flex items-start justify-between mb-6">
                    <span className="text-xs font-medium text-[#6B6459] pt-1">
                      {stat.title}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.chipBg} ${stat.chipText} transition-transform duration-300 group-hover:scale-105`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-3xl font-extrabold tracking-tight text-[#0F2A2E] tabular-nums">
                      {stat.value}
                    </h3>
                    <p className="text-xs text-[#6B6459]">{stat.change}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold tracking-widest text-[#6B6459] uppercase">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  to={action.path}
                  className="group relative p-6 rounded-2xl bg-white border border-[#E4DCCB]/80 shadow-[0_1px_2px_rgba(15,42,46,0.04)] transition-all duration-300 hover:border-[#E8772E]/40 hover:shadow-[0_4px_20px_-8px_rgba(232,119,46,0.25)] hover:-translate-y-0.5 flex flex-col justify-between focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-10 rounded-xl bg-[#FCE9DA] text-[#B34F12] flex items-center justify-center transition-all duration-300 group-hover:bg-[#E8772E] group-hover:text-[#0F2A2E] group-hover:scale-105">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A4E08] bg-[#FDF4DD] px-2 py-1 rounded-md">
                        {action.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-[#0F2A2E] transition-colors flex items-center gap-1.5 mb-2">
                      {action.title}
                      <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-0.5 translate-x-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-1 transition-all duration-300 text-[#B34F12]" />
                    </h3>

                    <p className="text-xs text-[#6B6459] leading-relaxed mb-6">
                      {action.description}
                    </p>
                  </div>

                  <span className="text-xs font-medium text-[#B34F12] flex items-center gap-1.5 transition-transform duration-300 group-hover:translate-x-1">
                    Execute action
                    <span aria-hidden>→</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-8 mt-2 border-t border-[#E4DCCB]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6459]">
          <p>© {new Date().getFullYear()} SafariGen Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              to="/terms"
              className="hover:text-[#B34F12] transition-colors flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] rounded"
            >
              Terms of Service
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              to="/privacy"
              className="hover:text-[#B34F12] transition-colors flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] rounded"
            >
              Privacy Policy
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </footer>

      </div>
    </div>
  );
}