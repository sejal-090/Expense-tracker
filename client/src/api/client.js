import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ledger_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // If backend server is down or unreachable
    if (!error.response) {
      error.message =
        "Backend server is offline or unreachable. Please check Node.js server.";
    }

    if (error.response?.status === 401) {
      const message = error.response?.data?.message || "";
      const isCredentialError =
        message.includes("Invalid credentials") ||
        message.includes("Current password");
      if (!isCredentialError) {
        localStorage.removeItem("ledger_token");
        localStorage.removeItem("ledger_user");
        if (
          !window.location.pathname.startsWith("/login") &&
          !window.location.pathname.startsWith("/register")
        ) {
          window.location.assign("/login");
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
