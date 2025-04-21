import cron from "node-cron";
import News from "../models/News.js";

// Отложенная публикация новости
export function startNewsPublisherJob() {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const newsToPublish = await News.find({
        published: false,
        publishAt: { $lte: now, $ne: null },
      });

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
