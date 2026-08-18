import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
  ShieldCheck,
  MessagesSquare,
  PackageCheck,
  ArrowRight,
} from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import Button from "../components/ui/Button";
import { ProductCardSkeleton } from "../components/ui/Skeleton";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";
import heroImage from "../assets/hero-headphones.jpg";

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

export default function Home() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      productService.list({ sort: "newest", limit: 8 }),
      categoryService.list(),
    ])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data.map(mapToCardShape));
        setCategories(categoriesRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line bg-black">
        <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2">
          {/* LEFT */}
          <div className="relative z-10 flex flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 md:py-16">
            <div className="w-full max-w-lg">
              <span className="inline-flex w-fit animate-fade-up items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-xs font-medium text-ember-soft">
                <Sparkles size={12} /> AI-powered discovery
              </span>

              <h1
                className="mt-6 animate-fade-up font-display text-5xl font-bold leading-[1.05] text-ink_text-hi sm:text-6xl"
                style={{ animationDelay: "0.08s" }}
              >
                Buy. Sell.
                <br />
                Discover <span className="text-ember">Everything.</span>
              </h1>

              <p
                className="mt-6 max-w-md animate-fade-up text-base leading-relaxed text-ink_text-mid"
                style={{ animationDelay: "0.16s" }}
              >
                A marketplace for anything with a second life — listed by
                real people nearby, backed by verified sellers and secure
                checkout.
              </p>

              <div
                className="mt-9 flex animate-fade-up flex-wrap items-center gap-3"
                style={{ animationDelay: "0.24s" }}
              >
                <Button
                  as={Link}
                  to="/products"
                  size="lg"
                  className="transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
                >
                  Start browsing <ArrowRight size={15} />
                </Button>
                <Button as={Link} to="/sell" variant="secondary" size="lg">
                  Sell an item
                </Button>
              </div>

              {/* Mobile-only product visual — shown right under the CTAs on
                  small screens, since the right panel image is desktop-only */}
              <div
                className="mt-8 flex animate-fade-up justify-center md:hidden"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="relative flex h-56 w-full max-w-xs items-center justify-center overflow-hidden rounded-2xl bg-black">
                  <div
                    className="pointer-events-none absolute h-48 w-48 rounded-full opacity-40"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255,90,31,0.18) 0%, transparent 70%)",
                    }}
                  />
                  <img
                    src={heroImage}
                    alt="Featured listing"
                    className="relative h-auto max-h-[90%] w-auto max-w-[88%] object-contain"
                  />
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (query.trim())
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                }}
                className="relative mt-7 flex max-w-md animate-fade-up items-center"
                style={{ animationDelay: "0.32s" }}
              >
                <Search
                  size={16}
                  className="absolute left-4 text-ink_text-low"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try “gaming laptop under 50000”"
                  className="w-full rounded-full border border-line/60 bg-surface/60 py-3.5 pl-10 pr-4 text-sm text-ink_text-hi placeholder:text-ink_text-low outline-none transition-colors focus:border-ember"
                />
              </form>

              <div
                className="relative mt-5 animate-fade-up"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {categories.slice(0, 6).map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/products?category=${cat._id}`}
                      className="shrink-0 whitespace-nowrap rounded-full border border-line/60 px-3.5 py-1.5 text-xs text-ink_text-mid transition-colors hover:border-ember/40 hover:text-ink_text-hi"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-black to-transparent" />
              </div>

              <div
                className="mt-8 flex animate-fade-up flex-wrap items-center gap-3"
                style={{ animationDelay: "0.46s" }}
              >
                <div className="flex items-center gap-1.5 rounded-full border border-line/60 bg-surface/50 px-3.5 py-2">
                  <ShieldCheck size={13} className="text-signal-green" />
                  <span className="text-xs font-medium text-ink_text-hi">
                    Verified sellers
                  </span>
                </div>
                <div className="rounded-full border border-line/60 bg-surface/50 px-3.5 py-2">
                  <span className="font-mono text-xs font-medium text-ember-soft">
                    {products.length}+ live listings
                  </span>
                </div>
              </div>
            </div>
          </div>

                                       {/* RIGHT — image shifted further up and slightly left so it sits
              centered within the panel's visible width, not pushed toward
              the right edge */}
          <div className="relative hidden min-h-[620px] items-center justify-center overflow-hidden md:flex">
            <div
              className="pointer-events-none absolute -ml-6 -mt-16 h-[500px] w-[500px] rounded-full opacity-40"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,90,31,0.18) 0%, transparent 70%)",
              }}
            />
            <img
              src={heroImage}
              alt="Featured listing"
              className="relative -ml-20 -mt-20 h-auto max-h-[100%] w-auto max-w-[100%] animate-fade-up object-contain"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink_text-hi">
              Trending near you
            </h2>
            <p className="mt-1 text-sm text-ink_text-mid">
              Freshly listed, picked up fast.
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-medium text-ember-soft hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-line bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="mb-10 text-center font-display text-2xl font-semibold text-ink_text-hi">
            How CrazyThing works
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                icon: Search,
                title: "List or discover",
                body: "Post an item in minutes with AI-suggested details, or search everything nearby.",
              },
              {
                icon: MessagesSquare,
                title: "Chat & agree",
                body: "Message the seller, negotiate a fair price, and lock it in.",
              },
              {
                icon: PackageCheck,
                title: "Pay & receive",
                body: "Checkout securely, track the shipment, and confirm once it arrives.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex flex-col items-start gap-3 rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-ember/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ember/10">
                  <Icon size={18} className="text-ember" />
                </div>
                <h3 className="font-display text-lg text-ink_text-hi">
                  {title}
                </h3>
                <p className="text-sm text-ink_text-mid">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section id="trust" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-gradient-to-br from-surface to-surface-raised p-10 text-center">
          <ShieldCheck size={28} className="text-signal-green" />
          <h2 className="font-display text-2xl font-semibold text-ink_text-hi">
            Built on trust
          </h2>
          <p className="max-w-lg text-sm text-ink_text-mid">
            Verified seller badges, server-side payment checks, and a
            moderation team keep every transaction accountable.
          </p>
          <Button as={Link} to="/products" size="lg">
            Start browsing
          </Button>
        </div>
      </section>
    </div>
  );
}