const scenarioItems = [
  {
    title: "文旅打卡",
    text: "入口地标、合影打卡、夜游氛围、导视界面等方向更容易快速比稿。",
  },
  {
    title: "乡村振兴",
    text: "村口形象、在地文化、产业展示、记忆叙事等更适合做多方向提案比较。",
  },
  {
    title: "商业街更新",
    text: "适合做街区年轻化、传播导向和品牌外显并行的墙绘更新方案。",
  },
  {
    title: "校园文化",
    text: "适合校园主通道、文化墙、教学楼外立面的精神表达和长期展示方案。",
  },
];

export function ScenarioSection() {
  return (
    <section className="landing-section">
      <div className="section-heading landing-section__heading">
        <h2>适用场景</h2>
        <p>不只服务一个风格，而是围绕墙绘提案的典型项目类型建立工作路径。</p>
      </div>
      <div className="scenario-grid">
        {scenarioItems.map((item) => (
          <article key={item.title} className="scenario-card">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
