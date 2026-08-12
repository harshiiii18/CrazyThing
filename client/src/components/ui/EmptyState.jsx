export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
      {Icon && (
        <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-surface-raised">
          <Icon size={22} className="text-ink_text-low" />
        </div>
      )}
      <h3 className="font-display text-lg text-ink_text-hi">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-ink_text-mid">{description}</p>
      )}
      {action}
    </div>
  );
}
