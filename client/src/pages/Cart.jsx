import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, ShoppingBag } from "lucide-react";
import Button from "../components/ui/Button";
import Price from "../components/ui/Price";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import { cartService } from "../services/cartService";
import { setCart } from "../redux/slices/cartSlice";

export default function Cart() {
  const items = useSelector((s) => s.cart.items);
  const subtotal = useSelector((s) => s.cart.subtotal);
  const token = useSelector((s) => s.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    cartService
      .get()
      .then((res) => dispatch(setCart(res.data)))
      .catch((err) => setError(err.message || "Could not load your cart"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleQuantity = async (productId, quantity) => {
    try {
      const res = await cartService.updateItem(productId, quantity);
      dispatch(setCart(res.data));
    } catch (err) {
      setError(err.message || "Could not update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await cartService.removeItem(productId);
      dispatch(setCart(res.data));
    } catch (err) {
      setError(err.message || "Could not remove item");
    }
  };

  const groupedBySeller = items.reduce((acc, item) => {
    acc[item.sellerName] = acc[item.sellerName] || [];
    acc[item.sellerName].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Items you add will show up here, grouped by seller."
          action={
            <Button as={Link} to="/products">
              Browse listings
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink_text-hi">
        Your cart
      </h1>

      {error && (
        <p className="mb-4 rounded-lg bg-signal-red/10 px-3 py-2 text-sm text-signal-red">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-8">
        {Object.entries(groupedBySeller).map(([seller, sellerItems]) => (
          <div key={seller} className="rounded-2xl border border-line bg-surface p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink_text-low">
              Sold by {seller}
            </p>
            <div className="flex flex-col gap-4">
              {sellerItems.map((item) => (
                <div key={item.productId} className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink_text-hi">{item.title}</p>
                    <Price amount={item.price} size="sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantity(item.productId, item.quantity - 1)}
                      className="h-7 w-7 rounded-full border border-line text-ink_text-mid"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm text-ink_text-hi">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantity(item.productId, item.quantity + 1)}
                      className="h-7 w-7 rounded-full border border-line text-ink_text-mid"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="text-ink_text-low hover:text-signal-red"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-2xl border border-line bg-surface p-5">
        <div>
          <p className="text-sm text-ink_text-mid">Order total</p>
          <Price amount={subtotal} size="lg" />
        </div>
        <Button size="lg" onClick={() => navigate("/checkout")}>
          Checkout
        </Button>
      </div>
      <p className="mt-3 text-xs text-ink_text-low">
        Totals are recalculated and verified on the server at checkout.
      </p>
    </div>
  );
}
