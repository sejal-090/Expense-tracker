export const CATEGORIES = [
  "Food",
  "Rent",
  "Utilities",
  "Entertainment",
  "Transport",
  "Healthcare",
  "Shopping",
  "Education",
  "Salary",
  "Freelance",
  "Investment",
  "Other",
];

export const EXPENSE_CATEGORIES = [
  "Food",
  "Rent",
  "Utilities",
  "Entertainment",
  "Transport",
  "Healthcare",
  "Shopping",
  "Education",
  "Other",
];

export const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment", "Other"];

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export const toInputDate = (value) => {
  const d = value ? new Date(value) : new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const defaultRange = (preset = "this_month") => {
  const now = new Date();
  const start = new Date(now);
  if (preset === "this_week") {
    const day = now.getDay() || 7;
    start.setDate(now.getDate() - day + 1);
  } else if (preset === "this_year") {
    start.setMonth(0, 1);
  } else if (preset === "last_30") {
    start.setDate(now.getDate() - 30);
  } else {
    start.setDate(1);
  }
  start.setHours(0, 0, 0, 0);
  return {
    from: toInputDate(start),
    to: toInputDate(now),
    preset,
  };
};
