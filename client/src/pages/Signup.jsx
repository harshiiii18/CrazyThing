import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { signup, clearAuthError } from "../redux/slices/authSlice";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    const result = await dispatch(signup(values));
    if (signup.fulfilled.match(result)) navigate("/");
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink_text-hi">Create your account</h1>
      <p className="mt-2 text-sm text-ink_text-mid">
        One account to buy and sell — no separate seller signup needed.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <Input
          label="Full name"
          placeholder="Aarav Mehta"
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />
        <Input
          label="Username"
          placeholder="aarav_m"
          error={errors.username?.message}
          {...register("username", { required: "Username is required" })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
          })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Use at least 8 characters" },
          })}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (v) => v === watch("password") || "Passwords do not match",
          })}
        />

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
          {status === "loading" ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink_text-mid">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-ember-soft hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
