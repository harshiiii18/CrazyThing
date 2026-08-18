import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  Share2,
  Flag,
  BadgeCheck,
  MessageCircle,
  ShieldCheck,
  Mail,
  Phone,
  Loader2,
  X,
} from "lucide-react";
import Price from "../components/ui/Price";
import Badge from "../components/ui/Badge";
import Rating from "../components/ui/Rating";
import Button from "../components/ui/Button";
import ProductCard from "../components/product/ProductCard";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import ReviewList from "../components/product/ReviewList";
import { productService } from "../services/productService";
import { cartService } from "../services/cartService";
import { wishlistService } from "../services/wishlistService";
import { reviewService } from "../services/reviewService";
import { setCart } from "../redux/slices/cartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [offerOpen, setOfferOpen] = useState(false);
  const [wished, setWished] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const [contactOpen, setContactOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    productService
      .getById(id)
      .then((res) => {
        setProduct(res.data);
        return Promise.all([
          productService.list({
            category: res.data.category?._id || res.data.category,
            limit: 5,
          }),
          reviewService.getForProduct(id),
        ]);
      })
      .then(([similarRes, reviewsRes]) => {
        setSimilar((similarRes?.data || []).filter((p) => p._id !== id));
        setReviews(reviewsRes.data);
      })
      .catch((err) => setError(err.message || "Could not load this listing"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setAddingToCart(true);
    setCartMessage("");
    try {
      const res = await cartService.addItem(product._id, 1);
      dispatch(setCart(res.data));
      setCartMessage("Added to cart");
    } catch (err) {
      setCartMessage(err.message || "Could not add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setAddingToCart(true);
    setCartMessage("");
    try {
      const res = await cartService.addItem(product._id, 1);
      dispatch(setCart(res.data));
      navigate("/checkout");
    } catch (err) {
      setCartMessage(err.message || "Could not proceed to checkout");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await wishlistService.toggle(product._id);
      setWished(res.data.added);
    } catch {
      // silently ignore — non-critical action
    }
  };

  const handleContactSeller = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setContactOpen(true);
    if (contactInfo) return;

    setContactLoading(true);
    setContactError("");
    try {
      const res = await productService.getSellerContact(product._id);
      setContactInfo(res.data);
    } catch (err) {
      setContactError(err.message || "Could not load seller contact details");
    } finally {
      setContactLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          title="Listing not found"
          description={
            error || "This item may have been sold or removed by the seller."
          }
          action={
            <Button as={Link} to="/products" variant="secondary">
              Back to browsing
            </Button>
          }
        />
      </div>
    );
  }

  const gallery = product.images?.length
    ? product.images.map((i) => i.url)
    : [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* GALLERY */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl border border-line bg-surface">
            <img
              src={gallery[activeImage]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-xl border ${
                    activeImage === i ? "border-ember" : "border-line"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-2xl font-semibold text-ink_text-hi sm:text-3xl">
              {product.title}
            </h1>
            <div className="flex shrink-0 gap-1.5">
              <button
                onClick={handleToggleWishlist}
                className="rounded-full border border-line p-2.5 hover:border-ember/40"
                aria-label="Save to wishlist"
              >
                <Heart
                  size={17}
                  className={
                    wished ? "fill-ember text-ember" : "text-ink_text-mid"
                  }
                />
              </button>
              <button
                className="rounded-full border border-line p-2.5 hover:border-ember/40"
                aria-label="Share"
              >
                <Share2 size={17} className="text-ink_text-mid" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Price amount={product.price} size="lg" />
            <Badge tone="ember">
              {product.condition?.replaceAll("_", " ")}
            </Badge>
            {product.ratingCount > 0 && (
              <Rating value={product.ratingAvg} count={product.ratingCount} />
            )}
          </div>

          <p className="mt-1 text-sm text-ink_text-low">{product.location}</p>

          <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-ink_text-mid">
            {product.description}
          </p>

          {product.seller && (
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-line bg-surface p-4">
              <Link
                to={`/seller/${product.seller.username}`}
                className="flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-raised font-medium text-ink_text-hi">
                  {product.seller.name?.[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm font-medium text-ink_text-hi">
                    {product.seller.name}
                    {product.seller.sellerVerification?.status ===
                      "VERIFIED" && (
                      <BadgeCheck size={14} className="text-signal-green" />
                    )}
                  </div>
                  <Rating
                    value={product.seller.ratingAvg || 0}
                    count={product.seller.ratingCount || 0}
                  />
                </div>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleContactSeller}
              >
                <MessageCircle size={15} /> Contact seller
              </Button>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleBuyNow}
              disabled={addingToCart}
            >
              Buy now
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? "Adding…" : "Add to cart"}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setOfferOpen(true)}
            >
              Make offer
            </Button>
          </div>

          {cartMessage && (
            <p className="mt-2 text-xs text-ink_text-mid">{cartMessage}</p>
          )}

          {offerOpen && (
            <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
              <p className="mb-2 text-sm font-medium text-ink_text-hi">
                Offer your price
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="number"
                  placeholder={`e.g. ${Math.round(product.price * 0.9)}`}
                  className="w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-ink_text-hi outline-none focus:border-ember"
                />
                <Button type="submit">Send</Button>
              </form>
              <p className="mt-2 text-xs text-ink_text-low">
                Offers are stored for a future phase — not yet wired to the
                backend.
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center gap-2 rounded-xl bg-signal-green/10 px-3.5 py-2.5 text-xs text-signal-green">
            <ShieldCheck size={15} />
            Payments are verified server-side before an order is confirmed.
          </div>

          <button className="mt-4 flex items-center gap-1.5 text-xs text-ink_text-low hover:text-signal-red">
            <Flag size={13} /> Report this listing
          </button>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-5 font-display text-xl font-semibold text-ink_text-hi">
          Reviews {product.ratingCount > 0 && `(${product.ratingCount})`}
        </h2>
        <ReviewList reviews={reviews} />
      </div>

      {similar.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-5 font-display text-xl font-semibold text-ink_text-hi">
            Similar listings
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {similar.map((p) => (
              <ProductCard key={p._id} product={mapToCardShape(p)} />
            ))}
          </div>
        </div>
      )}

      {contactOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm px-4"
          onClick={() => setContactOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg text-ink_text-hi">
                Contact seller
              </h3>
              <button onClick={() => setContactOpen(false)} aria-label="Close">
                <X size={18} className="text-ink_text-mid" />
              </button>
            </div>

            {contactLoading ? (
              <div className="flex items-center gap-2 py-4 text-sm text-ink_text-mid">
                <Loader2 size={16} className="animate-spin" /> Loading…
              </div>
            ) : contactError ? (
              <p className="text-sm text-signal-red">{contactError}</p>
            ) : contactInfo ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-ink_text-mid">
                  Reach out to{" "}
                  <span className="text-ink_text-hi">{contactInfo.name}</span>{" "}
                  directly to ask questions or arrange a closer look before you
                  buy.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    const subject = encodeURIComponent(
                      "Question about your listing: " + product.title,
                    );
                    window.location.href =
                      "mailto:" + contactInfo.email + "?subject=" + subject;
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-line bg-ink px-4 py-3 text-left text-sm text-ink_text-hi hover:border-ember/40"
                >
                  <Mail size={15} className="text-ember" />
                  {contactInfo.email}
                </button>

                {contactInfo.phone && (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "tel:" + contactInfo.phone;
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl border border-line bg-ink px-4 py-3 text-left text-sm text-ink_text-hi hover:border-ember/40"
                  >
                    <Phone size={15} className="text-ember" />
                    {contactInfo.phone}
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

function mapToCardShape(p) {
  return {
    id: p._id,
    title: p.title,
    price: p.price,
    condition: p.condition?.replaceAll("_", " "),
    location: p.location,
    image:
      p.images?.[0]?.url ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    sellerName: p.seller?.name || "Seller",
    sellerVerified: p.seller?.sellerVerification?.status === "VERIFIED",
  };
}
