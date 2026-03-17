import Link from "next/link";

export function LandingHero() {
  return (
    <section className="landing-hero">
      <div className="landing-hero__copy">
        <p className="page-eyebrow">墙绘直出 · 墙绘提案工作台</p>
        <h1>把现场墙面照片，整理成可提案、可比较、可汇报的墙绘方案。</h1>
        <div className="landing-hero__lead">
          <p>面向墙绘公司、文旅项目方、乡村改造团队与校园文化项目使用。</p>
          <p>它不是普通 AI 生图工具，而是把生成、微调、对比和提案输出串成一条工作链路的墙绘提案工作台。</p>
        </div>
        <div className="hero-actions">
          <Link href="/generate" className="button button--primary">
            立即试用
          </Link>
          <Link href="/submit-project?source=home" className="button button--secondary">
            提交项目
          </Link>
        </div>
      </div>

      <div className="landing-hero__panel">
        <article className="landing-metric-card">
          <span>首屏价值</span>
          <strong>从现场图到提案稿，不止出图，更输出沟通结构。</strong>
        </article>
        <article className="landing-metric-card">
          <span>四项核心能力</span>
          <strong>多模板生成 / 快捷微调 / 版本对比 / 提案导出</strong>
        </article>
        <article className="landing-preview-card">
          <div className="landing-preview-card__header">
            <span>内部演示视角</span>
            <strong>产品完成度一眼可见</strong>
          </div>
          <div className="landing-preview-card__stack">
            <div className="landing-preview-sheet">
              <em>结果页</em>
              <p>主效果图、方案定位、快捷微调、模板切换重出</p>
            </div>
            <div className="landing-preview-sheet landing-preview-sheet--offset">
              <em>版本对比</em>
              <p>当前版 vs 对比版，支持方向比较与差异总结</p>
            </div>
            <div className="landing-preview-sheet landing-preview-sheet--edge">
              <em>导出提案</em>
              <p>封面、正文、对比、备注一体化输出，适合截图与导出 PDF</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
