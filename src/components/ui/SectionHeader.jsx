import { motion } from 'framer-motion';

export default function SectionHeader({ eyebrow, title, description, align = 'start' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45 }}
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      {eyebrow && <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">{eyebrow}</p>}
      <h2 className="text-3xl font-black leading-tight text-ink-950 dark:text-white md:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{description}</p>}
    </motion.div>
  );
}
