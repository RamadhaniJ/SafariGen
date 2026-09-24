import { NavLink, useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, 
    User, 
    Users, 
    Compass, 
    CreditCard, 
    Settings, 
    LogOut, 
    Sparkles,
    ChevronRight
} from "lucide-react";

export default function ManagerSideBar() {
    const navigate = useNavigate();

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "My Profile", path: "/dashboard/manager/profile/manager/", icon: User },
        { name: "My Staff", path: "/dashboard/manager/staff", icon: Users },
        { name: "Itinerary", path: "/itinerary", icon: Compass },
        { name: "Subscriptions", path: "/subscriptions", icon: CreditCard },
        { name: "Settings", path: "/settings", icon: Settings },
    ];

    const handleLogout = () => {
        // Add your logout logic / context reset here
        navigate("/login");
    };

    
    return (
        <aside className="w-64 h-screen bg-slate-950 border-r border-slate-800/80 text-slate-300 flex flex-col justify-between p-4 sticky top-0 font-sans select-none">
            {/* TOP SECTION: BRAND & NAVIGATION */}
            <div className="space-y-6">
                {/* Brand Logo */}
                <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-fuchsia-500/20">
                            I
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white">
                            Ip<span className="text-fuchsia-500">s</span>
                        </span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1.5">
                    <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Management
                    </p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? "bg-gradient-to-r from-fuchsia-600/15 to-purple-600/10 text-fuchsia-400 font-semibold border border-fuchsia-500/30"
                                            : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <Icon
                                                className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                                                    isActive ? "text-fuchsia-400" : "text-slate-400 group-hover:text-slate-200"
                                                }`}
                                            />
                                            <span>{item.name}</span>
                                        </div>

                                        {isActive && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-sm shadow-fuchsia-500" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* BOTTOM SECTION: USER PROFILE & LOGOUT */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
                {/* Compact User Info Card */}
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs">
                        JD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">Jane Doe</p>
                        <p className="text-[11px] text-slate-500 truncate">Manager</p>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all group cursor-pointer"
                >
                    <div className="flex items-center gap-3">
                        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                        <span>Log Out</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>
        </aside>
    );
}