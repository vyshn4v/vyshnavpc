import express from "express";
import { getContactModel } from "../schema/contacts.js";
import { publishContactMessage } from "../config/amqp.js";

// Reuse the same helpers already used by visitorTracker
import {
  extractIp,
  parseUserAgent,
  fetchGeoInfo,
} from "../middleware/visitorTracker.js";

const router = express.Router();

// ── POST /contact ─────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName = "", email, subject = "", message } = req.body;

    // ── 1. Server-side validation ─────────────────────────────────────────
    if (!firstName?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        ok: false,
        error: "firstName, email, and message are required.",
      });
    }

    // Basic email format check
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email.trim())) {
      return res.status(400).json({ ok: false, error: "Invalid email address." });
    }

    // ── 2. Enrich with geo + device data (best-effort, non-blocking) ──────
    const ip      = extractIp(req);
    const uaData  = parseUserAgent(req.headers["user-agent"] || "");
    const geo     = await fetchGeoInfo(ip);

    // ── 3. Persist to MongoDB ─────────────────────────────────────────────
    const Contact = getContactModel();
    const doc = await Contact.create({
      firstName: firstName.trim(),
      lastName:  lastName.trim(),
      email:     email.trim().toLowerCase(),
      subject:   subject.trim() || "(no subject)",
      message:   message.trim(),
      ip,
      country: geo?.country  || "",
      state:   geo?.region   || "",
      city:    geo?.city     || "",
      device:  uaData.deviceType  || "",
      browser: uaData.browser
        ? `${uaData.browser} ${uaData.browserVersion}`.trim()
        : "",
      status: "queued",
    });

    // ── 4. Publish to RabbitMQ (email-consumer will do the actual sending) ─
    publishContactMessage({
      contactId:  doc._id.toString(),
      firstName:  doc.firstName,
      lastName:   doc.lastName,
      email:      doc.email,
      subject:    doc.subject,
      message:    doc.message,
      submittedAt: doc.createdAt,
    });

    return res.status(201).json({ ok: true });

  } catch (err) {
    console.error("[contact route] Error:", err.message);
    return res.status(500).json({ ok: false, error: "Something went wrong. Please try again." });
  }
});

export default router;
