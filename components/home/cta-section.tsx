import Link from "next/link";

export function CtaSection() {
  return (
    <section className="landing-cta">
      <div>
        <p className="page-eyebrow">试用与合作入口</p>
        <h2>如果已经看清产品能力，下一步就是先试一版，再决定合作深度。</h2>
        <p>
          当前版本先提供超轻合作闭环：在线试用、查看案例、再按项目阶段选择 AI 初稿、人工精修或整套提案输出，不先做复杂支付流程。
        </p>
      </div>
      <div className="hero-actions">
        <Link href="/generate" className="button button--primary">
          立即试用
        </Link>
        <Link href="/cases" className="button button--secondary">
          查看案例演示
        </Link>
      </div>
    </section>
  );
}
