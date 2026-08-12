import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, hint, className = "", ...props },
  ref
) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-ink_text-mid">
          {label}
        </span>
      )}
      <input
        ref={ref}
        className={`w-full rounded-xl border bg-surface px-4 py-2.5 text-ink_text-hi placeholder:text-ink_text-low outline-none transition-colors focus:border-ember ${
          error ? "border-signal-red" : "border-line"
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-signal-red">{error}</span>}
      {!error && hint && (
        <span className="mt-1 block text-xs text-ink_text-low">{hint}</span>
      )}
    </label>
  );
});

export default Input;
