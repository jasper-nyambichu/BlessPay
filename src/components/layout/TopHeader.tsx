"use client";
import { motion } from "framer-motion";
import { Menu, Bell, Settings, User, LogOut, ChevronDown, Home, CreditCard, FileText, Calendar, BarChart, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

interface TopHeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

const TopHeader = ({ onMenuClick, sidebarCollapsed }: TopHeaderProps) => {
  const { user, logout }                      = useAuth();
  const [isUserDropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount]         = useState(0);
  const [dashboardSummary, setDashboardSummary] = useState<{ totalGiven: number; transactionCount: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname    = usePathname();
  const router      = useRouter();

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // fetch real unread notification count
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/api/notifications');
        setUnreadCount(data.unreadCount || 0);
      } catch {}
    };
    fetch();
    const interval = setInterval(fetch, 60000);
    return () => clearInterval(interval);
  }, []);

  // fetch real dashboard summary for dropdown
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/api/user/dashboard');
        setDashboardSummary(data.summary);
      } catch {}
    };
    fetch();
  }, []);

  const getPageTitle = () => {
    const routes: { [key: string]: string } = {
      "/dashboard":     "Dashboard",
      "/payments":      "Payments",
      "/history":       "History",
      "/profile":       "Profile",
      "/settings":      "Settings",
      "/notifications": "Notifications",
      "/admin":         "Admin Dashboard",
      "/treasurer":     "Treasurer Dashboard",
    };
    for (const [path, title] of Object.entries(routes)) {
      if (pathname.startsWith(path)) return title;
    }
    return "Dashboard";
  };

  const getPageIcon = () => {
    const icons: { [key: string]: React.ReactNode } = {
      "/dashboard":     <Home     className="w-5 h-5 text-accent" />,
      "/payments":      <CreditCard className="w-5 h-5 text-accent" />,
      "/history":       <FileText className="w-5 h-5 text-accent" />,
      "/profile":       <User     className="w-5 h-5 text-accent" />,
      "/settings":      <Settings className="w-5 h-5 text-accent" />,
      "/notifications": <Bell     className="w-5 h-5 text-accent" />,
      "/analytics":     <BarChart className="w-5 h-5 text-accent" />,
    };
    for (const [path, icon] of Object.entries(icons)) {
      if (pathname.startsWith(path)) return icon;
    }
    return <Home className="w-5 h-5 text-accent" />;
  };

  const fullName   = user ? `${user.firstName} ${user.lastName}` : 'User';
  const initials   = user ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() : 'U';

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(n);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 bg-card border-b border-border shadow-soft"
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">

        {/* Left */}
        <div className="flex items-center gap-4">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors md:hidden"
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              {getPageIcon()}
            </div>
            <h1 className="text-xl font-serif font-bold text-foreground">{getPageTitle()}</h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="navy-outline" size="sm" className="gap-2" onClick={() => router.push('/payments')}>
              <Heart className="w-4 h-4" /><span>Give Now</span>
            </Button>
          </div>

          {/* Notifications bell with real count */}
          <motion.button
            onClick={() => router.push('/notifications')}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border border-card flex items-center justify-center">
                <span className="text-[9px] font-bold text-[hsl(220,50%,15%)]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </div>
            )}
          </motion.button>

          {/* Settings */}
          <motion.button
            onClick={() => router.push('/settings')}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[hsl(220,50%,20%)] to-[hsl(220,50%,30%)] flex items-center justify-center shadow-sm overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-[hsl(38,70%,55%)]">{initials}</span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground truncate max-w-32">{fullName}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role || 'member'}</p>
              </div>
              <motion.div animate={{ rotate: isUserDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </motion.button>

            {isUserDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-72 bg-card rounded-xl shadow-lg border border-border py-2 z-50"
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(220,50%,20%)] to-[hsl(220,50%,30%)] flex items-center justify-center overflow-hidden">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-[hsl(38,70%,55%)]">{initials}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{fullName}</p>
                      <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>
                  <span className="inline-block px-3 py-1 text-xs bg-accent/10 text-accent rounded-full capitalize">
                    {user?.role}
                  </span>
                </div>

                {/* Menu items */}
                <div className="py-2">
                  <button onClick={() => { setDropdownOpen(false); router.push('/profile'); }}
                    className="w-full flex items-center px-4 py-3 hover:bg-muted transition-colors group text-foreground"
                  >
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mr-3 group-hover:bg-accent/20 transition-colors">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium">Profile</span>
                      <p className="text-xs text-muted-foreground">View and edit your profile</p>
                    </div>
                  </button>

                  <button onClick={() => { setDropdownOpen(false); router.push('/settings'); }}
                    className="w-full flex items-center px-4 py-3 hover:bg-muted transition-colors group text-foreground"
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

                {/* Real summary stats */}
                <div className="px-4 py-3 border-t border-border bg-muted/20">
                  <p className="text-xs font-medium text-muted-foreground mb-2">My Summary</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Given</p>
                      <p className="text-base font-bold text-accent">
                        {dashboardSummary ? formatCurrency(dashboardSummary.totalGiven) : '—'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Transactions</p>
                      <p className="text-base font-bold text-primary">
                        {dashboardSummary ? dashboardSummary.transactionCount : '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <div className="border-t border-border pt-2">
                  <motion.button whileHover={{ x: 4 }}
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    className="w-full flex items-center px-4 py-3 hover:bg-rose-50 transition-colors group text-rose-600"
                  >
                    <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center mr-3 group-hover:bg-rose-200 transition-colors">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium">Logout</span>
                      <p className="text-xs text-rose-500/70">Sign out of your account</p>
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
