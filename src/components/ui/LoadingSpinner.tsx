import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="flex justify-center"
    >
      <Loader2 className="w-8 h-8 text-sda-blue animate-spin" />
    </motion.div>
  );
}