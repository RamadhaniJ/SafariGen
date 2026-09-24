import { Link } from "react-router-dom";
import { 
    Users, 
    Compass, 
    UserPlus, 
    UserCheck, 
    Sparkles, 
    ArrowUpRight, 
    ShieldCheck, 
    CreditCard, 
    ExternalLink 
} from "lucide-react";

export default function ManagerDashboardPage() {
    // Replace with real user context or backend props
    const user = {
        name: "James Smith",
        email: "james@gmail.com",
        role: "General Manager",
    };

    const stats = [
        {
            title: "Total Staff Members",
            value: "12",
            change: "+2 this month",
            icon: Users,
            color: "from-purple-500/20 to-fuchsia-500/20",
            iconColor: "text-fuchsia-400"
        },
        {
            title: "Active Itineraries",
            value: "18",
            change: "4 pending approval",
            icon: Compass,
            color: "from-blue-500/20 to-cyan-500/20",
            iconColor: "text-cyan-400"
        },
        {
            title: "Active Subscription",
            value: "Pro Plan",
            change: "Renews in 24 days",
            icon: CreditCard,
            color: "from-emerald-500/20 to-teal-500/20",
            iconColor: "text-emerald-400"
        }
    ];

    const quickActions = [
        {
            title: "Add Staff User",
            description: "Create access for sales managers, marketers, or agents.",
            path: "/staff/new",
            icon: UserPlus,
            badge: "Management"
        },
        {
            title: "Update Your Profile",
            description: "Manage your account settings, security, and personal details.",
            path: "/profile",
            icon: UserCheck,
            badge: "Account"
        },
        {
            title: "Explore Packages",
            description: "View current subscription tiers, upgrades, and promotional offers.",
            path: "/subscriptions",
            icon: Sparkles,
            badge: "Billing"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10 font-sans selection:bg-fuchsia-500 selection:text-white">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* HEADER / WELCOME BAR */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold tracking-tight text-white">
                                Manager Dashboard
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-fuchsia-950/80 border border-fuchsia-500/30 text-[11px] font-semibold text-fuchsia-300">
                                Admin Hub
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Welcome back, <span className="text-slate-200 font-semibold">{user.name}</span>! Here is what's happening today.
                        </p>
                    </div>

                    {/* Profile Badge */}
                    <div className="flex items-center gap-3.5 bg-slate-950/80 p-2 pr-4 rounded-xl border border-slate-800">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-fuchsia-600 to-purple-600 text-white font-bold flex items-center justify-center text-lg shadow-md shadow-fuchsia-500/20">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-white">{user.name}</span>
                            <span className="text-[11px] text-slate-400">{user.email}</span>
                        </div>
                    </div>
                </div>

                {/* OVERVIEW / METRICS SECTION */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                        System Overview
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <div 
                                    key={idx}
                                    className="relative overflow-hidden p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all group"
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} blur-2xl pointer-events-none group-hover:scale-125 transition-transform`} />
                                    
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-medium text-slate-400">{stat.title}</span>
                                        <div className={`p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 ${stat.iconColor}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</h3>
                                        <p className="text-xs text-slate-400">{stat.change}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* QUICK ACTIONS SECTION */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                        Quick Actions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action, idx) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={idx}
                                    to={action.path}
                                    className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-fuchsia-500/40 hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 group-hover:bg-fuchsia-600 group-hover:text-white transition-all">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2 py-1 rounded-md">
                                                {action.badge}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-semibold text-white group-hover:text-fuchsia-300 transition-colors flex items-center gap-1.5 mb-2">
                                            {action.title}
                                            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-fuchsia-400" />
                                        </h3>

                                        <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                            {action.description}
                                        </p>
                                    </div>

                                    <span className="text-xs font-medium text-fuchsia-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Execute Action →
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* FOOTER LINKS */}
                <footer className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} Ips Inc. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link to="/terms" className="hover:text-slate-300 transition-colors flex items-center gap-1">
                            Terms of Service
                            <ExternalLink className="w-3 h-3" />
                        </Link>
                        <Link to="/privacy" className="hover:text-slate-300 transition-colors flex items-center gap-1">
                            Privacy Policy
                            <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                </footer>

            </div>
        </div>
    );
}