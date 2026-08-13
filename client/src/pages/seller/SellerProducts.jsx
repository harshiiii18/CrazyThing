import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pause, Play, XCircle, Trash2 } from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Price from "../../components/ui/Price";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import { productService } from "../../services/productService";

const statusTone = {
  ACTIVE: "green",
  PAUSED: "amber",
  SOLD_OUT: "neutral",
  DRAFT: "neutral",
  PENDING_APPROVAL: "amber",
  REJECTED: "red",
};

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    productService
      .mine()
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message || "Could not load your listings"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatus = async (id, status) => {
    setBusyId(id);
    try {
      await productService.updateStatus(id, status);
      load();
    } catch (err) {
      setError(err.message || "Could not update listing");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this listing? This can't be undone.")) return;
    setBusyId(id);
    try {
      await productService.remove(id);
      load();
    } catch (err) {
      setError(err.message || "Could not delete listing");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink_text-hi">Your listings</h1>
        <Button as={Link} to="/sell" size="sm">
          <Plus size={15} /> New listing
        </Button>
      </div>

      {error && <p className="mb-4 text-sm text-signal-red">{error}</p>}

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No listings yet"
          description="Create your first listing to start selling."
          action={
            <Button as={Link} to="/sell">
              List an item
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((p) => (
            <div
              key={p._id}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center"
            >
              <Link to={`/products/${p._id}`} className="flex flex-1 items-center gap-3">
                {p.images?.[0]?.url && (
                  <img src={p.images[0].url} alt="" className="h-14 w-14 rounded-xl object-cover" />
                )}
                <div>
                  <p className="text-sm font-medium text-ink_text-hi">{p.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Price amount={p.price} size="sm" />
                    <Badge tone={statusTone[p.status] || "neutral"}>{p.status.replaceAll("_", " ")}</Badge>
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                {p.status === "ACTIVE" && (
                  <button
                    onClick={() => handleStatus(p._id, "PAUSED")}
                    disabled={busyId === p._id}
                    className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-ink_text-mid hover:border-ember/40"
                  >
                    <Pause size={12} /> Pause
                  </button>
                )}
                {p.status === "PAUSED" && (
                  <button
                    onClick={() => handleStatus(p._id, "ACTIVE")}
                    disabled={busyId === p._id}
                    className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-ink_text-mid hover:border-ember/40"
                  >
                    <Play size={12} /> Resume
                  </button>
                )}
                {["ACTIVE", "PAUSED"].includes(p.status) && (
                  <button
                    onClick={() => handleStatus(p._id, "SOLD_OUT")}
                    disabled={busyId === p._id}
                    className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-ink_text-mid hover:border-ember/40"
                  >
                    <XCircle size={12} /> Sold out
                  </button>
                )}
                <button
                  onClick={() => handleDelete(p._id)}
                  disabled={busyId === p._id}
                  className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-ink_text-mid hover:border-signal-red/40 hover:text-signal-red"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}