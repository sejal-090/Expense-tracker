import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function CashFlowArea({ data }) {
  const rows = data || [];
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold">Net cash flow & savings</h3>
      <p className="mt-1 text-xs text-muted">Monthly surplus with cumulative savings trend</p>
      <div className="mt-4 h-72">
        {rows.length === 0 ? (
          <div className="grid h-full place-items-center text-sm text-muted">No cash-flow history in this range.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={rows}>
              <defs>
                <linearGradient id="netFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} />
              <Legend />
              <Area type="monotone" dataKey="net" name="Net cash flow" stroke="#4F46E5" strokeWidth={2} fill="url(#netFill)" />
              <Line type="monotone" dataKey="savings" name="Cumulative savings" stroke="#10B981" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
