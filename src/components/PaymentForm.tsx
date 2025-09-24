'use client';

import { CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import Input from './ui/Input';
import LoadingSpinner from './ui/LoadingSpinner';

export default function PaymentForm() {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-sda-blue mb-4">Payment</h2>
      <form className="space-y-4">
        <div>
          <label className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <Input placeholder="Phone Number" type="tel" />
          </label>
        </div>
        <div>
          <select className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sda-blue">
            <option value="tithe">Tithe (10%)</option>
            <option value="offering">General Offering</option>
            <option value="sabbath-school">Sabbath School</option>
          </select>
        </div>
        <div>
          <Input placeholder="Amount (KSH)" type="number" />
        </div>
        <Button className="w-full">Pay with M-Pesa</Button>
        <LoadingSpinner />
      </form>
    </motion.div>
  );
}