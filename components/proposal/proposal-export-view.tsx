"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  buildProposalNumber,
  buildDifferenceSummary,
  formatProposalDate,
  getProposalVersions,
  getVersionImage,
  getVersionSourceLabel,
  getVersionTemplateLabel,
} from "@/lib/proposal-presenter";
import { contactChannels, servicePlans } from "@/lib/cooperation";
import { getHistoryRecordById } from "@/lib/storage";
import { ProposalRecord } from "@/types/proposal";

export function ProposalExportView() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const leftId = searchParams.get("left") || "";
  const rightId = searchParams.get("right") || "";
  const [record, setRecord] = useState<ProposalRecord | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setRecord(getHistoryRecordById(id));
      setReady(true);
    });
  }, [id]);

  if (!ready) {
    return <section className="surface-card">正在生成提案导出视图...</section>;
  }

  if (!record) {
    return (
      <section className="surface-card empty-state">
        <h2>未找到提案记录</h2>
        <p>请先从结果页进入导出提案，系统需要基于本地历史记录整理导出内容。</p>
        <Link href="/result" className="button button--primary">
          返回结果页
        </Link>
      </section>
    );
  }

  const versions = getProposalVersions(record);
  const activeVersion = versions.find((item) => item.id === leftId) || versions.find((item) => item.id === record.activeVersionId) || versions[versions.length - 1];
  const compareVersion = versions.find((item) => item.id === rightId) || versions[versions.length - 2] || activeVersion;
  const differenceSummary = buildDifferenceSummary(activeVersion, compareVersion, record);
  const currentTemplateLabel = getVersionTemplateLabel(activeVersion, record);
  const compareTemplateLabel = getVersionTemplateLabel(compareVersion, record);
  const proposalNumber = buildProposalNumber(record);
  const exportDate = formatProposalDate(new Date().toISOString());
  const projectDate = formatProposalDate(record.createdAt);
  const brandName = "墙绘直出";
  const teamName = "墙绘直出提案组";

  return (
    <div className="proposal-export-page">
      <div className="proposal-export-toolbar">
        <Link href={`/result?id=${record.id}`} className="button button--secondary">
          返回结果页
        </Link>
        <button type="button" className="button button--primary" onClick={() => window.print()}>
          浏览器打印 / 导出 PDF
        </button>
      </div>

      <section className="proposal-export-sheet proposal-export-sheet--cover proposal-export-sheet--print-cover">
        <div className="proposal-export-brandbar">
          <div>
            <span className="proposal-export-brandbar__label">产品</span>
            <strong>{brandName}</strong>
          </div>
          <div>
            <span className="proposal-export-brandbar__label">提案编号</span>
            <strong>{proposalNumber}</strong>
          </div>
        </div>
        <div className="proposal-export-cover">
          <div className="proposal-export-cover__copy">
            <p className="page-eyebrow">{brandName} Proposal Deck</p>
            <h1>{record.formValues.projectName}</h1>
            <h2>{activeVersion.title}</h2>
            <div className="tag-row">
              <span>{currentTemplateLabel || "未识别模板"}</span>
              <span>{getVersionSourceLabel(activeVersion)}</span>
              <span>{record.formValues.scene}</span>
            </div>
            <p className="proposal-export-cover__summary">{activeVersion.summary}</p>
            <div className="proposal-export-cover__meta">
              <p>
                <span>输出团队</span>
                <strong>{teamName}</strong>
              </p>
              <p>
                <span>导出日期</span>
                <strong>{exportDate}</strong>
              </p>
              <p>
                <span>项目归档日期</span>
                <strong>{projectDate}</strong>
              </p>
            </div>
          </div>
          <div className="proposal-export-cover__visual">
            <Image
              src={getVersionImage(activeVersion, record, "generated")}
              alt={activeVersion.title}
              fill
              unoptimized
              sizes="(max-width: 1080px) 100vw, 46vw"
            />
          </div>
        </div>
      </section>

      <section className="proposal-export-sheet proposal-export-sheet--origin">
        <div className="proposal-export-sheet__header">
          <div>
            <span className="proposal-export-sheet__brand">{brandName}</span>
            <strong>{record.formValues.projectName}</strong>
          </div>
          <div className="proposal-export-sheet__meta">
            <span>{proposalNumber}</span>
            <span>01 / 原墙与项目背景</span>
          </div>
        </div>
        <div className="section-heading">
          <h2>01 原墙与项目背景</h2>
          <p>用于说明现场基础条件、应用场景与主题意图，便于后续施工与深化判断。</p>
        </div>
        <div className="proposal-export-origin">
          <div className="proposal-export-origin__image">
            <Image src={record.coverImage} alt="原墙现场图" fill unoptimized sizes="(max-width: 1080px) 100vw, 42vw" />
          </div>
          <div className="proposal-export-origin__content">
            <div className="proposal-list">
              <p>场景信息：{record.formValues.scene}</p>
              <p>主题方向：{record.formValues.theme}</p>
              <p>风格方向：{record.formValues.style}</p>
              <p>色彩策略：{record.formValues.colors}</p>
            </div>
            <p className="proposal-export-note">{record.formValues.notes || "当前项目未额外补充现场备注。"} </p>
          </div>
        </div>
      </section>

      <section className="proposal-export-sheet proposal-export-sheet--main-visual">
        <div className="proposal-export-sheet__header">
          <div>
            <span className="proposal-export-sheet__brand">{brandName}</span>
            <strong>{record.formValues.projectName}</strong>
          </div>
          <div className="proposal-export-sheet__meta">
            <span>{proposalNumber}</span>
            <span>02 / 当前主提案方向</span>
          </div>
        </div>
        <div className="section-heading">
          <h2>02 当前主提案方向</h2>
          <p>当前汇报稿以此版本作为主提案方向，用于甲方沟通与内部比选。</p>
        </div>
        <div className="proposal-export-main-visual">
          <Image
            src={getVersionImage(activeVersion, record, "generated")}
            alt={activeVersion.title}
            fill
            unoptimized
            sizes="100vw"
          />
          <div className="proposal-export-main-visual__overlay">
            <span>{activeVersion.label}</span>
            <strong>{activeVersion.title}</strong>
            <p>{activeVersion.positioning}</p>
          </div>
        </div>
      </section>

      <section className="proposal-export-sheet proposal-export-sheet--explainer">
        <div className="proposal-export-sheet__header">
          <div>
            <span className="proposal-export-sheet__brand">{brandName}</span>
            <strong>{record.formValues.projectName}</strong>
          </div>
          <div className="proposal-export-sheet__meta">
            <span>{proposalNumber}</span>
            <span>03 / 方案说明</span>
          </div>
        </div>
        <div className="section-heading">
          <h2>03 方案说明</h2>
          <p>围绕方案定位、画面逻辑、打卡传播与落地建议组织汇报内容。</p>
        </div>
        <div className="proposal-export-explainer">
          <article className="proposal-block">
            <p className="proposal-panel__label">方案定位</p>
            <p>{activeVersion.positioning}</p>
          </article>
          <article className="proposal-block">
            <p className="proposal-panel__label">画面逻辑</p>
            <div className="proposal-list">
              {activeVersion.visualLogic.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </article>
          <article className="proposal-block">
            <p className="proposal-panel__label">打卡互动亮点</p>
            <div className="proposal-list">
              {activeVersion.interactionHighlights.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </article>
          <article className="proposal-block">
            <p className="proposal-panel__label">落地执行建议</p>
            <div className="proposal-list">
              {activeVersion.executionAdvice.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <div className="proposal-export-group proposal-export-group--comparison">
        <section className="proposal-export-sheet proposal-export-sheet--comparison">
          <div className="proposal-export-sheet__header">
            <div>
              <span className="proposal-export-sheet__brand">{brandName}</span>
              <strong>{record.formValues.projectName}</strong>
            </div>
            <div className="proposal-export-sheet__meta">
              <span>{proposalNumber}</span>
              <span>04 / 版本对比</span>
            </div>
          </div>
          <div className="section-heading">
            <h2>04 版本对比</h2>
            <p>默认导出当前版本与当前对比版本，便于甲方直观看到提案方向差异。</p>
          </div>
          <div className="version-compare-grid">
            {[activeVersion, compareVersion].map((version, index) => (
              <article key={version.id} className="version-compare-card">
                <div className="version-compare-card__header">
                  <div>
                    <span className="comparison-card__label">{index === 0 ? "当前版" : "对比版"}</span>
                    <h3>{version.label}</h3>
                  </div>
                  <div className="version-compare-card__meta">
                    <span>{getVersionSourceLabel(version)}</span>
                    <span>{getVersionTemplateLabel(version, record) || "未识别模板"}</span>
                  </div>
                </div>
                <div className="comparison-card__image version-compare-card__image">
                  <Image
                    src={getVersionImage(version, record, "generated")}
                    alt={version.title}
                    fill
                    unoptimized
                    sizes="(max-width: 1080px) 100vw, 48vw"
                  />
                </div>
                <div className="version-compare-card__body">
                  <h4>{version.title}</h4>
                  <p>{version.positioning}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="proposal-export-sheet proposal-export-sheet--difference">
          <div className="proposal-export-sheet__header">
            <div>
              <span className="proposal-export-sheet__brand">{brandName}</span>
              <strong>{record.formValues.projectName}</strong>
            </div>
            <div className="proposal-export-sheet__meta">
              <span>{proposalNumber}</span>
              <span>05 / 差异总结</span>
            </div>
          </div>
          <div className="section-heading">
            <h2>05 差异总结</h2>
            <p>以下结论用于提案比较沟通，可直接作为汇报时的口径基础。</p>
          </div>
          <div className="compare-summary">
            <div className="proposal-list">
              {differenceSummary.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <div className="proposal-export-summary-meta">
              <span>当前版：{currentTemplateLabel || "未识别模板"}</span>
              <span>对比版：{compareTemplateLabel || "未识别模板"}</span>
            </div>
          </div>
        </section>
      </div>

      <section className="proposal-export-sheet proposal-export-sheet--footer">
        <div className="proposal-export-sheet__header">
          <div>
            <span className="proposal-export-sheet__brand">{brandName}</span>
            <strong>{record.formValues.projectName}</strong>
          </div>
          <div className="proposal-export-sheet__meta">
            <span>{proposalNumber}</span>
            <span>06 / 专业备注</span>
          </div>
        </div>
        <div className="section-heading">
          <h2>06 专业备注</h2>
          <p>以下内容用于明确提案阶段属性、深化边界与后续协同方式，便于甲方和执行团队统一判断。</p>
        </div>
        <div className="proposal-list">
          <p>本方案为阶段性提案稿，当前重点用于方向确认、气质判断与传播策略沟通，不等同于最终施工深化图纸。</p>
          <p>后续可结合现场实际尺寸、墙体结构、遮挡关系及材质条件继续深化，确保提案效果与落地完成面保持一致。</p>
          <p>方案内容可根据预算控制、施工周期与重点展示面进行取舍调整，形成更适配项目现实条件的执行版本。</p>
          <p>如甲方认可当前方向，也可继续围绕色彩、主视觉焦点、打卡点和模板路径做多轮微调迭代。</p>
        </div>
        <div className="proposal-export-footerline">
          <span>{brandName}</span>
          <span>{teamName}</span>
          <span>{proposalNumber}</span>
        </div>
      </section>

      <section className="proposal-export-sheet proposal-export-sheet--cooperation">
        <div className="proposal-export-sheet__header">
          <div>
            <span className="proposal-export-sheet__brand">{brandName}</span>
            <strong>{record.formValues.projectName}</strong>
          </div>
          <div className="proposal-export-sheet__meta">
            <span>{proposalNumber}</span>
            <span>07 / 试用与合作入口</span>
          </div>
        </div>
        <div className="section-heading">
          <h2>07 试用与合作入口</h2>
          <p>如果当前提案方向已经明确，下一步可按项目阶段继续选择更轻或更深的合作方式。</p>
        </div>
        <div className="proposal-export-cooperation">
          <div className="proposal-export-cooperation__plans">
            {servicePlans.map((plan) => (
              <article key={plan.name} className="proposal-export-cooperation__plan">
                <span>{plan.name}</span>
                <strong>{plan.price}</strong>
                <p>{plan.stage}</p>
              </article>
            ))}
          </div>
          <div className="proposal-export-cooperation__contact">
            <div className="proposal-list">
              <p>建议动作：先保留当前提案编号，再根据项目阶段决定是继续试用、进入人工精修，还是直接整理成整套提案。</p>
              <p>当前演示版不做在线支付，重点是把合作路径和下一步动作讲清楚。</p>
            </div>
            <div className="tag-row">
              {contactChannels.map((item) => (
                <span key={item.label}>{item.label}：{item.value}</span>
              ))}
            </div>
            <div className="hero-actions">
              <Link href="/submit-project?source=proposal-export" className="button button--primary">
                提交项目
              </Link>
              <Link href="/cases" className="button button--secondary">
                查看案例演示
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
