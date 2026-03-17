import { ProposalRecord } from "@/types/proposal";

const STORAGE_KEY = "wall-art-direct-history";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getHistoryRecords() {
  if (!canUseStorage()) {
    return [] as ProposalRecord[];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [] as ProposalRecord[];
  }

  try {
    return JSON.parse(raw) as ProposalRecord[];
  } catch {
    return [] as ProposalRecord[];
  }
}

export function saveHistoryRecord(record: ProposalRecord) {
  if (!canUseStorage()) {
    return;
  }

  const records = getHistoryRecords();
  const next = [record, ...records].slice(0, 12);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function replaceHistoryRecord(record: ProposalRecord) {
  if (!canUseStorage()) {
    return;
  }

  const records = getHistoryRecords();
  const next = records.map((item) => (item.id === record.id ? record : item));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function getHistoryRecordById(id: string) {
  return getHistoryRecords().find((item) => item.id === id) ?? null;
}
