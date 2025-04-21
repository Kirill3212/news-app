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

const app = express();
const server = http.createServer(app);

// Инициализация Socket.IO
initSocket(server);

app.use(cors(corsOptions));
app.use(express.json());

// Роуты
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // Регистрация GridFS раута, как DB будет готова
    app.use("/api/files", filesRoutes(mongoose.connection.getClient().db()));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Запуск news publiser
startNewsPublisherJob();

// Запуск сервера
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
