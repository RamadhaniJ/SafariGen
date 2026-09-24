import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, 
    User, 
    Compass, 
    Settings, 
    LogOut, 
    UserCheck2, 
    MessageCircle,
    Menu,
    X,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

export default function StaffSideBar() {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navItems = [
        { name: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard },
        { name: "My Profile", path: "/staff/dashboard/profile/", icon: User },
        { name: "Clients", path: "/staff/dashboard/list/clients/information/", icon: UserCheck2 },
        { name: "Itinerary", path: "/staff/dashboard/itinerary/list/", icon: Compass },
        { name: "Create Quote", path: "/staff/dashboard/create/quote/", icon: MessageCircle },
        { name: "Settings", path: "/settings", icon: Settings },
    ];

    const handleLogout = () => {
        // Add your logout logic / context reset here
        navigate("/login");
    };

    return (
        <>
            {/* Mobile Overlay Backdrop */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile Toggle Button (Visible only when sidebar is closed on mobile) */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="fixed top-4 left-4 z-30 md:hidden p-2.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 shadow-lg hover:bg-slate-800 transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Sidebar Container */}
            <aside className={`
                fixed md:sticky top-0 left-0 h-screen z-50 md:z-30
                flex flex-col 
                bg-slate-950/95 backdrop-blur-xl 
                border-r border-slate-800/60 
                transition-all duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
                ${isCollapsed ? 'md:w-20' : 'md:w-72'}
            `}>
                {/* Header: Logo & Toggle */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800/60 min-h-[73px]">
                    <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isCollapsed ? 'md:w-0 md:opacity-0' : 'md:w-auto md:opacity-100'}`}>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-fuchsia-500/20 flex-shrink-0">
                            I
                        </div>
                        <span className="text-xl font-black tracking-tight text-white whitespace-nowrap">
                            Ip<span className="text-fuchsia-500">s</span>
                        </span>
                    </div>
                    
                    {/* Desktop Collapse/Expand Toggle */}
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>

                    {/* Mobile Close Button */}
                    <button 
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileOpen(false)}
                            >
                                {({ isActive }) => (
                                    <div className={`
                                        group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                                        ${isActive 
                                            ? "bg-gradient-to-r from-fuchsia-600/15 to-purple-600/10 text-fuchsia-400 border border-fuchsia-500/30 shadow-sm shadow-fuchsia-500/10" 
                                            : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent"
                                        }
                                    `}>
                                        <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isActive ? "text-fuchsia-400 scale-110" : "text-slate-400 group-hover:text-slate-200"}`} />
                                        
                                        <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'md:w-0 md:opacity-0' : 'md:w-auto md:opacity-100'}`}>
                                            {item.name}
                                        </span>


                                        {isActive && !isCollapsed && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-sm shadow-fuchsia-500" />
                                        )}
                                        

                                        {isCollapsed && (
                                            <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-800 text-slate-200 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 border border-slate-700 shadow-xl">
                                                {item.name}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer: User Profile & Logout */}
                <div className="p-4 border-t border-slate-800/60 space-y-3">
                    {/* User Profile Card */}
                    <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60 transition-all duration-300 ${isCollapsed ? 'md:justify-center  md:pl-5 md:py-1' : 'md:justify-start'}`}>
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-sm flex-shrink-0 shadow-sm">
                            JD
                        </div>
                        <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'md:w-0 md:opacity-0' : 'md:w-auto md:opacity-100'}`}>
                            <p className="text-sm font-semibold text-white truncate">Jane Doe</p>
                            <p className="text-xs text-slate-500 truncate">Staff Member</p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 group relative ${isCollapsed ? 'md:justify-center' : 'md:justify-between'}`}
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
                            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'md:w-0 md:opacity-0' : 'md:w-auto md:opacity-100'}`}>
                                Log Out
                            </span>
                        </div>
                        
                        {!isCollapsed && (
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                        
                        {/* Tooltip for logout when collapsed */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-800 text-red-400 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 border border-slate-700 shadow-xl">
                                Log Out
                            </div>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}