const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

const dateBounds = (from, to) => {
  const match = {};
  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      match.date.$lte = end;
    }
  }
  return match;
};

const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { from, to } = req.query;
    const range = dateBounds(from, to);
    const match = { userId, ...range };

    const [totals] = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          income: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
    ]);

    const income = totals?.income || 0;
    const expense = totals?.expense || 0;
    const balance = income - expense;
    const savingsRate = income > 0 ? Number((((income - expense) / income) * 100).toFixed(1)) : 0;

    const categoryBreakdown = await Transaction.aggregate([
      { $match: { ...match, type: "expense" } },
      { $group: { _id: "$category", value: { $sum: "$amount" } } },
      { $sort: { value: -1 } },
      { $project: { _id: 0, name: "$_id", value: { $round: ["$value", 2] } } },
    ]);

    const monthlyComparison = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
          expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          label: {
            $dateToString: {
              format: "%b %Y",
              date: { $dateFromParts: { year: "$_id.year", month: "$_id.month", day: 1 } },
            },
          },
          income: { $round: ["$income", 2] },
          expense: { $round: ["$expense", 2] },
        },
      },
    ]);

    let cumulative = 0;
    const cashFlow = monthlyComparison.map((row) => {
      const net = Number((row.income - row.expense).toFixed(2));
      cumulative = Number((cumulative + net).toFixed(2));
      return {
        label: row.label,
        net,
        savings: cumulative,
        income: row.income,
        expense: row.expense,
      };
    });

    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    const budgets = await Budget.find({ userId, month, year });
    const spentByCategory = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: "expense",
          $expr: {
            $and: [{ $eq: [{ $month: "$date" }, month] }, { $eq: [{ $year: "$date" }, year] }],
          },
        },
      },
      { $group: { _id: "$category", spent: { $sum: "$amount" } } },
    ]);
    const spentMap = Object.fromEntries(spentByCategory.map((s) => [s._id, s.spent]));

    const budgetProgress = budgets.map((b) => {
      const spent = spentMap[b.category] || 0;
      const pct = b.monthlyLimit > 0 ? Math.min(100, Number(((spent / b.monthlyLimit) * 100).toFixed(1))) : 0;
      return {
        category: b.category,
        monthlyLimit: b.monthlyLimit,
        spent: Number(spent.toFixed(2)),
        remaining: Number(Math.max(0, b.monthlyLimit - spent).toFixed(2)),
        percentage: pct,
      };
    });

    const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
    const totalSpentThisMonth = Object.values(spentMap).reduce((sum, v) => sum + v, 0);
    const overallBudgetPct =
      totalBudget > 0 ? Math.min(100, Number(((totalSpentThisMonth / totalBudget) * 100).toFixed(1))) : 0;

    res.json({
      success: true,
      summary: {
        income: Number(income.toFixed(2)),
        expense: Number(expense.toFixed(2)),
        balance: Number(balance.toFixed(2)),
        savingsRate,
      },
      categoryBreakdown,
      monthlyComparison,
      cashFlow,
      budgetProgress,
      overallBudget: {
        limit: Number(totalBudget.toFixed(2)),
        spent: Number(totalSpentThisMonth.toFixed(2)),
        percentage: overallBudgetPct,
        month,
        year,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary };
