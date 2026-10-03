import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function IncomeExpenseBars({ data }) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold">Monthly income vs expense</h3>
      <p className="mt-1 text-xs text-muted">Side-by-side cash in and cash out</p>
      <div className="mt-4 h-72">
        {!data?.length ? (
          <div className="grid h-full place-items-center text-sm text-muted">No monthly comparison yet.</div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} />
            <Legend />
            <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" fill="#F43F5E" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
