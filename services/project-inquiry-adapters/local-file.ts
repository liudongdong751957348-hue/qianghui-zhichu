import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { ProjectInquiryStorageAdapter } from "@/services/project-inquiry-adapters/types";
import {
  ProjectInquiryNotificationResult,
  ProjectInquiryRecord,
  ProjectInquiryStatus,
  ProjectInquirySubmitRequest,
} from "@/types/project-inquiry";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "project-inquiries.json");

function normalizeRecord(record: Partial<ProjectInquiryRecord> & { id: string; createdAt: string }) {
  return {
    ...record,
    status: record.status || "new",
    delivery: {
      storageSaved: true,
      notifications: record.delivery?.notifications || [],
    },
  } as ProjectInquiryRecord;
}

async function readRecords() {
  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as Array<Partial<ProjectInquiryRecord> & { id: string; createdAt: string }>;
    return parsed.map(normalizeRecord);
  } catch {
    return [] as ProjectInquiryRecord[];
  }
}

async function writeRecords(records: ProjectInquiryRecord[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(records, null, 2), "utf8");
}

function sortRecords(records: ProjectInquiryRecord[]) {
  return [...records].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const localFileProjectInquiryAdapter: ProjectInquiryStorageAdapter = {
  mode: "local-file",
  storageAvailable: true,
  async save(request: ProjectInquirySubmitRequest) {
    const record: ProjectInquiryRecord = {
      ...request.input,
      id: `inq_${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      status: "new",
      delivery: {
        storageSaved: true,
        notifications: [],
      },
    };

    const records = await readRecords();
    await writeRecords([record, ...records]);
    return record;
  },

  async list() {
    const records = await readRecords();
    return sortRecords(records);
  },

  async getById(id: string) {
    const records = await readRecords();
    return records.find((item) => item.id === id) || null;
  },

  async updateStatus(id: string, status: ProjectInquiryStatus) {
    const records = await readRecords();
    const nextRecords = records.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            updatedAt: new Date().toISOString(),
          }
        : item,
    );

    const updated = nextRecords.find((item) => item.id === id) || null;

    if (!updated) {
      return null;
    }

    await writeRecords(nextRecords);
    return updated;
  },

  async updateDelivery(id: string, notifications: ProjectInquiryNotificationResult[]) {
    const records = await readRecords();
    const nextRecords = records.map((item) =>
      item.id === id
        ? {
            ...item,
            updatedAt: new Date().toISOString(),
            delivery: {
              storageSaved: true as const,
              notifications,
            },
          }
        : item,
    );

    const updated = nextRecords.find((item) => item.id === id) || null;

    if (!updated) {
      return null;
    }

    await writeRecords(nextRecords);
    return updated;
  },
};
