/**
 * @file routes/auth.js
 * Роуты для регистрации и аутентификации пользователей.
 */

import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Регистрация нового пользователя
 * @access Public
 */
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Проверка на существование пользователя
    let user = await User.findOne({ username });
    if (user)
      return res.status(409).json({ message: "User already exists" });

    user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Аутентификация пользователя и выдача JWT
 * @access Public
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Генерация JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
