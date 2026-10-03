const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

const getBudgets = async (req, res, next) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    const budgets = await Budget.find({ userId: req.user._id, month, year }).sort({ category: 1 });

    const spentByCategory = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: "expense",
          $expr: {
            $and: [{ $eq: [{ $month: "$date" }, month] }, { $eq: [{ $year: "$date" }, year] }],
          },
        },
      },
      { $group: { _id: "$category", spent: { $sum: "$amount" } } },
    ]);
    const spentMap = Object.fromEntries(spentByCategory.map((s) => [s._id, s.spent]));

    const items = budgets.map((b) => {
      const spent = spentMap[b.category] || 0;
      return {
        ...b.toObject(),
        spent: Number(spent.toFixed(2)),
        remaining: Number(Math.max(0, b.monthlyLimit - spent).toFixed(2)),
        percentage:
          b.monthlyLimit > 0 ? Math.min(100, Number(((spent / b.monthlyLimit) * 100).toFixed(1))) : 0,
      };
    });

    res.json({ success: true, items, month, year });
  } catch (error) {
    next(error);
  }
};

const upsertBudget = async (req, res, next) => {
  try {
    const now = new Date();
    const { category, monthlyLimit, month = now.getMonth() + 1, year = now.getFullYear() } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user._id, category, month, year },
      { monthlyLimit, category, month, year, userId: req.user._id },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ success: true, item: budget });
  } catch (error) {
    next(error);
  }
};

const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }
    res.json({ success: true, message: "Budget removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBudgets, upsertBudget, deleteBudget };
