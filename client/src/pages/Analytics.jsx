import { useOutletContext } from "react-router-dom";
import { useAnalytics } from "../hooks/useAnalytics";
import CategoryDonut from "../components/charts/CategoryDonut";
import IncomeExpenseBars from "../components/charts/IncomeExpenseBars";
import CashFlowArea from "../components/charts/CashFlowArea";
import BudgetGauge from "../components/charts/BudgetGauge";
import { formatCurrency } from "../utils/constants";

export default function Analytics() {
  const { range, refreshKey } = useOutletContext();
  const { data, loading } = useAnalytics(range, refreshKey);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Analytics</h2>
        <p className="mt-1 text-sm text-muted">Four distinct chart types for spend mix, cadence, trend, and budget.</p>
      </div>
      {loading && !data ? (
        <p className="text-sm text-muted">Crunching numbers…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card p-5">
              <p className="text-sm text-muted">Income</p>
              <p className="mt-2 text-xl font-semibold text-income">{formatCurrency(data?.summary?.income)}</p>
            </div>
            <div className="card p-5">
              <p className="text-sm text-muted">Expense</p>
              <p className="mt-2 text-xl font-semibold text-expense">{formatCurrency(data?.summary?.expense)}</p>
            </div>
            <div className="card p-5">
              <p className="text-sm text-muted">Savings rate</p>
              <p className="mt-2 text-xl font-semibold">{data?.summary?.savingsRate ?? 0}%</p>
            </div>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <CategoryDonut data={data?.categoryBreakdown} />
            <IncomeExpenseBars data={data?.monthlyComparison} />
            <CashFlowArea data={data?.cashFlow} />
            <BudgetGauge overall={data?.overallBudget} />
          </div>
          <div className="card overflow-hidden">
            <div className="border-b border-line px-5 py-4">
              <h3 className="text-sm font-semibold">Category budget progress</h3>
            </div>
            <div className="divide-y divide-line">
              {(data?.budgetProgress || []).length === 0 && (
                <p className="px-5 py-8 text-sm text-muted">No budgets set for this month yet.</p>
              )}
              {(data?.budgetProgress || []).map((row) => (
                <div key={row.category} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-28 text-sm font-medium">{row.category}</div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${row.percentage}%` }}
                    />
                  </div>
                  <div className="w-24 text-right text-sm text-muted">{row.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
