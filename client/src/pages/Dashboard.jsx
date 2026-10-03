import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useAnalytics } from "../hooks/useAnalytics";
import api from "../api/client";
import SummaryCards from "../components/dashboard/SummaryCards";
import CategoryDonut from "../components/charts/CategoryDonut";
import IncomeExpenseBars from "../components/charts/IncomeExpenseBars";
import CashFlowArea from "../components/charts/CashFlowArea";
import BudgetGauge from "../components/charts/BudgetGauge";
import { formatCurrency, formatDate } from "../utils/constants";

export default function Dashboard() {
  const { range, refreshKey, onAdd } = useOutletContext();
  const { user } = useAuth();
  const { data, loading, error } = useAnalytics(range, refreshKey);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const { data: payload } = await api.get("/transactions", {
          params: { page: 1, limit: 6, from: range.from, to: range.to },
        });
        setRecent(payload.items || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load recent activity");
      }
    };
    loadRecent();
  }, [range.from, range.to, refreshKey]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Good to see you, {user?.name?.split(" ")[0]}</h2>
        <p className="mt-1 text-sm text-muted">A concise view of liquidity, spend mix, and budget health.</p>
      </div>
      {loading && !data ? (
        <p className="text-sm text-muted">Loading analytics…</p>
      ) : error && !data ? (
        <div className="card p-6 text-sm text-muted">
          Could not load analytics. Confirm the API is running on port 5000 and MongoDB is connected.
        </div>
      ) : (
        <>
          <SummaryCards summary={data?.summary} />
          <div className="grid gap-4 xl:grid-cols-2">
            <CategoryDonut data={data?.categoryBreakdown} />
            <IncomeExpenseBars data={data?.monthlyComparison} />
            <CashFlowArea data={data?.cashFlow} />
            <BudgetGauge overall={data?.overallBudget} />
          </div>
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <h3 className="text-sm font-semibold">Recent activity</h3>
                <p className="text-xs text-muted">Latest movements in the selected period</p>
              </div>
              <Link to="/transactions" className="text-sm font-medium text-brand">
                View all
              </Link>
            </div>
            {recent.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-muted">No transactions yet. Add income or expense to populate charts.</p>
                <button type="button" className="btn-primary mt-4" onClick={onAdd}>
                  Add Transaction
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {recent.map((tx) => (
                  <li key={tx._id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{tx.title}</p>
                      <p className="text-xs text-muted">
                        {tx.category} · {formatDate(tx.date)}
                      </p>
                    </div>
                    <p
                      className={`shrink-0 text-sm font-semibold ${
                        tx.type === "income" ? "text-income" : "text-expense"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "−"}
                      {formatCurrency(tx.amount)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="text-sm font-semibold">Need more depth?</p>
              <p className="text-sm text-muted">Open analytics or set category limits on the budgets page.</p>
            </div>
            <div className="flex gap-2">
              <Link to="/analytics" className="btn-secondary">
                Analytics
              </Link>
              <Link to="/budgets" className="btn-primary">
                Manage budgets
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
