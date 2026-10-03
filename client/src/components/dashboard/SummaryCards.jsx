import { ArrowDownRight, ArrowUpRight, PiggyBank, Wallet } from "lucide-react";
import { formatCurrency } from "../../utils/constants";

const cards = [
  { key: "balance", label: "Total Balance", icon: Wallet, tone: "brand" },
  { key: "income", label: "Net Income", icon: ArrowUpRight, tone: "income" },
  { key: "expense", label: "Net Expense", icon: ArrowDownRight, tone: "expense" },
  { key: "savingsRate", label: "Savings Percentage", icon: PiggyBank, tone: "brand" },
];

const tones = {
  brand: "bg-brand-soft text-brand",
  income: "bg-emerald-50 text-income",
  expense: "bg-rose-50 text-expense",
};

export default function SummaryCards({ summary }) {
  const values = {
    balance: formatCurrency(summary?.balance),
    income: formatCurrency(summary?.income),
    expense: formatCurrency(summary?.expense),
    savingsRate: `${summary?.savingsRate ?? 0}%`,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.key} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">{values[card.key]}</p>
              </div>
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${tones[card.tone]}`}>
                <Icon size={18} />
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
