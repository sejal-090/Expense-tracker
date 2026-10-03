import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("ledger_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() =>
    localStorage.getItem("ledger_token"),
  );
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    const hydrate = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        localStorage.setItem("ledger_user", JSON.stringify(data.user));
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem("ledger_token");
        localStorage.removeItem("ledger_user");
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, [token]);

  const persist = (nextToken, nextUser) => {
    if (nextToken) {
      setToken(nextToken);
      localStorage.setItem("ledger_token", nextToken);
    }
    if (nextUser) {
      setUser(nextUser);
      localStorage.setItem("ledger_user", JSON.stringify(nextUser));
    }
  };

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    persist(data.token, data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    if (data.token && data.user) {
      persist(data.token, data.user);
    }
    return data;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put("/auth/me", payload);
    setUser(data.user);
    localStorage.setItem("ledger_user", JSON.stringify(data.user));
    return data.user;
  };

  const changePassword = async (payload) => {
    const { data } = await api.put("/auth/password", payload);
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("ledger_token", data.token);
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ledger_token");
    localStorage.removeItem("ledger_user");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
