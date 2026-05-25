import { assets } from '../config/links.js';

export default function BrandLogo({ className = 'h-11 w-11', showGlow = false }) {
  return (
    <span className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-lg bg-ink-950 ${className}`}>
      {showGlow && <span className="absolute inset-0 bg-brand-400/20 blur-xl" />}
      <img src={assets.logo} alt="CS Zone team logo" className="relative h-full w-full object-cover" />
    </span>
  );
}