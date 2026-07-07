export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded border border-dashed border-border px-6 py-16 text-center dark:border-zinc-700">
      {Icon && (
        <div className="mb-4 grid h-10 w-10 place-items-center rounded border border-border bg-surface-muted dark:border-zinc-700 dark:bg-zinc-900">
          <Icon size={18} className="text-ink-tertiary dark:text-zinc-500" />
        </div>
      )}
      <p className="text-sm font-medium text-ink dark:text-zinc-100">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-secondary dark:text-zinc-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
