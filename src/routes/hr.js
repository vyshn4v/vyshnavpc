import express from "express";
import { getHrJobModel } from "../schema/hrJobs.js";
import { publishHrJob } from "../config/amqp.js";
import { triggerSummaryEmail } from "../cron/hrScheduler.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("hr-portal", { title: "HR Application Portal" });
});

/**
 * @swagger
 * tags:
 *   name: HR Campaigns
 *   description: Scheduled daily HR email campaign management
 */

/**
 * @swagger
 * /hr-portal/schedule:
 *   post:
 *     summary: Schedule a new daily HR email campaign
 *     description: Saves a new campaign to the database. It will automatically run every day at 9 AM via cron job.
 *     tags: [HR Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [adminKey, to, subject, content]
 *             properties:
 *               adminKey:
 *                 type: string
 *                 example: "my_secret_key"
 *               to:
 *                 type: string
 *                 example: "hr@company.com,talent@startup.io"
 *                 description: Comma-separated list of recipient emails
 *               cc:
 *                 type: string
 *                 example: "manager@company.com"
 *               bcc:
 *                 type: string
 *                 example: "hidden@example.com"
 *               subject:
 *                 type: string
 *                 example: "Application for Fullstack Developer - Vyshnav P C"
 *               content:
 *                 type: string
 *                 example: "Hi Team,\n\nI am writing to express my interest..."
 *               driveLink:
 *                 type: string
 *                 example: "https://drive.google.com/file/d/FILE_ID/view"
 *     responses:
 *       200:
 *         description: Campaign scheduled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Campaign successfully scheduled!"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Unauthorized - invalid admin key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/schedule", async (req, res) => {
  try {
    const { to, cc, bcc, subject, content, driveLink, adminKey } = req.body;

    if (!adminKey || adminKey !== process.env.HR_ADMIN_KEY) {
      return res.status(403).json({ ok: false, error: "Unauthorized. Invalid Admin Key." });
    }

    if (!to || !subject || !content) {
      return res.status(400).json({ ok: false, error: "Missing required fields: to, subject, or content" });
    }

    const HrJob = getHrJobModel();
    const newJob = new HrJob({
      to,
      cc: cc || "",
      bcc: bcc || "",
      subject,
      content,
      driveLink: driveLink || "",
      status: "active"
    });

    await newJob.save();
    res.json({ ok: true, message: "Campaign successfully scheduled!" });
  } catch (error) {
    console.error("Error scheduling HR applications:", error);
    res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /hr-portal/jobs:
 *   get:
 *     summary: List all scheduled HR campaigns
 *     description: Returns all campaigns sorted by creation date (newest first). Requires admin key in x-admin-key header.
 *     tags: [HR Campaigns]
 *     security:
 *       - AdminKeyHeader: []
 *     responses:
 *       200:
 *         description: List of all campaigns
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HrJob'
 *       403:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/jobs", async (req, res) => {
  try {
    const adminKey = req.headers["x-admin-key"];
    if (adminKey !== process.env.HR_ADMIN_KEY) {
      return res.status(403).json({ ok: false, error: "Unauthorized" });
    }
    const HrJob = getHrJobModel();
    const jobs = await HrJob.find().sort({ createdAt: -1 });
    res.json({ ok: true, jobs });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * @swagger
 * /hr-portal/jobs/{id}/toggle:
 *   put:
 *     summary: Pause or resume a scheduled campaign
 *     description: Toggles the status of a campaign between active and paused. Completed campaigns cannot be toggled.
 *     tags: [HR Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the campaign
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [adminKey]
 *             properties:
 *               adminKey:
 *                 type: string
 *                 example: "my_secret_key"
 *     responses:
 *       200:
 *         description: Status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   example: "paused"
 *       403:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/jobs/:id/toggle", async (req, res) => {
  try {
    const adminKey = req.body.adminKey;
    if (adminKey !== process.env.HR_ADMIN_KEY) {
      return res.status(403).json({ ok: false, error: "Unauthorized" });
    }
    const HrJob = getHrJobModel();
    const job = await HrJob.findById(req.params.id);
    if (!job) return res.status(404).json({ ok: false, error: "Job not found" });

    job.status = job.status === "active" ? "paused" : "active";
    await job.save();
    res.json({ ok: true, status: job.status });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * @swagger
 * /hr-portal/jobs/{id}:
 *   delete:
 *     summary: Delete a scheduled campaign
 *     description: Permanently deletes a campaign from the database.
 *     tags: [HR Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the campaign
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [adminKey]
 *             properties:
 *               adminKey:
 *                 type: string
 *                 example: "my_secret_key"
 *     responses:
 *       200:
 *         description: Deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       403:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/jobs/:id", async (req, res) => {
  try {
    const adminKey = req.body.adminKey;
    if (adminKey !== process.env.HR_ADMIN_KEY) {
      return res.status(403).json({ ok: false, error: "Unauthorized" });
    }
    const HrJob = getHrJobModel();
    await HrJob.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * @swagger
 * /hr-portal/trigger-now:
 *   post:
 *     summary: "[DEBUG] Manually trigger the cron job immediately"
 *     description: Fetches all active campaigns from the DB and pushes them to the RabbitMQ queue right now, exactly like the 9 AM cron. Use this for testing email format and delivery.
 *     tags: [HR Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [adminKey]
 *             properties:
 *               adminKey:
 *                 type: string
 *                 example: "my_secret_key"
 *     responses:
 *       200:
 *         description: Jobs triggered and queued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Triggered 3 job(s) successfully!"
 *                 queued:
 *                   type: integer
 *                   example: 3
 *       403:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/trigger-now", async (req, res) => {
  try {
    const { adminKey } = req.body;
    if (!adminKey || adminKey !== process.env.HR_ADMIN_KEY) {
      return res.status(403).json({ ok: false, error: "Unauthorized" });
    }

    const HrJob = getHrJobModel();
    const activeJobs = await HrJob.find({ status: "active" });

    if (activeJobs.length === 0) {
      return res.json({ ok: true, message: "No active jobs found to trigger.", queued: 0 });
    }

    const jobIds = [];
    for (const job of activeJobs) {
      publishHrJob({
        jobId: job._id.toString(),
        to: job.to,
        cc: job.cc,
        bcc: job.bcc,
        subject: job.subject,
        content: job.content,
        driveLink: job.driveLink,
      });
      job.lastRunAt = new Date();
      await job.save();
      jobIds.push(job._id.toString());
    }

    // Fire summary email after workers finish (same as cron behaviour)
    triggerSummaryEmail(jobIds);

    res.json({ ok: true, message: `Triggered ${activeJobs.length} job(s) successfully! Summary email will arrive in ~5 mins.`, queued: activeJobs.length });
  } catch (err) {
    console.error("[Trigger Now] Error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
