import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TransactionModal from "../transactions/TransactionModal";
import { defaultRange } from "../../utils/constants";

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [range, setRange] = useState(defaultRange("this_month"));
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRange = (preset) => setRange(defaultRange(preset));

  const bump = () => setRefreshKey((k) => k + 1);

  return (
    <div className="flex min-h-screen bg-canvas">
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu overlay"
          />
          <div className="relative z-50 h-full w-64">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          range={range}
          onRangeChange={handleRange}
          onAdd={() => setModalOpen(true)}
          onMenu={() => setDrawerOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8">
          <Outlet context={{ range, refreshKey, onAdd: () => setModalOpen(true), bump }} />
        </main>
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={bump}
      />
    </div>
  );
}
