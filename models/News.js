/**
 * @file models/News.js
 * Mongoose-схема и модель для новостных статей.
 */

import mongoose from "mongoose";

/**
 * @typedef {Object} News
 * @property {mongoose.Types.ObjectId} author - Автор новости (ссылка на пользователя)
 * @property {string} title - Заголовок новости
 * @property {string} content - Содержимое новости
 * @property {boolean} published - Опубликована ли новость
 * @property {Date|null} publishAt - Время отложенной публикации
 * @property {Date} createdAt - Дата создания
 * @property {Date} updatedAt - Дата обновления
 */

const newsSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  published: { type: Boolean, default: false },
  publishAt: { type: Date, default: null }, // дата и время отложенной публикации
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/**
 * Обновляем updatedAt при изменении документа
 */
newsSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Модель новости
 */
const News = mongoose.model("News", newsSchema);

export default News;
