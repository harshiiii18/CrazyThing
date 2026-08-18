import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import Button from "../components/ui/Button";

export default function ComingSoon({
  title = "Coming soon",
  description = "This part of CrazyThing is being built in a later phase.",
  icon: Icon = Sparkles,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/15 blur-[50px]" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-ember/20 bg-surface">
          <Icon size={24} className="text-ember" />
        </div>
      </div>

      <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-xs font-medium text-ember-soft">
        In progress
      </span>

      <h1 className="mt-4 font-display text-2xl font-semibold text-ink_text-hi">{title}</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink_text-mid">{description}</p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        {actionLabel && actionTo && (
          <Button as={Link} to={actionTo}>
            {actionLabel}
          </Button>
        )}
        <Button as={Link} to="/" variant="secondary">
          Back to home
        </Button>
      </div>
    </div>
  );
}
