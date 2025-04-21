const allowedOrigins = ["http://localhost:3000"];

export const corsOptions = {
  origin: function (origin, callback) {
    // Позволить запросы с no origin (mobile apps, curl, и т.д.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
