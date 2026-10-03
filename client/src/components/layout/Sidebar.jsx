import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Wallet,
  Settings,
  Landmark,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/analytics", label: "Analytics", icon: PieChart },
  { to: "/budgets", label: "Budgets", icon: Wallet },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ onNavigate }) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-line bg-white">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
          <Landmark size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">Ledger</p>
          <p className="text-xs text-muted">Personal finance OS</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-brand-soft text-brand"
                  : "text-muted hover:bg-slate-50 hover:text-ink"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="m-4 rounded-2xl bg-brand-soft p-4">
        <p className="text-xs font-semibold text-brand">Executive view</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Track cash flow, budgets, and category risk in one workspace.
        </p>
      </div>
    </aside>
  );
}
