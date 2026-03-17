import {
  ProposalGenerateRequest,
  ProposalGenerationSourceKind,
  ProposalImageCapability,
  ProposalProviderId,
  ProposalQuickAction,
  ProposalRefineRequest,
  ProposalServiceError,
  ProposalTemplateSelectionMode,
  ProposalTemplateSwitchSource,
  ProposalSubtemplateKey,
  ProposalSummaryDraft,
  ProposalTemplateKey,
  ProposalVersion,
} from "@/types/proposal";

export type ProviderProposalPayload = {
  generationSource?: ProposalGenerationSourceKind;
  templateSwitchSource?: ProposalTemplateSwitchSource;
  templateSelectionMode: ProposalTemplateSelectionMode;
  recommendedTemplateKey: ProposalTemplateKey;
  recommendedTemplateName: string;
  recommendedSubtemplateKey?: ProposalSubtemplateKey;
  recommendedSubtemplateName?: string;
  templateRecommendationReasons: string[];
  templateKey: ProposalTemplateKey;
  templateName: string;
  subtemplateKey?: ProposalSubtemplateKey;
  subtemplateName?: string;
  coverImage: string;
  generatedImage: string;
  summary: ProposalSummaryDraft;
  quickActions: ProposalQuickAction[];
  version: ProposalVersion;
};

export type ProviderOperationSuccess = {
  ok: true;
  payload: ProviderProposalPayload;
};

export type ProviderOperationFailure = {
  ok: false;
  error: ProposalServiceError;
};

export type ProviderOperationResult = ProviderOperationSuccess | ProviderOperationFailure;

export type ProposalProviderConfig = {
  endpoint?: string;
  apiKeyEnvVar?: string;
  model?: string;
};

export type ProposalProvider = {
  id: ProposalProviderId;
  label: string;
  capabilities: ProposalImageCapability[];
  config: ProposalProviderConfig;
  generate: (request: ProposalGenerateRequest) => Promise<ProviderOperationResult>;
  refine: (request: ProposalRefineRequest) => Promise<ProviderOperationResult>;
  summarize: (
    request:
      | { kind: "generate"; request: ProposalGenerateRequest }
      | { kind: "refine"; request: ProposalRefineRequest },
  ) => Promise<ProposalSummaryDraft>;
};
