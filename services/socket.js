import { Server as SocketIOServer } from "socket.io";

let io = null;

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

//  Получить текущий экземпляр io
export function getIO() {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
}
