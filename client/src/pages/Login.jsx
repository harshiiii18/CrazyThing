import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { login, clearAuthError } from "../redux/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    const result = await dispatch(login(values));
    if (login.fulfilled.match(result)) navigate("/");
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink_text-hi">Welcome back</h1>
      <p className="mt-2 text-sm text-ink_text-mid">
        Sign in to buy, sell, and pick up where you left off.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", { required: "Email is required" })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-ember-soft hover:underline">
            Forgot password?
          </Link>
        </div>

        {error && (
          <p className="rounded-lg bg-signal-red/10 px-3 py-2 text-sm text-signal-red">
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={status === "loading"}
          onClick={() => dispatch(clearAuthError())}
        >
          {status === "loading" ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink_text-mid">
        New to CrazyThing?{" "}
        <Link to="/signup" className="font-medium text-ember-soft hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
