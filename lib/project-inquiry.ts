import {
  BudgetRangeOption,
  DeliveryTypeOption,
  DemandStageOption,
  InquirySource,
  ProjectInquiryFormValues,
  ProjectInquiryStatus,
  ProjectTypeOption,
} from "@/types/project-inquiry";

export const projectTypeOptions: ProjectTypeOption[] = ["文旅打卡", "乡村振兴", "商业街更新", "校园文化", "社区亲子", "其他"];

export const demandStageOptions: DemandStageOption[] = ["方向摸排", "内部预审", "首次汇报", "正式比稿", "落地深化"];

export const budgetRangeOptions: BudgetRangeOption[] = ["5千以内", "5千-2万", "2万-5万", "5万-10万", "10万以上", "暂未明确"];

export const deliveryTypeOptions: DeliveryTypeOption[] = ["AI 初稿", "AI 初稿 + 人工精修", "整套提案输出", "先沟通后判断"];

export const preparationNotes = [
  "建议准备 1 到 3 张原墙现场照片，尽量包含正视角、侧视角和周边环境关系。",
  "如果方便，补充墙面大致尺寸、可施工范围和现场遮挡信息，后续判断会更稳。",
  "请尽量说明主题方向、使用场景、参考风格或已有提案要求，便于快速对齐表达重点。",
  "如项目已经有预算区间、汇报节点或预计落地时间，也建议一并说明，方便判断适合的交付深度。",
];

export const inquirySourceLabels: Record<InquirySource, string> = {
  home: "首页提交",
  "case-study": "案例页提交",
  "proposal-export": "导出提案页提交",
  direct: "直接访问",
};

export const inquiryStatusLabels: Record<ProjectInquiryStatus, string> = {
  new: "新提交",
  contacted: "已联系",
  in_progress: "跟进中",
  completed: "已完成",
};

export const inquiryStatusOptions: ProjectInquiryStatus[] = ["new", "contacted", "in_progress", "completed"];

export const initialInquiryValues: ProjectInquiryFormValues = {
  contactName: "",
  contactInfo: "",
  projectName: "",
  projectType: "文旅打卡",
  projectLocation: "",
  demandStage: "方向摸排",
  budgetRange: "暂未明确",
  deliveryType: "先沟通后判断",
  notes: "",
  source: "direct",
};
