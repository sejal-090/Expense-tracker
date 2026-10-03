import { ChevronLeft, ChevronRight, Pencil, Search, Trash2 } from "lucide-react";
import { CATEGORIES, formatCurrency, formatDate } from "../../utils/constants";

export default function TransactionTable({
  items,
  pagination,
  filters,
  onFilters,
  onPage,
  onEdit,
  onDelete,
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-line p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="field pl-9"
            placeholder="Search title, notes, or category"
            value={filters.search}
            onChange={(e) => onFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>
        <select
          className="field md:w-40"
          value={filters.category}
          onChange={(e) => onFilters({ ...filters, category: e.target.value, page: 1 })}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="field md:w-36"
          value={filters.type}
          onChange={(e) => onFilters({ ...filters, type: e.target.value, page: 1 })}
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted">
                  No transactions match these filters.
                </td>
              </tr>
            )}
            {items.map((tx) => (
              <tr key={tx._id} className="border-t border-line font-normal">
                <td className="px-4 py-3">
                  <p className="font-medium">{tx.title}</p>
                  {tx.notes && <p className="text-xs text-muted">{tx.notes}</p>}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand">
                    {tx.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(tx.date)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold uppercase ${
                      tx.type === "income" ? "text-income" : "text-expense"
                    }`}
                  >
                    {tx.type}
                  </span>
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    tx.type === "income" ? "text-income" : "text-expense"
                  }`}
                >
                  {tx.type === "income" ? "+" : "−"}
                  {formatCurrency(tx.amount)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="mr-1 rounded-lg p-2 text-muted hover:bg-slate-50"
                    onClick={() => onEdit(tx)}
                    aria-label="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg p-2 text-muted hover:bg-rose-50 hover:text-expense"
                    onClick={() => onDelete(tx)}
                    aria-label="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm text-muted">
        <span>
          Page {pagination.page} of {pagination.pages} · {pagination.total} records
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-secondary px-3 py-1.5"
            disabled={pagination.page <= 1}
            onClick={() => onPage(pagination.page - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="btn-secondary px-3 py-1.5"
            disabled={pagination.page >= pagination.pages}
            onClick={() => onPage(pagination.page + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
