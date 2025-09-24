import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-sda-blue text-white p-4 mt-8"
    >
      <div className="container mx-auto text-center">
        <p>&copy; 2025 BlessPay. All rights reserved.</p>
        <p>Seventh-day Adventist Church Offering System</p>
      </div>
    </motion.footer>
  );
}