const express = require("express");
const { body } = require("express-validator");
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { CATEGORIES } = require("../models/Transaction");

const router = express.Router();

router.use(protect);

router.get("/", getTransactions);

router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("amount").isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),
    body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense"),
    body("category").isIn(CATEGORIES).withMessage("Invalid category"),
    body("date").optional().isISO8601().withMessage("Invalid date"),
  ],
  validate,
  createTransaction
);

router.put(
  "/:id",
  [
    body("title").optional().trim().notEmpty(),
    body("amount").optional().isFloat({ gt: 0 }),
    body("type").optional().isIn(["income", "expense"]),
    body("category").optional().isIn(CATEGORIES),
    body("date").optional().isISO8601(),
  ],
  validate,
  updateTransaction
);

router.delete("/:id", deleteTransaction);

module.exports = router;
