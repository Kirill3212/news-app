import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  published: { type: Boolean, default: false },
  publishAt: { type: Date, default: null }, // дата и время отложенной публикации
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Обновляем updatedAt при изменении
newsSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const News = mongoose.model("News", newsSchema);

export default News;
