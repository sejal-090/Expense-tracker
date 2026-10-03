import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/client";
import { CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES, toInputDate } from "../../utils/constants";

const empty = {
  title: "",
  amount: "",
  type: "expense",
  category: "Food",
  date: toInputDate(),
  notes: "",
};

export default function TransactionModal({ open, onClose, onSaved, initial }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              title: initial.title,
              amount: String(initial.amount),
              type: initial.type,
              category: initial.category,
              date: toInputDate(initial.date),
              notes: initial.notes || "",
            }
          : empty
      );
      setErrors({});
    }
  }, [open, initial]);

  if (!open) return null;

  const allowed = form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const categoryOptions = allowed.includes(form.category) ? allowed : CATEGORIES;

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.amount || Number(form.amount) <= 0) next.amount = "Enter a valid amount";
    if (!form.category) next.category = "Category is required";
    if (!form.date) next.date = "Date is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        amount: Number(form.amount),
        type: form.type,
        category: form.category,
        date: form.date,
        notes: form.notes.trim(),
      };
      if (initial?._id) {
        await api.put(`/transactions/${initial._id}`, payload);
        toast.success("Transaction updated");
      } else {
        await api.post("/transactions", payload);
        toast.success("Transaction added");
      }
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save transaction");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-label="Close modal" />
      <div className="relative w-full max-w-lg rounded-2xl border border-line bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{initial ? "Edit transaction" : "Add transaction"}</h2>
            <p className="text-sm text-muted">Income and expense entries with validation</p>
          </div>
          <button type="button" className="rounded-xl p-2 text-muted hover:bg-slate-50" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <form className="mt-5 space-y-4" onSubmit={submit}>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-1">
            {["expense", "income"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    type: t,
                    category: t === "income" ? "Salary" : "Food",
                  }))
                }
                className={`rounded-lg py-2 text-sm font-semibold capitalize ${
                  form.type === t ? "bg-white text-brand shadow-sm" : "text-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div>
            <label className="label">Title</label>
            <input
              className="field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Grocery haul"
            />
            {errors.title && <p className="mt-1 text-xs text-expense">{errors.title}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Amount</label>
              <input
                className="field"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
              />
              {errors.amount && <p className="mt-1 text-xs text-expense">{errors.amount}</p>}
            </div>
            <div>
              <label className="label">Date</label>
              <input
                className="field"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              {errors.date && <p className="mt-1 text-xs text-expense">{errors.date}</p>}
            </div>
          </div>
          <div>
            <label className="label">Category</label>
            <select
              className="field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea
              className="field min-h-[88px] resize-y"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Optional context"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
