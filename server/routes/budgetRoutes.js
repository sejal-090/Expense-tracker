const express = require("express");
const { body } = require("express-validator");
const { getBudgets, upsertBudget, deleteBudget } = require("../controllers/budgetController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { CATEGORIES } = require("../models/Transaction");

const router = express.Router();
router.use(protect);

router.get("/", getBudgets);
router.post(
  "/",
  [
    body("category").isIn(CATEGORIES).withMessage("Invalid category"),
    body("monthlyLimit").isFloat({ min: 0 }).withMessage("Monthly limit must be 0 or greater"),
    body("month").optional().isInt({ min: 1, max: 12 }),
    body("year").optional().isInt({ min: 2000 }),
  ],
  validate,
  upsertBudget
);
router.delete("/:id", deleteBudget);

module.exports = router;
