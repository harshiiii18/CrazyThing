import { useState } from "react";
import { Star } from "lucide-react";
import Button from "../ui/Button";
import { reviewService } from "../../services/reviewService";

export default function ReviewForm({ orderId, productId, productTitle, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Select a star rating");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await reviewService.create({ orderId, productId, rating, comment });
      onSubmitted();
    } catch (err) {
      setError(err.message || "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-line bg-ink p-3">
      <p className="mb-2 text-sm text-ink_text-hi">Rate {productTitle}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          >
            <Star
              size={22}
              className={
                star <= (hoverRating || rating)
                  ? "fill-ember text-ember"
                  : "text-ink_text-low"
              }
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        placeholder="Share your experience (optional)"
        className="mt-2 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink_text-hi outline-none focus:border-ember"
      />
      {error && <p className="mt-1 text-xs text-signal-red">{error}</p>}
      <Button type="submit" size="sm" className="mt-2" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  );
}