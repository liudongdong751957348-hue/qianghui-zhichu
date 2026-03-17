const capabilityItems = [
  {
    title: "多模板提案生成",
    text: "把文旅打卡、乡村振兴、商业街更新、校园文化等场景拆成可控模板，而不是泛化生图。",
  },
  {
    title: "快捷微调迭代",
    text: "不回表单重填，直接围绕当前提案做色彩、焦点、打卡点和风格方向的快速迭代。",
  },
  {
    title: "版本对比沟通",
    text: "同一项目内保留多版方向，支持当前版与对比版并排沟通，方便甲方判断取舍。",
  },
  {
    title: "提案导出汇报",
    text: "把结果整理成封面、说明、对比、备注完整输出页，适合截图、打印和浏览器导出 PDF。",
  },
];

export function CapabilitySection() {
  return (
    <section className="landing-section landing-section--accent">
      <div className="section-heading landing-section__heading">
        <h2>核心能力</h2>
        <p>核心不是“更快出一张图”，而是让墙绘提案这件事更稳定、更可控、更容易对外汇报。</p>
      </div>
      <div className="capability-grid">
        {capabilityItems.map((item) => (
          <article key={item.title} className="capability-card">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
