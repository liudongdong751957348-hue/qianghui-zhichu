import { createId } from "@/lib/utils";
import { mockProposalProvider, proposalQuickActions } from "@/services/proposal-providers/mock-provider";
import {
  buildGenerateImagePrompt,
  buildGenerateSummaryPrompt,
  buildRefineImagePrompt,
  buildRefineSummaryPrompt,
  resolveTemplateProfile,
} from "@/services/proposal-templates/engine";
import { ProposalProvider, ProviderOperationResult } from "@/services/proposal-providers/types";
import {
  ProposalGenerateRequest,
  ProposalRefineRequest,
  ProposalServiceError,
  ProposalSummaryDraft,
} from "@/types/proposal";
import { promises as fs } from "node:fs";
import path from "node:path";

function getConfig() {
  return {
    endpoint: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    apiKeyEnvVar: "OPENAI_API_KEY",
    model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1",
  };
}

function getSummaryModel() {
  return process.env.OPENAI_SUMMARY_MODEL || "gpt-5-mini";
}

function getEditModel() {
  return process.env.OPENAI_IMAGE_EDIT_MODEL || process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
}

function createProviderError(code: string, message: string, detail?: string, recoverable = true): ProposalServiceError {
  return {
    code,
    message,
    detail,
    recoverable,
  };
}

function getApiKey() {
  return process.env.OPENAI_API_KEY || "";
}

function isConfigured() {
  return Boolean(getApiKey());
}

function buildSummarySchema() {
  return {
    name: "proposal_summary",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        summary: { type: "string" },
        positioning: { type: "string" },
        visualLogic: { type: "array", items: { type: "string" } },
        interactionHighlights: { type: "array", items: { type: "string" } },
        executionAdvice: { type: "array", items: { type: "string" } },
      },
      required: ["title", "summary", "positioning", "visualLogic", "interactionHighlights", "executionAdvice"],
    },
  };
}

async function requestOpenAI<T>(pathName: string, body: Record<string, unknown>) {
  const response = await fetch(`${getConfig().endpoint}${pathName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as T & { error?: { message?: string } };

  if (!response.ok) {
    throw createProviderError("OPENAI_REQUEST_FAILED", "OpenAI 提案服务调用失败。", data.error?.message || `HTTP ${response.status}`);
  }

  return data;
}

async function requestOpenAIFormData<T>(pathName: string, formData: FormData) {
  const response = await fetch(`${getConfig().endpoint}${pathName}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: formData,
  });

  const data = (await response.json()) as T & { error?: { message?: string } };

  if (!response.ok) {
    throw createProviderError("OPENAI_REQUEST_FAILED", "OpenAI 提案服务调用失败。", data.error?.message || `HTTP ${response.status}`);
  }

  return data;
}

function getMimeAndBufferFromDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);

  if (!match) {
    throw createProviderError("INVALID_DATA_URL", "输入图片格式无法识别。", "仅支持 base64 data URL。");
  }

  return {
    mime: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

async function loadPublicAssetAsFile(assetPath: string) {
  const fullPath = path.join(process.cwd(), "public", assetPath.replace(/^\//, ""));
  const buffer = await fs.readFile(fullPath);
  const ext = path.extname(assetPath).toLowerCase();
  const mime =
    ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : ext === ".webp" ? "image/webp" : "";

  if (!mime) {
    throw createProviderError(
      "UNSUPPORTED_REFERENCE_IMAGE",
      "当前参考图格式不适合直接进入真实链路。",
      "真实图像能力仅支持 png、jpg、webp。当前资源建议先生成真实图后再微调。",
    );
  }

  return new File([buffer], `proposal${ext}`, { type: mime });
}

async function resolveEditableSourceImage(request: ProposalRefineRequest) {
  const preferred =
    request.imagePreference === "original-reference"
      ? [request.record.coverImage, request.record.generatedImage]
      : [request.record.generatedImage, request.record.coverImage];

  for (const candidate of preferred) {
    if (!candidate) {
      continue;
    }

    if (candidate.startsWith("data:image/")) {
      const { mime, buffer } = getMimeAndBufferFromDataUrl(candidate);

      if (!["image/png", "image/jpeg", "image/webp"].includes(mime)) {
        continue;
      }

      const extension = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
      return new File([buffer], `proposal-source.${extension}`, { type: mime });
    }

    if (candidate.startsWith("/")) {
      try {
        return await loadPublicAssetAsFile(candidate);
      } catch {
        continue;
      }
    }
  }

  throw createProviderError(
    "NO_EDITABLE_IMAGE_SOURCE",
    "当前方案没有可用于真实图像编辑的输入图片。",
    "建议先完成一次真实生成，或上传 png/jpg/webp 现场图后再做真实微调。",
  );
}

async function generateImage(request: ProposalGenerateRequest) {
  const { template, subtemplate } = resolveTemplateProfile(request.input, request.input.templateSelection);
  const data = await requestOpenAI<{ data?: Array<{ b64_json?: string }> }>("/images/generations", {
    model: getConfig().model,
    prompt: buildGenerateImagePrompt(request.input, template, subtemplate),
    size: process.env.OPENAI_IMAGE_SIZE || "1536x1024",
    quality: process.env.OPENAI_IMAGE_QUALITY || "medium",
  });

  const base64 = data.data?.[0]?.b64_json;

  if (!base64) {
    throw createProviderError("OPENAI_IMAGE_EMPTY", "OpenAI 已返回成功状态，但未生成可用图片。", "未在 Images API 返回中找到 b64_json。");
  }

  return `data:image/png;base64,${base64}`;
}

async function editImage(request: ProposalRefineRequest) {
  const { template, subtemplate } = resolveTemplateProfile(request.record.formValues, {
    mode: request.record.templateSelectionMode || "auto",
    templateKey: request.record.templateKey,
    subtemplateKey: request.record.subtemplateKey,
  });
  const sourceImage = await resolveEditableSourceImage(request);
  const formData = new FormData();
  formData.append("model", getEditModel());
  formData.append("image", sourceImage);
  formData.append("prompt", buildRefineImagePrompt(request, template, subtemplate));
  formData.append("size", process.env.OPENAI_IMAGE_SIZE || "1536x1024");
  formData.append("quality", process.env.OPENAI_IMAGE_QUALITY || "medium");
  formData.append("input_fidelity", process.env.OPENAI_IMAGE_INPUT_FIDELITY || "high");

  const data = await requestOpenAIFormData<{ data?: Array<{ b64_json?: string }> }>("/images/edits", formData);
  const base64 = data.data?.[0]?.b64_json;

  if (!base64) {
    throw createProviderError("OPENAI_EDIT_EMPTY", "OpenAI 已返回成功状态，但未生成可用编辑结果。", "未在 Images Edits 返回中找到 b64_json。");
  }

  return `data:image/png;base64,${base64}`;
}

async function summarizeGenerateRequest(request: ProposalGenerateRequest): Promise<ProposalSummaryDraft> {
  const { template, subtemplate } = resolveTemplateProfile(request.input, request.input.templateSelection);
  const data = await requestOpenAI<{ output_text?: string }>("/responses", {
    model: getSummaryModel(),
    input: buildGenerateSummaryPrompt(request.input, template, subtemplate),
    text: {
      format: {
        type: "json_schema",
        json_schema: buildSummarySchema(),
      },
    },
  });

  if (!data.output_text) {
    throw createProviderError("OPENAI_SUMMARY_EMPTY", "摘要生成成功状态异常，未返回可解析文本。", "Responses API 未返回 output_text。");
  }

  return {
    ...(JSON.parse(data.output_text) as ProposalSummaryDraft),
    templateKey: template.key,
  };
}

async function summarizeRefineRequest(request: ProposalRefineRequest): Promise<ProposalSummaryDraft> {
  const { template, subtemplate } = resolveTemplateProfile(request.record.formValues, {
    mode: request.record.templateSelectionMode || "auto",
    templateKey: request.record.templateKey,
    subtemplateKey: request.record.subtemplateKey,
  });
  const data = await requestOpenAI<{ output_text?: string }>("/responses", {
    model: getSummaryModel(),
    input: buildRefineSummaryPrompt(request, template, subtemplate),
    text: {
      format: {
        type: "json_schema",
        json_schema: buildSummarySchema(),
      },
    },
  });

  if (!data.output_text) {
    throw createProviderError("OPENAI_SUMMARY_EMPTY", "微调摘要生成成功状态异常，未返回可解析文本。", "Responses API 未返回 output_text。");
  }

  return {
    ...(JSON.parse(data.output_text) as ProposalSummaryDraft),
    templateKey: template.key,
    tweakKey: request.tweakKey,
  };
}

async function generateWithOpenAI(request: ProposalGenerateRequest): Promise<ProviderOperationResult> {
  const { template, subtemplate, recommendation, selectionMode } = resolveTemplateProfile(
    request.input,
    request.input.templateSelection,
  );

  if (!isConfigured()) {
    return {
      ok: false,
      error: createProviderError(
        "PROVIDER_NOT_CONFIGURED",
        "未检测到 OpenAI 服务配置，当前无法调用真实图像生成能力。",
        "请配置 OPENAI_API_KEY，并按需配置 OPENAI_IMAGE_MODEL 与 OPENAI_SUMMARY_MODEL。",
      ),
    };
  }

  let summary: ProposalSummaryDraft;
  let generatedImage: string;

  try {
    generatedImage = await generateImage(request);
  } catch (error) {
    const providerError = error as ProposalServiceError;
    return {
      ok: false,
      error: providerError.code ? providerError : createProviderError("OPENAI_IMAGE_FAILED", "真实图片生成失败，已准备回退到 mock。"),
    };
  }

  try {
    summary = await summarizeGenerateRequest(request);
  } catch {
    summary = await mockProposalProvider.summarize({ kind: "generate", request });
  }

  const versionLabel =
    request.generationSource === "template-switch"
      ? `切换至 ${template.name}${subtemplate ? ` / ${subtemplate.name}` : ""}`
      : "当前版本";

  return {
    ok: true,
    payload: {
      generationSource: request.generationSource || "initial",
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
      coverImage: request.input.referenceImage || generatedImage,
      generatedImage,
      summary,
      quickActions: proposalQuickActions,
      version: {
        id: createId("version"),
        label: versionLabel,
        createdAt: new Date().toISOString(),
        coverImage: request.input.referenceImage || generatedImage,
        generatedImage,
        title: summary.title,
        summary: summary.summary,
        positioning: summary.positioning,
        visualLogic: summary.visualLogic,
        interactionHighlights: summary.interactionHighlights,
        executionAdvice: summary.executionAdvice,
        sourceKind: request.generationSource || "initial",
        templateKey: template.key,
        templateName: template.name,
        subtemplateKey: subtemplate?.key,
        subtemplateName: subtemplate?.name,
        templateSwitchSource: request.templateSwitchSource,
      },
    },
  };
}

async function refineWithOpenAI(request: ProposalRefineRequest): Promise<ProviderOperationResult> {
  const { template, subtemplate } = resolveTemplateProfile(request.record.formValues, {
    mode: request.record.templateSelectionMode || "auto",
    templateKey: request.record.templateKey,
    subtemplateKey: request.record.subtemplateKey,
  });

  if (!isConfigured()) {
    return {
      ok: false,
      error: createProviderError(
        "PROVIDER_NOT_CONFIGURED",
        "未检测到 OpenAI 服务配置，当前无法调用真实图像编辑能力。",
        "请配置 OPENAI_API_KEY，并按需配置 OPENAI_IMAGE_EDIT_MODEL 与 OPENAI_SUMMARY_MODEL。",
      ),
    };
  }

  let editedImage: string;
  let summary: ProposalSummaryDraft;

  try {
    editedImage = await editImage(request);
  } catch (error) {
    const providerError = error as ProposalServiceError;
    return {
      ok: false,
      error: providerError.code ? providerError : createProviderError("OPENAI_IMAGE_EDIT_FAILED", "真实图片编辑失败，已准备回退到 mock。"),
    };
  }

  try {
    summary = await summarizeRefineRequest(request);
  } catch {
    summary = await mockProposalProvider.summarize({ kind: "refine", request });
  }

  const label = proposalQuickActions.find((item) => item.key === request.tweakKey)?.label || "微调版本";

  return {
    ok: true,
    payload: {
      templateSelectionMode: request.record.templateSelectionMode || "auto",
      recommendedTemplateKey: request.record.recommendedTemplateKey || template.key,
      recommendedTemplateName: request.record.recommendedTemplateName || template.name,
      recommendedSubtemplateKey: request.record.recommendedSubtemplateKey || undefined,
      recommendedSubtemplateName: request.record.recommendedSubtemplateName || undefined,
      templateRecommendationReasons: request.record.templateRecommendationReasons || [],
      templateKey: template.key,
      templateName: template.name,
      subtemplateKey: subtemplate?.key,
      subtemplateName: subtemplate?.name,
      coverImage: request.record.coverImage,
      generatedImage: editedImage,
      summary,
      quickActions: proposalQuickActions,
      version: {
        id: createId("version"),
        label,
        createdAt: new Date().toISOString(),
        coverImage: request.record.coverImage,
        generatedImage: editedImage,
        title: summary.title,
        summary: summary.summary,
        positioning: summary.positioning,
        visualLogic: summary.visualLogic,
        interactionHighlights: summary.interactionHighlights,
        executionAdvice: summary.executionAdvice,
        sourceKind: "refine",
        templateKey: template.key,
        templateName: template.name,
        subtemplateKey: subtemplate?.key,
        subtemplateName: subtemplate?.name,
        tweakKey: request.tweakKey,
      },
    },
  };
}

export const realProposalProvider: ProposalProvider = {
  id: "external-adapter",
  label: "OpenAI Adapter",
  capabilities: ["image-generation", "image-editing"],
  config: getConfig(),
  async generate(request) {
    return generateWithOpenAI(request);
  },
  async refine(request) {
    return refineWithOpenAI(request);
  },
  async summarize({ kind, request }) {
    if (kind === "generate") {
      return summarizeGenerateRequest(request);
    }

    return summarizeRefineRequest(request);
  },
};
