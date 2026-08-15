import { Star } from "lucide-react";

export default function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-ink_text-low">No reviews yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((r) => (
        <div key={r._id} className="rounded-xl border border-line bg-surface p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-raised text-xs font-medium text-ink_text-hi">
                {r.reviewer?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="text-sm text-ink_text-hi">{r.reviewer?.name || "Buyer"}</span>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={i < r.rating ? "fill-ember text-ember" : "text-ink_text-low"}
                />
              ))}
            </div>
          </div>
          {r.comment && <p className="mt-2 text-sm text-ink_text-mid">{r.comment}</p>}
          <p className="mt-2 text-xs text-ink_text-low">
            {new Date(r.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}