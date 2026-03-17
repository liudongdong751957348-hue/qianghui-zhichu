import Link from "next/link";

import { contactChannels, servicePlans, trialSteps } from "@/lib/cooperation";

export function CooperationSection() {
  return (
    <section id="cooperation-plans" className="landing-section landing-section--cooperation">
      <div className="section-heading landing-section__heading">
        <h2>试用与合作说明</h2>
        <p>不做复杂支付逻辑，先把“怎么试、怎么合作、怎么继续推进”讲清楚，让墙绘直出具备轻量成交入口。</p>
      </div>

      <div className="trial-flow-grid">
        {trialSteps.map((item, index) => (
          <article key={item.title} className="trial-flow-card">
            <span>{`0${index + 1}`}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <div className="service-plan-grid">
        {servicePlans.map((plan) => (
          <article key={plan.name} className="service-plan-card">
            <div className="service-plan-card__header">
              <span>服务分层</span>
              <h3>{plan.name}</h3>
            </div>
            <p className="service-plan-card__fit">{plan.fitFor}</p>
            <div className="proposal-list">
              {plan.includes.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <div className="service-plan-card__meta">
              <p>
                <strong>适合阶段</strong>
                <span>{plan.stage}</span>
              </p>
              <p>
                <strong>价格参考</strong>
                <span>{plan.price}</span>
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="cooperation-footer">
        <div className="cooperation-contact-grid">
          {contactChannels.map((item) => (
            <article key={item.label} className="cooperation-contact-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
        <div className="cooperation-cta">
          <div>
            <p className="page-eyebrow">下一步怎么走</p>
            <h3>先在线试用，再按项目阶段决定是看首稿、做精修，还是直接整理成整套提案。</h3>
            <p>如果你已经有现场图和方向需求，现在就可以直接提交项目，先把第一版提案跑出来。</p>
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
      </div>
    </section>
  );
}
