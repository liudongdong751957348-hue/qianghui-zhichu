import {
  resolveProjectInquiryNotificationAdapters,
  resolveProjectInquiryStorageAdapter,
} from "@/services/project-inquiry-adapters/registry";
import {
  ProjectInquiryListResponse,
  ProjectInquiryResponse,
  ProjectInquiryStatus,
  ProjectInquiryStatusUpdateResponse,
  ProjectInquirySubmitRequest,
} from "@/types/project-inquiry";

function validateRequest(request: ProjectInquirySubmitRequest) {
  const { contactName, contactInfo, projectName, projectLocation } = request.input;

  if (!contactName.trim() || !contactInfo.trim() || !projectName.trim() || !projectLocation.trim()) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "请先补全联系人姓名、联系方式、项目名称和项目地点。",
      },
    } satisfies ProjectInquiryResponse;
  }

  return null;
}

export async function submitProjectInquiry(request: ProjectInquirySubmitRequest): Promise<ProjectInquiryResponse> {
  const invalidResponse = validateRequest(request);

  if (invalidResponse) {
    return invalidResponse;
  }

  const storageAdapter = resolveProjectInquiryStorageAdapter();
  const savedRecord = await storageAdapter.save(request);
  const notificationAdapters = resolveProjectInquiryNotificationAdapters();
  const notifications = await Promise.all(notificationAdapters.map((adapter) => adapter.notify(savedRecord)));
  const record = (await storageAdapter.updateDelivery(savedRecord.id, notifications)) || {
    ...savedRecord,
    delivery: {
      storageSaved: storageAdapter.storageAvailable,
      notifications,
    },
  };

  return {
    ok: true,
    data: record,
    nextSteps: [
      "我们已收到你的项目资料，会先按项目类型、需求阶段和期望交付方式做初步判断。",
      "如资料完整，下一步通常会围绕提案方向、交付深度和时间节点继续沟通。",
      "当前演示版默认以你提交时留下的联系方式为主，建议保留回执编号便于后续继续对接。",
    ],
    delivery: {
      storageSaved: record.delivery.storageSaved,
      notifications: record.delivery.notifications,
    },
  };
}

export async function listProjectInquiries(): Promise<ProjectInquiryListResponse> {
  const storageAdapter = resolveProjectInquiryStorageAdapter();
  const records = await storageAdapter.list();

  return {
    ok: true,
    data: records,
    meta: {
      storageMode: storageAdapter.mode,
      storageAvailable: storageAdapter.storageAvailable,
      message: storageAdapter.message,
    },
  };
}

export async function updateProjectInquiryStatus(
  id: string,
  status: ProjectInquiryStatus,
): Promise<ProjectInquiryStatusUpdateResponse> {
  const storageAdapter = resolveProjectInquiryStorageAdapter();
  const record = await storageAdapter.updateStatus(id, status);

  if (!record) {
    return {
      ok: false,
      error: {
        code: storageAdapter.storageAvailable ? "NOT_FOUND" : "STORAGE_UNAVAILABLE",
        message: storageAdapter.storageAvailable
          ? "未找到对应线索，无法更新状态。"
          : storageAdapter.message || "当前环境未启用持久化存储，无法在线更新线索状态。",
      },
    };
  }

  return {
    ok: true,
    data: record,
  };
}
