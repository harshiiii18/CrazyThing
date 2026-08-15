import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Package, ShoppingBag, TrendingUp, ShieldCheck, ArrowUpRight } from "lucide-react";
import Skeleton from "../../components/ui/Skeleton";
import { adminService } from "../../services/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getAnalytics()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { icon: Users, label: "Total users", value: stats.totalUsers, tone: "ember" },
        { icon: Package, label: "Total listings", value: stats.totalProducts, tone: "neutral" },
        { icon: ShoppingBag, label: "Total orders", value: stats.totalOrders, tone: "amber" },
        { icon: TrendingUp, label: "Total revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, tone: "green" },
      ]
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-xs font-medium text-ember-soft">
        <ShieldCheck size={12} /> Admin panel
      </span>
      <h1 className="mt-3 font-display text-3xl font-bold text-ink_text-hi">Platform overview</h1>

      {loading ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {cards.map(({ icon: Icon, label, value, tone }) => (
            <StatCard key={label} icon={Icon} label={label} value={value} tone={tone} />
          ))}
        </div>
      )}

      {stats?.pendingVerifications > 0 && (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-signal-amber/30 bg-signal-amber/10 p-4">
          <p className="text-sm text-signal-amber">
            {stats.pendingVerifications} seller verification request{stats.pendingVerifications > 1 ? "s" : ""} pending review
          </p>
          <Link to="/admin/users" className="text-sm font-medium text-signal-amber hover:underline">
            Review now
          </Link>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ActionCard to="/admin/users" icon={Users} title="Manage users" description="Suspend accounts, review seller verification" />
        <ActionCard to="/admin/products" icon={Package} title="Manage listings" description="Approve, reject, or remove products" />
      </div>
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
    <div className="rounded-2xl border border-line bg-surface p-4">
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
      className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-all hover:border-ember/40 hover:shadow-card"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ember/10 text-ember">
        <Icon size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink_text-hi">{title}</p>
        <p className="text-sm text-ink_text-low">{description}</p>
      </div>
      <ArrowUpRight size={18} className="shrink-0 text-ink_text-low transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}