import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, TrendingUp, Clock, Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import { productService } from "../../services/productService";
import { orderService } from "../../services/orderService";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productService.mine(), orderService.sellerOrders()])
      .then(([productsRes, ordersRes]) => {
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeListings = products.filter((p) => p.status === "ACTIVE").length;
  const pendingOrders = orders.filter((o) => o.status === "SELLER_CONFIRMATION_PENDING").length;
  const revenue = orders
    .filter((o) => !["PENDING_PAYMENT", "CANCELLED"].includes(o.status))
    .reduce((sum, o) => {
      const mine = o.items.filter((i) => products.some((p) => p._id === i.product));
      return sum + mine.reduce((s, i) => s + i.price * i.quantity, 0);
    }, 0);

  const stats = [
    { icon: Package, label: "Active listings", value: activeListings },
    { icon: Clock, label: "Awaiting your response", value: pendingOrders },
    { icon: ShoppingBag, label: "Total orders", value: orders.length },
    { icon: TrendingUp, label: "Revenue (confirmed)", value: `₹${revenue.toLocaleString("en-IN")}` },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink_text-hi">Seller dashboard</h1>
        <Button as={Link} to="/sell" size="sm">
          <Plus size={15} /> New listing
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border border-line bg-surface p-4">
              <Icon size={16} className="text-ember" />
              <p className="mt-2 font-mono text-xl font-medium text-ink_text-hi">{value}</p>
              <p className="mt-0.5 text-xs text-ink_text-low">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/seller/products"
          className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-5 hover:border-ember/40"
        >
          <Package size={20} className="text-ember" />
          <div>
            <p className="font-medium text-ink_text-hi">Manage listings</p>
            <p className="text-xs text-ink_text-low">Pause, mark sold out, or delete items</p>
          </div>
        </Link>
        <Link
          to="/seller/orders"
          className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-5 hover:border-ember/40"
        >
          <ShoppingBag size={20} className="text-ember" />
          <div>
            <p className="font-medium text-ink_text-hi">Manage orders</p>
            <p className="text-xs text-ink_text-low">Accept, pack, and ship orders</p>
          </div>
        </Link>
      </div>
    </div>
  );
}