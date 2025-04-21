/**
 * @file server.js
 * Главная точка входа в приложение. Инициализация Express, Socket.IO, подключение к MongoDB и запуск cron-задач.
 */

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";

import authRoutes from "./routes/auth.js";
import newsRoutes from "./routes/news.js";
import filesRoutes from "./routes/files.js";

import { initSocket } from "./services/socket.js";
import { corsOptions } from "./config/corsOptions.js";
import { startNewsPublisherJob } from "./jobs/newsPublisher.js";

/**
 * Экземпляр Express-приложения
 * @type {import('express').Express}
 */
const app = express();

/**
 * HTTP сервер для Express и Socket.IO
 * @type {import('http').Server}
 */
const server = http.createServer(app);

// Инициализация Socket.IO для real-time уведомлений
initSocket(server);

/**
 * Настройка middleware для CORS и обработки JSON
 */
app.use(cors(corsOptions));
app.use(express.json());

/**
 * Регистрация API маршрутов
 */
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

/**
 * Подключение к MongoDB и регистрация GridFS роутов после подключения
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // Регистрация GridFS раута, когда база данных готова
    app.use("/api/files", filesRoutes(mongoose.connection.getClient().db()));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

/**
 * Запуск cron-задачи для отложенной публикации новостей
 */
startNewsPublisherJob();

/**
 * Запуск сервера на указанном порту
 */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
