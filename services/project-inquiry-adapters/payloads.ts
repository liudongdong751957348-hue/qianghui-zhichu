import { inquirySourceLabels } from "@/lib/project-inquiry";
import { ProjectInquiryRecord } from "@/types/project-inquiry";

export function buildInquiryNotificationTitle(record: ProjectInquiryRecord) {
  return `墙绘直出收到新项目提交｜${record.projectName}`;
}

export function buildInquiryNotificationEntries(record: ProjectInquiryRecord) {
  return [
    ["回执编号", record.id],
    ["项目名称", record.projectName],
    ["联系人", record.contactName],
    ["联系方式", record.contactInfo],
    ["项目类型", record.projectType],
    ["项目地点", record.projectLocation],
    ["当前需求阶段", record.demandStage],
    ["预算范围", record.budgetRange],
    ["期望交付类型", record.deliveryType],
    ["补充说明", record.notes || "未填写"],
    ["入口来源", inquirySourceLabels[record.source]],
    ["提交时间", new Date(record.createdAt).toLocaleString("zh-CN")],
  ] as const;
}

export function buildInquiryNotificationText(record: ProjectInquiryRecord) {
  return [
    buildInquiryNotificationTitle(record),
    ...buildInquiryNotificationEntries(record).map(([label, value]) => `${label}：${value}`),
  ].join("\n");
}

export function buildInquiryNotificationMarkdown(record: ProjectInquiryRecord) {
  return [
    `**${buildInquiryNotificationTitle(record)}**`,
    ...buildInquiryNotificationEntries(record).map(([label, value]) => `- ${label}：${value}`),
  ].join("\n");
}
