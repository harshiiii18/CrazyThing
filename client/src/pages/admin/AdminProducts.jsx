import { useEffect, useState } from "react";
import Badge from "../../components/ui/Badge";
import Price from "../../components/ui/Price";
import Skeleton from "../../components/ui/Skeleton";
import { adminService } from "../../services/adminService";

const statusTone = {
  ACTIVE: "green",
  PAUSED: "amber",
  SOLD_OUT: "neutral",
  REJECTED: "red",
  PENDING_APPROVAL: "amber",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    adminService
      .listAllProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message || "Could not load listings"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatus = async (id, status) => {
    setBusyId(id);
    try {
      await adminService.setProductStatus(id, status);
      load();
    } catch (err) {
      setError(err.message || "Could not update listing");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink_text-hi">Manage listings</h1>
      {error && <p className="mb-4 text-sm text-signal-red">{error}</p>}

      <div className="flex flex-col gap-2">
        {products.map((p) => (
          <div
            key={p._id}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              {p.images?.[0]?.url && (
                <img src={p.images[0].url} alt="" className="h-12 w-12 rounded-xl object-cover" />
              )}
              <div>
                <p className="text-sm font-medium text-ink_text-hi">{p.title}</p>
                <p className="text-xs text-ink_text-low">by {p.seller?.name}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Price amount={p.price} size="sm" />
              <Badge tone={statusTone[p.status] || "neutral"}>{p.status.replaceAll("_", " ")}</Badge>
              {p.status !== "REJECTED" && (
                <button
                  onClick={() => handleStatus(p._id, "REJECTED")}
                  disabled={busyId === p._id}
                  className="rounded-full border border-line px-3 py-1.5 text-xs text-ink_text-mid hover:border-signal-red/40 hover:text-signal-red"
                >
                  Reject
                </button>
              )}
              <button
                onClick={() => handleStatus(p._id, "DELETED")}
                disabled={busyId === p._id}
                className="rounded-full border border-line px-3 py-1.5 text-xs text-ink_text-mid hover:border-signal-red/40 hover:text-signal-red"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}