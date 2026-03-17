import { createId } from "@/lib/utils";
import {
  ProposalGenerateRequest,
  ProposalQuickAction,
  ProposalSummaryDraft,
  ProposalVersion,
} from "@/types/proposal";
import {
  ProposalProvider,
  ProviderOperationResult,
  ProviderProposalPayload,
} from "@/services/proposal-providers/types";
import {
  buildTemplateAwareMockSummary,
  resolveTemplateProfile,
} from "@/services/proposal-templates/engine";

const fallbackImage = "/placeholders/wall-demo-1.svg";
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const proposalQuickActions: ProposalQuickAction[] = [
  { key: "muted-colors", label: "整体色彩更克制" },
  { key: "stronger-checkin", label: "增强打卡点识别" },
  { key: "stronger-focal", label: "主视觉更突出" },
  { key: "rural-character", label: "更适合乡村气质" },
  { key: "commercial-spread", label: "更适合商业街传播" },
  { key: "reduce-clutter", label: "减少杂乱元素" },
];

function createVersion(label: string, summary: ProposalSummaryDraft, generatedImage?: string, coverImage?: string): ProposalVersion {
  return {
    id: createId("version"),
    label,
    createdAt: new Date().toISOString(),
    coverImage,
    generatedImage,
    title: summary.title,
    summary: summary.summary,
    positioning: summary.positioning,
    visualLogic: summary.visualLogic,
    interactionHighlights: summary.interactionHighlights,
    executionAdvice: summary.executionAdvice,
    sourceKind: summary.tweakKey ? "refine" : "initial",
    tweakKey: summary.tweakKey,
  };
}

function createPayload(
  request: ProposalGenerateRequest,
  summary: ProposalSummaryDraft,
  label: string,
  overrideSelection?: ProposalGenerateRequest["input"]["templateSelection"],
): ProviderProposalPayload {
  const input = request.input;
  const effectiveSelection = overrideSelection || input.templateSelection;
  const { template, subtemplate, recommendation, selectionMode } = resolveTemplateProfile(input, effectiveSelection);
  const generationSource = request.generationSource || "initial";
  const previewImage = input.referenceImage || fallbackImage;
  const version = createVersion(label, summary, previewImage, previewImage);

  version.sourceKind = generationSource;
  version.templateKey = template.key;
  version.templateName = template.name;
  version.subtemplateKey = subtemplate?.key;
  version.subtemplateName = subtemplate?.name;
  version.templateSwitchSource = request.templateSwitchSource;

  return {
    generationSource,
    templateSwitchSource: request.templateSwitchSource,
    templateSelectionMode: selectionMode,
    recommendedTemplateKey: recommendation.templateKey,
    recommendedTemplateName: recommendation.templateName,
    recommendedSubtemplateKey: recommendation.subtemplateKey,
    recommendedSubtemplateName: recommendation.subtemplateName,
    templateRecommendationReasons: recommendation.reasons,
    templateKey: template.key,
    templateName: template.name,
    subtemplateKey: subtemplate?.key,
    subtemplateName: subtemplate?.name,
    coverImage: previewImage,
    generatedImage: previewImage,
    summary,
    quickActions: proposalQuickActions,
    version,
  };
}

async function toSuccess(payload: ProviderProposalPayload, delay = 800): Promise<ProviderOperationResult> {
  await wait(delay);
  return { ok: true, payload };
}

export const mockProposalProvider: ProposalProvider = {
  id: "mock",
  label: "Mock Provider",
  capabilities: ["image-generation", "image-editing"],
  config: {},
  async generate(request) {
    const summary = await this.summarize({ kind: "generate", request });
    const { template, subtemplate } = resolveTemplateProfile(request.input, request.input.templateSelection);
    const label =
      request.generationSource === "template-switch"
        ? `切换至 ${template.name}${subtemplate ? ` / ${subtemplate.name}` : ""}`
        : "当前版本";
    return toSuccess(createPayload(request, summary, label), 900);
  },
  async refine(request) {
    const action = proposalQuickActions.find((item) => item.key === request.tweakKey);
    const summary = await this.summarize({ kind: "refine", request });
    return toSuccess(
      createPayload(
        {
          ...request,
          input: {
            ...request.record.formValues,
            referenceImage: request.record.coverImage,
          },
          generationSource: "initial",
        },
        summary,
        action ? action.label : "微调版本",
        {
          mode: request.record.templateSelectionMode || "auto",
          templateKey: request.record.templateKey,
          subtemplateKey: request.record.subtemplateKey,
        },
      ),
      800,
    );
  },
  async summarize({ kind, request }) {
    if (kind === "generate") {
      const { template, subtemplate } = resolveTemplateProfile(request.input, request.input.templateSelection);
      return buildTemplateAwareMockSummary(request.input, template, subtemplate);
    }

    const { template, subtemplate } = resolveTemplateProfile(request.record.formValues, {
      mode: request.record.templateSelectionMode || "auto",
      templateKey: request.record.templateKey,
      subtemplateKey: request.record.subtemplateKey,
    });
    return buildTemplateAwareMockSummary(
      {
        ...request.record.formValues,
        referenceImage: request.record.coverImage,
      },
      template,
      subtemplate,
      request.tweakKey,
    );
  },
};
