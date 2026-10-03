import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Landmark } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink p-12 text-white lg:flex">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand">
            <Landmark size={18} />
          </div>
          <span className="font-semibold">Ledger</span>
        </div>
        <div>
          <p className="text-3xl font-semibold leading-tight">
            Clarity for every rupee that moves.
          </p>
          <p className="mt-4 max-w-md text-sm text-slate-300">
            An executive finance workspace with live analytics, category
            budgets, and a clean audit trail.
          </p>
        </div>
        <div></div>
      </div>
      <div className="grid place-items-center p-6">
        <form className="w-full max-w-md space-y-4" onSubmit={submit}>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted">
            Sign in to continue to your dashboard.
          </p>
          <div>
            <label className="label">Email</label>
            <input
              className="field"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="field"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <p className="text-sm text-muted">
            New here?{" "}
            <Link to="/register" className="font-medium text-brand">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
