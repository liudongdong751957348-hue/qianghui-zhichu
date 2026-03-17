const processItems = [
  {
    index: "01",
    title: "上传现场图与需求",
    text: "输入项目主题、风格、色彩和场景条件，让方案起点建立在真实墙面与项目语境上。",
  },
  {
    index: "02",
    title: "匹配模板生成首稿",
    text: "基于墙绘模板体系形成首轮提案方向，而不是只拼一段提示词去碰运气。",
  },
  {
    index: "03",
    title: "微调、切换、对比",
    text: "沿用同一项目资料继续微调或切换模板重出，形成可比较的多方向方案稿。",
  },
  {
    index: "04",
    title: "导出提案对外沟通",
    text: "把结果整理成能截图、能打印、能浏览器导出 PDF 的提案稿，直接进入汇报场景。",
  },
];

export function ProcessSection() {
  return (
    <section className="landing-section">
      <div className="section-heading landing-section__heading">
        <h2>核心流程</h2>
        <p>围绕墙绘公司真实提案过程设计，不让生成结果停留在“出一张图”这一步。</p>
      </div>
      <div className="process-grid">
        {processItems.map((item) => (
          <article key={item.index} className="process-card">
            <span>{item.index}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
