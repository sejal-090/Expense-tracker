const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((val) => val.message)
        .join(", ");
      return res.status(400).json({ success: false, message });
    }
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
    },
  });
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (email) {
      const cleanEmail = email.toLowerCase().trim();
      if (cleanEmail !== user.email) {
        const taken = await User.findOne({ email: cleanEmail });
        if (taken) {
          return res
            .status(409)
            .json({ success: false, message: "Email already in use" });
        }
        user.email = cleanEmail;
      }
    }
    if (name) user.name = name.trim();
    await user.save();

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((val) => val.message)
        .join(", ");
      return res.status(400).json({ success: false, message });
    }
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!(await user.matchPassword(currentPassword))) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    const token = generateToken(user._id);
    return res.json({
      success: true,
      token,
      message: "Password updated",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile, updatePassword };
