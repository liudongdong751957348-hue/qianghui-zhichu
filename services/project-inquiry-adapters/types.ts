import {
  ProjectInquiryNotificationResult,
  ProjectInquiryRecord,
  ProjectInquiryStatus,
  ProjectInquirySubmitRequest,
} from "@/types/project-inquiry";

export type ProjectInquiryStorageAdapter = {
  save: (request: ProjectInquirySubmitRequest) => Promise<ProjectInquiryRecord>;
  list: () => Promise<ProjectInquiryRecord[]>;
  getById: (id: string) => Promise<ProjectInquiryRecord | null>;
  updateStatus: (id: string, status: ProjectInquiryStatus) => Promise<ProjectInquiryRecord | null>;
  updateDelivery: (id: string, notifications: ProjectInquiryNotificationResult[]) => Promise<ProjectInquiryRecord | null>;
};

export type ProjectInquiryNotificationAdapter = {
  channel: ProjectInquiryNotificationResult["channel"];
  notify: (record: ProjectInquiryRecord) => Promise<ProjectInquiryNotificationResult>;
};
