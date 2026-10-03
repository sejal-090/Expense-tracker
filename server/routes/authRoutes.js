const express = require("express");
const { body } = require("express-validator");
const { register, login, getMe, updateProfile, updatePassword } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.get("/me", protect, getMe);
router.put(
  "/me",
  protect,
  [
    body("name").optional().trim().isLength({ min: 2 }),
    body("email").optional().isEmail(),
  ],
  validate,
  updateProfile
);
router.put(
  "/password",
  protect,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 8 }).withMessage("New password must be at least 8 characters"),
  ],
  validate,
  updatePassword
);

module.exports = router;
