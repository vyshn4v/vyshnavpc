const cron = require("node-cron");
const { exec } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const Video = require("../models/videos.js");
const axios = require("axios");

const DOWNLOADS_DIR = path.join(__dirname, "../downloads");
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "7", 10); // videos per cron tick
const MIN_FREE_BYTES = 200 * 1024 * 1024; // 200MB

// ─── Persistent Queue State ───────────────────────────────────────────────────
// videoQueue  = full list loaded from one search page
// queuePage   = which search page the queue came from
// queueIndex  = next unprocessed position inside videoQueue
//
// Each cron tick slices [queueIndex … queueIndex+BATCH_SIZE] and processes
// them one-by-one. On the next tick it picks up exactly where it left off.
// When the queue is exhausted we load the next search page.
let videoQueue = [];
let queuePage = 1;
let queueIndex = 0;

// ─── Disk / Dir Helpers ───────────────────────────────────────────────────────

async function ensureCleanDir() {
  await fs.ensureDir(DOWNLOADS_DIR);
  const files = await fs.readdir(DOWNLOADS_DIR);
  for (const file of files) {
    try {
      await fs.remove(path.join(DOWNLOADS_DIR, file));
      console.log("🧹 Cleaned leftover file:", file);
    } catch (e) {
      console.error("❌ Could not remove:", file, e.message);
    }
  }
}

async function getFreeDiskSpace() {
  return new Promise((resolve) => {
    exec(
      `df -k "${DOWNLOADS_DIR}" | tail -1 | awk '{print $4}'`,
      (err, stdout) => {
        if (err) return resolve(Infinity);
        const freeKB = parseInt(stdout.trim(), 10);
        resolve(isNaN(freeKB) ? Infinity : freeKB * 1024);
      },
    );
  });
}

async function hasSufficientSpace(label = "") {
  const free = await getFreeDiskSpace();
  if (free < MIN_FREE_BYTES) {
    console.error(
      `❌ [${label}] Disk too low: ${Math.round(free / 1024 / 1024)}MB free.`,
    );
    return false;
  }
  return true;
}

// ─── Search / Queue Loader ────────────────────────────────────────────────────

/**
 * Fetches ALL videos from one search page and resets the queue.
 * Recursively tries the next page if the current one is empty.
 */
async function loadPage(query, page) {
  const url = `${process.env.SEARCH_URL}/${query}?page=${page}`;
  console.log(`🔍 Loading search page ${page} for query "${query}"…`);

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
  const hrefRegex = /href="([^"]*\/videos\/[^"]*)"[^>]*(?:title="([^"]*)")?/g;
  let match;
  while ((match = hrefRegex.exec(data)) !== null) {
    videos.push({
      title: (match[2] || "").trim() || "Watch video",
      link: match[1].startsWith("http") ? match[1] : baseUrl + match[1],
    });
  }

  if (videos.length === 0) {
    console.log(`⚠️  Page ${page} empty — trying page ${page + 1}…`);
    return loadPage(query, page + 1);
  }

  // Reset queue state with the newly loaded page
  videoQueue = videos;
  queuePage = page;
  queueIndex = 0;
  console.log(
    `📄 Page ${page}: ${videos.length} videos loaded. Queue reset to index 0.`,
  );
}

// ─── Download / Send / Delete ─────────────────────────────────────────────────

function downloadVideo(url) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DOWNLOADS_DIR, `video_${Date.now()}.mp4`);
    const cmd = `yt-dlp -o "${filePath}" --merge-output-format mp4 "${url.link}"`;
    console.log("⬇️  Downloading:", url.link);

    exec(cmd, async (error, _stdout, stderr) => {
      if (error) {
        try {
          await fs.remove(filePath);
        } catch {}
        try {
          await fs.remove(filePath + ".part");
        } catch {}
        return reject(new Error(stderr || error.message));
      }
      resolve(filePath);
    });
  });
}

function sendVideoStream(bot, chatId, filePath, caption) {
  return new Promise((resolve, reject) => {
    bot
      .sendVideo(chatId, fs.createReadStream(filePath), { caption })
      .then(resolve)
      .catch(reject);
  });
}

function titleFromUrl(url) {
  if (!url) return "Watch video";
  return (
    url
      .split("/")
      .pop()
      .split("?")[0]
      .replace(/[-_]/g, " ")
      .replace(/\d+/g, "")
      .trim() || "Watch video"
  );
}

// ─── Process exactly ONE video (download → upload → delete) ──────────────────

async function processOne(bot, GROUP_CHAT_ID, url) {
  const exists = await Video.findOne({ sourceUrl: url.link });
  if (exists) {
    console.log("⏭  Already in DB, skipping:", url.link);
    return;
  }

  if (!(await hasSufficientSpace("pre-download"))) return;

  let filePath = null;
  let sentMsg = null;
  let status = "success";
  let errorMessage = null;

  try {
    // 1. Download
    filePath = await downloadVideo(url);

    // 2. Upload — fully awaited; next video won't start until this resolves
    sentMsg = await sendVideoStream(
      bot,
      GROUP_CHAT_ID,
      filePath,
      titleFromUrl(url.link),
    );
    console.log("✅ Uploaded:", url.link);
  } catch (err) {
    console.error("❌ Failed:", err.message);
    status = "error";
    errorMessage = err.message;
  } finally {
    // 3. Delete local file right away — whether upload succeeded or not
    if (filePath) {
      try {
        await fs.remove(filePath);
        console.log("🗑️  Deleted:", path.basename(filePath));
      } catch {
        console.error("❌ Could not delete:", filePath);
      }
    }
  }

  // 4. Save to DB
  try {
    await Video.create({
      messageId: sentMsg?.message_id || null,
      fileId: sentMsg?.video?.file_id || null,
      caption: titleFromUrl(url.link),
      sourceUrl: url.link,
      status,
      errorMessage,
      createdAt: new Date(),
    });
    console.log(`💾 DB saved (${status}): ${url.link}`);
  } catch (dbErr) {
    if (dbErr.code === 11000) {
      console.log("⚠️  Duplicate race-condition, ignored.");
    } else {
      console.error("❌ DB error:", dbErr.message);
    }
  }
}

// ─── Main cron function ───────────────────────────────────────────────────────

const query = process.env.QUERY;

async function cronfunction(bot, GROUP_CHAT_ID) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(
    `⏰ Cron tick | page ${queuePage} | index ${queueIndex}/${videoQueue.length} | batch size ${BATCH_SIZE}`,
  );
  console.log(`${"═".repeat(60)}`);

  try {
    await ensureCleanDir();
    if (!(await hasSufficientSpace("start"))) return;

    // ── Load a new search page if this is the first run or queue is exhausted ──
    if (queueIndex >= videoQueue.length) {
      const nextPage = videoQueue.length === 0 ? queuePage : queuePage + 1;
      try {
        await loadPage(query, nextPage);
      } catch (fetchErr) {
        console.error("❌ Failed to load search page:", fetchErr.message);
        return;
      }
    }

    // ── Take exactly BATCH_SIZE items from the current queue position ──
    const batch = videoQueue.slice(queueIndex, queueIndex + BATCH_SIZE);

    if (batch.length === 0) {
      console.log("ℹ️  Queue empty after load — nothing to process.");
      return;
    }

    console.log(
      `\n📦 Batch: items ${queueIndex + 1}–${queueIndex + batch.length} of ${videoQueue.length} (page ${queuePage})`,
    );

    // ── Process strictly one-at-a-time ──
    for (let i = 0; i < batch.length; i++) {
      const url = batch[i];
      console.log(`\n  [${i + 1}/${batch.length}] ▶️  ${url.link}`);

      if (!(await hasSufficientSpace("mid-batch"))) {
        // Don't advance index so we retry this item next tick
        break;
      }

      await processOne(bot, GROUP_CHAT_ID, url);

      // ✅ Advance index AFTER the item is fully processed
      queueIndex++;

      await new Promise((r) => setTimeout(r, 500));
    }

    console.log(
      `\n✅ Batch complete. Next tick → page ${queuePage}, index ${queueIndex}/${videoQueue.length}.`,
    );

    // Clean downloads dir after every batch
    await ensureCleanDir();
  } catch (err) {
    console.error("❌ Cron error:", err.message);
  }
}

// ─── Export ───────────────────────────────────────────────────────────────────

module.exports = (bot, GROUP_CHAT_ID) => {
  cronfunction(bot, GROUP_CHAT_ID);

  cron.schedule(process.env.CRON_SCHEDULE, () => {
    console.log("⏰ Scheduled cron triggered.");
    cronfunction(bot, GROUP_CHAT_ID);
  });
};
