import { motion } from 'framer-motion';

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <h1 className="text-3xl font-bold text-sda-blue mb-6">Dashboard</h1>
      <p className="text-gray-600">Overview of your giving and activities.</p>
      {/* Placeholder for data */}
    </motion.div>
  );
}