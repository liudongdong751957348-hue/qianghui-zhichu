import Image from "next/image";
import Link from "next/link";

import { contactChannels, servicePlans } from "@/lib/cooperation";
import { CaseStudy } from "@/lib/case-studies";

type CaseStudyViewProps = {
  study: CaseStudy;
};

export function CaseStudyView({ study }: CaseStudyViewProps) {
  const stages = [study.initial, study.refined, study.switched];
  const recommendedStage = study[study.finalRecommendation.version];
  const stageGuides = [
    {
      eyebrow: "03 首版提案",
      whyTitle: "首版为什么这样做",
      direction: "先建立主判断",
    },
    {
      eyebrow: "04 微调版本",
      whyTitle: "微调版为什么这样改",
      direction: "在既有基础上压准传播重点",
    },
    {
      eyebrow: "05 切模板版本",
      whyTitle: "切模板版为什么要换方向",
      direction: "拉出平行提案路径做方向比较",
    },
  ];

  return (
    <section className="case-study">
      <div className="page-heading">
        <p className="page-eyebrow">{study.category}</p>
        <h1>{study.title}</h1>
        <p className="page-description">{study.summary}</p>
      </div>

      <section className="case-verdict surface-card">
        <div className="case-verdict__eyebrow">推荐结论优先看</div>
        <div className="case-verdict__main">
          <div>
            <span className="case-verdict__tag">{recommendedStage.template}</span>
            <h2>{study.finalRecommendation.title}</h2>
          </div>
          <p>{study.finalRecommendation.reason}</p>
        </div>
        <div className="case-verdict__meta">
          <div>
            <strong>建议主推原因</strong>
            <p>{study.finalRecommendation.reason}</p>
          </div>
          <div>
            <strong>适合当前汇报阶段</strong>
            <p>{study.finalRecommendation.applicableCase}</p>
          </div>
        </div>
      </section>

      <div className="case-rhythm">
        <span>01 项目背景</span>
        <span>02 问题判断</span>
        <span>03 首版提案</span>
        <span>04 微调版本</span>
        <span>05 切模板重出</span>
        <span>06 最终建议</span>
        <span>07 导出提案预览</span>
      </div>

      <section className="surface-card case-study__section">
        <div className="section-heading">
          <h2>01 项目背景</h2>
          <p>先说明原墙条件、项目目标和为什么需要用提案工作流而不是单次出图。</p>
        </div>
        <div className="proposal-list">
          {study.background.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section className="surface-card case-study__section">
        <div className="section-heading">
          <h2>02 原墙与现场起点</h2>
          <p>作为整条提案链路的起点，用于判断结构关系、展示面和改造边界。</p>
        </div>
        <div className="case-study__origin">
          <div className="case-study__image">
            <Image src={study.originalWall.image} alt={`${study.title} 原墙`} fill unoptimized sizes="(max-width: 1080px) 100vw, 48vw" />
          </div>
          <div className="proposal-list">
            <p>应用场景：{study.originalWall.scene}</p>
            <p>主题方向：{study.originalWall.theme}</p>
            <p>项目备注：{study.originalWall.notes}</p>
          </div>
        </div>
      </section>

      <section className="surface-card case-study__section">
        <div className="section-heading">
          <h2>02 问题判断与提案目标</h2>
          <p>不是直接出图，而是先判断这面墙当前缺什么、这轮提案要先解决什么。</p>
        </div>
        <div className="case-study__problem-grid">
          <div className="case-study__mini-block">
            <strong>当前墙面问题</strong>
            <div className="proposal-list">
              {study.wallProblems.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
          <div className="case-study__mini-block">
            <strong>本轮提案目标</strong>
            <div className="proposal-list">
              {study.proposalGoals.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="case-stage-grid">
        {stages.map((stage, index) => (
          <article key={stage.title} className="surface-card case-stage-card">
            <div className="case-stage-card__header">
              <div>
                <span>{stageGuides[index].eyebrow}</span>
                <h2>{stage.title}</h2>
              </div>
              <div className="case-stage-card__meta">
                <strong>{stage.template}</strong>
                <em>{stage.source}</em>
              </div>
            </div>
            <div className="case-stage-card__direction">
              <strong>变化方向</strong>
              <p>{stageGuides[index].direction}</p>
            </div>
            <div className="case-stage-card__image">
              <Image src={stage.image} alt={stage.title} fill unoptimized sizes="(max-width: 1080px) 100vw, 48vw" />
              <div className="case-stage-card__overlay">
                <span>{stage.subtitle}</span>
              </div>
            </div>
            <p className="case-stage-card__summary">{stage.summary}</p>
            <div className="case-stage-card__why">
              <strong>{stageGuides[index].whyTitle}</strong>
              <p>{stage.why}</p>
            </div>
            <div className="case-stage-card__fit">
              <div>
                <strong>适合场景</strong>
                <p>{stage.suitableScene}</p>
              </div>
              <div>
                <strong>适合目标</strong>
                <p>{stage.suitableGoal}</p>
              </div>
              <div>
                <strong>推荐理由</strong>
                <p>{stage.recommendation}</p>
              </div>
            </div>
            <div className="proposal-list">
              {stage.changes.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <div className="case-stage-card__talktrack">
              <strong>客户沟通口径</strong>
              <div className="proposal-list">
                {stage.clientTalkTrack.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="surface-card case-study__section case-final-recommendation">
        <div className="section-heading">
          <h2>06 最终建议 / 推荐版本</h2>
          <p>把三版提案放回项目目标里判断，明确这次汇报最适合主推哪一版，以及为什么主推这版。</p>
        </div>
        <div className="case-final-recommendation__content">
          <div>
            <span>{recommendedStage.template}</span>
            <h3>{study.finalRecommendation.title}</h3>
          </div>
          <p>{study.finalRecommendation.reason}</p>
          <p>{study.finalRecommendation.applicableCase}</p>
        </div>
      </section>

      <section className="surface-card case-study__section">
        <div className="section-heading">
          <h2>07 导出提案预览</h2>
          <p>展示这个案例最终如何整理成可截图、可打印、可导出 PDF 的提案输出页。</p>
        </div>
        <div className="case-export-preview">
          <div className="case-export-preview__sheet">
            <div className="case-export-preview__cover">
              <strong>{study.exportPreview.title}</strong>
              <p>{study.exportPreview.text}</p>
            </div>
            <div className="case-export-preview__sections">
              {study.exportPreview.sections.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </div>
          <div className="proposal-list case-export-preview__notes">
            <p>这个案例会在导出提案里保留原墙、当前方案、对比版本和差异总结。</p>
            {study.exportPreview.closingNotes.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-card case-study__section case-study__cooperation">
        <div className="section-heading">
          <h2>合作方式建议</h2>
          <p>看完案例之后，下一步不是回到功能说明，而是判断这个项目适合先试用、先精修，还是直接整理成整套提案。</p>
        </div>
        <div className="case-study__cooperation-grid">
          {servicePlans.map((plan) => (
            <article key={plan.name} className="case-study__cooperation-card">
              <span>{plan.name}</span>
              <strong>{plan.price}</strong>
              <p>{plan.fitFor}</p>
            </article>
          ))}
        </div>
        <div className="case-study__cooperation-note">
          <div className="proposal-list">
            <p>建议动作：如果你手上已经有真实现场图，最顺的方式是先在线提交项目，把第一版提案编号先跑出来。</p>
            <p>继续推进时，可以按案例里的推荐版本作为主方向，再决定是否需要人工精修或整套提案整理。</p>
          </div>
          <div className="tag-row">
            {contactChannels.map((item) => (
              <span key={item.label}>{item.label}：{item.value}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="button-row">
        <Link href="/submit-project?source=case-study" className="button button--primary">
          提交项目
        </Link>
        <Link href="/cases" className="button button--secondary">
          返回案例总览
        </Link>
        <Link href="/generate" className="button button--secondary">
          进入生成页
        </Link>
      </div>
    </section>
  );
}
