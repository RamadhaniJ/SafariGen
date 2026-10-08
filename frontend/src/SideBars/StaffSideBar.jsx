import { useState, useContext } from "react";
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
  ChevronRight,
} from "lucide-react";
import { AuthenticationContext } from "../Apis/AuthProvider";

export default function StaffSideBar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard },
    { name: "Profile", path: "/staff/dashboard/profile/", icon: User },

    { name: "Clients", path: "/staff/dashboard/clients/list/", icon: UserCheck2 },
    { name: "Quotes", path: "/staff/dashboard/quotes/list/", icon: Compass },
    { name: "Create Quote", path: "/staff/dashboard/quote/create/gate/", icon: MessageCircle },
    { name: "Settings", path: "/staff/dashboard/settings", icon: Settings },
  ];

 const {email,fullName, userRole, Logout} = useContext(AuthenticationContext);
  
  const handleLogout = async () => {
    await Logout();
    navigate("/", {replace : true})
  };

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#0F2A2E]/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-30 md:hidden p-2.5 rounded-xl bg-[#0F2A2E] text-[#F6F1E7] border border-[#E4DCCB]/20 shadow-lg hover:bg-[#1C3B40] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen z-50 md:z-30
          flex flex-col
          bg-[#0F2A2E]
          border-r border-[#E4DCCB]/15
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "md:w-20" : "md:w-72"}
        `}
      >
        {/* Header: Logo & Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-[#E4DCCB]/15 min-h-[73px]">
          <div
            className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${
              isCollapsed ? "md:w-0 md:opacity-0" : "md:w-auto md:opacity-100"
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#E8772E] flex items-center justify-center text-[#0F2A2E] font-black text-xl shadow-md shadow-[#E8772E]/20 flex-shrink-0">
              S
            </div>
            <span className="text-xl font-black tracking-tight text-[#F6F1E7] whitespace-nowrap">
              Safari<span className="text-[#F2B544]">Gen</span>
            </span>
          </div>

          {/* Desktop Collapse/Expand Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-[#1C3B40] text-[#F6F1E7]/70 hover:text-[#F6F1E7] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-[#1C3B40] text-[#F6F1E7]/70 hover:text-[#F6F1E7] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E]"
            aria-label="Close sidebar"
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
                className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] rounded-xl"
              >
                {({ isActive }) => (
                  <div
                    className={`
                      group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? "bg-[#E8772E] text-[#0F2A2E] shadow-sm shadow-[#E8772E]/20"
                          : "text-[#F6F1E7]/70 hover:text-[#F6F1E7] hover:bg-[#1C3B40]"
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                        isActive
                          ? "text-[#0F2A2E] scale-110"
                          : "text-[#F6F1E7]/70 group-hover:text-[#F6F1E7]"
                      }`}
                    />

                    <span
                      className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                        isCollapsed ? "md:w-0 md:opacity-0" : "md:w-auto md:opacity-100"
                      }`}
                    >
                      {item.name}
                    </span>

                    {isActive && !isCollapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0F2A2E]" />
                    )}

                    {/* Tooltip when collapsed */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1C3B40] text-[#F6F1E7] text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 border border-[#E4DCCB]/20 shadow-xl">
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
        <div className="p-4 border-t border-[#E4DCCB]/15 space-y-3">
          {/* User Profile Card */}
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-[#1C3B40] border border-[#E4DCCB]/10 transition-all duration-300 ${
              isCollapsed ? "md:justify-center md:pl-5 md:py-1" : "md:justify-start"
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-[#FCE9DA] border border-[#E4DCCB]/20 flex items-center justify-center text-[#B34F12] font-bold text-sm flex-shrink-0 shadow-sm">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isCollapsed ? "md:w-0 md:opacity-0" : "md:w-auto md:opacity-100"
              }`}
            >
              <p className="text-sm font-semibold text-[#F6F1E7] truncate">{fullName}</p>
              <p className="text-xs text-[#F6F1E7]/60 truncate">{userRole?.toLowerCase()} Member</p>

            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#F6F1E7]/70 hover:text-[#FBE5E2] hover:bg-[#8E2A1F]/20 border border-transparent hover:border-[#8E2A1F]/30 transition-all duration-200 group relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8772E] ${
              isCollapsed ? "md:justify-center" : "md:justify-between"
            }`}
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isCollapsed ? "md:w-0 md:opacity-0" : "md:w-auto md:opacity-100"
                }`}
              >
                Log Out
              </span>
            </div>

            {!isCollapsed && (
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}

            {/* Tooltip for logout when collapsed */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1C3B40] text-[#FBE5E2] text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 border border-[#E4DCCB]/20 shadow-xl">
                Log Out
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}