import { motion } from 'framer-motion';

const MotionDiv = motion.div;

export default function SectionHeader({ eyebrow, title, description, align = 'start', action }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.2 }}
      className={`${align === 'center' ? 'mx-auto text-center' : ''} ${action ? 'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between' : ''}`}
    >
      <div className={align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <p className="text-label mb-2">{eyebrow}</p>}
        <h2 className="text-xl font-semibold tracking-tight text-ink dark:text-zinc-50 sm:text-2xl">{title}</h2>
        {description && <p className="mt-2 text-sm leading-6 text-ink-secondary dark:text-zinc-400">{description}</p>}
      </div>
      {action}
    </MotionDiv>
  );
}
