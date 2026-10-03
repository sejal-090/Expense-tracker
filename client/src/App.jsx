import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Budgets from "./pages/Budgets";
import Settings from "./pages/Settings";

const Guard = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-canvas text-muted">
        Loading workspace…
      </div>
    );
  }
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const Guest = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return null;
  if (token) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Guest>
            <Login />
          </Guest>
        }
      />
      <Route
        path="/register"
        element={
          <Guest>
            <Register />
          </Guest>
        }
      />
      <Route
        element={
          <Guard>
            <AppLayout />
          </Guard>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
