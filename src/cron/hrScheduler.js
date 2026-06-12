import cron from "node-cron";
import nodemailer from "nodemailer";
import { getHrJobModel } from "../schema/hrJobs.js";
import { publishHrJob } from "../config/amqp.js";

// Send the single consolidated daily summary email
async function sendDailySummary(jobIds) {
  // Wait 5 minutes for workers to finish processing
  await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));

  try {
    const HrJob = getHrJobModel();
    const jobs = await HrJob.find({ _id: { $in: jobIds } });

    const totalSuccess = jobs.reduce((acc, j) => acc + (j.successCount || 0), 0);
    const totalFail = jobs.reduce((acc, j) => acc + (j.failCount || 0), 0);
    const totalJobs = jobs.length;

    // Build HTML table rows
    const rows = jobs.map(job => {
      const toEmails = job.to.split(",").map(e => e.trim()).filter(e => e);
      const statusColor = job.status === "completed" ? "#2dd4bf" : job.status === "paused" ? "#f59e0b" : "#ef4444";
      return `
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #1e1e2e; color: #e2e8f0;">${job.subject}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #1e1e2e; color: #94a3b8; font-size: 13px;">${toEmails.join("<br>")}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #1e1e2e; color: #2dd4bf; text-align: center;">${job.successCount || 0}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #1e1e2e; color: #ef4444; text-align: center;">${job.failCount || 0}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #1e1e2e; text-align: center;">
            <span style="background: ${statusColor}22; color: ${statusColor}; padding: 2px 10px; border-radius: 100px; font-size: 12px;">${job.status.toUpperCase()}</span>
          </td>
        </tr>
      `;
    }).join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="margin:0; padding:0; background:#0a0a0f; font-family: 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 700px; margin: 40px auto; background: #111118; border-radius: 12px; overflow: hidden; border: 1px solid #1e1e2e;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c6ef7 0%, #5b4de0 100%); padding: 32px 36px;">
            <h1 style="margin: 0; color: #fff; font-size: 22px; font-weight: 700;">📬 Daily HR Campaign Summary</h1>
            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.75); font-size: 14px;">${new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>

          <!-- Stats Row -->
          <div style="display: flex; gap: 0; border-bottom: 1px solid #1e1e2e;">
            <div style="flex: 1; padding: 24px; text-align: center; border-right: 1px solid #1e1e2e;">
              <div style="font-size: 32px; font-weight: 700; color: #7c6ef7;">${totalJobs}</div>
              <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Campaigns Run</div>
            </div>
            <div style="flex: 1; padding: 24px; text-align: center; border-right: 1px solid #1e1e2e;">
              <div style="font-size: 32px; font-weight: 700; color: #2dd4bf;">${totalSuccess}</div>
              <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Emails Sent</div>
            </div>
            <div style="flex: 1; padding: 24px; text-align: center;">
              <div style="font-size: 32px; font-weight: 700; color: #ef4444;">${totalFail}</div>
              <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Failed</div>
            </div>
          </div>

          <!-- Table -->
          <div style="padding: 24px 36px;">
            <h2 style="color: #e2e8f0; font-size: 16px; font-weight: 600; margin: 0 0 16px;">Campaign Breakdown</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <thead>
                <tr style="background: #0d0d1a;">
                  <th style="padding: 10px 14px; text-align: left; color: #64748b; font-weight: 500; border-bottom: 1px solid #1e1e2e;">Subject</th>
                  <th style="padding: 10px 14px; text-align: left; color: #64748b; font-weight: 500; border-bottom: 1px solid #1e1e2e;">Recipients</th>
                  <th style="padding: 10px 14px; text-align: center; color: #64748b; font-weight: 500; border-bottom: 1px solid #1e1e2e;">✓ Sent</th>
                  <th style="padding: 10px 14px; text-align: center; color: #64748b; font-weight: 500; border-bottom: 1px solid #1e1e2e;">✗ Failed</th>
                  <th style="padding: 10px 14px; text-align: center; color: #64748b; font-weight: 500; border-bottom: 1px solid #1e1e2e;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div style="padding: 20px 36px; border-top: 1px solid #1e1e2e; text-align: center;">
            <p style="margin: 0; color: #475569; font-size: 13px;">Automated summary from <strong style="color: #7c6ef7;">Vyshnav PC — HR Campaign Engine</strong></p>
          </div>

        </div>
      </body>
      </html>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.MAIL_TO || "vyshnavpcnaravoor@gmail.com",
      subject: `📬 HR Campaign Summary — ${totalSuccess} sent, ${totalFail} failed (${new Date().toLocaleDateString("en-IN")})`,
      html,
    });

    console.log(`[HR Scheduler] Summary email sent: ${totalSuccess} success, ${totalFail} failed across ${totalJobs} campaigns.`);
  } catch (err) {
    console.error("[HR Scheduler] Failed to send summary email:", err);
  }
}

export const triggerSummaryEmail = (jobIds) => sendDailySummary(jobIds);

export const startHrScheduler = () => {
  // Every day at 09:00 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("[HR Scheduler] Running daily 9 AM job...");
    try {
      const HrJob = getHrJobModel();

      // Only pick jobs that are active AND have NOT been run today already
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const activeJobs = await HrJob.find({
        status: "active",
        $or: [
          { lastRunAt: null },
          { lastRunAt: { $lt: todayStart } }
        ]
      });

      if (activeJobs.length === 0) {
        console.log("[HR Scheduler] No active jobs found.");
        return;
      }

      console.log(`[HR Scheduler] Found ${activeJobs.length} active jobs. Queueing...`);

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

      // Fire and forget — send ONE summary email after workers finish
      sendDailySummary(jobIds);

    } catch (err) {
      console.error("[HR Scheduler] Error running cron job:", err);
    }
  });

  console.log("[HR Scheduler] Initialized: Waiting for 9 AM...");
};
