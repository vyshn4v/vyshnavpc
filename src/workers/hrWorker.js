import { getChannel } from "../config/amqp.js";
import { getHrJobModel } from "../schema/hrJobs.js";
import nodemailer from "nodemailer";

// Helper to convert Google Drive link to direct download link
function getDirectDownloadLink(driveLink) {
  if (driveLink && driveLink.includes("google.com")) {
    const match = driveLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      if (driveLink.includes("docs.google.com/document")) {
        return `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
      }
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }
  return driveLink;
}

export const startHrWorker = () => {
  const channel = getChannel();
  if (!channel) {
    console.error("[HR Worker] AMQP channel not available");
    return;
  }

  const hrQueue = process.env.HR_QUEUE || "hr_jobs_queue";

  channel.consume(hrQueue, async (msg) => {
    if (msg !== null) {
      try {
        const payload = JSON.parse(msg.content.toString());
        const { jobId, to, cc, bcc, subject, content, driveLink } = payload;

        console.log(`[HR Worker] Processing Job ${jobId}`);

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const toList = to.split(",").map(e => e.trim()).filter(e => e);
        const ccList = cc ? cc.split(",").map(e => e.trim()).filter(e => e) : [];
        const bccList = bcc ? bcc.split(",").map(e => e.trim()).filter(e => e) : [];

        // Prepare attachment
        const attachments = [];
        if (driveLink) {
          const directLink = getDirectDownloadLink(driveLink);
          if (directLink) {
            attachments.push({
              filename: "Resume_Vyshnav_PC.pdf",
              path: directLink,
            });
          }
        }

        // Send individual emails in parallel
        const promises = toList.map(async (recipient) => {
          const mailOptions = {
            from: process.env.SMTP_USER,
            to: recipient,
            cc: ccList.length > 0 ? ccList : undefined,
            bcc: bccList.length > 0 ? bccList : undefined,
            subject: subject,
            html: content.replace(/\n/g, "<br>"),
            attachments: attachments.length > 0 ? attachments : undefined,
          };
          return transporter.sendMail(mailOptions);
        });

        const results = await Promise.allSettled(promises);

        const successCount = results.filter(r => r.status === "fulfilled").length;
        const failCount = results.filter(r => r.status === "rejected").length;
        const failedEmails = toList.filter((_, i) => results[i].status === "rejected");

        console.log(`[HR Worker] Job ${jobId} done: ${successCount} success, ${failCount} failed.`);

        // Save results to DB — keep status ACTIVE so it recurs tomorrow
        // Only update stats and lastRunAt. User must manually mark as completed.
        try {
          const HrJob = getHrJobModel();
          await HrJob.findByIdAndUpdate(jobId, {
            successCount,
            failCount,
          });
          console.log(`[HR Worker] Job ${jobId} stats saved. Will run again tomorrow.`);
        } catch (dbErr) {
          console.error(`[HR Worker] Failed to update job ${jobId}:`, dbErr);
        }

        channel.ack(msg);
      } catch (error) {
        console.error("[HR Worker] Error processing message:", error);
        channel.nack(msg, false, false);
      }
    }
  });

  console.log("[HR Worker] Listening for jobs...");
};
