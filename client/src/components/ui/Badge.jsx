const tones = {
  neutral: "bg-surface-raised text-ink_text-mid border-line",
  ember: "bg-ember/10 text-ember-soft border-ember/30",
  green: "bg-signal-green/10 text-signal-green border-signal-green/30",
  amber: "bg-signal-amber/10 text-signal-amber border-signal-amber/30",
  red: "bg-signal-red/10 text-signal-red border-signal-red/30",
};

export default function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
