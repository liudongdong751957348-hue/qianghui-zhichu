import { emailProjectInquiryAdapter } from "@/services/project-inquiry-adapters/email";
import { feishuProjectInquiryAdapter } from "@/services/project-inquiry-adapters/feishu";
import { localFileProjectInquiryAdapter } from "@/services/project-inquiry-adapters/local-file";
import {
  ProjectInquiryNotificationAdapter,
  ProjectInquiryStorageAdapter,
} from "@/services/project-inquiry-adapters/types";
import { wecomProjectInquiryAdapter } from "@/services/project-inquiry-adapters/wecom";

export function resolveProjectInquiryStorageAdapter(): ProjectInquiryStorageAdapter {
  return localFileProjectInquiryAdapter;
}

export function resolveProjectInquiryNotificationAdapters(): ProjectInquiryNotificationAdapter[] {
  return [emailProjectInquiryAdapter, feishuProjectInquiryAdapter, wecomProjectInquiryAdapter];
}
