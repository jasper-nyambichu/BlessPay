'use client';

import { User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-sda-blue text-white p-4 shadow-md"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          BlessPay
        </Link>
        <div className="space-x-4">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/payments" className="hover:underline">
            Payments
          </Link>
          <Link href="/history" className="hover:underline">
            History
          </Link>
          <Link href="/profile" className="hover:underline">
            Profile
          </Link>
          <Link href="/admin" className="hover:underline">
            Admin
          </Link>
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Guest</span>
            <LogOut className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}