import nodemailer from "nodemailer";

import {
  buildInquiryNotificationEntries,
  buildInquiryNotificationText,
  buildInquiryNotificationTitle,
} from "@/services/project-inquiry-adapters/payloads";
import { ProjectInquiryNotificationAdapter } from "@/services/project-inquiry-adapters/types";
import { ProjectInquiryRecord } from "@/types/project-inquiry";

function isEmailConfigured() {
  return Boolean(
    process.env.PROJECT_INQUIRY_SMTP_HOST &&
      process.env.PROJECT_INQUIRY_SMTP_PORT &&
      process.env.PROJECT_INQUIRY_SMTP_USER &&
      process.env.PROJECT_INQUIRY_SMTP_PASS &&
      process.env.PROJECT_INQUIRY_NOTIFY_TO,
  );
}

function buildMailHtml(record: ProjectInquiryRecord) {
  const items = buildInquiryNotificationEntries(record);

  return `
    <div style="font-family:Arial,sans-serif;color:#2f2419;line-height:1.7;">
      <h2 style="margin:0 0 12px;">${buildInquiryNotificationTitle(record)}</h2>
      <p style="margin:0 0 18px;">以下为本次项目提交信息，可直接作为初步跟进依据。</p>
      <table style="width:100%;border-collapse:collapse;">
        ${items
          .map(
            ([label, value]) => `
              <tr>
                <td style="padding:10px 12px;border:1px solid #e6dccb;background:#faf6ee;width:180px;"><strong>${label}</strong></td>
                <td style="padding:10px 12px;border:1px solid #e6dccb;background:#fff;">${value}</td>
              </tr>`,
          )
          .join("")}
      </table>
    </div>
  `;
}

function buildMailText(record: ProjectInquiryRecord) {
  return buildInquiryNotificationText(record);
}

export const emailProjectInquiryAdapter: ProjectInquiryNotificationAdapter = {
  channel: "email",
  async notify(record: ProjectInquiryRecord) {
    if (!isEmailConfigured()) {
      return {
        channel: "email",
        ok: false,
        message: "邮件通知未配置，已跳过发送。",
      };
    }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.PROJECT_INQUIRY_SMTP_HOST,
        port: Number(process.env.PROJECT_INQUIRY_SMTP_PORT),
        secure: process.env.PROJECT_INQUIRY_SMTP_SECURE === "true",
        auth: {
          user: process.env.PROJECT_INQUIRY_SMTP_USER,
          pass: process.env.PROJECT_INQUIRY_SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.PROJECT_INQUIRY_NOTIFY_FROM || process.env.PROJECT_INQUIRY_SMTP_USER,
        to: process.env.PROJECT_INQUIRY_NOTIFY_TO,
        subject: `${buildInquiryNotificationTitle(record)}｜${record.id}`,
        text: buildMailText(record),
        html: buildMailHtml(record),
      });

      return {
        channel: "email",
        ok: true,
        message: "邮件通知已发送。",
      };
    } catch {
      return {
        channel: "email",
        ok: false,
        message: "邮件通知发送失败，项目资料已成功保存。",
      };
    }
  },
};
