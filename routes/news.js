import express from "express";
import mongoose from "mongoose";
import News from "../models/News.js";
import authMiddleware from "../middleware/auth.js";
import { getIO } from "../services/socket.js";

const router = express.Router();

// Создать новость
router.post("/", authMiddleware, async (req, res) => {
  const { title, content, publishAt } = req.body;

  try {
    const news = new News({
      author: req.user._id,
      title,
      content,
      publishAt: publishAt ? new Date(publishAt) : null,
      published: false,
    });

    await news.save();

    getIO().emit("news:created", { news });
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Редактировать новость
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, content, publishAt, published } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid news ID" });
  }

  try {
    const news = await News.findById(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(news)) {
      return res.status(400).json({ message: "Invalid news ID" });
    }

    if (!news.author.equals(req.user._id))
      return res.status(403).json({ message: "Forbidden" });

    if (title) news.title = title;
    if (content) news.content = content;
    if (publishAt !== undefined)
      news.publishAt = publishAt ? new Date(publishAt) : null;
    if (published !== undefined) news.published = published;

    await news.save();

    getIO().emit("news:updated", { news });

    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Удалить новость
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) return res.status(404).json({ message: "News not found" });
    if (!news.author.equals(req.user._id))
      return res.status(403).json({ message: "Forbidden" });

    await news.deleteOne();

    getIO().emit("news:deleted", { newsId: req.params.id });

    res.json({ message: "News deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Публикация новости (endpoint для немедленной публикации)
router.post("/:id/publish", authMiddleware, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) return res.status(404).json({ message: "News not found" });
    if (!news.author.equals(req.user._id))
      return res.status(403).json({ message: "Forbidden" });

    news.published = true;
    news.publishAt = null; // очищаем отложенную дату, если была
    await news.save();

    res.json({ message: "News published", news });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Получить все новости пользователя
router.get("/", authMiddleware, async (req, res) => {
  try {
    const news = await News.find({ author: req.user._id });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
