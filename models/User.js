/**
 * @file models/User.js
 * Mongoose-схема и модель пользователя с хешированием пароля и методом проверки пароля.
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";

/**
 * @typedef {Object} User
 * @property {string} username - Уникальное имя пользователя (минимум 3 символа)
 * @property {string} password - Хешированный пароль пользователя
 */

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 3 },
  password: { type: String, required: true },
});

/**
 * Хеширует пароль пользователя перед сохранением.
 * @function
 * @name userSchema.pre('save')
 * @param {function} next - Callback для перехода к следующему middleware
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Проверяет соответствие введённого пароля хешу пользователя.
 * @function
 * @name userSchema.methods.comparePassword
 * @param {string} candidatePassword - Введённый пароль
 * @returns {Promise<boolean>} true, если пароль совпадает
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Модель пользователя
 */
const User = mongoose.model("User", userSchema);

export default User;
