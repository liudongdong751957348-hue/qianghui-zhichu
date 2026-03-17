export type ProjectTypeOption =
  | "文旅打卡"
  | "乡村振兴"
  | "商业街更新"
  | "校园文化"
  | "社区亲子"
  | "其他";

export type DemandStageOption =
  | "方向摸排"
  | "内部预审"
  | "首次汇报"
  | "正式比稿"
  | "落地深化";

export type BudgetRangeOption =
  | "5千以内"
  | "5千-2万"
  | "2万-5万"
  | "5万-10万"
  | "10万以上"
  | "暂未明确";

export type DeliveryTypeOption =
  | "AI 初稿"
  | "AI 初稿 + 人工精修"
  | "整套提案输出"
  | "先沟通后判断";

export type InquirySource = "home" | "case-study" | "proposal-export" | "direct";
export type ProjectInquiryStatus = "new" | "contacted" | "in_progress" | "completed";

export type ProjectInquiryFormValues = {
  contactName: string;
  contactInfo: string;
  projectName: string;
  projectType: ProjectTypeOption;
  projectLocation: string;
  demandStage: DemandStageOption;
  budgetRange: BudgetRangeOption;
  deliveryType: DeliveryTypeOption;
  notes: string;
  source: InquirySource;
};

export type ProjectInquiryRecord = ProjectInquiryFormValues & {
  id: string;
  createdAt: string;
  updatedAt?: string;
  status: ProjectInquiryStatus;
  delivery: {
    storageSaved: true;
    notifications: ProjectInquiryNotificationResult[];
  };
};

export type ProjectInquiryNotificationResult = {
  channel: "email" | "feishu" | "wecom";
  ok: boolean;
  message: string;
};

export type ProjectInquirySubmitRequest = {
  input: ProjectInquiryFormValues;
};

export type ProjectInquiryStatusUpdateRequest = {
  status: ProjectInquiryStatus;
};

export type ProjectInquirySuccess = {
  ok: true;
  data: ProjectInquiryRecord;
  nextSteps: string[];
  delivery: ProjectInquiryRecord["delivery"];
};

export type ProjectInquiryFailure = {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};

export type ProjectInquiryResponse = ProjectInquirySuccess | ProjectInquiryFailure;

export type ProjectInquiryListResponse =
  | {
      ok: true;
      data: ProjectInquiryRecord[];
    }
  | ProjectInquiryFailure;

export type ProjectInquiryStatusUpdateResponse =
  | {
      ok: true;
      data: ProjectInquiryRecord;
    }
  | ProjectInquiryFailure;
