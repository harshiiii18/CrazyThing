import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  Plus,
  ArrowUpRight,
  Sparkles,
  BadgeCheck,
  ShieldAlert,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import { productService } from "../../services/productService";
import { orderService } from "../../services/orderService";
import { userService } from "../../services/userService";
import { fetchCurrentUser } from "../../redux/slices/authSlice";

const statusTone = {
  SELLER_CONFIRMATION_PENDING: "amber",
  CONFIRMED: "neutral",
  PACKED: "neutral",
  SHIPPED: "ember",
  DELIVERED: "green",
  CANCELLED: "red",
};

export default function SellerDashboard() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingVerification, setRequestingVerification] = useState(false);

  useEffect(() => {
    Promise.all([productService.mine(), orderService.sellerOrders()])
      .then(([productsRes, ordersRes]) => {
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRequestVerification = async () => {
    setRequestingVerification(true);
    try {
      await userService.requestVerification();
      await dispatch(fetchCurrentUser());
    } catch (err) {
      alert(err.message || "Could not submit request");
    } finally {
      setRequestingVerification(false);
    }
  };

  const activeListings = products.filter((p) => p.status === "ACTIVE").length;
  const pendingOrders = orders.filter((o) => o.status === "SELLER_CONFIRMATION_PENDING").length;
  const revenue = orders
    .filter((o) => !["PENDING_PAYMENT", "CANCELLED"].includes(o.status))
    .reduce((sum, o) => {
      const mine = o.items.filter((i) => products.some((p) => p._id === i.product));
      return sum + mine.reduce((s, i) => s + i.price * i.quantity, 0);
    }, 0);

  const stats = [
    { icon: Package, label: "Active listings", value: activeListings, tone: "ember" },
    { icon: Clock, label: "Awaiting response", value: pendingOrders, tone: "amber" },
    { icon: ShoppingBag, label: "Total orders", value: orders.length, tone: "neutral" },
    { icon: TrendingUp, label: "Revenue (confirmed)", value: `₹${revenue.toLocaleString("en-IN")}`, tone: "green" },
  ];

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Header with greeting */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-xs font-medium text-ember-soft">
            <Sparkles size={12} /> Seller mode
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-ink_text-hi">
            Welcome back, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="mt-1 text-sm text-ink_text-mid">
            Here's what's happening with your shop today.
          </p>
        </div>
        <Button as={Link} to="/sell" size="lg">
          <Plus size={16} /> New listing
        </Button>
      </div>

      <VerificationBanner
        status={user?.sellerVerification?.status}
        onRequest={handleRequestVerification}
        requesting={requestingVerification}
      />

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map(({ icon: Icon, label, value, tone }) => (
            <StatCard key={label} icon={Icon} label={label} value={value} tone={tone} />
          ))}
        </div>
      )}

      {/* Quick action cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ActionCard
          to="/seller/products"
          icon={Package}
          title="Manage listings"
          description="Pause, mark sold out, or delete items"
        />
        <ActionCard
          to="/seller/orders"
          icon={ShoppingBag}
          title="Manage orders"
          description="Accept, pack, and ship orders"
        />
      </div>

      {/* Recent orders preview */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink_text-hi">Recent orders</h2>
          {orders.length > 0 && (
            <Link
              to="/seller/orders"
              className="flex items-center gap-1 text-sm font-medium text-ember-soft hover:underline"
            >
              View all <ArrowUpRight size={14} />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line p-8 text-center">
            <p className="text-sm text-ink_text-mid">No orders yet — they'll show up here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recentOrders.map((order) => (
              <Link
                key={order._id}
                to="/seller/orders"
                className="flex items-center justify-between rounded-xl border border-line bg-surface p-3.5 transition-colors hover:border-ember/40"
              >
                <div>
                  <p className="font-mono text-xs text-ink_text-low">#{order._id.slice(-8)}</p>
                  <p className="mt-0.5 text-sm text-ink_text-hi">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-ink_text-hi">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                  <Badge tone={statusTone[order.status] || "neutral"}>
                    {order.status.replaceAll("_", " ")}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VerificationBanner({ status, onRequest, requesting }) {
  if (status === "VERIFIED") {
    return (
      <div className="mb-6 flex items-center gap-2 rounded-xl border border-signal-green/30 bg-signal-green/10 px-4 py-3 text-sm text-signal-green">
        <BadgeCheck size={16} /> You're a verified seller — buyers see a trust badge on your listings.
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="mb-6 flex items-center gap-2 rounded-xl border border-signal-amber/30 bg-signal-amber/10 px-4 py-3 text-sm text-signal-amber">
        <Clock size={16} /> Your verification request is under review.
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-ink_text-mid">
        <ShieldAlert size={16} className="text-ember" />
        {status === "REJECTED"
          ? "Your last verification request was rejected. You can request again."
          : "Get verified to earn a trust badge buyers see on every listing."}
      </div>
      <Button size="sm" onClick={onRequest} disabled={requesting}>
        {requesting ? "Submitting…" : "Request verification"}
      </Button>
    </div>
  );
}

const toneStyles = {
  ember: "bg-ember/10 text-ember",
  amber: "bg-signal-amber/10 text-signal-amber",
  green: "bg-signal-green/10 text-signal-green",
  neutral: "bg-surface-raised text-ink_text-mid",
};

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="group rounded-2xl border border-line bg-surface p-4 transition-all hover:border-ember/30 hover:shadow-card">
      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${toneStyles[tone]}`}>
        <Icon size={16} />
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold text-ink_text-hi">{value}</p>
      <p className="mt-0.5 text-xs text-ink_text-low">{label}</p>
    </div>
  );
}

function ActionCard({ to, icon: Icon, title, description }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-gradient-to-br from-surface to-surface-raised p-5 transition-all hover:border-ember/40 hover:shadow-card"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ember/10 text-ember transition-transform group-hover:scale-110">
        <Icon size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink_text-hi">{title}</p>
        <p className="text-sm text-ink_text-low">{description}</p>
      </div>
      <ArrowUpRight
        size={18}
        className="shrink-0 text-ink_text-low transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ember"
      />
    </Link>
  );
}