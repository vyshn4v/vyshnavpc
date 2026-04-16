const cron = require("node-cron");
const { exec } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const Video = require("../models/videos.js");
const puppeteer = require("puppeteer");
const axios = require("axios");
const cheerio = require("cheerio");
// List of search queries + tags to auto-fetch
const AUTO_FETCH_QUERIES = [
  { query: "funny cats", tags: ["cats", "funny"] },
  { query: "nature documentary", tags: ["nature", "documentary"] },
  // Add your own search queries and tags here
];

function downloadVideo(url) {
  return new Promise((resolve, reject) => {
    console.log("🔄 Downloading video from URL:", url);
    const filename = `video_${Date.now()}.mp4`;
    const filePath = path.join(__dirname, "../downloads", filename);
    fs.ensureDirSync(path.join(__dirname, "../downloads"));
    const cmd = `yt-dlp -o "${filePath}" --merge-output-format mp4 "${url?.link}"`;
    console.log("🔄 Executing command:", cmd);
    exec(cmd, (error, stdout, stderr) => {
      console.log("🔄 Download completed:", filePath);
      resolve(filePath);
    });
    console.log("🔄 Download command executed, waiting for completion...");
  });
}

function searchTwitterVideos(query) {
  return new Promise(async (resolve, reject) => {
    const url = process.env.SEARCH_URL;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/147 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: process.env.REFERER_URL,
      },
      timeout: 20000,
    });

    const $ = cheerio.load(data);
    const videos = [];

    $("a").each((i, el) => {
      const href = $(el).attr("href");
      const title = $(el).attr("title") || $(el).text().trim();

      if (href && href.includes("/videos/")) {
        videos.push({
          title: title || "Watch video",
          link: href.startsWith("http")
            ? href
            : process.env.SEARCH_URL.split("/search")[0] + href,
        });
      }
    });
    console.log(videos);
    console.log(`🔍 Found ${videos.length} videos for query "${query}"`);
    return resolve(videos.slice(0, 5));
  });
}

module.exports = (bot, GROUP_CHAT_ID) => {
  // Runs every 6 hours
  cron.schedule("* * * * *", async () => {
    console.log("🔄 Running auto-fetch cron...");

    try {
      const urls = await searchTwitterVideos();
      console.log(urls);
      for (const url of urls) {
        console.log("🔄 URL:", url);
        // Skip if already exists
        const exists = await Video.findOne({ sourceUrl: url?.link });
        console.log("🔍 Exists in DB:", !!exists);
        if (exists) continue;

        const filePath = await downloadVideo(url);
        const sentMsg = await bot.sendVideo(GROUP_CHAT_ID, filePath, {
          caption: `${url?.title || "Watch video"}`,
        });

        await Video.create({
          messageId: sentMsg.message_id,
          fileId: sentMsg.video.file_id,
          caption: `${url?.title || "Watch video"}`,
          tags: item.tags,
          sourceUrl: url,
          isNew: true,
        });

        await fs.remove(filePath);
        console.log(`✅ Auto-fetched: ${url}`);
      }
    } catch (err) {
      console.error(`❌ Cron error for "${item.query}":`, err.message);
    }
  });
};
