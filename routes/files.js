/**
 * @file routes/files.js
 * Роуты для загрузки и скачивания файлов через MongoDB GridFS.
 */

import { Router } from "express";
import multer from "multer";
import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";
import { Readable } from "stream";

const upload = multer();

/**
 * Создаёт роутер для работы с файлами через GridFS.
 * @param {Db} db - Экземпляр MongoDB базы данных
 * @returns {Router} Экспресс-роутер
 */
export default function files(db) {
  const router = Router();
  const bucket = new GridFSBucket(db, { bucketName: "uploads" });

  /**
   * @route POST /api/files/upload
   * @desc Загрузка файла в GridFS
   * @access Public (или защитите по необходимости)
   */
  router.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Проверка на существующее имя файла
    const existing = await db
      .collection("uploads.files")
      .findOne({ filename: req.file.originalname });

    if (existing) {
      return res.status(409).json({ error: "File already exists" });
    }

    const readableStream = Readable.from(req.file.buffer);
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    readableStream
      .pipe(uploadStream)
      .on("error", (err) => res.status(500).json({ error: err.message }))
      .on("finish", () => {
        res.status(201).json({
          fileId: uploadStream.id,
          filename: req.file.originalname,
          url: `/api/files/${uploadStream.id}`,
        });
      });
  });

  /**
   * @route GET /api/files/:id
   * @desc Скачать файл из GridFS по ID
   * @access Public (или защитите по необходимости)
   */
  router.get("/:id", async (req, res) => {
    try {
      const fileId = new mongoose.Types.ObjectId(req.params.id);
      const files = await db
        .collection("uploads.files")
        .find({ _id: fileId })
        .toArray();
      if (!files || files.length === 0) {
        return res.status(404).json({ error: "File not found" });
      }
      res.set(
        "Content-Type",
        files[0].contentType || "application/octet-stream"
      );
      const downloadStream = bucket.openDownloadStream(fileId);
      downloadStream.pipe(res);
    } catch (err) {
      res.status(400).json({ error: "Invalid file ID" });
    }
  });

  return router;
}
