import { createId } from "@/lib/utils";
import { ProjectInquiryStorageAdapter } from "@/services/project-inquiry-adapters/types";
import { ProjectInquiryRecord, ProjectInquirySubmitRequest } from "@/types/project-inquiry";

function buildVolatileRecord(request: ProjectInquirySubmitRequest): ProjectInquiryRecord {
  return {
    ...request.input,
    id: createId("inq"),
    createdAt: new Date().toISOString(),
    status: "new",
    delivery: {
      storageSaved: false,
      notifications: [],
    },
  };
}

export const volatileProjectInquiryAdapter: ProjectInquiryStorageAdapter = {
  mode: "volatile",
  storageAvailable: false,
  message: "当前部署环境未启用持久化存储，项目提交会返回正式回执并发送通知，但不会保留在线索列表中。",
  async save(request: ProjectInquirySubmitRequest) {
    return buildVolatileRecord(request);
  },
  async list() {
    return [];
  },
  async getById() {
    return null;
  },
  async updateStatus() {
    return null;
  },
  async updateDelivery() {
    return null;
  },
};
