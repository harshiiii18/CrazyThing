import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Heart, BadgeCheck } from "lucide-react";
import { useSelector } from "react-redux";
import Price from "../ui/Price";
import Badge from "../ui/Badge";
import { wishlistService } from "../../services/wishlistService";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const token = useSelector((s) => s.auth.token);
  const [wished, setWished] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }
    setBusy(true);
    try {
      const res = await wishlistService.toggle(product.id);
      setWished(res.data.added);
    } catch {
      // non-critical — ignore
    } finally {
      setBusy(false);
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-200 hover:border-ember/40 hover:shadow-card"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-raised">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={handleWishlist}
          disabled={busy}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-ink/60 backdrop-blur-sm transition-colors hover:bg-ink/80"
          aria-label="Toggle wishlist"
        >
          <Heart
            size={16}
            className={wished ? "fill-ember text-ember" : "text-ink_text-hi"}
          />
        </button>
        {product.condition && (
          <div className="absolute left-2.5 top-2.5">
            <Badge tone="neutral" className="bg-ink/60 backdrop-blur-sm border-transparent">
              {product.condition}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink_text-hi">
          {product.title}
        </h3>
        <Price amount={product.price} size="sm" />
        <div className="mt-1 flex items-center gap-1.5 text-xs text-ink_text-low">
          {product.sellerVerified && (
            <BadgeCheck size={13} className="text-signal-green" />
          )}
          <span className="truncate">{product.sellerName}</span>
          <span>·</span>
          <span className="truncate">{product.location}</span>
        </div>
      </div>
    </Link>
  );
}
