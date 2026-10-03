import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

export default function BudgetGauge({ overall }) {
  const pct = overall?.percentage || 0;
  const data = [{ name: "spent", value: pct, fill: pct >= 90 ? "#F43F5E" : "#4F46E5" }];

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold">Monthly budget vs actual</h3>
      <p className="mt-1 text-xs text-muted">
        {overall?.month}/{overall?.year} · ₹{(overall?.spent || 0).toLocaleString("en-IN")} of ₹
        {(overall?.limit || 0).toLocaleString("en-IN")}
      </p>
      <div className="mt-2 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="72%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background dataKey="value" cornerRadius={12} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <p className="-mt-16 mb-8 text-center text-3xl font-semibold">{pct}%</p>
      <p className="text-center text-xs text-muted">of allocated monthly budgets used</p>
    </div>
  );
}
