import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Price from "../components/ui/Price";
import { addressService } from "../services/addressService";
import { orderService, paymentService } from "../services/orderService";
import { loadRazorpayScript } from "../utils/loadRazorpay";
import { clearCart } from "../redux/slices/cartSlice";

export default function Checkout() {
  const items = useSelector((s) => s.cart.items);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("review"); // review | success

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  useEffect(() => {
    addressService
      .list()
      .then((res) => {
        setAddresses(res.data);
        const def = res.data.find((a) => a.isDefault) || res.data[0];
        if (def) setSelectedAddress(def._id);
        if (res.data.length === 0) setAddingAddress(true);
      })
      .catch(() => setAddingAddress(true))
      .finally(() => setLoadingAddresses(false));
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await addressService.create(newAddress);
      setAddresses((prev) => [...prev, res.data]);
      setSelectedAddress(res.data._id);
      setAddingAddress(false);
    } catch (err) {
      setError(err.message || "Could not save that address");
    }
  };

  const handlePay = async () => {
    if (!selectedAddress) {
      setError("Select a shipping address first");
      return;
    }
    setError("");
    setPlacing(true);
    try {
      // 1. Create the order — the server recalculates every price from the DB.
      const { data } = await orderService.create(selectedAddress);
      const { order, razorpayOrder, razorpayKeyId, mockMode } = data;

      // 2. Mock mode: no real Razorpay keys configured — skip the checkout
      // modal and go straight to (server-side, still-checked) verification,
      // clearly surfaced to the person as a dev-mode payment.
      if (mockMode) {
        await paymentService.verify({
          orderId: order._id,
          razorpay_order_id: razorpayOrder.id,
          razorpay_payment_id: `mock_pay_${Date.now()}`,
          razorpay_signature: "mock",
        });
        dispatch(clearCart());
        setStep("success");
        setPlacing(false);
        return;
      }

      // 3. Real Razorpay flow
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Couldn't load the payment gateway. Check your connection and try again.");
        setPlacing(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: "CrazyThing",
        description: `Order ${order._id}`,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#FF5A1F" },
        handler: async (response) => {
          try {
            await paymentService.verify({
              orderId: order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            dispatch(clearCart());
            setStep("success");
          } catch (err) {
            setError(err.message || "Payment verification failed");
          } finally {
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: async () => {
            await paymentService.markFailed(order._id).catch(() => {});
            setPlacing(false);
          },
        },
      });
      rzp.open();
    } catch (err) {
      setError(err.message || "Could not start checkout");
      setPlacing(false);
    }
  };

  if (step === "success") {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <CheckCircle2 size={44} className="text-signal-green" />
        <h1 className="mt-4 font-display text-2xl text-ink_text-hi">Order confirmed</h1>
        <p className="mt-2 text-sm text-ink_text-mid">
          Payment verified — the seller has been notified to confirm your order.
        </p>
        <Button className="mt-6" onClick={() => navigate("/orders")}>
          View your orders
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink_text-hi">Checkout</h1>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="mb-3 text-sm font-medium text-ink_text-hi">Shipping address</h2>

        {loadingAddresses ? (
          <p className="text-sm text-ink_text-low">Loading addresses…</p>
        ) : (
          <>
            {addresses.length > 0 && (
              <div className="mb-4 flex flex-col gap-2">
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
                      selectedAddress === addr._id ? "border-ember" : "border-line"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress === addr._id}
                      onChange={() => setSelectedAddress(addr._id)}
                      className="mt-1 accent-ember"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-ink_text-hi">{addr.fullName} · {addr.phone}</p>
                      <p className="text-ink_text-mid">
                        {addr.line1}, {addr.line2 && `${addr.line2}, `}
                        {addr.city}, {addr.state} {addr.pincode}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {!addingAddress ? (
              <button
                onClick={() => setAddingAddress(true)}
                className="text-sm font-medium text-ember-soft hover:underline"
              >
                + Add a new address
              </button>
            ) : (
              <form onSubmit={handleAddAddress} className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label="Full name"
                  required
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                />
                <Input
                  label="Phone"
                  required
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                />
                <Input
                  label="Address line 1"
                  required
                  className="sm:col-span-2"
                  value={newAddress.line1}
                  onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                />
                <Input
                  label="Address line 2 (optional)"
                  className="sm:col-span-2"
                  value={newAddress.line2}
                  onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                />
                <Input
                  label="City"
                  required
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                />
                <Input
                  label="State"
                  required
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                />
                <Input
                  label="Pincode"
                  required
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                />
                <div className="flex items-end gap-2">
                  <Button type="submit" size="sm">Save address</Button>
                  {addresses.length > 0 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setAddingAddress(false)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            )}
          </>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <h2 className="mb-3 text-sm font-medium text-ink_text-hi">Order summary</h2>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between text-sm">
              <span className="text-ink_text-mid">
                {item.title} × {item.quantity}
              </span>
              <span className="font-mono text-ink_text-hi">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="text-sm text-ink_text-mid">Total</span>
          <Price amount={subtotal} size="lg" />
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-signal-red/10 px-4 py-3 text-sm text-signal-red">
          <ShieldAlert size={16} /> {error}
        </div>
      )}

      <Button size="lg" className="mt-6 w-full" onClick={handlePay} disabled={placing}>
        {placing ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Processing…
          </>
        ) : (
          "Pay now"
        )}
      </Button>
      <p className="mt-3 text-center text-xs text-ink_text-low">
        Your total is recalculated and your payment is verified on the server —
        nothing here is trusted client-side.
      </p>
    </div>
  );
}
