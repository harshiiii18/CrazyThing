import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Truck } from "lucide-react";
import Price from "../components/ui/Price";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import OrderTimeline from "../components/product/OrderTimeline";
import { orderService } from "../services/orderService";

const CANCELLABLE = ["PENDING_PAYMENT", "PAID", "SELLER_CONFIRMATION_PENDING", "CONFIRMED"];

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    orderService
      .getById(id)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.message || "Could not load this order"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await orderService.cancel(id, "Cancelled by buyer");
      load();
    } catch (err) {
      setError(err.message || "Could not cancel this order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-sm text-signal-red">{error || "Order not found"}</p>
        <Button as={Link} to="/orders" variant="secondary" className="mt-4">
          Back to orders
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-ink_text-low">Order #{order._id.slice(-8)}</p>
          <h1 className="font-display text-2xl font-semibold text-ink_text-hi">
            Placed {new Date(order.createdAt).toLocaleDateString()}
          </h1>
        </div>
        {CANCELLABLE.includes(order.status) && (
          <Button variant="danger" size="sm" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? "Cancelling…" : "Cancel order"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="mb-4 text-sm font-medium text-ink_text-hi">Status</h2>
            <OrderTimeline status={order.status} />
          </div>

          {order.tracking?.trackingNumber && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-line bg-surface p-5">
              <Truck size={20} className="text-ember" />
              <div className="text-sm">
                <p className="text-ink_text-hi">
                  {order.tracking.courier} · {order.tracking.trackingNumber}
                </p>
                {order.tracking.estimatedDelivery && (
                  <p className="text-ink_text-low">
                    Estimated delivery:{" "}
                    {new Date(order.tracking.estimatedDelivery).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
            <h2 className="mb-4 text-sm font-medium text-ink_text-hi">Items</h2>
            <div className="flex flex-col gap-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="h-14 w-14 rounded-xl object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink_text-hi">{item.title}</p>
                    <p className="text-xs text-ink_text-low">Qty {item.quantity}</p>
                  </div>
                  <Price amount={item.price * item.quantity} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="mb-3 text-sm font-medium text-ink_text-hi">Shipping to</h2>
            <p className="text-sm text-ink_text-mid">
              {order.shippingAddress?.fullName}
              <br />
              {order.shippingAddress?.line1}
              {order.shippingAddress?.line2 && <>, {order.shippingAddress.line2}</>}
              <br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
              {order.shippingAddress?.pincode}
              <br />
              {order.shippingAddress?.phone}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
            <h2 className="mb-3 text-sm font-medium text-ink_text-hi">Payment</h2>
            <div className="flex justify-between text-sm text-ink_text-mid">
              <span>Subtotal</span>
              <span className="font-mono text-ink_text-hi">
                ₹{order.subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="mt-1 flex justify-between text-sm text-ink_text-mid">
              <span>Shipping</span>
              <span className="font-mono text-ink_text-hi">
                ₹{order.shippingFee.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="mt-3 flex justify-between border-t border-line pt-3 text-sm">
              <span className="text-ink_text-mid">Total</span>
              <Price amount={order.total} size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
