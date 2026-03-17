export type ProposalFormValues = {
  projectName: string;
  theme: string;
  style: string;
  colors: string;
  scene: string;
  notes: string;
};

export type ProposalInput = ProposalFormValues & {
  referenceImage?: string;
  templateSelection?: ProposalTemplateSelectionInput;
};

export type ProposalAdjustmentKey =
  | "muted-colors"
  | "stronger-checkin"
  | "stronger-focal"
  | "rural-character"
  | "commercial-spread"
  | "reduce-clutter";

export type ProposalQuickAction = {
  key: ProposalAdjustmentKey;
  label: string;
};

export type ProposalServiceMode = "mock" | "real" | "auto";

export type ProposalProviderId = "mock" | "external-adapter";

export type ProposalImageCapability = "image-generation" | "image-editing";

export type ProposalTemplateKey =
  | "rural-revitalization"
  | "cultural-tourism-checkin"
  | "commercial-youth"
  | "campus-culture"
  | "community-family"
  | "guochao-culture";

export type ProposalSubtemplateKey =
  | "tourism-entry-landmark"
  | "tourism-night-ambience"
  | "tourism-group-photo"
  | "tourism-wayfinding"
  | "rural-village-gateway"
  | "rural-folklore-culture"
  | "rural-industry-showcase"
  | "rural-memory-story";

export type ProposalSubtemplate = {
  key: ProposalSubtemplateKey;
  parentKey: ProposalTemplateKey;
  name: string;
  applicableScenes: string[];
  designGoals: string[];
  visualStrategy: string[];
  compositionStrategy: string[];
  colorStrategy: string[];
  imagePromptRules: string[];
  refinePromptRules: Record<ProposalAdjustmentKey, string[]>;
  copyToneRules: string[];
  summaryPromptRules: string[];
  pitfalls: string[];
  negativeConstraints: string[];
  constructionReminders: string[];
};

export type ProposalTemplateRecommendation = {
  templateKey: ProposalTemplateKey;
  templateName: string;
  subtemplateKey?: ProposalSubtemplateKey;
  subtemplateName?: string;
  reasons: string[];
};

export type ProposalTemplateSelectionMode = "auto" | "manual";

export type ProposalTemplateSelectionInput = {
  mode: ProposalTemplateSelectionMode;
  templateKey?: ProposalTemplateKey;
  subtemplateKey?: ProposalSubtemplateKey;
};

export type ProposalGenerationSourceKind = "initial" | "template-switch";

export type ProposalTemplateSwitchSource = {
  trigger: "result-template-switch";
  fromTemplateKey?: ProposalTemplateKey;
  fromTemplateName?: string;
  fromSubtemplateKey?: ProposalSubtemplateKey;
  fromSubtemplateName?: string;
};

export type ProposalTemplate = {
  key: ProposalTemplateKey;
  name: string;
  applicableScenes: string[];
  designGoals: string[];
  visualStrategy: string[];
  compositionStrategy: string[];
  colorStrategy: string[];
  imagePromptRules: string[];
  refinePromptRules: Record<ProposalAdjustmentKey, string[]>;
  copyToneRules: string[];
  summaryPromptRules: string[];
  pitfalls: string[];
  negativeConstraints: string[];
  constructionReminders: string[];
};

export type ProposalVersion = {
  id: string;
  label: string;
  createdAt: string;
  coverImage?: string;
  generatedImage?: string;
  title: string;
  summary: string;
  positioning: string;
  visualLogic: string[];
  interactionHighlights: string[];
  executionAdvice: string[];
  sourceKind?: ProposalGenerationSourceKind | "refine";
  templateKey?: ProposalTemplateKey;
  templateName?: string;
  subtemplateKey?: ProposalSubtemplateKey;
  subtemplateName?: string;
  templateSwitchSource?: ProposalTemplateSwitchSource;
  tweakKey?: ProposalAdjustmentKey;
};

export type ProposalRecord = {
  id: string;
  createdAt: string;
  latestGenerationSource?: ProposalGenerationSourceKind | "refine";
  latestTemplateSwitchSource?: ProposalTemplateSwitchSource;
  templateSelectionMode?: ProposalTemplateSelectionMode;
  recommendedTemplateKey?: ProposalTemplateKey;
  recommendedTemplateName?: string;
  recommendedSubtemplateKey?: ProposalSubtemplateKey;
  recommendedSubtemplateName?: string;
  templateRecommendationReasons?: string[];
  templateKey?: ProposalTemplateKey;
  templateName?: string;
  subtemplateKey?: ProposalSubtemplateKey;
  subtemplateName?: string;
  coverImage: string;
  generatedImage: string;
  title: string;
  summary: string;
  positioning: string;
  visualLogic: string[];
  interactionHighlights: string[];
  executionAdvice: string[];
  quickActions: ProposalQuickAction[];
  activeVersionId: string;
  versions: ProposalVersion[];
  formValues: ProposalFormValues;
};

export type ProposalSummaryDraft = {
  templateKey?: ProposalTemplateKey;
  title: string;
  summary: string;
  positioning: string;
  visualLogic: string[];
  interactionHighlights: string[];
  executionAdvice: string[];
  tweakKey?: ProposalAdjustmentKey;
};

export type ProposalGenerateRequest = {
  mode?: ProposalServiceMode;
  provider?: ProposalProviderId;
  fallbackToMock?: boolean;
  generationSource?: ProposalGenerationSourceKind;
  contextRecord?: ProposalRecord;
  templateSwitchSource?: ProposalTemplateSwitchSource;
  input: ProposalInput;
};

export type ProposalRefineRequest = {
  mode?: ProposalServiceMode;
  provider?: ProposalProviderId;
  fallbackToMock?: boolean;
  record: ProposalRecord;
  tweakKey: ProposalAdjustmentKey;
  imagePreference?: "current-generated" | "original-reference";
  allowRegenerate?: boolean;
};

export type ProposalServiceMeta = {
  modeRequested: ProposalServiceMode;
  modeResolved: ProposalServiceMode;
  providerRequested: ProposalProviderId;
  providerResolved: ProposalProviderId;
  fallbackUsed: boolean;
  capabilities: ProposalImageCapability[];
};

export type ProposalServiceError = {
  code: string;
  message: string;
  detail?: string;
  recoverable: boolean;
};

export type ProposalServiceSuccess = {
  ok: true;
  data: ProposalRecord;
  error: null;
  meta: ProposalServiceMeta;
};

export type ProposalServiceFailure = {
  ok: false;
  data: null;
  error: ProposalServiceError;
  meta: ProposalServiceMeta;
};

export type ProposalServiceResponse = ProposalServiceSuccess | ProposalServiceFailure;
