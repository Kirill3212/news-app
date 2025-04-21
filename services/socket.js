/**
 * @file services/socket.js
 * Модуль инициализации и экспорта Socket.IO для real-time уведомлений.
 */

/**
 * @typedef {Object} SocketIOServer
 * @see https://socket.io/docs/v4/server-api/
 */

import { Server as SocketIOServer } from "socket.io";

let io = null;

/**
 * Инициализация Socket.IO
 * @param {Object} server - HTTP сервер, созданный через http.createServer(app)
 * @returns {SocketIOServer} Экземпляр Socket.IO сервера
 */
export function initSocket(server) {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  // Для теста: логирование подключения
  io.on("connection", (socket) => {
    console.log("Socket.IO client connected:", socket.id);

    socket.emit("hello", { message: "Welcome to Socket.IO!" });
  });

  return io;
}

/**
 * Получить текущий экземпляр io
 * @returns {SocketIOServer} Экземпляр Socket.IO сервера
 * @throws {Error} Если Socket.IO не инициализирован
 */
export function getIO() {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
}
