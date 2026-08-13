import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BadgeCheck, Loader2, Package, ShoppingBag, LogOut } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { userService } from "../services/userService";
import { fetchCurrentUser, logout } from "../redux/slices/authSlice";

export default function Profile() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const [tab, setTab] = useState("details");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-raised text-2xl font-medium text-ink_text-hi">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-display text-xl font-semibold text-ink_text-hi">{user?.name}</h1>
            {user?.sellerVerification?.status === "VERIFIED" && (
              <BadgeCheck size={16} className="text-signal-green" />
            )}
          </div>
          <p className="text-sm text-ink_text-low">@{user?.username} · {user?.email}</p>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="ml-auto flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-sm text-ink_text-mid hover:border-signal-red/40 hover:text-signal-red"
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>

      <div className="mb-6 flex gap-1 border-b border-line">
        {[
          ["details", "Profile details"],
          ["password", "Change password"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === key
                ? "border-b-2 border-ember text-ink_text-hi"
                : "text-ink_text-mid hover:text-ink_text-hi"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "details" && <DetailsForm user={user} dispatch={dispatch} />}
      {tab === "password" && <PasswordForm />}

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/orders"
          className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 hover:border-ember/40"
        >
          <ShoppingBag size={18} className="text-ember" />
          <div>
            <p className="text-sm font-medium text-ink_text-hi">Your orders</p>
            <p className="text-xs text-ink_text-low">Track purchases and deliveries</p>
          </div>
        </Link>
        <Link
          to="/seller/products"
          className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 hover:border-ember/40"
        >
          <Package size={18} className="text-ember" />
          <div>
            <p className="text-sm font-medium text-ink_text-hi">Your listings</p>
            <p className="text-xs text-ink_text-low">Manage items you're selling</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function DetailsForm({ user, dispatch }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      location: user?.location || "",
      bio: user?.bio || "",
    },
  });

  const onSubmit = async (values) => {
    setSaving(true);
    setMessage("");
    try {
      await userService.updateProfile(values);
      await dispatch(fetchCurrentUser());
      setMessage("Profile updated");
    } catch (err) {
      setMessage(err.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Full name" {...register("name")} />
      <Input label="Phone" {...register("phone")} />
      <Input label="Location" placeholder="e.g. Jaipur, RJ" {...register("location")} />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink_text-mid">Bio</span>
        <textarea
          rows={3}
          maxLength={300}
          className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-ink_text-hi outline-none focus:border-ember"
          {...register("bio")}
        />
      </label>
      {message && <p className="text-sm text-ink_text-mid">{message}</p>}
      <Button type="submit" disabled={saving} className="w-fit">
        {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Save changes"}
      </Button>
    </form>
  );
}

function PasswordForm() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { register, handleSubmit, reset, watch } = useForm();

  const onSubmit = async (values) => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await userService.changePassword(values);
      setMessage("Password updated");
      reset();
    } catch (err) {
      setError(err.message || "Could not update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-sm flex-col gap-4">
      <Input
        label="Current password"
        type="password"
        {...register("currentPassword", { required: true })}
      />
      <Input
        label="New password"
        type="password"
        {...register("newPassword", { required: true, minLength: 8 })}
      />
      <Input
        label="Confirm new password"
        type="password"
        {...register("confirmPassword", {
          validate: (v) => v === watch("newPassword") || "Passwords do not match",
        })}
      />
      {error && <p className="text-sm text-signal-red">{error}</p>}
      {message && <p className="text-sm text-signal-green">{message}</p>}
      <Button type="submit" disabled={saving} className="w-fit">
        {saving ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}