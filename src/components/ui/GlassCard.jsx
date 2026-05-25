import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay }}
      className={`glass-panel rounded-lg p-5 ${className}`}
    >
      {children}
    </motion.div>
  );
}
