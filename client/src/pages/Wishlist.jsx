import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Heart, X } from "lucide-react";
import Price from "../components/ui/Price";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import { wishlistService } from "../services/wishlistService";

export default function Wishlist() {
  const token = useSelector((s) => s.auth.token);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    wishlistService
      .get()
      .then((res) => setItems(res.data))
      .catch((err) => setError(err.message || "Could not load your wishlist"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleRemove = async (productId) => {
    try {
      await wishlistService.toggle(productId);
      setItems((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      setError(err.message || "Could not remove item");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          icon={Heart}
          title="Nothing saved yet"
          description="Tap the heart on any listing to save it here for later."
          action={
            <Button as={Link} to="/products">
              Browse listings
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink_text-hi">
        Your wishlist
      </h1>
      {error && <p className="mb-4 text-sm text-signal-red">{error}</p>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="group relative overflow-hidden rounded-2xl border border-line bg-surface"
          >
            <button
              onClick={() => handleRemove(item._id)}
              className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-ink/70"
              aria-label="Remove from wishlist"
            >
              <X size={14} className="text-ink_text-hi" />
            </button>
            <Link to={`/products/${item._id}`}>
              <img
                src={item.images?.[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"}
                alt={item.title}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="p-3.5">
                <p className="line-clamp-2 text-sm font-medium text-ink_text-hi">
                  {item.title}
                </p>
                <Price amount={item.price} size="sm" className="mt-1" />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
