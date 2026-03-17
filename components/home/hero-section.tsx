import Link from "next/link";

export function HeroSection() {
  return (
    <section className="hero-card">
      <div className="hero-copy">
        <p className="page-eyebrow">墙绘方案提案工具</p>
        <h1>上传现场墙面照片，快速生成可沟通、可提案的墙绘初稿</h1>
        <p className="hero-copy__text">
          为墙绘公司、文旅项目方与乡村改造团队提供更高效的方案起草方式。先用 mock
          数据跑通完整链路，后续可无缝接入真实图像生成能力。
        </p>
        <div className="hero-actions">
          <Link href="/generate" className="button button--primary">
            立即生成方案
          </Link>
          <Link href="/history" className="button button--secondary">
            查看历史记录
          </Link>
        </div>
      </div>
      <div className="hero-panel">
        <div className="hero-panel__card">
          <span>适用对象</span>
          <strong>墙绘公司 / 文旅甲方 / 乡村更新团队</strong>
        </div>
        <div className="hero-panel__card">
          <span>当前阶段</span>
          <strong>Mock 流程验证版</strong>
        </div>
        <div className="hero-panel__card">
          <span>核心输出</span>
          <strong>效果图初稿 + 方案说明</strong>
        </div>
      </div>
    </section>
  );
}
