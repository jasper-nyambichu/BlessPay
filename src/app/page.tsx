import { motion } from 'framer-motion';

export default function Home() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-sda-white p-4"
    >
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-sda-blue mb-4">
          Welcome to BlessPay
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Manage your tithes and offerings with a faith-inspired system.
        </p>
        <a href="/login" className="btn bg-sda-blue text-white">
          Get Started
        </a>
      </div>
    </motion.div>
  );
}