const cron = require("node-cron");
const { exec } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const Video = require("../models/videos.js");
const axios = require("axios");

const DOWNLOADS_DIR = path.join(__dirname, "../downloads");

// ✅ Purge stale/partial files on startup and before each run
async function cleanDownloadsDir() {
  try {
    await fs.ensureDir(DOWNLOADS_DIR);
    const files = await fs.readdir(DOWNLOADS_DIR);
    for (const file of files) {
      const filePath = path.join(DOWNLOADS_DIR, file);
      try {
        await fs.remove(filePath);
        console.log("🧹 Cleaned leftover file:", file);
      } catch (e) {
        console.error("❌ Could not remove:", file, e.message);
      }
    }
  } catch (e) {
    console.error("❌ cleanDownloadsDir error:", e.message);
  }
}

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
        maxContentLength: 5 * 1024 * 1024,
        responseType: "text",
      });

      const baseUrl = process.env.SEARCH_URL.split("/search")[0];
      const videos = [];
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

// ✅ Check free disk space before attempting download (in bytes)
function getFreeDiskSpace() {
  return new Promise((resolve) => {
    exec(
      `df -k "${DOWNLOADS_DIR}" | tail -1 | awk '{print $4}'`,
      (err, stdout) => {
        if (err) return resolve(Infinity); // can't check, allow it
        const freeKB = parseInt(stdout.trim(), 10);
        resolve(isNaN(freeKB) ? Infinity : freeKB * 1024);
      },
    );
  });
}

function sendVideoStream(bot, chatId, filePath, caption) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);
    bot.sendVideo(chatId, stream, { caption }).then(resolve).catch(reject);
  });
}

function downloadVideo(url) {
  return new Promise((resolve, reject) => {
    const filename = `video_${Date.now()}.mp4`;
    const filePath = path.join(DOWNLOADS_DIR, filename);

    const cmd = `yt-dlp -o "${filePath}" --merge-output-format mp4 "${url?.link}"`;
    console.log("🔄 Downloading:", url?.link);

    exec(cmd, async (error, stdout, stderr) => {
      if (error) {
        // ✅ Always delete partial file on failure
        try {
          await fs.remove(filePath);
        } catch {}
        // Also remove any yt-dlp temp fragments (e.g. .mp4.part, .ytdl)
        try {
          await fs.remove(filePath + ".part");
        } catch {}
        console.error("❌ Download error:", stderr || error.message);
        return reject(new Error(stderr || error.message));
      }
      resolve(filePath);
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

// ✅ Minimum 200MB free space required before downloading
const MIN_FREE_BYTES = 200 * 1024 * 1024;

async function cronfunction(bot, GROUP_CHAT_ID) {
  try {
    // ✅ Clean any leftover files before starting
    await cleanDownloadsDir();

    const freeSpace = await getFreeDiskSpace();
    if (freeSpace < MIN_FREE_BYTES) {
      console.error(
        `❌ Not enough disk space: ${Math.round(freeSpace / 1024 / 1024)}MB free. Skipping cycle.`,
      );
      return;
    }

    const urls = await searchTwitterVideos(query, page);

    for (const url of urls) {
      console.log("🔄 Processing:", url?.link);

      const exists = await Video.findOne({ sourceUrl: url?.link });
      if (exists) {
        console.log("⏭ In DB, skipping");
        continue;
      }

      // ✅ Re-check space before each individual download
      const spaceNow = await getFreeDiskSpace();
      if (spaceNow < MIN_FREE_BYTES) {
        console.error("❌ Disk space too low mid-cycle, stopping.");
        break;
      }

      let filePath = null;
      let sentMsg = null;
      let status = "success";
      let errorMessage = null;

      try {
        filePath = await downloadVideo(url);
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
      } finally {
        // ✅ Always delete in finally — runs even if sendVideo throws
        if (filePath) {
          try {
            await fs.remove(filePath);
            console.log("✅ File removed:", filePath);
          } catch {
            console.error("❌ Failed to remove file:", filePath);
          }
        }
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
