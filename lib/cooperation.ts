export type ServicePlan = {
  name: string;
  fitFor: string;
  includes: string[];
  stage: string;
  price: string;
};

export type TrialStep = {
  title: string;
  text: string;
};

export type ContactChannel = {
  label: string;
  value: string;
  note: string;
};

export const trialSteps: TrialStep[] = [
  {
    title: "先在线试用",
    text: "上传现场墙面照片并填写基础需求，先确认项目适不适合用墙绘直出做首轮提案。",
  },
  {
    title: "再看案例判断方向",
    text: "结合文旅、乡村、商业街案例，快速判断更适合走哪类模板和哪种提案节奏。",
  },
  {
    title: "确认合作方式",
    text: "如果需要继续推进，可按项目阶段选择 AI 初稿、人工精修或整套提案输出。",
  },
];

export const servicePlans: ServicePlan[] = [
  {
    name: "AI 初稿版",
    fitFor: "适合想先看方向、先开内部讨论的墙绘公司、项目方或策划团队。",
    includes: ["现场图转提案首稿", "模板推荐与基础摘要", "1 版主方向输出"],
    stage: "适合立项前期、方向摸排、内部预审阶段。",
    price: "¥199 起 / 项目",
  },
  {
    name: "AI 初稿 + 人工精修版",
    fitFor: "适合需要更稳汇报口径、希望提案更像正式沟通稿的团队。",
    includes: ["AI 首稿生成", "人工梳理标题与方案说明", "1-2 轮重点方向微调建议"],
    stage: "适合首轮甲方沟通、客户汇报、方案初筛阶段。",
    price: "¥899 起 / 项目",
  },
  {
    name: "提案整套版",
    fitFor: "适合需要完整提案稿、版本比较和对外汇报材料的正式项目。",
    includes: ["多方向提案输出", "版本对比与推荐结论", "导出提案页整理与汇报口径建议"],
    stage: "适合比稿、正式汇报、商务推进和项目确认阶段。",
    price: "¥2800 起 / 项目",
  },
];

export const contactChannels: ContactChannel[] = [
  {
    label: "项目提交入口",
    value: "统一提交表单",
    note: "首页、案例页和导出提案页都会进入同一个真实提交入口，便于统一留资。",
  },
  {
    label: "合作沟通方式",
    value: "提交回执编号继续对接",
    note: "提交后会形成正式回执编号，后续可继续接入邮箱、飞书或 CRM。",
  },
  {
    label: "响应说明",
    value: "适合试用与项目预沟通",
    note: "更适合先明确项目方向、预算阶段和需要的输出深度，再进入下一步合作。",
  },
];
