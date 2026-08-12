import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import Badge from "../components/ui/Badge";
import Price from "../components/ui/Price";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import { orderService } from "../services/orderService";

const statusTone = {
  PENDING_PAYMENT: "amber",
  PAID: "neutral",
  SELLER_CONFIRMATION_PENDING: "amber",
  CONFIRMED: "neutral",
  PACKED: "neutral",
  SHIPPED: "ember",
  OUT_FOR_DELIVERY: "ember",
  DELIVERED: "green",
  COMPLETED: "green",
  CANCELLED: "red",
  RETURN_REQUESTED: "amber",
  RETURNED: "neutral",
  REFUNDED: "neutral",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    orderService
      .myOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message || "Could not load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink_text-hi">Your orders</h1>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-signal-red">{error}</p>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No orders yet"
          description="Once you buy something, it'll show up here with live tracking."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4 hover:border-ember/40"
            >
              <div>
                <p className="font-mono text-xs text-ink_text-low">#{order._id.slice(-8)}</p>
                <p className="mt-1 text-sm text-ink_text-hi">
                  {order.items.length} item{order.items.length > 1 ? "s" : ""} ·{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Price amount={order.total} size="sm" />
                <Badge tone={statusTone[order.status] || "neutral"}>
                  {order.status.replaceAll("_", " ")}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
