// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Search, Sparkles, ShieldCheck, MessagesSquare, PackageCheck } from "lucide-react";
// import ProductCard from "../components/product/ProductCard";
// import Button from "../components/ui/Button";
// import { ProductCardSkeleton } from "../components/ui/Skeleton";
// import { productService } from "../services/productService";
// import { categoryService } from "../services/categoryService";

// const tilts = [-6, 4, -3, 7, -8];

// function mapToCardShape(p) {
//   return {
//     id: p._id,
//     title: p.title,
//     price: p.price,
//     condition: p.condition?.replaceAll("_", " "),
//     location: p.location,
//     image: p.images?.[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
//     sellerName: p.seller?.name || "Seller",
//     sellerVerified: p.seller?.sellerVerification?.status === "VERIFIED",
//   };
// }

// export default function Home() {
//   const [query, setQuery] = useState("");
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     Promise.all([
//       productService.list({ sort: "newest", limit: 8 }),
//       categoryService.list(),
//     ])
//       .then(([productsRes, categoriesRes]) => {
//         setProducts(productsRes.data.map(mapToCardShape));
//         setCategories(categoriesRes.data);
//       })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   const collageProducts = products.slice(0, 5);

//   return (
//     <div>
//       {/* HERO */}
//       <section className="relative overflow-hidden border-b border-line">
//         <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
//           <div>
//             <span className="inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-xs font-medium text-ember-soft">
//               <Sparkles size={12} /> AI-powered discovery
//             </span>
//             <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] text-ink_text-hi sm:text-5xl md:text-6xl">
//               Buy. Sell.
//               <br />
//               Discover <span className="text-ember">Everything.</span>
//             </h1>
//             <p className="mt-5 max-w-md text-base text-ink_text-mid">
//               A marketplace for anything with a second life — listed by real
//               people nearby, backed by verified sellers and secure checkout.
//             </p>

//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
//               }}
//               className="relative mt-8 flex max-w-md items-center"
//             >
//               <Search size={17} className="absolute left-4 text-ink_text-low" />
//               <input
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Try “gaming laptop under 50000”"
//                 className="w-full rounded-full border border-line bg-surface py-3.5 pl-11 pr-28 text-sm text-ink_text-hi placeholder:text-ink_text-low outline-none focus:border-ember"
//               />
//               <Button type="submit" size="sm" className="absolute right-1.5">
//                 Search
//               </Button>
//             </form>

//             <div className="mt-6 flex flex-wrap gap-2">
//               {categories.slice(0, 6).map((cat) => (
//                 <Link
//                   key={cat._id}
//                   to={`/products?category=${cat._id}`}
//                   className="rounded-full border border-line px-3.5 py-1.5 text-xs text-ink_text-mid hover:border-ember/40 hover:text-ink_text-hi"
//                 >
//                   {cat.name}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Signature element: drifting tilted collage of listings */}
//           {collageProducts.length > 0 && (
//             <div className="relative hidden h-[420px] md:block" aria-hidden="true">
//               {collageProducts.map((p, i) => (
//                 <div
//                   key={p.id}
//                   style={{
//                     "--tilt": `${tilts[i]}deg`,
//                     top: `${(i % 3) * 30 + 5}%`,
//                     left: `${(i * 19) % 60}%`,
//                     animationDelay: `${i * 0.4}s`,
//                   }}
//                   className="absolute w-40 animate-drift overflow-hidden rounded-2xl border border-line bg-surface shadow-card"
//                 >
//                   <img src={p.image} alt="" className="aspect-[4/5] w-full object-cover" />
//                   <div className="p-2.5">
//                     <p className="truncate text-xs text-ink_text-mid">{p.title}</p>
//                     <p className="mt-0.5 font-mono text-sm text-ink_text-hi">
//                       ₹{p.price.toLocaleString("en-IN")}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* TRENDING */}
//       <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
//         <div className="mb-6 flex items-end justify-between">
//           <div>
//             <h2 className="font-display text-2xl font-semibold text-ink_text-hi">
//               Trending near you
//             </h2>
//             <p className="mt-1 text-sm text-ink_text-mid">
//               Freshly listed, picked up fast.
//             </p>
//           </div>
//           <Link to="/products" className="text-sm font-medium text-ember-soft hover:underline">
//             View all
//           </Link>
//         </div>
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
//           {loading
//             ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
//             : products.map((p) => <ProductCard key={p.id} product={p} />)}
//         </div>
//       </section>

//       {/* HOW IT WORKS */}
//       <section id="how-it-works" className="border-t border-line bg-surface/40">
//         <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
//           <h2 className="mb-10 text-center font-display text-2xl font-semibold text-ink_text-hi">
//             How CrazyThing works
//           </h2>
//           <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
//             {[
//               { icon: Search, title: "List or discover", body: "Post an item in minutes with AI-suggested details, or search everything nearby." },
//               { icon: MessagesSquare, title: "Chat & agree", body: "Message the seller, negotiate a fair price, and lock it in." },
//               { icon: PackageCheck, title: "Pay & receive", body: "Checkout securely, track the shipment, and confirm once it arrives." },
//             ].map(({ icon: Icon, title, body }) => (
//               <div key={title} className="flex flex-col items-start gap-3 rounded-2xl border border-line bg-surface p-6">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ember/10">
//                   <Icon size={18} className="text-ember" />
//                 </div>
//                 <h3 className="font-display text-lg text-ink_text-hi">{title}</h3>
//                 <p className="text-sm text-ink_text-mid">{body}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* TRUST */}
//       <section id="trust" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
//         <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-gradient-to-br from-surface to-surface-raised p-10 text-center">
//           <ShieldCheck size={28} className="text-signal-green" />
//           <h2 className="font-display text-2xl font-semibold text-ink_text-hi">
//             Built on trust
//           </h2>
//           <p className="max-w-lg text-sm text-ink_text-mid">
//             Verified seller badges, server-side payment checks, and a
//             moderation team keep every transaction accountable.
//           </p>
//           <Button as={Link} to="/products" size="lg">
//             Start browsing
//           </Button>
//         </div>
//       </section>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
  ShieldCheck,
  MessagesSquare,
  PackageCheck,
  ArrowUpRight,
  Package,
} from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import Button from "../components/ui/Button";
import { ProductCardSkeleton } from "../components/ui/Skeleton";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";

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
      {/* HERO — full-bleed background image, bold uppercase headline */}
      <section className="relative h-[560px] overflow-hidden border-b border-line sm:h-[640px]">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark gradient overlay for legibility + theme tint */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-ember/40 bg-ember/10 px-3 py-1 text-xs font-medium tracking-wide text-ember-soft backdrop-blur-sm">
            <Sparkles size={12} /> AI-POWERED DISCOVERY
          </span>

          <p className="mt-6 font-display text-lg font-medium tracking-[0.3em] text-ink_text-mid">
            BUY. SELL.
          </p>
          <h1 className="mt-1 font-display text-6xl font-bold uppercase leading-[0.95] tracking-tight text-ink_text-hi sm:text-7xl md:text-8xl">
            Discover<br />
            <span className="text-ember">Everything</span>
          </h1>

          <div className="mt-6 flex max-w-md items-start gap-3 border-l-2 border-ember/50 pl-4">
            <p className="text-sm leading-relaxed text-ink_text-mid">
              A marketplace for anything with a second life — listed by real
              people nearby, backed by verified sellers and secure checkout.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button as={Link} to="/products" size="lg" variant="secondary" className="border border-line">
              Start browsing <ArrowUpRight size={15} />
            </Button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
              }}
              className="relative hidden items-center sm:flex"
            >
              <Search size={16} className="absolute left-4 text-ink_text-low" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try “gaming laptop under 50000”"
                className="w-72 rounded-full border border-line bg-ink/60 py-3 pl-10 pr-4 text-sm text-ink_text-hi placeholder:text-ink_text-low outline-none backdrop-blur-sm focus:border-ember"
              />
            </form>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="rounded-full border border-line/60 bg-ink/40 px-3.5 py-1.5 text-xs text-ink_text-mid backdrop-blur-sm hover:border-ember/40 hover:text-ink_text-hi"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom-right floating info cards */}
        <div className="absolute bottom-0 right-0 hidden max-w-md grid-cols-2 divide-x divide-line/60 border-l border-t border-line/60 bg-ink/70 backdrop-blur-md lg:grid">
          <div className="p-5">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-ember/15 text-ember">
              <Package size={14} />
            </div>
            <p className="font-mono text-lg font-semibold text-ink_text-hi">{products.length}+</p>
            <p className="mt-0.5 text-xs text-ink_text-low">Live listings, updated daily</p>
          </div>
          <div className="p-5">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-signal-green/15 text-signal-green">
              <ShieldCheck size={14} />
            </div>
            <p className="font-mono text-lg font-semibold text-ink_text-hi">100%</p>
            <p className="mt-0.5 text-xs text-ink_text-low">Server-verified checkout</p>
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
          <Link to="/products" className="text-sm font-medium text-ember-soft hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
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
              { icon: Search, title: "List or discover", body: "Post an item in minutes with AI-suggested details, or search everything nearby." },
              { icon: MessagesSquare, title: "Chat & agree", body: "Message the seller, negotiate a fair price, and lock it in." },
              { icon: PackageCheck, title: "Pay & receive", body: "Checkout securely, track the shipment, and confirm once it arrives." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex flex-col items-start gap-3 rounded-2xl border border-line bg-surface p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ember/10">
                  <Icon size={18} className="text-ember" />
                </div>
                <h3 className="font-display text-lg text-ink_text-hi">{title}</h3>
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