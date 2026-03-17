import { emailProjectInquiryAdapter } from "@/services/project-inquiry-adapters/email";
import { feishuProjectInquiryAdapter } from "@/services/project-inquiry-adapters/feishu";
import { localFileProjectInquiryAdapter } from "@/services/project-inquiry-adapters/local-file";
import {
  ProjectInquiryNotificationAdapter,
  ProjectInquiryStorageAdapter,
} from "@/services/project-inquiry-adapters/types";
import { volatileProjectInquiryAdapter } from "@/services/project-inquiry-adapters/volatile";
import { wecomProjectInquiryAdapter } from "@/services/project-inquiry-adapters/wecom";

export function resolveProjectInquiryStorageAdapter(): ProjectInquiryStorageAdapter {
  const mode = process.env.PROJECT_INQUIRY_STORAGE_MODE || "auto";

  if (mode === "local-file") {
    return localFileProjectInquiryAdapter;
  }

  if (mode === "volatile") {
    return volatileProjectInquiryAdapter;
  }

  if (process.env.VERCEL === "1" || process.env.VERCEL_ENV) {
    return volatileProjectInquiryAdapter;
  }

  return localFileProjectInquiryAdapter;
}

export function resolveProjectInquiryNotificationAdapters(): ProjectInquiryNotificationAdapter[] {
  return [emailProjectInquiryAdapter, feishuProjectInquiryAdapter, wecomProjectInquiryAdapter];
}
