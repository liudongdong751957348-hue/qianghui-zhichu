import {
  ProposalAdjustmentKey,
  ProposalSubtemplate,
  ProposalSubtemplateKey,
  ProposalTemplate,
  ProposalTemplateKey,
} from "@/types/proposal";

type RouteKeywords = {
  scene: string[];
  style: string[];
  theme: string[];
};

type TemplateSeed = Omit<ProposalTemplate, "refinePromptRules" | "summaryPromptRules" | "negativeConstraints"> & {
  routeKeywords: RouteKeywords;
  refinePromptRules: Partial<Record<ProposalAdjustmentKey, string[]>>;
  summaryPromptRules?: string[];
  negativeConstraints?: string[];
};

type SubtemplateSeed = Omit<ProposalSubtemplate, "refinePromptRules" | "summaryPromptRules" | "negativeConstraints"> & {
  routeKeywords: RouteKeywords;
  refinePromptRules: Partial<Record<ProposalAdjustmentKey, string[]>>;
  summaryPromptRules?: string[];
  negativeConstraints?: string[];
};

const baseRefineRules: Record<ProposalAdjustmentKey, string[]> = {
  "muted-colors": ["收束高饱和区域和辅助色，让完成面更耐看、更克制。"],
  "stronger-checkin": ["强化可停留拍照点和单一传播焦点，提升项目记忆点。"],
  "stronger-focal": ["突出主视觉主体，压低次级元素干扰，提升第一眼识别。"],
  "rural-character": ["增强自然感、在地感和公共空间的亲和气质。"],
  "commercial-spread": ["提升远距可见度、街区传播效率和品牌外显完整度。"],
  "reduce-clutter": ["删减噪音元素和重复装饰，让构图更整洁有秩序。"],
};

const templateSeeds: TemplateSeed[] = [
  {
    key: "rural-revitalization",
    name: "乡村振兴型",
    routeKeywords: {
      scene: ["乡村", "村", "民宿", "庭院"],
      style: ["乡村振兴", "自然生态"],
      theme: ["在地", "丰收", "乡土", "田园"],
    },
    applicableScenes: ["乡村公共空间", "村口形象墙", "民宿围墙", "乡村导览界面"],
    designGoals: ["建立在地识别", "提升公共空间亲和力", "兼顾传播和长期耐看度"],
    visualStrategy: ["强调乡土符号与自然肌理", "保留质朴而清晰的主视觉", "避免过度商业化"],
    compositionStrategy: ["画面舒展有呼吸感", "主次关系明确", "优先大面秩序而非碎片细节"],
    colorStrategy: ["土地色、植物色、木质色为主", "控制高饱和对比", "强调环境融合感"],
    imagePromptRules: ["突出乡村公共空间的人情味和在地文化", "避免廉价乡村旅游风"],
    copyToneRules: ["语气克制务实", "强调公共价值与在地气质", "避免夸张营销语气"],
    summaryPromptRules: ["标题先给空间角色判断，再给主题方向", "定位强调在地识别、公共性和长期耐看度"],
    pitfalls: ["避免元素堆砌", "避免过强商业街视觉", "避免空泛怀旧叙事"],
    negativeConstraints: ["避免低幼插画感", "避免像景区门头广告牌", "避免脱离真实墙体比例的漂浮构图"],
    constructionReminders: ["优先考虑耐候材料和维护便利", "提前核对墙体基层和实际施工条件"],
    refinePromptRules: {
      "stronger-checkin": ["打卡点应融入乡村语境，不做过强网红装置感。"],
      "commercial-spread": ["即使强化传播，也要保留乡村更新的温度和在地质感。"],
    },
  },
  {
    key: "cultural-tourism-checkin",
    name: "文旅打卡型",
    routeKeywords: {
      scene: ["文旅", "景区", "打卡"],
      style: ["国潮文旅", "新中式"],
      theme: ["夜游", "文旅", "打卡", "地标"],
    },
    applicableScenes: ["文旅街区外立面", "景区打卡点", "夜游动线界面", "游客集散区"],
    designGoals: ["提升传播效率", "强化项目记忆点", "兼顾白天与夜间识别"],
    visualStrategy: ["建立鲜明主符号", "设置清晰打卡焦点", "适配镜头传播"],
    compositionStrategy: ["单焦点优先", "预留标准拍照位", "前后层次清晰"],
    colorStrategy: ["适度强化对比和记忆色", "兼顾夜景氛围", "控制画面脏乱感"],
    imagePromptRules: ["强调游客视角与传播场景", "重点表现拍照吸引力和社交媒体传播性"],
    copyToneRules: ["表达有提案力度", "突出传播价值与项目记忆点", "不过度营销化"],
    summaryPromptRules: ["标题应先落项目记忆点，再说明传播角色", "摘要要讲清为什么值得停留和拍照"],
    pitfalls: ["避免多个焦点并列", "避免拍照面过于拥挤", "避免只有装饰没有主题"],
    negativeConstraints: ["避免像快闪海报贴图", "避免画面漂浮脱离建筑结构", "避免只剩装饰气氛却没有打卡主体"],
    constructionReminders: ["提前考虑灯光和夜景关系", "同步评估导视、店招和人流遮挡"],
    refinePromptRules: {
      "stronger-checkin": ["进一步明确镜头中心和停留位，形成稳定传播画面。"],
      "reduce-clutter": ["删减不服务于打卡传播的背景噪音，保持焦点纯度。"],
    },
  },
  {
    key: "commercial-youth",
    name: "商业街年轻化型",
    routeKeywords: {
      scene: ["商业街", "商圈", "街区"],
      style: ["现代几何", "国潮文旅"],
      theme: ["潮流", "年轻", "品牌", "街头"],
    },
    applicableScenes: ["商业街区形象墙", "品牌街区入口", "夜经济界面", "年轻客群聚集点"],
    designGoals: ["提升远距识别", "增强年轻客群吸引力", "强化街区传播与品牌外显"],
    visualStrategy: ["图形边界利落", "色块关系明确", "镜头冲击力强但不杂乱"],
    compositionStrategy: ["主视觉强聚焦", "适合移动场景快速浏览", "信息层级鲜明"],
    colorStrategy: ["适度提高新鲜度和对比感", "品牌色或主题色要明确", "避免灰闷"],
    imagePromptRules: ["强调商业街浏览节奏和年轻化传播界面", "画面要干净但有吸引力"],
    copyToneRules: ["表达利落直接", "突出客流吸附和传播效率", "避免空泛艺术腔"],
    summaryPromptRules: ["标题要利落，优先给出传播界面判断", "摘要要说明客流吸附与品牌外显的关系"],
    pitfalls: ["避免过度杂乱街头风", "避免品牌元素无秩序堆叠", "避免主题脱离商业属性"],
    negativeConstraints: ["避免低质街头涂鸦感", "避免元素堆砌成电商海报", "避免品牌信息和墙绘主画面互相抢戏"],
    constructionReminders: ["提前核对店招灯箱干扰", "品牌信息尺寸与位置需前置锁定"],
    refinePromptRules: {
      "commercial-spread": ["进一步提高品牌露出完整度和移动视角识别效率。"],
      "muted-colors": ["即便收束色彩，也要保留年轻感和街区活力。"],
    },
  },
  {
    key: "campus-culture",
    name: "校园文化型",
    routeKeywords: {
      scene: ["校园", "学校"],
      style: ["新中式", "现代几何"],
      theme: ["校训", "成长", "教育", "文化墙"],
    },
    applicableScenes: ["校园文化墙", "教学楼外立面", "校园主通道", "操场侧墙"],
    designGoals: ["强化校园精神识别", "传递教育价值", "兼顾日常观看与仪式感"],
    visualStrategy: ["主题清晰", "阅读路径明确", "避免娱乐化过度"],
    compositionStrategy: ["秩序感强", "适合长期观看", "文化信息有清晰主次"],
    colorStrategy: ["稳重清爽", "避免商业街艳色", "主色调有文化气质"],
    imagePromptRules: ["强调教育属性和长期使用场景", "画面有秩序感和正向价值表达"],
    copyToneRules: ["稳重清晰", "正向克制", "强调精神文化与长期浸润"],
    summaryPromptRules: ["标题和定位要先判断校园空间角色，再谈文化表达", "逻辑说明应清楚、可读、避免营销口吻"],
    pitfalls: ["避免网红化", "避免视觉噪声影响阅读", "避免符号堆砌"],
    negativeConstraints: ["避免娱乐化卡通感", "避免像商业街拍照背景板", "避免过度装饰影响校园长期观看"],
    constructionReminders: ["注意与校园导视和建筑立面协调", "优先考虑长期维护与安全性"],
    refinePromptRules: {
      "stronger-focal": ["主视觉增强时仍需保持校园秩序感和教育气质。"],
      "stronger-checkin": ["传播点应克制表达，不应破坏整体校园气质。"],
    },
  },
  {
    key: "community-family",
    name: "社区亲子型",
    routeKeywords: {
      scene: ["社区", "亲子"],
      style: ["儿童友好"],
      theme: ["家庭", "童趣", "成长", "邻里"],
    },
    applicableScenes: ["社区围墙", "儿童活动区", "邻里中心", "亲子活动界面"],
    designGoals: ["提升社区亲和力", "增强儿童友好体验", "营造可停留可互动的公共氛围"],
    visualStrategy: ["角色和图形友好", "互动点温和明确", "细节易被儿童识别"],
    compositionStrategy: ["主次清楚", "低位区域可适度互动", "避免压迫感"],
    colorStrategy: ["明快但不过度刺眼", "温暖清洁", "适合家庭长期观看"],
    imagePromptRules: ["强调友好、温暖、可停留的社区氛围", "避免冷感商业视觉"],
    copyToneRules: ["温和专业", "强调陪伴、参与和社区友好", "避免幼稚化表达"],
    summaryPromptRules: ["标题要强调社区互动角色，不做幼教宣传口吻", "亮点描述要具体到亲子停留和参与方式"],
    pitfalls: ["避免高刺激色块过量", "避免互动点太多", "避免符号低龄化过头"],
    negativeConstraints: ["避免低幼感", "避免彩色元素满铺", "避免互动点过多导致施工和维护失控"],
    constructionReminders: ["注意低位区域耐污与维护", "互动元素需兼顾安全与耐久性"],
    refinePromptRules: {
      "stronger-checkin": ["打卡点要以亲子互动为核心，而不是成人化网红装置。"],
      "reduce-clutter": ["删减低位杂项元素，保留儿童最容易感知的重点内容。"],
    },
  },
  {
    key: "guochao-culture",
    name: "国潮文化型",
    routeKeywords: {
      scene: ["文旅", "商业", "街区"],
      style: ["国潮", "新中式"],
      theme: ["非遗", "国风", "东方", "传统"],
    },
    applicableScenes: ["国潮街区", "文化商业界面", "节庆主题墙", "东方文化展示界面"],
    designGoals: ["建立东方文化识别", "避免陈词滥调式拼贴", "提升文化表达完整度"],
    visualStrategy: ["提炼传统符号", "控制装饰节奏", "强调当代化转译"],
    compositionStrategy: ["主叙事清晰", "符号使用有主次", "既有气场也有留白"],
    colorStrategy: ["可用东方色系但控制纯度和数量", "避免廉价节庆感"],
    imagePromptRules: ["强调东方文化转译与当代审美", "避免简单龙凤祥云式堆砌"],
    copyToneRules: ["有文化判断力", "克制而有气场", "避免空泛国风形容词堆砌"],
    summaryPromptRules: ["标题先判断文化表达方向，再判断空间角色", "摘要应体现当代化转译，而不是只讲传统元素"],
    pitfalls: ["避免符号滥用", "避免廉价节庆化", "避免只有传统元素没有当代结构"],
    negativeConstraints: ["避免廉价节庆布景感", "避免传统纹样满铺", "避免像平面国风海报直接贴墙"],
    constructionReminders: ["重点核对细节精度和材料表现", "避免复杂细部在施工中失真"],
    refinePromptRules: {
      "muted-colors": ["收束传统色的饱和度，提升东方审美的克制感。"],
      "stronger-focal": ["强化主视觉时保留文化表达完整度与留白。"],
    },
  },
];

const subtemplateSeeds: SubtemplateSeed[] = [
  {
    key: "tourism-entry-landmark",
    parentKey: "cultural-tourism-checkin",
    name: "入口地标版",
    routeKeywords: {
      scene: ["入口", "门头", "首站", "地标"],
      style: [],
      theme: ["地标", "门户", "第一印象"],
    },
    applicableScenes: ["景区入口", "文旅街区首界面", "游客集散口"],
    designGoals: ["建立第一识别", "形成地标印象", "提升到达感与仪式感"],
    visualStrategy: ["主符号必须鲜明居中", "强调远距可见度", "形成到达瞬间的记忆锚点"],
    compositionStrategy: ["正视角构图优先", "主体与背景分离明确", "避免入口信息过碎"],
    colorStrategy: ["主色集中", "记忆色明确", "避免多色抢戏"],
    imagePromptRules: [
      "入口主视觉必须围绕单一地标主体建立，优先让村名、景区名或核心识别图形承担第一眼识别。",
      "主图形要紧贴真实墙体、门洞或入口转角组织，不做漂浮贴纸式构图，确保像建在建筑表面的墙绘而不是后期海报。",
      "以接近游客到达视角的正向或微斜透视表达门面关系，远看先读主标识，近看再读细节，不做满墙均质装饰。",
      "打卡点应直接设置在入口主地标前方或侧前方，保证人物与主识别能在一张照片里同时成立。",
      "控制次级符号和辅助装饰数量，让入口在二三十米外仍然有稳定识别，不被店招、导视和碎纹样打散。",
      "避免平面海报感、节庆布景感和过度舞台化效果，画面应更像真实可落地的入口墙绘门面。",
    ],
    copyToneRules: ["强调门户感、地标感和到达识别", "语气更有项目展示力度"],
    summaryPromptRules: [
      "标题要像入口提案名称，先立到达识别，再谈主题气质",
      "定位必须明确这是首界面和门面担当，不能写成普通打卡墙",
      "画面逻辑要说明主地标、建筑入口关系和远视距识别机制",
      "亮点描述要具体到游客抬眼即识别、停留拍照和入口导入效率",
      "落地建议要落到人流遮挡、门头尺度和远距离观看校验",
    ],
    pitfalls: ["避免多个入口符号并列", "避免导视与地标关系混乱"],
    negativeConstraints: [
      "避免像平面广告门头直接贴在墙面",
      "避免地标元素悬浮脱离建筑转角和墙体尺度",
      "避免过多装饰抢掉入口主识别",
      "避免主标题和导视信息并列导致主次不清",
      "避免花哨灯带感掩盖墙绘门面气质",
    ],
    constructionReminders: ["注意入口人流遮挡和远视距观察效果", "地标主元素比例要先做放样"],
    refinePromptRules: {
      "muted-colors": ["入口版的色彩收束应保住门面记忆色，只压低背景辅色和边缘装饰，避免入口失去首识别。"],
      "stronger-checkin": ["把打卡点收拢到入口主地标前的标准停留位，让游客与门面主符号形成一镜完成的到达合影，而不是额外增加独立拍照装置。"],
      "stronger-focal": ["进一步压缩两侧噪音，把视线集中到入口主标识、门面主图形和迎宾中心位，强化抬眼即识别的第一印象。"],
      "reduce-clutter": ["优先删减入口周边零散纹样、次级口号和碎导视，让主地标、门洞关系和进场方向保持干净。"],
    },
  },
  {
    key: "tourism-night-ambience",
    parentKey: "cultural-tourism-checkin",
    name: "夜游氛围版",
    routeKeywords: {
      scene: ["夜游", "夜景", "灯光"],
      style: [],
      theme: ["夜游", "夜色", "灯光"],
    },
    applicableScenes: ["夜游街区", "夜间游览动线", "灯光氛围界面"],
    designGoals: ["建立夜间氛围感", "强化灯光传播效果", "兼顾夜景识别"],
    visualStrategy: ["强调光感层次和夜景主符号", "画面重心服务夜间观看"],
    compositionStrategy: ["避免日景式平铺", "让亮点区域形成视觉节奏", "主体在夜景中仍保持清晰"],
    colorStrategy: ["控制暗部脏灰", "用少量亮色拉出氛围层次", "兼顾灯光适配"],
    imagePromptRules: ["突出夜间游览氛围、光影层次和可拍照传播的夜景界面"],
    copyToneRules: ["强调夜间体验、氛围传播和灯光记忆点"],
    pitfalls: ["避免夜景细节过花", "避免全画面同亮度导致没有重心"],
    constructionReminders: ["需同步考虑灯光和材料反射关系", "夜景效果需校验手机镜头表现"],
    refinePromptRules: {
      "muted-colors": ["收束彩色灯感，保留夜景层次但避免廉价夜市感。"],
      "stronger-checkin": ["夜游打卡点应以光感焦点为主，而非简单叠加图形。"],
    },
  },
  {
    key: "tourism-group-photo",
    parentKey: "cultural-tourism-checkin",
    name: "打卡合影版",
    routeKeywords: {
      scene: ["打卡", "合影", "拍照"],
      style: [],
      theme: ["合影", "自拍", "拍照"],
    },
    applicableScenes: ["游客合影点", "主题打卡位", "社交媒体传播界面"],
    designGoals: ["形成标准合影画面", "提高社交传播效率", "增强停留互动"],
    visualStrategy: ["为人物留出清晰站位", "视觉中心服务镜头构图", "焦点元素具备镜头表现力"],
    compositionStrategy: ["前景留位明确", "中景主元素完整", "背景干净不抢人像"],
    colorStrategy: ["适合镜头曝光", "人物和背景区分清晰", "控制复杂高频纹理"],
    imagePromptRules: [
      "主视觉主体要围绕合影背景中心建立，优先形成一处镜头友好的主标识或主题图形，让人物站进去后仍能清楚读到项目记忆点。",
      "背景图形必须与真实墙面比例、转角和材质关系贴合，不做漂浮相框、悬空贴纸或独立舞台道具式效果。",
      "构图优先服务常见手机拍摄视角，前景留出稳定站位，中景保留完整主图，背景尽量干净，形成可重复复制的合影取景框。",
      "打卡点要明确到人物可停留的位置、身体朝向和镜头中心范围，避免主题图形太高、太偏或被人挡住。",
      "远看先识别合影主题和项目名称，近看再读局部装饰与互动细节，控制高频纹理和碎元素，保证拍照时背景不脏。",
      "避免普通 AI 海报感、直播背景板感和低幼网红拍照墙感，整体更像真实墙绘场景中的高完成度合影界面。",
    ],
    copyToneRules: ["强调传播、停留、合影体验和镜头友好度"],
    summaryPromptRules: [
      "标题应像打卡位提案名，先定义合影角色，再落主题识别",
      "定位要明确这是一处稳定出片的合影界面，不是普通装饰墙",
      "画面逻辑必须交代人物站位、背景层级和镜头中心关系",
      "互动亮点要具体到站位、自拍角度、多人合影和社交传播场景",
      "落地建议要写清拍摄距离、视平线高度和地墙关系校验",
    ],
    pitfalls: ["避免背景过碎", "避免人物站位被信息挤压", "避免焦点太高或太偏"],
    negativeConstraints: [
      "避免像平面海报背景板而不像真实墙绘界面",
      "避免人物站位区被纹样、文字或装饰切碎",
      "避免主视觉过高导致合影人物与主体脱节",
      "避免过度花哨的边框和漂浮贴纸感元素",
      "避免低幼插画感和廉价网红拍照背景感",
    ],
    constructionReminders: ["需现场验证取景高度和常见拍摄距离", "地面与墙面关系要一起考虑"],
    refinePromptRules: {
      "muted-colors": ["合影版降饱和时要先压低人物两侧和头顶杂色，保住镜头中心和主标识的对比度，让人站进去依然出片。"],
      "stronger-checkin": ["强化标准拍照位、人物站位边界和镜头中心，让背景主符号与合影人物形成稳定的三段式取景关系。"],
      "stronger-focal": ["把主视觉重心下沉并靠近合影镜头中心，避免主题图形过高过偏，确保人物入镜后仍能读到项目记忆点。"],
      "reduce-clutter": ["优先清掉人物肩部以上和镜头边缘的碎图形、零散字样和无效装饰，让合影背景面更完整、更纯净。"],
    },
  },
  {
    key: "tourism-wayfinding",
    parentKey: "cultural-tourism-checkin",
    name: "路线导视版",
    routeKeywords: {
      scene: ["导视", "路线", "动线", "指引"],
      style: [],
      theme: ["路线", "导航", "动线"],
    },
    applicableScenes: ["景区路线墙", "街区动线引导界面", "导视打卡复合墙"],
    designGoals: ["强化路径识别", "兼顾导视与审美展示", "提升游客理解效率"],
    visualStrategy: ["导视信息与主视觉统一设计", "主次关系清楚", "识别优先"],
    compositionStrategy: ["阅读路径明确", "视觉节奏沿动线展开", "文字与图形不过度竞争"],
    colorStrategy: ["导视层级清晰", "重点信息色值明确", "避免同级信息混淆"],
    imagePromptRules: ["兼顾导视功能和打卡界面质感", "让游客在移动中也能快速理解信息"],
    copyToneRules: ["强调识别效率、动线组织和项目服务能力"],
    pitfalls: ["避免装饰压过导视", "避免路线信息过密", "避免图文关系失衡"],
    constructionReminders: ["文字尺寸和安装位置要先验证视距", "导视信息需与实际路线完全一致"],
    refinePromptRules: {
      "stronger-focal": ["即使强化主视觉，也不能削弱导视信息的清晰度。"],
      "reduce-clutter": ["优先清理会影响读图和辨识的背景噪音。"],
    },
  },
  {
    key: "rural-village-gateway",
    parentKey: "rural-revitalization",
    name: "村口形象版",
    routeKeywords: {
      scene: ["村口", "入口", "门户"],
      style: [],
      theme: ["门户", "形象", "迎宾"],
    },
    applicableScenes: ["村口入口墙", "村庄形象界面", "乡村迎宾界面"],
    designGoals: ["建立村庄第一识别", "提升整体形象感", "兼顾导览与传播"],
    visualStrategy: ["主符号清晰", "形象表达集中", "兼具亲和与仪式感"],
    compositionStrategy: ["入口正向构图优先", "主次明确", "避免村口信息过满"],
    colorStrategy: ["在地自然色中加入适度记忆色", "不过度跳脱环境"],
    imagePromptRules: [
      "主视觉应围绕村名识别、迎宾主图形或在地代表性符号建立，先做村口门面判断，再展开文化内容。",
      "画面必须服从真实村口道路、围墙长度和转角关系，图形要像绘制在实际墙面上的门面界面，而不是独立立牌或景区门楼。",
      "优先使用车辆和步行双重视角都能成立的透视关系，远看先读村名和主形象，近看再读民俗或产业细节。",
      "打卡点要自然嵌入迎宾界面，可形成停车后、步行进入前的简洁合影点，而不是额外堆一个网红装置。",
      "色彩和形象要与村口环境、树木、道路和建筑基底协调，保证远距离辨识同时不破坏乡村气质。",
      "避免像商业景区门头、招商广告墙或平面宣传海报，整体应呈现真实、在地、可长期使用的村口形象墙。",
    ],
    copyToneRules: ["强调门户形象、在地识别和空间第一印象"],
    summaryPromptRules: [
      "标题要像村口形象提案名，先判断村庄门面角色，再落在地主题",
      "定位要明确这是村庄门户界面，不写成普通宣传墙",
      "画面逻辑需说明村口识别、车辆步行视距和在地迎宾关系",
      "互动亮点要具体到村口停留点、游客识别点和归属感建立方式",
      "落地建议要强调基层、尺度、耐久和村口真实使用场景",
    ],
    pitfalls: ["避免像商业景区门头", "避免口号堆叠压过画面"],
    negativeConstraints: [
      "避免做成景区售票口门头式夸张门面",
      "避免口号和图形堆满整面墙导致村口失去呼吸感",
      "避免主形象脱离真实村口道路视角产生漂浮感",
      "避免过度商业色彩破坏乡村在地气质",
      "避免施工细节过密导致乡村墙面难以还原",
    ],
    constructionReminders: ["需核对村口视距和车辆经过视角", "主形象比例应适配真实尺度"],
    refinePromptRules: {
      "muted-colors": ["村口版收束色彩时应压低跳色装饰和商业感高的辅色，让墙面更贴近乡村环境、道路视线和长期观看。"],
      "stronger-checkin": ["村口版的打卡增强不是做网红装置，而是让迎宾主形象、村名识别和停留点形成自然合影关系。"],
      "stronger-focal": ["把视线重新集中到村名识别、迎宾主图形和入口门面轴线上，让村口第一印象更完整、更有归属感。"],
      "commercial-spread": ["提升识别时仍应保留村庄亲和与在地气质。"],
      "reduce-clutter": ["优先删减零散口号、过密乡土符号和次级装饰，让村口墙面更像门面界面而不是内容展板。"],
    },
  },
  {
    key: "rural-folklore-culture",
    parentKey: "rural-revitalization",
    name: "民俗文化版",
    routeKeywords: {
      scene: ["乡村", "村"],
      style: [],
      theme: ["民俗", "非遗", "节庆", "风俗"],
    },
    applicableScenes: ["民俗文化墙", "乡村非遗展示墙", "村史文化界面"],
    designGoals: ["强化民俗表达", "提升文化可读性", "建立村庄独特内容资产"],
    visualStrategy: ["提炼民俗符号", "控制故事信息密度", "避免满墙说明牌感"],
    compositionStrategy: ["主叙事明确", "辅叙事辅助展开", "保持文化阅读节奏"],
    colorStrategy: ["结合民俗色彩但控制纯度", "避免节庆化过头"],
    imagePromptRules: ["突出真实民俗文化和生活痕迹", "避免空洞符号化国风表达"],
    copyToneRules: ["强调文化根性、生活语境和在地内容价值"],
    pitfalls: ["避免百科式堆砌", "避免只有传统符号没有生活感"],
    constructionReminders: ["细部过多时要评估施工还原度", "文字型内容宜适度精简"],
    refinePromptRules: {
      "reduce-clutter": ["优先压缩不必要文化装饰，保留最有代表性的民俗叙事。"],
      "stronger-checkin": ["传播点也应依托民俗内容本身，而非另造网红装置。"],
    },
  },
  {
    key: "rural-industry-showcase",
    parentKey: "rural-revitalization",
    name: "产业展示版",
    routeKeywords: {
      scene: ["产业", "农场", "合作社"],
      style: [],
      theme: ["产业", "农业", "特产", "农文旅"],
    },
    applicableScenes: ["产业示范墙", "农产品展示界面", "合作社形象墙"],
    designGoals: ["呈现产业特色", "建立可信的产业识别", "兼顾导览和品牌展示"],
    visualStrategy: ["产业要素清晰可辨", "形象表达偏真实可信", "避免过度空想化"],
    compositionStrategy: ["主信息集中", "辅助内容有清晰层级", "便于导览和介绍"],
    colorStrategy: ["贴近产品或产业特征色", "控制整体秩序感", "避免营销海报化"],
    imagePromptRules: ["强调产业内容、产品气质和乡村产业可信度", "避免空洞口号墙"],
    copyToneRules: ["强调产业价值、真实感和项目可持续性"],
    pitfalls: ["避免像电商海报", "避免品牌露出与产业叙事割裂"],
    constructionReminders: ["如含品牌信息，需提早锁定版式和字重", "应预留后续更新维护可能"],
    refinePromptRules: {
      "commercial-spread": ["强化传播时，应优先增强产业识别，而不是单纯增加商业感。"],
      "stronger-focal": ["主产业内容需更集中，避免多品类并列分散注意力。"],
    },
  },
  {
    key: "rural-memory-story",
    parentKey: "rural-revitalization",
    name: "记忆叙事版",
    routeKeywords: {
      scene: ["乡村", "社区", "村"],
      style: [],
      theme: ["记忆", "乡愁", "故事", "叙事"],
    },
    applicableScenes: ["村史叙事墙", "乡愁记忆界面", "在地故事展示墙"],
    designGoals: ["强化记忆叙事", "建立情感连接", "让村庄故事被看见和被记住"],
    visualStrategy: ["叙事节奏温和但明确", "情感点可识别", "避免简单怀旧滤镜化"],
    compositionStrategy: ["故事主轴清晰", "局部细节服务情感阅读", "不做满铺式讲故事"],
    colorStrategy: ["偏克制和有时间感", "保留少量记忆色强化情绪", "避免灰脏化"],
    imagePromptRules: ["突出乡村记忆、生活片段和情感连接", "避免空洞怀旧和刻意煽情"],
    copyToneRules: ["有情感温度但保持专业克制", "强调叙事价值与公共共鸣"],
    pitfalls: ["避免假旧感", "避免情绪先行但内容空心", "避免讲述碎片化"],
    constructionReminders: ["叙事细节要控制施工复杂度", "长篇文字不宜过多，应以画面先行"],
    refinePromptRules: {
      "muted-colors": ["通过更克制的色彩去增强记忆感和时间感。"],
      "stronger-focal": ["强化叙事主轴，但不要破坏整体情绪的连贯性。"],
    },
  },
];

function mergeRefineRules<
  T extends {
    refinePromptRules: Partial<Record<ProposalAdjustmentKey, string[]>>;
    summaryPromptRules?: string[];
    negativeConstraints?: string[];
    copyToneRules: string[];
    pitfalls: string[];
  },
>(seed: T) {
  return {
    ...seed,
    summaryPromptRules: seed.summaryPromptRules || seed.copyToneRules,
    negativeConstraints: seed.negativeConstraints || seed.pitfalls,
    refinePromptRules: {
      "muted-colors": [...baseRefineRules["muted-colors"], ...(seed.refinePromptRules["muted-colors"] || [])],
      "stronger-checkin": [...baseRefineRules["stronger-checkin"], ...(seed.refinePromptRules["stronger-checkin"] || [])],
      "stronger-focal": [...baseRefineRules["stronger-focal"], ...(seed.refinePromptRules["stronger-focal"] || [])],
      "rural-character": [...baseRefineRules["rural-character"], ...(seed.refinePromptRules["rural-character"] || [])],
      "commercial-spread": [...baseRefineRules["commercial-spread"], ...(seed.refinePromptRules["commercial-spread"] || [])],
      "reduce-clutter": [...baseRefineRules["reduce-clutter"], ...(seed.refinePromptRules["reduce-clutter"] || [])],
    },
  };
}

export const proposalTemplates = templateSeeds.map(mergeRefineRules) as ProposalTemplate[];
export const proposalSubtemplates = subtemplateSeeds.map(mergeRefineRules) as ProposalSubtemplate[];

export const proposalTemplateMap = proposalTemplates.reduce<Record<ProposalTemplateKey, ProposalTemplate>>((acc, template) => {
  acc[template.key] = template;
  return acc;
}, {} as Record<ProposalTemplateKey, ProposalTemplate>);

export const proposalSubtemplateMap = proposalSubtemplates.reduce<Record<ProposalSubtemplateKey, ProposalSubtemplate>>((acc, template) => {
  acc[template.key] = template;
  return acc;
}, {} as Record<ProposalSubtemplateKey, ProposalSubtemplate>);

export const proposalTemplateRouting = templateSeeds.reduce<Record<ProposalTemplateKey, RouteKeywords>>((acc, template) => {
  acc[template.key] = template.routeKeywords;
  return acc;
}, {} as Record<ProposalTemplateKey, RouteKeywords>);

export const proposalSubtemplateRouting = subtemplateSeeds.reduce<Record<ProposalSubtemplateKey, RouteKeywords>>((acc, template) => {
  acc[template.key] = template.routeKeywords;
  return acc;
}, {} as Record<ProposalSubtemplateKey, RouteKeywords>);

export const proposalSubtemplatesByTemplate = proposalSubtemplates.reduce<Record<ProposalTemplateKey, ProposalSubtemplate[]>>(
  (acc, subtemplate) => {
    acc[subtemplate.parentKey] = [...(acc[subtemplate.parentKey] || []), subtemplate];
    return acc;
  },
  {
    "rural-revitalization": [],
    "cultural-tourism-checkin": [],
    "commercial-youth": [],
    "campus-culture": [],
    "community-family": [],
    "guochao-culture": [],
  },
);
