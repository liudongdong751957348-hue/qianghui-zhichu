import {
  buildInquiryNotificationMarkdown,
  buildInquiryNotificationTitle,
} from "@/services/project-inquiry-adapters/payloads";
import { ProjectInquiryNotificationAdapter } from "@/services/project-inquiry-adapters/types";
import { ProjectInquiryRecord } from "@/types/project-inquiry";

function isFeishuConfigured() {
  return Boolean(process.env.PROJECT_INQUIRY_FEISHU_WEBHOOK_URL);
}

export const feishuProjectInquiryAdapter: ProjectInquiryNotificationAdapter = {
  channel: "feishu",
  async notify(record: ProjectInquiryRecord) {
    if (!isFeishuConfigured()) {
      return {
        channel: "feishu",
        ok: false,
        message: "飞书通知未配置，已跳过发送。",
      };
    }

    try {
      const response = await fetch(process.env.PROJECT_INQUIRY_FEISHU_WEBHOOK_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          msg_type: "post",
          content: {
            post: {
              zh_cn: {
                title: buildInquiryNotificationTitle(record),
                content: [
                  [
                    {
                      tag: "text",
                      text: buildInquiryNotificationMarkdown(record).replace(/\*\*/g, ""),
                    },
                  ],
                ],
              },
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error("feishu webhook failed");
      }

      return {
        channel: "feishu",
        ok: true,
        message: "飞书群通知已发送。",
      };
    } catch {
      return {
        channel: "feishu",
        ok: false,
        message: "飞书群通知发送失败，项目资料已成功保存。",
      };
    }
  },
};
