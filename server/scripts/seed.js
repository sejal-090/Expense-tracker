const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

const DEMO_EMAIL = "sejal@ledger.test";
const DEMO_PASSWORD = "Password123";

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d;
};

const monthsAgo = (n, day = 5) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n, day);
  d.setHours(12, 0, 0, 0);
  return d;
};

const seed = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany({ email: DEMO_EMAIL });
  const user = await User.create({
    name: "Sejal Ledger",
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });

  await Transaction.deleteMany({ userId: user._id });
  await Budget.deleteMany({ userId: user._id });

  const tx = [
    { title: "Monthly salary", amount: 85000, type: "income", category: "Salary", date: monthsAgo(0, 1), notes: "Primary paycheck" },
    { title: "Freelance UI kit", amount: 18000, type: "income", category: "Freelance", date: daysAgo(6), notes: "Invoice #441" },
    { title: "SIP returns", amount: 4200, type: "income", category: "Investment", date: daysAgo(12), notes: "" },
    { title: "Apartment rent", amount: 22000, type: "expense", category: "Rent", date: monthsAgo(0, 2), notes: "Mayfair Heights" },
    { title: "Electricity + wifi", amount: 3100, type: "expense", category: "Utilities", date: daysAgo(4), notes: "" },
    { title: "Weekly groceries", amount: 4200, type: "expense", category: "Food", date: daysAgo(2), notes: "Nature's Basket" },
    { title: "Team dinner", amount: 2600, type: "expense", category: "Food", date: daysAgo(8), notes: "" },
    { title: "Metro + cabs", amount: 1800, type: "expense", category: "Transport", date: daysAgo(1), notes: "" },
    { title: "Cinema weekend", amount: 950, type: "expense", category: "Entertainment", date: daysAgo(3), notes: "" },
    { title: "Pharmacy refill", amount: 740, type: "expense", category: "Healthcare", date: daysAgo(9), notes: "" },
    { title: "Studio headphones", amount: 6900, type: "expense", category: "Shopping", date: daysAgo(15), notes: "" },
    { title: "Design course", amount: 4999, type: "expense", category: "Education", date: daysAgo(18), notes: "" },
    { title: "Monthly salary", amount: 85000, type: "income", category: "Salary", date: monthsAgo(1, 1), notes: "" },
    { title: "Apartment rent", amount: 22000, type: "expense", category: "Rent", date: monthsAgo(1, 2), notes: "" },
    { title: "Groceries", amount: 3800, type: "expense", category: "Food", date: monthsAgo(1, 12), notes: "" },
    { title: "Utilities", amount: 2800, type: "expense", category: "Utilities", date: monthsAgo(1, 8), notes: "" },
    { title: "Monthly salary", amount: 82000, type: "income", category: "Salary", date: monthsAgo(2, 1), notes: "" },
    { title: "Apartment rent", amount: 22000, type: "expense", category: "Rent", date: monthsAgo(2, 2), notes: "" },
    { title: "Concert tickets", amount: 3500, type: "expense", category: "Entertainment", date: monthsAgo(2, 16), notes: "" },
  ];

  await Transaction.insertMany(tx.map((item) => ({ ...item, userId: user._id })));

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  await Budget.insertMany([
    { userId: user._id, category: "Food", monthlyLimit: 12000, month, year },
    { userId: user._id, category: "Rent", monthlyLimit: 22000, month, year },
    { userId: user._id, category: "Utilities", monthlyLimit: 4000, month, year },
    { userId: user._id, category: "Entertainment", monthlyLimit: 4000, month, year },
    { userId: user._id, category: "Transport", monthlyLimit: 3000, month, year },
  ]);

  console.log(`Seeded demo user ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
