const features = [
  {
    title: "现场图快速转提案",
    text: "上传墙面照片后，结合需求表单，一键形成初步提案素材。",
  },
  {
    title: "专业表单结构",
    text: "聚焦主题、风格、色彩、场景和补充说明，方便团队统一沟通。",
  },
  {
    title: "适合 B 端展示",
    text: "界面语言与信息结构偏专业汇报风格，便于用于客户评审。",
  },
  {
    title: "预留真实接口层",
    text: "后续可接入真实图像生成能力，无需重写页面流程。",
  },
];

export function FeatureGrid() {
  return (
    <section className="feature-grid">
      {features.map((item) => (
        <article key={item.title} className="feature-card">
          <h2>{item.title}</h2>
          <p>{item.text}</p>
        </article>
      ))}
    </section>
  );
}
