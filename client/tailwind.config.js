/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        canvas: "#F8FAFC",
        ink: "#0F172A",
        muted: "#64748B",
        line: "#E2E8F0",
        brand: {
          DEFAULT: "#4F46E5",
          soft: "#EEF2FF",
        },
        income: "#10B981",
        expense: "#F43F5E",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};
