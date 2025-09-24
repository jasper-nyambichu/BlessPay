'use client';
import { motion } from 'framer-motion';

interface OfferingCardProps {
  title: string;
  amount: string;
  date: string;
}

export default function OfferingCard({ title, amount, date }: OfferingCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-4 rounded-lg shadow-md"
    >
      <h3 className="text-lg font-semibold text-sda-blue">{title}</h3>
      <p className="text-gray-600">Amount: {amount}</p>
      <p className="text-sm text-gray-500">Date: {date}</p>
    </motion.div>
  );
}