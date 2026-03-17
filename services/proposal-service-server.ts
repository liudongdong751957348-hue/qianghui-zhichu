import "server-only";

import { createId } from "@/lib/utils";
import { getDefaultMode, getDefaultProviderId, resolveProvider } from "@/services/proposal-providers/registry";
import { mockProposalProvider } from "@/services/proposal-providers/mock-provider";
import { ProviderOperationResult } from "@/services/proposal-providers/types";
import {
  ProposalGenerateRequest,
  ProposalRecord,
  ProposalRefineRequest,
  ProposalServiceError,
  ProposalServiceMeta,
  ProposalServiceResponse,
  ProposalVersion,
} from "@/types/proposal";

function createBaseMeta(
  modeRequested: ProposalGenerateRequest["mode"] | ProposalRefineRequest["mode"],
  providerRequested: ProposalGenerateRequest["provider"] | ProposalRefineRequest["provider"],
): ProposalServiceMeta {
  return {
    modeRequested: modeRequested || getDefaultMode(),
    modeResolved: modeRequested || getDefaultMode(),
    providerRequested: providerRequested || getDefaultProviderId(),
    providerResolved: providerRequested || getDefaultProviderId(),
    fallbackUsed: false,
    capabilities: [],
  };
}

function createErrorResponse(error: ProposalServiceError, meta: ProposalServiceMeta): ProposalServiceResponse {
  return {
    ok: false,
    data: null,
    error,
    meta,
  };
}

function createSuccessResponse(record: ProposalRecord, meta: ProposalServiceMeta): ProposalServiceResponse {
  return {
    ok: true,
    data: record,
    error: null,
    meta,
  };
}

function createLegacyVersion(record: ProposalRecord): ProposalVersion {
  return {
    id: record.activeVersionId || createId("legacy-version"),
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
  };
}

export async function summarizeProposal(
  request:
    | { kind: "generate"; request: ProposalGenerateRequest }
    | { kind: "refine"; request: ProposalRefineRequest },
) {
  const mode = request.kind === "generate" ? request.request.mode || getDefaultMode() : request.request.mode || getDefaultMode();
  const provider = resolveProvider(mode, request.request.provider);

  try {
    return await provider.summarize(request);
  } catch {
    return mockProposalProvider.summarize(request);
  }
}

export function normalizeProposalResult(
  operation: ProviderOperationResult,
  request: ProposalGenerateRequest | ProposalRefineRequest,
): ProposalRecord {
  if (!operation.ok) {
    throw new Error(operation.error.message);
  }

  const payload = operation.payload;

  const contextRecord = "record" in request ? request.record : request.contextRecord;

  if (contextRecord) {
    const currentRecord = contextRecord;
    return {
      ...currentRecord,
      latestGenerationSource: payload.generationSource || ("record" in request ? "refine" : request.generationSource || "initial"),
      latestTemplateSwitchSource: payload.templateSwitchSource || currentRecord.latestTemplateSwitchSource,
      templateSelectionMode: payload.templateSelectionMode || currentRecord.templateSelectionMode,
      recommendedTemplateKey: payload.recommendedTemplateKey || currentRecord.recommendedTemplateKey,
      recommendedTemplateName: payload.recommendedTemplateName || currentRecord.recommendedTemplateName,
      recommendedSubtemplateKey: payload.recommendedSubtemplateKey || currentRecord.recommendedSubtemplateKey,
      recommendedSubtemplateName: payload.recommendedSubtemplateName || currentRecord.recommendedSubtemplateName,
      templateRecommendationReasons:
        payload.templateRecommendationReasons?.length ? payload.templateRecommendationReasons : currentRecord.templateRecommendationReasons,
      templateKey: payload.templateKey || currentRecord.templateKey,
      templateName: payload.templateName || currentRecord.templateName,
      subtemplateKey: payload.subtemplateKey || currentRecord.subtemplateKey,
      subtemplateName: payload.subtemplateName || currentRecord.subtemplateName,
      coverImage: payload.coverImage || currentRecord.coverImage,
      generatedImage: payload.generatedImage || currentRecord.generatedImage,
      title: payload.summary.title,
      summary: payload.summary.summary,
      positioning: payload.summary.positioning,
      visualLogic: payload.summary.visualLogic,
      interactionHighlights: payload.summary.interactionHighlights,
      executionAdvice: payload.summary.executionAdvice,
      quickActions: payload.quickActions,
      activeVersionId: payload.version.id,
      versions: [
        ...(currentRecord.versions?.length ? currentRecord.versions : [createLegacyVersion(currentRecord)]),
        payload.version,
      ],
      formValues: currentRecord.formValues,
    };
  }

  if (!("input" in request)) {
    throw new Error("生成结果归一化缺少 input 上下文。");
  }

  return {
    id: createId(),
    createdAt: new Date().toISOString(),
    latestGenerationSource: payload.generationSource || ("input" in request ? request.generationSource || "initial" : "refine"),
    latestTemplateSwitchSource: payload.templateSwitchSource || ("input" in request ? request.templateSwitchSource : undefined),
    templateSelectionMode: payload.templateSelectionMode,
    recommendedTemplateKey: payload.recommendedTemplateKey,
    recommendedTemplateName: payload.recommendedTemplateName,
    recommendedSubtemplateKey: payload.recommendedSubtemplateKey,
    recommendedSubtemplateName: payload.recommendedSubtemplateName,
    templateRecommendationReasons: payload.templateRecommendationReasons,
    templateKey: payload.templateKey,
    templateName: payload.templateName,
    subtemplateKey: payload.subtemplateKey,
    subtemplateName: payload.subtemplateName,
    coverImage: payload.coverImage,
    generatedImage: payload.generatedImage,
    title: payload.summary.title,
    summary: payload.summary.summary,
    positioning: payload.summary.positioning,
    visualLogic: payload.summary.visualLogic,
    interactionHighlights: payload.summary.interactionHighlights,
    executionAdvice: payload.summary.executionAdvice,
    quickActions: payload.quickActions,
    activeVersionId: payload.version.id,
    versions: [payload.version],
    formValues: {
      projectName: request.input.projectName,
      theme: request.input.theme,
      style: request.input.style,
      colors: request.input.colors,
      scene: request.input.scene,
      notes: request.input.notes,
    },
  };
}

async function executeWithFallback(
  request: ProposalGenerateRequest | ProposalRefineRequest,
  operation: "generate" | "refine",
): Promise<ProposalServiceResponse> {
  const meta = createBaseMeta(request.mode, request.provider);
  const requestedMode = request.mode || getDefaultMode();
  const provider = resolveProvider(requestedMode, request.provider);

  meta.modeResolved = requestedMode === "auto" ? (provider.id === "mock" ? "mock" : "real") : requestedMode;
  meta.providerResolved = provider.id;
  meta.capabilities = provider.capabilities;

  const response =
    operation === "generate"
      ? await provider.generate(request as ProposalGenerateRequest)
      : await provider.refine(request as ProposalRefineRequest);

  if (response.ok) {
    return createSuccessResponse(normalizeProposalResult(response, request), meta);
  }

  const shouldFallback = request.fallbackToMock !== false && provider.id !== "mock" && response.error.recoverable;

  if (shouldFallback) {
    meta.fallbackUsed = true;
    meta.modeResolved = "mock";
    meta.providerResolved = mockProposalProvider.id;
    meta.capabilities = mockProposalProvider.capabilities;

    const fallbackResponse =
      operation === "generate"
        ? await mockProposalProvider.generate(request as ProposalGenerateRequest)
        : await mockProposalProvider.refine(request as ProposalRefineRequest);

    if (fallbackResponse.ok) {
      return createSuccessResponse(normalizeProposalResult(fallbackResponse, request), meta);
    }
  }

  return createErrorResponse(response.error, meta);
}

export async function generateProposal(request: ProposalGenerateRequest): Promise<ProposalServiceResponse> {
  return executeWithFallback(request, "generate");
}

export async function refineProposal(request: ProposalRefineRequest): Promise<ProposalServiceResponse> {
  return executeWithFallback(request, "refine");
}
