import { Link } from "react-router-dom";
import { Construction } from "lucide-react";
import Button from "../components/ui/Button";

export default function ComingSoon({ title = "Coming soon" }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-raised">
        <Construction size={24} className="text-ink_text-low" />
      </div>
      <h1 className="mt-5 font-display text-xl text-ink_text-hi">{title}</h1>
      <p className="mt-2 text-sm text-ink_text-mid">
        This part of CrazyThing is being built in a later phase.
      </p>
      <Button as={Link} to="/" variant="secondary" className="mt-6">
        Back to home
      </Button>
    </div>
  );
}
