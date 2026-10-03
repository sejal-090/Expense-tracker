const mongoose = require("mongoose");

const CATEGORIES = [
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

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 120,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, title: "text", notes: "text" });

module.exports = mongoose.model("Transaction", transactionSchema);
module.exports.CATEGORIES = CATEGORIES;
