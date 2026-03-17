import Link from "next/link";

export function ShowcaseSection() {
  return (
    <section id="proposal-showcase" className="landing-section">
      <div className="section-heading landing-section__heading">
        <h2>提案成果展示</h2>
        <p>把结果页、版本对比、导出提案和案例化演示放在同一个首页演示里，方便内部演示和老客户讲解产品完成度。</p>
      </div>
      <div className="showcase-grid">
        <article className="showcase-card showcase-card--result">
          <div className="showcase-card__top">
            <span>结果页</span>
            <strong>主效果图 + 模板方向 + 微调链路</strong>
          </div>
          <div className="showcase-card__frame">
            <div className="showcase-card__hero" />
            <div className="showcase-card__rows">
              <div />
              <div />
              <div />
            </div>
          </div>
          <p>更像提案板，而不是普通结果展示页。</p>
        </article>

        <article className="showcase-card showcase-card--compare">
          <div className="showcase-card__top">
            <span>版本对比</span>
            <strong>当前版 vs 对比版 + 差异总结</strong>
          </div>
          <div className="showcase-card__dual">
            <div className="showcase-card__pane" />
            <div className="showcase-card__pane" />
          </div>
          <p>适合甲方讨论方向取舍，也适合团队内部评审。</p>
        </article>

        <article className="showcase-card showcase-card--export">
          <div className="showcase-card__top">
            <span>导出提案</span>
            <strong>封面、正文、对比、备注一体化输出</strong>
          </div>
          <div className="showcase-card__sheet">
            <div className="showcase-card__sheet-head" />
            <div className="showcase-card__sheet-body" />
            <div className="showcase-card__sheet-foot" />
          </div>
          <p>支持截图、打印和浏览器导出 PDF，完成汇报闭环。</p>
        </article>
      </div>
      <div className="button-row">
        <Link href="/cases" className="button button--secondary">
          查看案例化演示
        </Link>
      </div>
    </section>
  );
}
