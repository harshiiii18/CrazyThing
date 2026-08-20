import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BadgeCheck, MapPin, Calendar, Package, Star } from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import { userService } from "../services/userService";
import { productService } from "../services/productService";

function mapToCardShape(p) {
  return {
    id: p._id,
    title: p.title,
    price: p.price,
    condition: p.condition?.replaceAll("_", " "),
    location: p.location,
    image: p.images?.[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    sellerName: p.seller?.name || "Seller",
    sellerVerified: p.seller?.sellerVerification?.status === "VERIFIED",
  };
}

export default function SellerProfile() {
  const { username } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    userService
      .getPublicProfile(username)
      .then((res) => {
        setSeller(res.data);
        return productService.list({ seller: res.data._id, limit: 20 });
      })
      .then((res) => setProducts(res?.data || []))
      .catch((err) => setError(err.message || "Could not load this seller's profile"))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-sm text-signal-red">{error || "Seller not found"}</p>
        <Link to="/products" className="mt-4 inline-block text-sm text-ember-soft hover:underline">
          Back to browsing
        </Link>
      </div>
    );
  }

  const isVerified = seller.sellerVerification?.status === "VERIFIED";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-surface-raised text-3xl font-medium text-ink_text-hi">
            {seller.name?.[0]?.toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-semibold text-ink_text-hi">{seller.name}</h1>
              {isVerified && (
                <span className="flex items-center gap-1 rounded-full border border-signal-green/30 bg-signal-green/10 px-2.5 py-1 text-xs font-medium text-signal-green">
                  <BadgeCheck size={13} /> Verified seller
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-ink_text-low">@{seller.username}</p>

            {seller.bio && <p className="mt-3 max-w-lg text-sm text-ink_text-mid">{seller.bio}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink_text-mid">
              {seller.ratingCount > 0 ? (
                <span className="flex items-center gap-1">
                  <Star size={14} className="fill-ember text-ember" />
                  <span className="font-medium text-ink_text-hi">{seller.ratingAvg.toFixed(1)}</span>
                  <span className="text-ink_text-low">({seller.ratingCount})</span>
                </span>
              ) : (
                <span className="text-ink_text-low">No ratings yet</span>
              )}
              {seller.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {seller.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={14} /> Joined{" "}
                {new Date(seller.createdAt).toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Package size={14} /> {seller.completedSalesCount || 0} sales
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="mt-8">
        <h2 className="mb-5 font-display text-xl font-semibold text-ink_text-hi">
          Listings from {seller.name.split(" ")[0]}
        </h2>
        {products.length === 0 ? (
          <EmptyState title="No active listings" description="This seller doesn't have any active items right now." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={mapToCardShape(p)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}