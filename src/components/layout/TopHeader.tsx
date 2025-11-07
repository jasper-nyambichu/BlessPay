"use client";
import { motion } from "framer-motion";
import { Menu, Bell, Settings, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

interface TopHeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

const TopHeader = ({ onMenuClick, sidebarCollapsed }: TopHeaderProps) => {
  const { user, logout } = useAuth();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const routes: { [key: string]: string } = {
      "/dashboard": "Dashboard",
      "/payments": "Payments",
      "/history": "History",
      "/profile": "Profile",
      "/settings": "Settings",
      "/notifications": "Notifications",
      "/admin": "Admin Dashboard",
    };

    for (const [path, title] of Object.entries(routes)) {
      if (pathname.startsWith(path)) {
        return title;
      }
    }

    return "Dashboard";
  };

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter((segment) => segment);
    if (pathSegments.length <= 1) return [];

    return pathSegments.map((segment, index) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: "/" + pathSegments.slice(0, index + 1).join("/"),
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-card-heavy border-b border-blue-200/30 sticky top-0 z-30"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-blue-100/50 transition-colors md:hidden"
          >
            <Menu className="w-5 h-5 text-blue-600" />
          </motion.button>

          <div className="flex flex-col">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-800 to-cyan-600 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>

            {breadcrumbs.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-blue-600/70 mt-1">
                <span>Dashboard</span>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.path} className="flex items-center gap-1">
                    <span>/</span>
                    <span
                      className={
                        index === breadcrumbs.length - 1
                          ? "text-blue-600 font-medium"
                          : "text-blue-500/60"
                      }
                    >
                      {crumb.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <motion.button
            onClick={() => {
              window.location.href = "/notifications";
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl hover:bg-blue-100/50 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-blue-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          </motion.button>

          {/* Settings */}
          <motion.button
            onClick={() => {
              window.location.href = "/settings";
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl hover:bg-blue-100/50 transition-colors"
          >
            <Settings className="w-5 h-5 text-blue-600" />
          </motion.button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-100/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-2 border-white/30"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-blue-900 truncate max-w-32">
                  {user?.full_name || user?.email}
                </p>
                <p className="text-xs text-blue-600/70 capitalize">
                  {user?.role || "member"}
                </p>
              </div>

              <motion.div
                animate={{ rotate: isUserDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-blue-600" />
              </motion.div>
            </motion.button>

            {/* Dropdown Menu */}
            {isUserDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 glass-card-heavy rounded-xl shadow-2xl border border-blue-200/30 py-2 z-50"
              >
                <div className="px-4 py-3 border-b border-blue-200/30">
                  <p className="font-semibold text-blue-900 truncate">
                    {user?.full_name || "User"}
                  </p>
                  <p className="text-sm text-blue-600/80 truncate">
                    {user?.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                    {user?.role}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    window.location.href = "/profile";
                  }}
                  className="w-full flex items-center px-4 py-3 hover:bg-blue-50/80 transition-colors duration-200 group text-blue-900"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    window.location.href = "/settings";
                  }}
                  className="w-full flex items-center px-4 py-3 hover:bg-blue-50/80 transition-colors duration-200 group text-blue-900"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <Settings className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Settings</span>
                </button>

                <div className="border-t border-blue-200/30 my-2"></div>

                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center px-4 py-3 hover:bg-red-50/80 transition-colors duration-200 group text-red-600"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span>Logout</span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default TopHeader;