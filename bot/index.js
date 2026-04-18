require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
const { exec } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const Video = require("./models/videos.js");
const startCron = require("./cron/autoFetch.js");

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROUP_CHAT_ID = process.env.GROUP_CHAT_ID;
const VIDEOS_PER_PAGE = 5;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ─── Connect MongoDB ───
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    startCron(bot, GROUP_CHAT_ID);
  })
  .catch((err) => console.error("❌ MongoDB error:", err));

// ─── User sessions ───
let userSessions = {};

// ─── Download video ───
function downloadVideo(url) {
  return new Promise((resolve, reject) => {
    const filename = `video_${Date.now()}.mp4`;
    const filePath = path.join(__dirname, "downloads", filename);
    fs.ensureDirSync(path.join(__dirname, "downloads"));

    const cmd = [
      "yt-dlp",
      "--no-playlist",
      "--no-warnings",
      '--format "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"',
      "--merge-output-format mp4",
      '--add-header "User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"',
      '--add-header "Accept-Language:en-US,en;q=0.9"',
      `--cookies-from-browser chrome`, // Optional: remove if not needed
      `-o "${filePath}"`,
      `"${url}"`,
    ].join(" ");

    exec(cmd, { timeout: 120000 }, (error, stdout, stderr) => {
      if (error) {
        console.error("yt-dlp error:", stderr || error.message);
        return reject(new Error(stderr || error.message));
      }

      // Verify file actually exists and has content
      if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
        return reject(
          new Error("Download failed: output file is empty or missing."),
        );
      }

      resolve(filePath);
    });
  });
}

// ─── Build paginated keyboard ───
function buildKeyboard(results, page, totalCount) {
  const start = page * VIDEOS_PER_PAGE;
  const end = Math.min(start + VIDEOS_PER_PAGE, results.length);
  const pageItems = results.slice(start, end);
  const totalPages = Math.ceil(totalCount / VIDEOS_PER_PAGE);

  const rows = pageItems.map((v, i) => [
    {
      text: `🎬 ${v.caption.substring(0, 40) || "Video " + (start + i + 1)}`,
      callback_data: `send_${v.messageId}`,
    },
  ]);

  const navRow = [];
  if (page > 0)
    navRow.push({ text: "⬅️ Prev", callback_data: `page_${page - 1}` });
  navRow.push({ text: `📄 ${page + 1}/${totalPages}`, callback_data: "noop" });
  if (end < totalCount)
    navRow.push({ text: "Next ➡️", callback_data: `page_${page + 1}` });

  rows.push(navRow);
  return { inline_keyboard: rows };
}

// ─── Main menu ───
function sendMainMenu(chatId) {
  bot.sendMessage(chatId, "📹 Video Bot Menu:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📋 List All Videos", callback_data: "list_0" }],
        [{ text: "🆕 New Videos", callback_data: "new_0" }],
        [{ text: "🔍 Search by keyword", callback_data: "search_prompt" }],
        [{ text: "🏷 Search by tag", callback_data: "tag_prompt" }],
      ],
    },
  });
}

// ─── /start ───
bot.onText(/\/start/, (msg) => sendMainMenu(msg.chat.id));
bot.onText(/\/menu/, (msg) => sendMainMenu(msg.chat.id));

// ─── Index group videos ───
bot.on("video", async (msg) => {
  if (String(msg.chat.id) === String(GROUP_CHAT_ID)) {
    const exists = await Video.findOne({ messageId: msg.message_id });
    if (!exists) {
      await Video.create({
        messageId: msg.message_id,
        fileId: msg.video.file_id,
        caption: msg.caption || `Video_${msg.message_id}`,
        tags: [],
        isNew: true,
      });
    }
  }
});

// ─── Handle messages ───
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();

  if (!text) return;

  // ─── Handle awaiting input (search/tag) ───
  if (userSessions[chatId]?.awaitingInput) {
    const type = userSessions[chatId].awaitingInput;
    userSessions[chatId].awaitingInput = null;

    if (type === "search") {
      const results = await Video.find(
        { $text: { $search: text } },
        { score: { $meta: "textScore" } },
      ).sort({ score: { $meta: "textScore" } });

      if (!results.length)
        return bot.sendMessage(chatId, `🔍 No results for "${text}"`);
      userSessions[chatId] = { results, page: 0, type: "search" };
      return bot.sendMessage(
        chatId,
        `🔍 ${results.length} result(s) for "${text}":`,
        { reply_markup: buildKeyboard(results, 0, results.length) },
      );
    }

    if (type === "tag") {
      const results = await Video.find({ tags: { $in: [text.toLowerCase()] } });
      if (!results.length)
        return bot.sendMessage(chatId, `🏷 No videos with tag "${text}"`);
      userSessions[chatId] = { results, page: 0, type: "tag" };
      return bot.sendMessage(
        chatId,
        `🏷 ${results.length} video(s) tagged "${text}":`,
        { reply_markup: buildKeyboard(results, 0, results.length) },
      );
    }
    return;
  }

  // ─── Handle Twitter/X URL ───
  if (!text.startsWith("http")) return;

  if (!text.includes("twitter.com") && !text.includes("x.com")) {
    return bot.sendMessage(
      chatId,
      "⚠️ Only Twitter/X URLs supported. Use /menu to search.",
    );
  }

  // Strip query params / tracking junk that can confuse yt-dlp
  let cleanUrl = text;
  try {
    const parsed = new URL(text);
    // Keep only the pathname (removes ?s=... tracking params)
    cleanUrl = `${parsed.origin}${parsed.pathname}`;
  } catch {
    // If URL parsing fails, use as-is
    cleanUrl = text.split("?")[0];
  }

  const statusMsg = await bot.sendMessage(
    chatId,
    "⏳ Downloading Twitter/X video...",
  );

  try {
    const filePath = await downloadVideo(cleanUrl);

    await bot.editMessageText("📤 Uploading to group...", {
      chat_id: chatId,
      message_id: statusMsg.message_id,
    });

    const sentMsg = await bot.sendVideo(GROUP_CHAT_ID, filePath, {
      caption: `📹 ${cleanUrl}`,
    });

    await Video.create({
      messageId: sentMsg.message_id,
      fileId: sentMsg.video.file_id,
      caption: cleanUrl,
      tags: [],
      sourceUrl: cleanUrl,
      isNew: true,
    });

    await bot.editMessageText("✅ Uploaded and saved to database!", {
      chat_id: chatId,
      message_id: statusMsg.message_id,
    });

    await fs.remove(filePath);
  } catch (err) {
    console.error("Download/upload error:", err);

    let errorMsg = "❌ Error: " + err.message;

    // Provide helpful hints for common yt-dlp failures
    if (
      err.message.includes("login") ||
      err.message.includes("age") ||
      err.message.includes("private")
    ) {
      errorMsg +=
        "\n\n⚠️ This tweet may be private, age-restricted, or requires login.";
    } else if (err.message.includes("rate") || err.message.includes("429")) {
      errorMsg +=
        "\n\n⚠️ Twitter rate limit hit. Please try again in a few minutes.";
    } else if (
      err.message.includes("No video") ||
      err.message.includes("no formats")
    ) {
      errorMsg += "\n\n⚠️ No downloadable video found in this tweet.";
    }

    await bot
      .editMessageText(errorMsg, {
        chat_id: chatId,
        message_id: statusMsg.message_id,
      })
      .catch(() => bot.sendMessage(chatId, errorMsg));
  }
});

// ─── Handle all callbacks ───
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  await bot.answerCallbackQuery(query.id);

  if (data === "noop") return;

  // Main menu buttons
  if (data === "search_prompt") {
    userSessions[chatId] = { awaitingInput: "search" };
    return bot.sendMessage(chatId, "🔍 Type your search keyword:");
  }

  if (data === "tag_prompt") {
    userSessions[chatId] = { awaitingInput: "tag" };
    return bot.sendMessage(
      chatId,
      "🏷 Type a tag to search (e.g. cats, funny):",
    );
  }

  // List all
  if (data.startsWith("list_")) {
    const page = parseInt(data.split("_")[1]);
    const total = await Video.countDocuments();
    const results = await Video.find()
      .sort({ uploadedAt: -1 })
      .skip(page * VIDEOS_PER_PAGE)
      .limit(VIDEOS_PER_PAGE);

    userSessions[chatId] = { page, type: "list" };
    return bot.sendMessage(chatId, `📋 All videos (${total} total):`, {
      reply_markup: buildKeyboard(results, page, total),
    });
  }

  // New videos
  if (data.startsWith("new_")) {
    const page = parseInt(data.split("_")[1]);
    const total = await Video.countDocuments({ isNew: true });
    const results = await Video.find({ isNew: true })
      .sort({ uploadedAt: -1 })
      .skip(page * VIDEOS_PER_PAGE)
      .limit(VIDEOS_PER_PAGE);

    if (!total) return bot.sendMessage(chatId, "🆕 No new videos.");
    userSessions[chatId] = { page, type: "new" };
    return bot.sendMessage(chatId, `🆕 New videos (${total}):`, {
      reply_markup: buildKeyboard(results, page, total),
    });
  }

  // Pagination
  if (data.startsWith("page_")) {
    const page = parseInt(data.split("_")[1]);
    const session = userSessions[chatId];
    if (!session) return;

    let results, total;

    if (session.type === "list") {
      total = await Video.countDocuments();
      results = await Video.find()
        .sort({ uploadedAt: -1 })
        .skip(page * VIDEOS_PER_PAGE)
        .limit(VIDEOS_PER_PAGE);
    } else if (session.type === "new") {
      total = await Video.countDocuments({ isNew: true });
      results = await Video.find({ isNew: true })
        .sort({ uploadedAt: -1 })
        .skip(page * VIDEOS_PER_PAGE)
        .limit(VIDEOS_PER_PAGE);
    } else {
      results = session.results;
      total = results.length;
      results = results.slice(
        page * VIDEOS_PER_PAGE,
        (page + 1) * VIDEOS_PER_PAGE,
      );
    }

    session.page = page;
    return bot.editMessageReplyMarkup(buildKeyboard(results, page, total), {
      chat_id: chatId,
      message_id: query.message.message_id,
    });
  }

  // Send video to user
  if (data.startsWith("send_")) {
    const messageId = parseInt(data.split("_")[1]);
    const video = await Video.findOne({ messageId });
    if (!video)
      return bot.sendMessage(chatId, "❌ Video not found in database.");

    await bot.sendVideo(chatId, video.fileId, { caption: video.caption });

    // Mark as not new after viewing
    await Video.updateOne({ messageId }, { isNew: false });
  }
});

console.log("🤖 Bot running...");
