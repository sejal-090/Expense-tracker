import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/client";

export const useAnalytics = (range, refreshKey) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: payload } = await api.get("/analytics/summary", {
          params: { from: range.from, to: range.to },
        });
        if (active) setData(payload);
      } catch (err) {
        if (active) {
          setData(null);
          setError(err.response?.data?.message || "Failed to load analytics");
          toast.error(err.response?.data?.message || "Failed to load analytics");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [range.from, range.to, refreshKey]);

  return { data, loading, error };
};
