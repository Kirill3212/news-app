/**
 * @file jobs/newsPublisher.js
 * Cron-задача для отложенной публикации новостей.
 */

import cron from "node-cron";
import News from "../models/News.js";

/**
 * Запускает cron-задачу для публикации новостей с истёкшим временем publishAt.
 * Проверяет каждую минуту.
 */
export function startNewsPublisherJob() {
  /**
   * Планирует задачу на выполнение каждую минуту
   */
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const newsToPublish = await News.find({
        published: false,
        publishAt: { $lte: now, $ne: null },
      });

      /**
       * Обрабатываем каждую новость, которая должна быть опубликована
       */
      for (const news of newsToPublish) {
        news.published = true;
        news.publishAt = null;
        await news.save();
        console.log(`News published automatically: ${news._id}`);
      }
    } catch (error) {
      console.error("Error in scheduled news publishing:", error);
    }
  });
}
