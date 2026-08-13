import { useEffect, useState } from "react";
import { Package, Truck, Check, X } from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Price from "../../components/ui/Price";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import { orderService } from "../../services/orderService";

const statusTone = {
  SELLER_CONFIRMATION_PENDING: "amber",
  CONFIRMED: "neutral",
  PACKED: "neutral",
  SHIPPED: "ember",
  DELIVERED: "green",
  CANCELLED: "red",
};

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [shipForm, setShipForm] = useState(null); // orderId currently entering tracking info

  const load = () => {
    orderService
      .sellerOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message || "Could not load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleRespond = async (id, action) => {
    setBusyId(id);
    try {
      await orderService.sellerRespond(id, action);
      load();
    } catch (err) {
      setError(err.message || "Could not update order");
    } finally {
      setBusyId(null);
    }
  };

  const handlePack = async (id) => {
    setBusyId(id);
    try {
      await orderService.markPacked(id);
      load();
    } catch (err) {
      setError(err.message || "Could not update order");
    } finally {
      setBusyId(null);
    }
  };

  const handleShip = async (id, courier, trackingNumber) => {
    if (!courier || !trackingNumber) {
      setError("Enter courier and tracking number");
      return;
    }
    setBusyId(id);
    try {
      await orderService.markShipped(id, { courier, trackingNumber });
      setShipForm(null);
      load();
    } catch (err) {
      setError(err.message || "Could not mark as shipped");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink_text-hi">Orders to fulfill</h1>

      {error && <p className="mb-4 text-sm text-signal-red">{error}</p>}

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Orders containing your listings will show up here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-ink_text-low">#{order._id.slice(-8)}</p>
                <Badge tone={statusTone[order.status] || "neutral"}>
                  {order.status.replaceAll("_", " ")}
                </Badge>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center justify-between text-sm">
                    <span className="text-ink_text-mid">{item.title} × {item.quantity}</span>
                    <Price amount={item.price * item.quantity} size="sm" />
                  </div>
                ))}
              </div>

              <p className="mt-3 text-xs text-ink_text-low">
                Ship to: {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {order.status === "SELLER_CONFIRMATION_PENDING" && (
                  <>
                    <Button size="sm" onClick={() => handleRespond(order._id, "accept")} disabled={busyId === order._id}>
                      <Check size={13} /> Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleRespond(order._id, "reject")}
                      disabled={busyId === order._id}
                    >
                      <X size={13} /> Reject
                    </Button>
                  </>
                )}
                {order.status === "CONFIRMED" && (
                  <Button size="sm" onClick={() => handlePack(order._id)} disabled={busyId === order._id}>
                    <Package size={13} /> Mark packed
                  </Button>
                )}
                {order.status === "PACKED" && shipForm !== order._id && (
                  <Button size="sm" onClick={() => setShipForm(order._id)}>
                    <Truck size={13} /> Mark shipped
                  </Button>
                )}
                {order.status === "PACKED" && shipForm === order._id && (
                  <ShipForm
                    onSubmit={(courier, tracking) => handleShip(order._id, courier, tracking)}
                    onCancel={() => setShipForm(null)}
                    busy={busyId === order._id}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ShipForm({ onSubmit, onCancel, busy }) {
  const [courier, setCourier] = useState("");
  const [tracking, setTracking] = useState("");

  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border border-line bg-ink p-3 sm:flex-row sm:items-center">
      <input
        value={courier}
        onChange={(e) => setCourier(e.target.value)}
        placeholder="Courier (e.g. Delhivery)"
        className="w-full rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-ink_text-hi outline-none focus:border-ember"
      />
      <input
        value={tracking}
        onChange={(e) => setTracking(e.target.value)}
        placeholder="Tracking number"
        className="w-full rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-ink_text-hi outline-none focus:border-ember"
      />
      <div className="flex gap-2">
        <Button size="sm" disabled={busy} onClick={() => onSubmit(courier, tracking)}>
          Confirm
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}