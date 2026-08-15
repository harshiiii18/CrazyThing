import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute() {
  const token = useSelector((s) => s.auth.token);
  const user = useSelector((s) => s.auth.user);

  // Token exists but the user object hasn't loaded yet (App.jsx is still
  // fetching /auth/me) — wait instead of redirecting prematurely.
  if (token && !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-ink_text-low">Loading…</p>
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "ADMIN") return <Navigate to="/" replace />;

  return <Outlet />;
}