const Transaction = require("../models/Transaction");

const parseDateRange = (from, to) => {
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

const getTransactions = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
    const skip = (page - 1) * limit;
    const { search = "", category, type, from, to } = req.query;

    const query = { userId: req.user._id, ...parseDateRange(from, to) };

    if (category && category !== "all") query.category = category;
    if (type && type !== "all") query.type = type;
    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ title: regex }, { notes: regex }, { category: regex }];
    }

    const [items, total] = await Promise.all([
      Transaction.find(query).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limit),
      Transaction.countDocuments(query),
    ]);

    res.json({
      success: true,
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;
    const transaction = await Transaction.create({
      userId: req.user._id,
      title,
      amount,
      type,
      category,
      date: date ? new Date(date) : new Date(),
      notes: notes || "",
    });
    res.status(201).json({ success: true, item: transaction });
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    const fields = ["title", "amount", "type", "category", "notes"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) transaction[field] = req.body[field];
    });
    if (req.body.date) transaction.date = new Date(req.body.date);

    await transaction.save();
    res.json({ success: true, item: transaction });
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    res.json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
