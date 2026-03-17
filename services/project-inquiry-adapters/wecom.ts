import {
  buildInquiryNotificationMarkdown,
  buildInquiryNotificationTitle,
} from "@/services/project-inquiry-adapters/payloads";
import { ProjectInquiryNotificationAdapter } from "@/services/project-inquiry-adapters/types";
import { ProjectInquiryRecord } from "@/types/project-inquiry";

function isWecomConfigured() {
  return Boolean(process.env.PROJECT_INQUIRY_WECOM_WEBHOOK_URL);
}

export const wecomProjectInquiryAdapter: ProjectInquiryNotificationAdapter = {
  channel: "wecom",
  async notify(record: ProjectInquiryRecord) {
    if (!isWecomConfigured()) {
      return {
        channel: "wecom",
        ok: false,
        message: "企业微信通知未配置，已跳过发送。",
      };
    }

    try {
      const response = await fetch(process.env.PROJECT_INQUIRY_WECOM_WEBHOOK_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          msgtype: "markdown",
          markdown: {
            content: buildInquiryNotificationMarkdown(record).replace(
              `**${buildInquiryNotificationTitle(record)}**`,
              `<font color="info">${buildInquiryNotificationTitle(record)}</font>`,
            ),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("wecom webhook failed");
      }

      return {
        channel: "wecom",
        ok: true,
        message: "企业微信群通知已发送。",
      };
    } catch {
      return {
        channel: "wecom",
        ok: false,
        message: "企业微信群通知发送失败，项目资料已成功保存。",
      };
    }
  },
};
