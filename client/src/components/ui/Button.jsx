const variants = {
  primary:
    "bg-ember text-ink hover:bg-ember-soft shadow-glow disabled:bg-ember/40",
  secondary:
    "bg-surface-raised text-ink_text-hi border border-line hover:border-ember/50",
  ghost: "bg-transparent text-ink_text-mid hover:text-ink_text-hi hover:bg-surface",
  danger: "bg-signal-red/10 text-signal-red border border-signal-red/30 hover:bg-signal-red/20",
};

const sizes = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-6 py-3",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  as: Comp = "button",
  ...props
}) {
  return (
    <Comp
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}
