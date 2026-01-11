"use client";
import { motion } from "framer-motion";
import { Menu, Bell, Settings, User, LogOut, ChevronDown, Home, CreditCard, FileText, Calendar, BarChart, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

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
      "/give": "Give",
      "/history": "History",
      "/schedules": "Schedules",
      "/analytics": "Analytics",
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

  const getPageIcon = () => {
    const icons: { [key: string]: React.ReactNode } = {
      "/dashboard": <Home className="w-5 h-5 text-accent" />,
      "/give": <Heart className="w-5 h-5 text-accent" />,
      "/history": <FileText className="w-5 h-5 text-accent" />,
      "/schedules": <Calendar className="w-5 h-5 text-accent" />,
      "/analytics": <BarChart className="w-5 h-5 text-accent" />,
      "/profile": <User className="w-5 h-5 text-accent" />,
      "/settings": <Settings className="w-5 h-5 text-accent" />,
      "/notifications": <Bell className="w-5 h-5 text-accent" />,
    };

    for (const [path, icon] of Object.entries(icons)) {
      if (pathname.startsWith(path)) {
        return icon;
      }
    }

    return <Home className="w-5 h-5 text-accent" />;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 bg-card border-b border-border shadow-soft"
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors md:hidden"
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              {getPageIcon()}
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-xl font-serif font-bold text-foreground">
                {getPageTitle()}
              </h1>

              {breadcrumbs.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <span className="text-foreground/80">Home</span>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.path} className="flex items-center gap-1">
                      <span className="text-muted-foreground">/</span>
                      <span
                        className={
                          index === breadcrumbs.length - 1
                            ? "text-accent font-medium"
                            : "text-foreground/60"
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
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Quick Action Buttons (Desktop only) */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="navy-outline"
              size="sm"
              className="gap-2"
              onClick={() => window.location.href = "/give"}
            >
              <Heart className="w-4 h-4" />
              <span>Give Now</span>
            </Button>
            
            <Button
              variant="gold"
              size="sm"
              className="gap-2"
              onClick={() => window.location.href = "/schedules"}
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </Button>
          </div>

          {/* Notifications */}
          <motion.button
            onClick={() => {
              window.location.href = "/notifications";
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full border border-card"></div>
          </motion.button>

          {/* Settings */}
          <motion.button
            onClick={() => {
              window.location.href = "/settings";
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-navy flex items-center justify-center shadow-sm">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-2 border-cream/30"
                  />
                ) : (
                  <User className="w-4 h-4 text-cream" />
                )}
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground truncate max-w-32">
                  {user?.full_name || user?.email}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role || "member"}
                </p>
              </div>

              <motion.div
                animate={{ rotate: isUserDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </motion.button>

            {/* Dropdown Menu - Now with solid background */}
            {isUserDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-72 bg-card rounded-xl shadow-lg border border-border py-2 z-50"
              >
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-navy flex items-center justify-center">
                      {user?.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover border border-cream/20"
                        />
                      ) : (
                        <User className="w-5 h-5 text-cream" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {user?.full_name || "User"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <span className="inline-block px-3 py-1 text-xs bg-accent/10 text-accent rounded-full capitalize">
                    {user?.role}
                  </span>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      window.location.href = "/profile";
                    }}
                    className="w-full flex items-center px-4 py-3 hover:bg-muted transition-colors duration-200 group text-foreground"
                  >
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mr-3 group-hover:bg-accent/20 transition-colors">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium">Profile</span>
                      <p className="text-xs text-muted-foreground">View and edit your profile</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      window.location.href = "/settings";
                    }}
                    className="w-full flex items-center px-4 py-3 hover:bg-muted transition-colors duration-200 group text-foreground"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors">
                      <Settings className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium">Settings</span>
                      <p className="text-xs text-muted-foreground">Account preferences</p>
                    </div>
                  </button>
                </div>

                {/* Stats Section */}
                <div className="px-4 py-3 border-t border-border bg-muted/20">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Monthly Summary</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">Total Given</p>
                      <p className="text-lg font-bold text-accent">KSh 15,000</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-foreground">Transactions</p>
                      <p className="text-lg font-bold text-primary">12</p>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="border-t border-border pt-2">
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center px-4 py-3 hover:bg-red-50 transition-colors duration-200 group text-red-600"
                  >
                    <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium">Logout</span>
                      <p className="text-xs text-red-500/70">Sign out of your account</p>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default TopHeader;