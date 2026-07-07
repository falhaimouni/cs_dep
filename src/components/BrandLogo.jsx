import { assets } from '../config/links.js';

export default function BrandLogo({ className = 'h-8 w-8' }) {
  return (
    <span className={`inline-grid shrink-0 place-items-center overflow-hidden rounded border border-border bg-zinc-900 dark:border-zinc-700 ${className}`}>
      <img src={assets.logo} alt="CS Department logo" className="h-full w-full object-cover" />
    </span>
  );
}
