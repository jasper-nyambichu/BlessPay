// Updated Sidebar.tsx with Serene Blue & Gold theme
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CreditCard,
  History,
  User,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['member', 'admin', 'pastor'] },
    { name: 'Payments', path: '/payments', icon: CreditCard, roles: ['member', 'admin', 'pastor'] },
    { name: 'History', path: '/history', icon: History, roles: ['member', 'admin', 'pastor'] },
    { name: 'Profile', path: '/profile', icon: User, roles: ['member', 'admin', 'pastor'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['member', 'admin', 'pastor'] },
    { name: 'Notifications', path: '/notifications', icon: Bell, roles: ['member', 'admin', 'pastor'] },
    { name: 'Admin', path: '/admin', icon: Users, roles: ['admin', 'pastor'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'member')
  );

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  const handleNavigation = () => {
    if (!isDesktop) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    if (!isDesktop) {
      setIsMobileOpen(false);
    }
  };

  // Calculate sidebar position based on device
  const getSidebarPosition = () => {
    if (isDesktop) {
      return 0; // Always visible on desktop
    } else {
      return isMobileOpen ? 0 : -280; // Hidden on mobile unless opened
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 280,
          x: getSidebarPosition()
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          fixed md:relative h-full bg-gradient-to-b from-[#4facfe] via-[#00a8ff] to-[#00f2fe] 
          text-white z-50 flex flex-col shadow-2xl border-r border-blue-400/30
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-blue-400/30">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
                <motion.div
                  key="expanded-logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                  >
                    <Heart className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    BlessPay
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed-logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mx-auto"
                >
                  <Heart className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapse Toggle - Desktop */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-white" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          {/* User Profile */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center shadow-lg border-2 border-white/30">
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-white">
                    {user?.full_name || 'User'}
                  </p>
                  <span className="text-xs text-blue-200 bg-blue-500/40 px-2 py-1 rounded-full font-medium capitalize">
                    {user?.role || 'member'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto sidebar-scrollbar">
          {filteredMenuItems.map((item, index) => {
            const active = isActive(item.path);
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.path}
                  onClick={handleNavigation}
                  className={`
                    flex items-center rounded-xl p-3 transition-all duration-200 group relative
                    ${active 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <item.icon className={`w-5 h-5 transition-all duration-200 ${active ? 'scale-110' : ''}`} />
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="ml-3 font-medium whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-400/30">
          <motion.button
            onClick={handleLogout}
            whileHover={{ x: isCollapsed ? 0 : 4 }}
            className={`
              flex items-center w-full rounded-xl p-3 text-blue-100 hover:bg-red-500/20 
              hover:text-red-100 transition-all duration-200 group
            `}
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-3 font-medium"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;