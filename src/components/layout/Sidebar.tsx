'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CreditCard, History, User, Settings, Bell,
  ChevronLeft, ChevronRight, LogOut, Users, Heart
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
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 768);
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

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role || 'member'));
  const isActive = (path: string) => path === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(path);
  const handleNavigation = () => !isDesktop && setIsMobileOpen(false);
  const handleLogout = async () => { await logout(); !isDesktop && setIsMobileOpen(false); };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isDesktop ? 0 : (isMobileOpen ? 0 : -280), 
          width: isDesktop ? (isCollapsed ? 80 : 260) : 260 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed md:relative left-0 top-0 h-screen bg-gradient-to-b from-[hsl(220,50%,12%)] to-[hsl(220,50%,18%)] shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              {!isCollapsed ? (
                <>
                  <div className="w-10 h-10 bg-gradient-to-br from-[hsl(38,70%,50%)] to-[hsl(38,70%,60%)] rounded-xl flex items-center justify-center shadow-lg">
                    <Heart className="w-5 h-5 text-[hsl(220,50%,15%)]" />
                  </div>
                  <span className="text-xl font-serif font-bold text-white">BlessPay</span>
                </>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-[hsl(38,70%,50%)] to-[hsl(38,70%,60%)] rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[hsl(220,50%,15%)]" />
                </div>
              )}
            </Link>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5 text-[hsl(38,70%,55%)]" /> : <ChevronLeft className="w-5 h-5 text-[hsl(38,70%,55%)]" />}
            </button>
          </div>

          {/* User Profile */}
          {!isCollapsed && (
            <div className="mt-5 flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(38,70%,50%)] to-[hsl(38,70%,60%)] flex items-center justify-center text-[hsl(220,50%,15%)] font-bold">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{user?.full_name || 'User'}</p>
                <p className="text-[hsl(38,70%,55%)] text-xs capitalize">{user?.role || 'member'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto sidebar-scrollbar">
          {filteredMenuItems.map((item, index) => {
            const active = isActive(item.path);
            return (
              <motion.div key={item.path} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.05 }}>
                <Link
                  href={item.path}
                  onClick={handleNavigation}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    active 
                      ? 'bg-gradient-to-r from-[hsl(38,70%,50%)] to-[hsl(38,70%,55%)] text-[hsl(220,50%,15%)] shadow-lg' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${active ? 'text-[hsl(220,50%,15%)]' : ''}`} />
                  {!isCollapsed && <span className="font-medium">{item.name}</span>}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-[hsl(220,50%,15%)] text-white rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-xl z-50 text-sm">
                      {item.name}
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;