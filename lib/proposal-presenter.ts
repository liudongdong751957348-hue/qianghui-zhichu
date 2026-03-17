import {
  ProposalAdjustmentKey,
  ProposalRecord,
  ProposalVersion,
} from "@/types/proposal";

export function formatProposalDate(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}.${month}.${day}`;
}

export function buildProposalNumber(record: ProposalRecord) {
  const date = new Date(record.createdAt);
  const year = Number.isNaN(date.getTime()) ? "0000" : `${date.getFullYear()}`;
  const serial = record.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase() || "000000";

  return `QHZC-${year}-${serial}`;
}

export function getVersionSourceLabel(version?: ProposalVersion) {
  if (!version?.sourceKind || version.sourceKind === "initial") {
    return "首次生成";
  }

  if (version.sourceKind === "template-switch") {
    return "切换模板重出";
  }

  return "快捷微调";
}

export function getVersionTemplateLabel(version?: ProposalVersion, record?: ProposalRecord | null) {
  return [version?.templateName || record?.templateName, version?.subtemplateName || record?.subtemplateName]
    .filter(Boolean)
    .join(" / ");
}

export function getVersionImage(version: ProposalVersion | undefined, record: ProposalRecord, kind: "generated" | "cover") {
  if (kind === "generated") {
    return version?.generatedImage || record.generatedImage;
  }

  return version?.coverImage || record.coverImage;
}

export function getProposalVersions(record: ProposalRecord) {
  return record.versions?.length
    ? record.versions
    : [
        {
          id: record.activeVersionId || "legacy-version",
          label: "当前版本",
          createdAt: record.createdAt,
          coverImage: record.coverImage,
          generatedImage: record.generatedImage,
          title: record.title,
          summary: record.summary,
          positioning: record.positioning,
          visualLogic: record.visualLogic,
          interactionHighlights: record.interactionHighlights,
          executionAdvice: record.executionAdvice,
          sourceKind: record.latestGenerationSource,
          templateKey: record.templateKey,
          templateName: record.templateName,
          subtemplateKey: record.subtemplateKey,
          subtemplateName: record.subtemplateName,
          templateSwitchSource: record.latestTemplateSwitchSource,
        } satisfies ProposalVersion,
      ];
}

export function buildDifferenceSummary(left: ProposalVersion | undefined, right: ProposalVersion | undefined, record: ProposalRecord) {
  if (!left || !right) {
    return [];
  }

  const summary: string[] = [];
  const leftTemplate = getVersionTemplateLabel(left, record);
  const rightTemplate = getVersionTemplateLabel(right, record);

  if (leftTemplate !== rightTemplate) {
    summary.push(`本轮提案方向由“${rightTemplate}”切换为“${leftTemplate}”，整体判断路径已经发生变化。`);
  }

  if (left.sourceKind !== right.sourceKind) {
    if (left.sourceKind === "template-switch") {
      summary.push("当前版本属于模板切换重出，更侧重提案方向重构，而不是在原有画面上做局部修饰。");
    } else if (left.sourceKind === "refine") {
      summary.push("当前版本属于原方案上的定向微调，核心价值在于收束重点，而不是彻底更换提案路径。");
    }
  }

  if (left.tweakKey && left.tweakKey !== right.tweakKey) {
    const tweakLabels: Record<ProposalAdjustmentKey, string> = {
      "muted-colors": "色彩更克制",
      "stronger-checkin": "更偏合影打卡",
      "stronger-focal": "主视觉更集中",
      "rural-character": "在地感更强",
      "commercial-spread": "传播性更强",
      "reduce-clutter": "画面更整洁",
    };
    summary.push(`当前版本进一步强调“${tweakLabels[left.tweakKey]}”这条方向，提案表达更有明确取舍。`);
  }

  const leftPositioning = left.positioning || "";
  const rightPositioning = right.positioning || "";

  if (leftPositioning.includes("入口") && !rightPositioning.includes("入口")) {
    summary.push("本版更偏入口识别与首界面判断，适合强调到达感和第一印象。");
  } else if (leftPositioning.includes("合影") || leftPositioning.includes("打卡")) {
    summary.push("本版更偏合影打卡和传播停留，适合在甲方沟通中强调社交传播价值。");
  } else if (leftPositioning.includes("在地") || leftPositioning.includes("乡村")) {
    summary.push("本版更强调在地气质与空间归属感，适合突出乡村更新或公共空间属性。");
  }

  if (!summary.length) {
    summary.push("两版都围绕同一项目目标展开，但当前版本在模板路径和表达重心上更明确，适合拿来做方向比较。");
  }

  return summary.slice(0, 4);
}
