import { useEffect, useState } from "react";
import { BadgeCheck, Ban, CheckCircle2 } from "lucide-react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import { adminService } from "../../services/adminService";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    adminService
      .listUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err.message || "Could not load users"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleSuspend = async (id, isActive) => {
    setBusyId(id);
    try {
      await adminService.setUserStatus(id, !isActive);
      load();
    } catch (err) {
      setError(err.message || "Could not update user");
    } finally {
      setBusyId(null);
    }
  };

  const handleVerification = async (id, status) => {
    setBusyId(id);
    try {
      await adminService.setSellerVerification(id, status);
      load();
    } catch (err) {
      setError(err.message || "Could not update verification");
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
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink_text-hi">Manage users</h1>
      {error && <p className="mb-4 text-sm text-signal-red">{error}</p>}

      <div className="flex flex-col gap-2">
        {users.map((u) => (
          <div
            key={u._id}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-raised text-sm font-medium text-ink_text-hi">
                {u.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-ink_text-hi">{u.name}</p>
                  {u.role === "ADMIN" && <Badge tone="ember">Admin</Badge>}
                  {!u.isActive && <Badge tone="red">Suspended</Badge>}
                </div>
                <p className="text-xs text-ink_text-low">@{u.username} · {u.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {u.sellerVerification?.status === "PENDING" && (
                <>
                  <Button size="sm" onClick={() => handleVerification(u._id, "VERIFIED")} disabled={busyId === u._id}>
                    <BadgeCheck size={13} /> Approve seller
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleVerification(u._id, "REJECTED")} disabled={busyId === u._id}>
                    Reject
                  </Button>
                </>
              )}
              {u.sellerVerification?.status === "VERIFIED" && (
                <Badge tone="green">Verified seller</Badge>
              )}
              {u.role !== "ADMIN" && (
                <button
                  onClick={() => toggleSuspend(u._id, u.isActive)}
                  disabled={busyId === u._id}
                  className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs ${
                    u.isActive
                      ? "border-line text-ink_text-mid hover:border-signal-red/40 hover:text-signal-red"
                      : "border-signal-green/30 text-signal-green"
                  }`}
                >
                  {u.isActive ? <><Ban size={12} /> Suspend</> : <><CheckCircle2 size={12} /> Activate</>}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}