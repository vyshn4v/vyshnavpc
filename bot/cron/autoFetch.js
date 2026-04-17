const cron = require("node-cron");
const { exec, spawn } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const Video = require("../models/videos.js");
const axios = require("axios");

// ✅ FIX 1: Drop cheerio entirely — regex scraping avoids building a full DOM in RAM
function searchTwitterVideos(query, page) {
  return new Promise(async (resolve, reject) => {
    const url = `${process.env.SEARCH_URL}/${query}?page=${page}`;

    try {
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/147 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: process.env.REFERER_URL,
        },
        timeout: 20000,
        // ✅ FIX 2: Tell axios not to decompress/buffer a huge response object
        maxContentLength: 5 * 1024 * 1024, // 5MB max
        responseType: "text",
      });

      const baseUrl = process.env.SEARCH_URL.split("/search")[0];
      const videos = [];

      // ✅ FIX 3: Regex instead of cheerio — no DOM tree in memory
      const hrefRegex =
        /href="([^"]*\/videos\/[^"]*)"[^>]*(?:title="([^"]*)")?/g;
      let match;
      while ((match = hrefRegex.exec(data)) !== null) {
        const href = match[1];
        const title = match[2] || "";
        videos.push({
          title: title.trim() || "Watch video",
          link: href.startsWith("http") ? href : baseUrl + href,
        });
      }

      if (videos.length === 0) {
        return searchTwitterVideos(query, page + 1)
          .then(resolve)
          .catch(reject);
      }

      console.log(`🔍 Found ${videos.length} videos for query "${query}"`);
      resolve(videos);
    } catch (err) {
      reject(err);
    }
  });
}

// ✅ FIX 4: Stream the file directly to Telegram instead of loading it into RAM
function sendVideoStream(bot, chatId, filePath, caption) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);
    bot.sendVideo(chatId, stream, { caption }).then(resolve).catch(reject);
  });
}

function downloadVideo(url) {
  return new Promise((resolve, reject) => {
    const filename = `video_${Date.now()}.mp4`;
    const filePath = path.join(__dirname, "../downloads", filename);
    fs.ensureDirSync(path.join(__dirname, "../downloads"));

    const cmd = `yt-dlp -o "${filePath}" --merge-output-format mp4 "${url?.link}"`;
    console.log("🔄 Downloading:", url?.link);

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Download error:", stderr || error.message);
        reject(new Error(stderr || error.message));
      } else {
        resolve(filePath);
      }
    });
  });
}

function titleFromUrl(url) {
  if (!url) return "Watch video";
  return url
    .split("/")
    .pop()
    .split("?")[0]
    .replace(/[-_]/g, " ")
    .replace(/\d+/g, "")
    .trim();
}

let page = 1;
const query = process.env.QUERY;

async function cronfunction(bot, GROUP_CHAT_ID) {
  try {
    const urls = await searchTwitterVideos(query, page);

    // ✅ FIX 5: Process one URL at a time — no full array in RAM during download
    for (const url of urls) {
      console.log("🔄 Processing:", url?.link);

      const exists = await Video.findOne({ sourceUrl: url?.link });
      if (exists) {
        console.log("⏭ In DB, skipping");
        continue;
      }

      let filePath = null;
      let sentMsg = null;
      let status = "success";
      let errorMessage = null;

      try {
        filePath = await downloadVideo(url);

        // ✅ FIX 6: Stream the file — don't buffer the whole video in RAM
        sentMsg = await sendVideoStream(
          bot,
          GROUP_CHAT_ID,
          filePath,
          titleFromUrl(url?.link) || "Watch video",
        );
      } catch (err) {
        console.error("❌ Failed:", err.message);
        status = "error";
        errorMessage = err.message;
      }

      try {
        await Video.create({
          messageId: sentMsg?.message_id || null,
          fileId: sentMsg?.video?.file_id || null,
          caption: titleFromUrl(url?.link) || "Watch video",
          sourceUrl: url?.link,
          status,
          errorMessage,
          createdAt: new Date(),
        });
        console.log(`✅ Saved: ${url?.link} | Status: ${status}`);
      } catch (dbErr) {
        if (dbErr.code === 11000) {
          console.log("⚠️ Duplicate (race condition), ignored");
        } else {
          console.error("❌ DB error:", dbErr.message);
        }
      }

      // ✅ FIX 7: Always clean up temp file immediately after send
      if (filePath) {
        try {
          await fs.remove(filePath);
          console.log("✅ File removed:", filePath);
        } catch {
          console.error("❌ Failed to remove file:", filePath);
        }
      }

      // ✅ FIX 8: Small pause between videos to avoid memory spikes from concurrent I/O
      await new Promise((r) => setTimeout(r, 500));
    }

    page++;
  } catch (err) {
    console.error("❌ Cron error:", err.message);
  }
}

module.exports = (bot, GROUP_CHAT_ID) => {
  cronfunction(bot, GROUP_CHAT_ID);
  cron.schedule(process.env.CRON_SCHEDULE, async () => {
    console.log("🔄 Running auto-fetch cron...");
    cronfunction(bot, GROUP_CHAT_ID);
  });
};
