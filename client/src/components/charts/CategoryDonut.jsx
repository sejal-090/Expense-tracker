import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#4F46E5", "#10B981", "#F43F5E", "#6366F1", "#0EA5E9", "#F59E0B", "#8B5CF6", "#14B8A6"];

export default function CategoryDonut({ data }) {
  const chart = data?.length ? data : [{ name: "No expenses", value: 1 }];
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold">Expense by category</h3>
      <p className="mt-1 text-xs text-muted">Share of spend across lifestyle buckets</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chart}
              dataKey="value"
              nameKey="name"
              innerRadius={68}
              outerRadius={96}
              paddingAngle={3}
            >
              {chart.map((entry, i) => (
                <Cell key={entry.name} fill={data?.length ? COLORS[i % COLORS.length] : "#E2E8F0"} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Amount"]} />
            <Legend verticalAlign="bottom" height={24} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
