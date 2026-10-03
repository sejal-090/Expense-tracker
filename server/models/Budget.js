const mongoose = require("mongoose");
const { CATEGORIES } = require("./Transaction");

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
    },
    monthlyLimit: {
      type: Number,
      required: [true, "Monthly limit is required"],
      min: [0, "Limit cannot be negative"],
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
    },
  },
  { timestamps: true }
);

budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
