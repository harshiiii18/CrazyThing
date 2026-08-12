import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="font-mono text-6xl font-bold text-ember">404</span>
      <h1 className="mt-4 font-display text-xl text-ink_text-hi">Page not found</h1>
      <p className="mt-2 text-sm text-ink_text-mid">
        This listing or page may have moved, sold, or never existed.
      </p>
      <Button as={Link} to="/" className="mt-6">
        Back to home
      </Button>
    </div>
  );
}
