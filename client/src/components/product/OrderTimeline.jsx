import { Check, Circle, ArrowRight } from "lucide-react";

const STEPS = [
  { key: "PAID", label: "Order placed" },
  { key: "SELLER_CONFIRMATION_PENDING", label: "Payment confirmed" },
  { key: "CONFIRMED", label: "Seller confirmed" },
  { key: "PACKED", label: "Packed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

export default function OrderTimeline({ status }) {
  const currentIndex = STEPS.findIndex((s) => s.key === status);
  const isCancelled = status === "CANCELLED";

  if (isCancelled) {
    return (
      <div className="rounded-xl border border-signal-red/30 bg-signal-red/10 px-4 py-3 text-sm text-signal-red">
        This order was cancelled.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {STEPS.map((step, i) => {
        const done = currentIndex >= 0 && i <= currentIndex;
        const isNext = i === currentIndex + 1;
        return (
          <div key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                  done
                    ? "border-signal-green bg-signal-green/15 text-signal-green"
                    : isNext
                    ? "border-ember text-ember"
                    : "border-line text-ink_text-low"
                }`}
              >
                {done ? <Check size={13} /> : isNext ? <ArrowRight size={12} /> : <Circle size={8} />}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-8 w-px ${done ? "bg-signal-green" : "bg-line"}`} />
              )}
            </div>
            <span
              className={`pb-8 pt-0.5 text-sm ${
                done ? "text-ink_text-hi" : isNext ? "text-ember-soft" : "text-ink_text-low"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
