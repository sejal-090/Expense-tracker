import { Menu, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const presets = [
  { id: "this_month", label: "This month" },
  { id: "last_30", label: "Last 30 days" },
  { id: "this_week", label: "This week" },
  { id: "this_year", label: "This year" },
];

export default function Topbar({ range, onRangeChange, onAdd, onMenu }) {
  const { user } = useAuth();
  const initials = (user?.name || "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-white/80 px-4 py-3 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl border border-line p-2 text-ink lg:hidden"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="text-xs font-medium text-muted">Workspace</p>
          <h1 className="text-base font-semibold">Financial overview</h1>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <select
          className="max-w-[140px] rounded-xl border border-line bg-white px-2 py-2 text-xs font-medium text-ink sm:max-w-none sm:px-3 sm:text-sm"
          value={range.preset}
          onChange={(e) => onRangeChange(e.target.value)}
        >
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        <button type="button" className="btn-primary" onClick={onAdd}>
          <Plus size={16} />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>
        <div className="flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
            {initials}
          </div>
          <span className="hidden max-w-[120px] truncate text-sm font-medium md:block">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
}
