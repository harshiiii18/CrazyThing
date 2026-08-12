import { Star } from "lucide-react";

export default function Rating({ value = 0, count, size = 14 }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={size} className="fill-ember text-ember" />
      <span className="text-sm font-medium text-ink_text-hi">{value.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-ink_text-low">({count})</span>
      )}
    </div>
  );
}
