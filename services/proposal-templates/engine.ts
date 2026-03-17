import {
  ProposalAdjustmentKey,
  ProposalGenerateRequest,
  ProposalRecord,
  ProposalRefineRequest,
  ProposalSubtemplate,
  ProposalSubtemplateKey,
  ProposalSummaryDraft,
  ProposalTemplateRecommendation,
  ProposalTemplateSelectionInput,
  ProposalTemplateSelectionMode,
  ProposalTemplate,
  ProposalTemplateKey,
} from "@/types/proposal";
import {
  proposalSubtemplateMap,
  proposalSubtemplateRouting,
  proposalSubtemplatesByTemplate,
  proposalTemplateMap,
  proposalTemplateRouting,
  proposalTemplates,
} from "@/services/proposal-templates/library";

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function computeScore(scene: string, style: string, theme: string, routing: { scene: string[]; style: string[]; theme: string[] }) {
  return (includesAny(scene, routing.scene) ? 3 : 0) + (includesAny(style, routing.style) ? 3 : 0) + (includesAny(theme, routing.theme) ? 2 : 0);
}

function collectMatchedDimensions(
  scene: string,
  style: string,
  theme: string,
  routing: { scene: string[]; style: string[]; theme: string[] },
) {
  return {
    sceneMatches: routing.scene.filter((keyword) => scene.includes(keyword)),
    styleMatches: routing.style.filter((keyword) => style.includes(keyword)),
    themeMatches: routing.theme.filter((keyword) => theme.includes(keyword)),
  };
}

function buildRecommendationReasons(
  template: ProposalTemplate,
  subtemplate: ProposalSubtemplate | null,
  scene: string,
  style: string,
  theme: string,
) {
  const templateMatches = collectMatchedDimensions(scene, style, theme, proposalTemplateRouting[template.key]);
  const subtemplateMatches = subtemplate
    ? collectMatchedDimensions(scene, style, theme, proposalSubtemplateRouting[subtemplate.key])
    : null;
  const reasons: string[] = [];

  if (templateMatches.sceneMatches.length) {
    reasons.push(`场景字段命中“${templateMatches.sceneMatches.join(" / ")}”，更贴近${template.name}的使用场景。`);
  }

  if (templateMatches.styleMatches.length) {
    reasons.push(`风格字段命中“${templateMatches.styleMatches.join(" / ")}”，与${template.name}的视觉策略更一致。`);
  }

  if (templateMatches.themeMatches.length) {
    reasons.push(`主题字段命中“${templateMatches.themeMatches.join(" / ")}”，更容易形成${template.name}的提案表达。`);
  }

  if (subtemplate && subtemplateMatches) {
    const subtemplateKeywords = [
      ...subtemplateMatches.sceneMatches,
      ...subtemplateMatches.styleMatches,
      ...subtemplateMatches.themeMatches,
    ];

    if (subtemplateKeywords.length) {
      reasons.push(`子模板推荐为“${subtemplate.name}”，因为输入内容更接近“${subtemplateKeywords.join(" / ")}”对应的场景档位。`);
    } else {
      reasons.push(`子模板推荐为“${subtemplate.name}”，因为它更适合当前${template.name}下的提案落点。`);
    }
  }

  if (!reasons.length) {
    reasons.push(`当前输入未出现强指向字段，系统按${template.name}的基础适配度给出默认推荐。`);
  }

  return reasons;
}

function getTemplateSelectionMode(selection?: ProposalTemplateSelectionInput): ProposalTemplateSelectionMode {
  return selection?.mode === "manual" && selection.templateKey ? "manual" : "auto";
}

export function resolveProposalTemplate(
  source:
    | ProposalGenerateRequest["input"]
    | ProposalRecord["formValues"]
    | { scene: string; style: string; theme: string },
): ProposalTemplate {
  const scene = source.scene || "";
  const style = source.style || "";
  const theme = source.theme || "";

  let bestKey: ProposalTemplateKey = "cultural-tourism-checkin";
  let bestScore = -1;

  for (const template of proposalTemplates) {
    const score = computeScore(scene, style, theme, proposalTemplateRouting[template.key]);

    if (score > bestScore) {
      bestKey = template.key;
      bestScore = score;
    }
  }

  return proposalTemplateMap[bestKey];
}

export function resolveProposalSubtemplate(
  templateKey: ProposalTemplateKey,
  source:
    | ProposalGenerateRequest["input"]
    | ProposalRecord["formValues"]
    | { scene: string; style: string; theme: string },
): ProposalSubtemplate | null {
  const scene = source.scene || "";
  const style = source.style || "";
  const theme = source.theme || "";

  const candidates = proposalSubtemplatesByTemplate[templateKey] || [];

  if (!candidates.length) {
    return null;
  }

  let bestKey: ProposalSubtemplateKey | null = null;
  let bestScore = 0;

  for (const subtemplate of candidates) {
    const score = computeScore(scene, style, theme, proposalSubtemplateRouting[subtemplate.key]);

    if (score > bestScore) {
      bestKey = subtemplate.key;
      bestScore = score;
    }
  }

  return bestKey ? proposalSubtemplateMap[bestKey] : null;
}

function resolveManualTemplate(selection?: ProposalTemplateSelectionInput) {
  if (!selection?.templateKey) {
    return null;
  }

  return proposalTemplateMap[selection.templateKey] || null;
}

function resolveManualSubtemplate(templateKey: ProposalTemplateKey, selection?: ProposalTemplateSelectionInput) {
  if (!selection?.subtemplateKey) {
    return null;
  }

  const subtemplate = proposalSubtemplateMap[selection.subtemplateKey];
  return subtemplate && subtemplate.parentKey === templateKey ? subtemplate : null;
}

export function getTemplateSelectionCatalog() {
  return proposalTemplates.map((template) => ({
    key: template.key,
    name: template.name,
    applicableScenes: template.applicableScenes,
    subtemplates: (proposalSubtemplatesByTemplate[template.key] || []).map((subtemplate) => ({
      key: subtemplate.key,
      name: subtemplate.name,
      applicableScenes: subtemplate.applicableScenes,
    })),
  }));
}

export function getRecommendedTemplateSelection(
  source:
    | ProposalGenerateRequest["input"]
    | ProposalRecord["formValues"]
    | { scene: string; style: string; theme: string },
): ProposalTemplateRecommendation {
  const scene = source.scene || "";
  const style = source.style || "";
  const theme = source.theme || "";
  const template = resolveProposalTemplate(source);
  const subtemplate = resolveProposalSubtemplate(template.key, source);

  return {
    templateKey: template.key,
    templateName: template.name,
    subtemplateKey: subtemplate?.key,
    subtemplateName: subtemplate?.name,
    reasons: buildRecommendationReasons(template, subtemplate, scene, style, theme),
  };
}

export function resolveTemplateProfile(
  source:
    | ProposalGenerateRequest["input"]
    | ProposalRecord["formValues"]
    | { scene: string; style: string; theme: string },
  selection?: ProposalTemplateSelectionInput,
) {
  const recommendation = getRecommendedTemplateSelection(source);
  const selectionMode = getTemplateSelectionMode(selection);
  const manualTemplate = selectionMode === "manual" ? resolveManualTemplate(selection) : null;
  const template = manualTemplate || proposalTemplateMap[recommendation.templateKey];
  const recommendedSubtemplate = recommendation.subtemplateKey ? proposalSubtemplateMap[recommendation.subtemplateKey] : null;
  const manualSubtemplate = selectionMode === "manual" ? resolveManualSubtemplate(template.key, selection) : null;
  const subtemplate = manualSubtemplate || (template.key === recommendation.templateKey ? recommendedSubtemplate : resolveProposalSubtemplate(template.key, source));

  return {
    template,
    subtemplate,
    recommendation,
    selectionMode,
    isManualSelection: selectionMode === "manual",
    profileName: subtemplate ? `${template.name} / ${subtemplate.name}` : template.name,
  };
}

function getCurrentVersion(record: ProposalRecord) {
  return record.versions.find((item) => item.id === record.activeVersionId) || record.versions[record.versions.length - 1];
}

function getRefineRules(template: ProposalTemplate, subtemplate: ProposalSubtemplate | null, tweakKey: ProposalAdjustmentKey) {
  return [...template.refinePromptRules[tweakKey], ...(subtemplate?.refinePromptRules[tweakKey] || [])].join(" ");
}

function getMergedList(templateList: string[], subtemplateList?: string[]) {
  return [...templateList, ...(subtemplateList || [])];
}

function getSummaryRules(template: ProposalTemplate, subtemplate: ProposalSubtemplate | null) {
  return getMergedList(template.summaryPromptRules, subtemplate?.summaryPromptRules);
}

function getNegativeConstraints(template: ProposalTemplate, subtemplate: ProposalSubtemplate | null) {
  return getMergedList(template.negativeConstraints, subtemplate?.negativeConstraints);
}

export function buildGenerateImagePrompt(
  input: ProposalGenerateRequest["input"],
  template: ProposalTemplate,
  subtemplate: ProposalSubtemplate | null,
) {
  return [
    "你是墙绘提案效果图生成助手。",
    "请生成一张适合甲方提案展示的墙绘效果图初稿。",
    `主模板：${template.name}`,
    subtemplate ? `子模板：${subtemplate.name}` : "",
    `设计目标：${getMergedList(template.designGoals, subtemplate?.designGoals).join("；")}`,
    `主视觉策略：${getMergedList(template.visualStrategy, subtemplate?.visualStrategy).join("；")}`,
    `画面结构策略：${getMergedList(template.compositionStrategy, subtemplate?.compositionStrategy).join("；")}`,
    `色彩策略：${getMergedList(template.colorStrategy, subtemplate?.colorStrategy).join("；")}`,
    `图像提示词规则：${getMergedList(template.imagePromptRules, subtemplate?.imagePromptRules).join("；")}`,
    `常见禁忌：${getMergedList(template.pitfalls, subtemplate?.pitfalls).join("；")}`,
    `负面约束：${getNegativeConstraints(template, subtemplate).join("；")}`,
    `项目名称：${input.projectName}`,
    `主题方向：${input.theme}`,
    `风格字段：${input.style}`,
    `色彩字段：${input.colors}`,
    `应用场景字段：${input.scene}`,
    `补充说明：${input.notes || "无"}`,
    "画面要求：专业、克制、高级，适合墙绘公司向甲方提案。",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildGenerateSummaryPrompt(
  input: ProposalGenerateRequest["input"],
  template: ProposalTemplate,
  subtemplate: ProposalSubtemplate | null,
) {
  return [
    "请以专业墙绘提案语气，输出一份 JSON。",
    "内容用于甲方沟通，语言必须简洁、专业、可成交，不要 AI 套话。",
    `主模板：${template.name}`,
    subtemplate ? `子模板：${subtemplate.name}` : "",
    `文案语气规则：${getMergedList(template.copyToneRules, subtemplate?.copyToneRules).join("；")}`,
    `摘要提示词规则：${getSummaryRules(template, subtemplate).join("；")}`,
    `设计目标：${getMergedList(template.designGoals, subtemplate?.designGoals).join("；")}`,
    `主视觉策略：${getMergedList(template.visualStrategy, subtemplate?.visualStrategy).join("；")}`,
    `构图策略：${getMergedList(template.compositionStrategy, subtemplate?.compositionStrategy).join("；")}`,
    `色彩策略：${getMergedList(template.colorStrategy, subtemplate?.colorStrategy).join("；")}`,
    `施工落地提醒：${getMergedList(template.constructionReminders, subtemplate?.constructionReminders).join("；")}`,
    `负面约束：${getNegativeConstraints(template, subtemplate).join("；")}`,
    `项目名称：${input.projectName}`,
    `主题方向：${input.theme}`,
    `风格字段：${input.style}`,
    `色彩字段：${input.colors}`,
    `应用场景字段：${input.scene}`,
    `补充说明：${input.notes || "无"}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildRefineImagePrompt(
  request: ProposalRefineRequest,
  template: ProposalTemplate,
  subtemplate: ProposalSubtemplate | null,
) {
  const currentVersion = getCurrentVersion(request.record);

  return [
    "你正在编辑一张墙绘提案效果图，请在保留空间结构与主题方向的前提下做定向微调。",
    `主模板：${template.name}`,
    subtemplate ? `子模板：${subtemplate.name}` : "",
    `设计目标：${getMergedList(template.designGoals, subtemplate?.designGoals).join("；")}`,
    `主视觉策略：${getMergedList(template.visualStrategy, subtemplate?.visualStrategy).join("；")}`,
    `构图策略：${getMergedList(template.compositionStrategy, subtemplate?.compositionStrategy).join("；")}`,
    `色彩策略：${getMergedList(template.colorStrategy, subtemplate?.colorStrategy).join("；")}`,
    `微调规则：${getRefineRules(template, subtemplate, request.tweakKey)}`,
    `项目名称：${request.record.formValues.projectName}`,
    `主题方向：${request.record.formValues.theme}`,
    `应用场景：${request.record.formValues.scene}`,
    `当前方案摘要：${currentVersion?.summary || request.record.summary}`,
    `当前方案定位：${currentVersion?.positioning || request.record.positioning}`,
    `补充说明：${request.record.formValues.notes || "无"}`,
    `常见禁忌：${getMergedList(template.pitfalls, subtemplate?.pitfalls).join("；")}`,
    `负面约束：${getNegativeConstraints(template, subtemplate).join("；")}`,
    "编辑要求：保持建筑关系稳定，不做无关重构，不改变项目用途。",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildRefineSummaryPrompt(
  request: ProposalRefineRequest,
  template: ProposalTemplate,
  subtemplate: ProposalSubtemplate | null,
) {
  const currentVersion = getCurrentVersion(request.record);

  return [
    "请以专业墙绘提案语气，输出一份 JSON。",
    "当前任务不是从零重写提案，而是基于现有方案做定向微调。",
    `主模板：${template.name}`,
    subtemplate ? `子模板：${subtemplate.name}` : "",
    `文案语气规则：${getMergedList(template.copyToneRules, subtemplate?.copyToneRules).join("；")}`,
    `摘要提示词规则：${getSummaryRules(template, subtemplate).join("；")}`,
    `施工落地提醒：${getMergedList(template.constructionReminders, subtemplate?.constructionReminders).join("；")}`,
    `微调规则：${getRefineRules(template, subtemplate, request.tweakKey)}`,
    `负面约束：${getNegativeConstraints(template, subtemplate).join("；")}`,
    `项目名称：${request.record.formValues.projectName}`,
    `主题方向：${request.record.formValues.theme}`,
    `应用场景：${request.record.formValues.scene}`,
    `当前方案标题：${currentVersion?.title || request.record.title}`,
    `当前方案摘要：${currentVersion?.summary || request.record.summary}`,
    `当前方案定位：${currentVersion?.positioning || request.record.positioning}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildTemplateAwareMockSummary(
  input: ProposalGenerateRequest["input"],
  template: ProposalTemplate,
  subtemplate: ProposalSubtemplate | null,
  tweakKey?: ProposalAdjustmentKey,
): ProposalSummaryDraft {
  const profileName = subtemplate ? `${template.name}${subtemplate.name}` : template.name;
  const tweakRule = tweakKey ? getRefineRules(template, subtemplate, tweakKey) : "";
  const summaryRule = getSummaryRules(template, subtemplate)[0];
  const negativeRule = getNegativeConstraints(template, subtemplate)[0];

  return {
    templateKey: template.key,
    title: tweakKey ? `${input.projectName || "墙绘项目"} · ${profileName}微调稿` : `${input.projectName || "墙绘项目"} · ${profileName}提案初稿`,
    summary: tweakKey
      ? `本轮微调延续${profileName}的提案路径，重点围绕${tweakRule}展开，并继续遵循${summaryRule}，使方案更贴合${input.scene}场景下的传播与落地需求。`
      : `本方案采用${profileName}路径，以${input.theme}为主叙事，围绕${getMergedList(template.designGoals, subtemplate?.designGoals)[0]}与${getMergedList(template.designGoals, subtemplate?.designGoals)[1]}建立首轮墙绘提案表达，并以${summaryRule}统一提案口径。`,
    positioning: `本方案定位为${input.scene}中的核心视觉界面，遵循${profileName}的表达路径，以${getMergedList(template.visualStrategy, subtemplate?.visualStrategy)[0]}和${getMergedList(template.compositionStrategy, subtemplate?.compositionStrategy)[0]}建立稳定的提案主轴，同时规避${negativeRule}。`,
    visualLogic: [
      `主视觉策略以${getMergedList(template.visualStrategy, subtemplate?.visualStrategy).join("、")}为核心，确保画面先建立记忆点，再展开细节层次。`,
      `结构上遵循${getMergedList(template.compositionStrategy, subtemplate?.compositionStrategy).join("、")}的关系，保证远观识别与近看细节并存。`,
      `色彩处理遵循${getMergedList(template.colorStrategy, subtemplate?.colorStrategy).join("、")}，使效果图更符合${profileName}的提案气质。`,
    ],
    interactionHighlights: [
      `互动亮点围绕${getMergedList(template.designGoals, subtemplate?.designGoals)[0]}展开，确保甲方能快速理解项目传播价值。`,
      tweakKey
        ? `本次微调重点体现为：${tweakRule}`
        : `结合${profileName}特征，建议在局部形成清晰的停留或识别点，增强项目可记忆性。`,
    ],
    executionAdvice: [
      `施工深化建议优先落实${getMergedList(template.constructionReminders, subtemplate?.constructionReminders)[0]}。`,
      `同时注意${getMergedList(template.constructionReminders, subtemplate?.constructionReminders)[1]}，避免效果图在落地阶段失真。`,
    ],
    tweakKey,
  };
}
