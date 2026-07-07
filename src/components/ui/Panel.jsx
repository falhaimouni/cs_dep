import { motion } from 'framer-motion';

const MotionDiv = motion.div;

export default function Panel({ children, className = '', delay = 0, muted = false, animate = true }) {
  const base = muted ? 'panel-muted' : 'panel';

  if (!animate) {
    return <div className={`${base} p-4 ${className}`}>{children}</div>;
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.2, delay }}
      className={`${base} p-4 ${className}`}
    >
      {children}
    </MotionDiv>
  );
}
