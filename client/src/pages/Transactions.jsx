import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";
import api from "../api/client";
import TransactionTable from "../components/transactions/TransactionTable";
import TransactionModal from "../components/transactions/TransactionModal";

export default function Transactions() {
  const { range, refreshKey, bump } = useOutletContext();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [filters, setFilters] = useState({ search: "", category: "all", type: "all", page: 1 });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/transactions", {
        params: {
          page: filters.page,
          limit: 10,
          search: filters.search,
          category: filters.category,
          type: filters.type,
          from: range.from,
          to: range.to,
        },
      });
      setItems(data.items);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [filters, range, refreshKey]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const onDelete = async (tx) => {
    if (!window.confirm(`Delete “${tx.title}”?`)) return;
    try {
      await api.delete(`/transactions/${tx._id}`);
      toast.success("Deleted");
      bump();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Transactions</h2>
        <p className="mt-1 text-sm text-muted">Search, filter, and paginate every cash movement.</p>
      </div>
      {loading && items.length === 0 ? (
        <p className="text-sm text-muted">Loading ledger…</p>
      ) : (
        <TransactionTable
          items={items}
          pagination={pagination}
          filters={filters}
          onFilters={setFilters}
          onPage={(page) => setFilters((f) => ({ ...f, page }))}
          onEdit={setEditing}
          onDelete={onDelete}
        />
      )}
      <TransactionModal
        open={Boolean(editing)}
        initial={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          bump();
          load();
        }}
      />
    </div>
  );
}
