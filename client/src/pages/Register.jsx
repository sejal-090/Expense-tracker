import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Landmark } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
            Open your personal finance OS in minutes.
          </p>
          <p className="mt-4 max-w-md text-sm text-slate-300">
            Track cash flow, monitor category budgets, and analyze spending
            patterns effortlessly.
          </p>
        </div>
        <div></div>
      </div>
      <div className="grid place-items-center p-6">
        <form className="w-full max-w-md space-y-4" onSubmit={submit}>
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="text-sm text-muted">
            Start managing your personal expenses today.
          </p>
          <div>
            <label className="label">Full name</label>
            <input
              className="field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
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
              placeholder="At least 8 characters"
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Creating…" : "Create account"}
          </button>
          <p className="text-sm text-muted">
            Already registered?{" "}
            <Link to="/login" className="font-medium text-brand">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
