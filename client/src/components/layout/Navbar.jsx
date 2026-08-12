import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingCart, MessageCircle, Menu, X, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import Button from "../ui/Button";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const cartCount = useSelector((s) => s.cart.items.length);
  const user = useSelector((s) => s.auth.user);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-1 font-display text-xl font-bold text-ink_text-hi shrink-0">
          Crazy<span className="text-ember">Thing</span>
        </Link>

        <form
          onSubmit={handleSearch}
          className="relative hidden flex-1 max-w-xl items-center md:flex"
        >
          <Search size={16} className="absolute left-3.5 text-ink_text-low" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for anything…"
            className="w-full rounded-full border border-line bg-surface py-2.5 pl-10 pr-24 text-sm text-ink_text-hi placeholder:text-ink_text-low outline-none focus:border-ember"
          />
          <button
            type="button"
            onClick={() => navigate(`/search?ai=1&q=${encodeURIComponent(query)}`)}
            className="absolute right-1.5 flex items-center gap-1 rounded-full bg-ember/15 px-3 py-1.5 text-xs font-medium text-ember-soft hover:bg-ember/25"
          >
            <Sparkles size={12} /> AI
          </button>
        </form>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          <Link
            to="/wishlist"
            className="rounded-full p-2.5 text-ink_text-mid hover:bg-surface hover:text-ink_text-hi"
          >
            <Heart size={19} />
          </Link>
          <Link
            to="/messages"
            className="rounded-full p-2.5 text-ink_text-mid hover:bg-surface hover:text-ink_text-hi"
          >
            <MessageCircle size={19} />
          </Link>
          <Link
            to="/cart"
            className="relative rounded-full p-2.5 text-ink_text-mid hover:bg-surface hover:text-ink_text-hi"
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ember text-[10px] font-bold text-ink">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <Link to="/profile" className="ml-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-raised text-sm font-medium text-ink_text-hi">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
            </Link>
          ) : (
            <Button as={Link} to="/login" size="sm" className="ml-2">
              Sign in
            </Button>
          )}
          <Button as={Link} to="/sell" variant="secondary" size="sm">
            Sell
          </Button>
        </nav>

        <button
          className="ml-auto p-2 text-ink_text-hi md:hidden"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-ink/95 backdrop-blur-md md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-display text-lg font-bold">
              Crazy<span className="text-ember">Thing</span>
            </span>
            <button onClick={() => setDrawerOpen(false)} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <form onSubmit={handleSearch} className="relative mx-4 mb-6 flex items-center">
            <Search size={16} className="absolute left-3.5 text-ink_text-low" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for anything…"
              className="w-full rounded-full border border-line bg-surface py-3 pl-10 pr-4 text-sm text-ink_text-hi outline-none focus:border-ember"
            />
          </form>
          <div className="flex flex-col gap-1 px-4">
            {[
              ["Wishlist", "/wishlist"],
              ["Messages", "/messages"],
              ["Cart", "/cart"],
              ["Sell an item", "/sell"],
              [user ? "Profile" : "Sign in", user ? "/profile" : "/login"],
            ].map(([label, to]) => (
              <Link
                key={to}
                to={to}
                onClick={() => setDrawerOpen(false)}
                className="rounded-xl px-3 py-3 text-base text-ink_text-hi hover:bg-surface"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
