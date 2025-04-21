/**
 * @file config/corsOptions.js
 * Конфигурация CORS для Express-приложения.
 */

/**
 * Список разрешённых источников (Origin)
 * @type {string[]}
 */
const allowedOrigins = ["http://localhost:3000"];

/**
 * @typedef {Object} CorsOptions
 * @property {function} origin - Функция проверки Origin
 * @property {boolean} credentials - Разрешить ли отправку куки
 */

/**
 * Опции CORS для Express
 * @type {CorsOptions}
 */
export const corsOptions = {
  origin: function (origin, callback) {
    // Разрешить запросы без Origin (например, curl, мобильные приложения)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
