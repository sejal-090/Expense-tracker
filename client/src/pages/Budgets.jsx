import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/client";
import { EXPENSE_CATEGORIES, formatCurrency } from "../utils/constants";

export default function Budgets() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ category: "Food", monthlyLimit: "" });

  const load = async () => {
    try {
      const { data } = await api.get("/budgets", { params: { month, year } });
      setItems(data.items);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load budgets");
    }
  };

  useEffect(() => {
    load();
  }, [month, year]);

  const save = async (e) => {
    e.preventDefault();
    if (!form.monthlyLimit || Number(form.monthlyLimit) < 0) {
      toast.error("Enter a valid monthly limit");
      return;
    }
    try {
      await api.post("/budgets", {
        category: form.category,
        monthlyLimit: Number(form.monthlyLimit),
        month,
        year,
      });
      toast.success("Budget saved");
      setForm({ ...form, monthlyLimit: "" });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save budget");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      toast.success("Removed");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove budget");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Budgets</h2>
        <p className="mt-1 text-sm text-muted">Set category spending limits and watch utilization.</p>
      </div>
      <div className="flex gap-3">
        <select className="field max-w-[140px]" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(2000, i, 1).toLocaleString("en", { month: "long" })}
            </option>
          ))}
        </select>
        <select className="field max-w-[120px]" value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {Array.from({ length: 6 }, (_, i) => now.getFullYear() - 2 + i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <form className="card grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto]" onSubmit={save}>
        <div>
          <label className="label">Category</label>
          <select
            className="field"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Monthly limit</label>
          <input
            className="field"
            type="number"
            min="0"
            step="1"
            value={form.monthlyLimit}
            onChange={(e) => setForm({ ...form, monthlyLimit: e.target.value })}
            placeholder="25000"
          />
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full md:w-auto">
            Save budget
          </button>
        </div>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {items.length === 0 && <p className="text-sm text-muted">No limits configured for this period.</p>}
        {items.map((b) => (
          <article key={b._id} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{b.category}</h3>
                <p className="text-sm text-muted">
                  {formatCurrency(b.spent)} spent of {formatCurrency(b.monthlyLimit)}
                </p>
              </div>
              <button type="button" className="text-xs font-medium text-expense" onClick={() => remove(b._id)}>
                Remove
              </button>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${b.percentage >= 90 ? "bg-expense" : "bg-brand"}`}
                style={{ width: `${b.percentage}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              {b.percentage}% used · {formatCurrency(b.remaining)} remaining
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
