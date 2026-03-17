"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getHistoryRecordById, replaceHistoryRecord } from "@/lib/storage";
import {
  buildDifferenceSummary,
  getProposalVersions,
  getVersionImage,
  getVersionSourceLabel,
  getVersionTemplateLabel,
} from "@/lib/proposal-presenter";
import { generateProposal, proposalQuickActions, refineProposal } from "@/services/proposal-service";
import { getTemplateSelectionCatalog } from "@/services/proposal-templates/engine";
import {
  ProposalAdjustmentKey,
  ProposalQuickAction,
  ProposalRecord,
  ProposalSubtemplateKey,
  ProposalTemplateKey,
} from "@/types/proposal";

const templateCatalog = getTemplateSelectionCatalog();

export function ResultView() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const [record, setRecord] = useState<ProposalRecord | null>(null);
  const [ready, setReady] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [activeTweakKey, setActiveTweakKey] = useState<ProposalAdjustmentKey | null>(null);
  const [refineError, setRefineError] = useState("");
  const [isSwitchingTemplate, setIsSwitchingTemplate] = useState(false);
  const [templateSwitchError, setTemplateSwitchError] = useState("");
  const [switchTemplateKey, setSwitchTemplateKey] = useState<ProposalTemplateKey | "">("");
  const [switchSubtemplateKey, setSwitchSubtemplateKey] = useState<ProposalSubtemplateKey | "">("");
  const [compareLeftId, setCompareLeftId] = useState("");
  const [compareRightId, setCompareRightId] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setRecord(getHistoryRecordById(id));
      setReady(true);
    });
  }, [id]);

  useEffect(() => {
    if (!record) {
      return;
    }

    setSwitchTemplateKey(record.templateKey || record.recommendedTemplateKey || "");
    setSwitchSubtemplateKey(record.subtemplateKey || "");
  }, [record]);

  useEffect(() => {
    if (!record?.versions?.length) {
      return;
    }

    const active = record.versions.find((item) => item.id === record.activeVersionId) || record.versions[record.versions.length - 1];
    const previous = record.versions.length > 1 ? record.versions[record.versions.length - 2] : active;

    setCompareLeftId(active.id);
    setCompareRightId(previous.id);
  }, [record]);

  if (!ready) {
    return <section className="surface-card">正在读取方案结果...</section>;
  }

  if (!record) {
    return (
      <section className="surface-card empty-state">
        <h2>未找到方案结果</h2>
        <p>当前结果页依赖本地历史记录。请先从生成页跑通一次 mock 生成流程。</p>
        <Link href="/generate" className="button button--primary">
          前往生成页
        </Link>
      </section>
    );
  }

  const versions = getProposalVersions(record);
  const activeVersion = versions.find((item) => item.id === record.activeVersionId) || versions[versions.length - 1];
  const previousVersion = versions.length > 1 ? versions[versions.length - 2] : null;

  const positioning =
    activeVersion?.positioning ||
    `本方案定位为${record.formValues.scene}中的视觉识别主界面，重点建立统一主题印象与可传播的空间记忆点。`;
  const visualLogic =
    activeVersion?.visualLogic?.length
      ? activeVersion.visualLogic
      : [
          `画面围绕“${record.formValues.theme}”展开，建议优先强化正视角主界面的识别度。`,
          `整体采用${record.formValues.style}的构图逻辑，保证远观完整、近看有细节。`,
        ];
  const interactionHighlights =
    activeVersion?.interactionHighlights?.length
      ? activeVersion.interactionHighlights
      : [
          "建议在主体墙面形成一处标准拍照位，增强停留与传播。",
          "可加入少量识别符号或短句内容，提升打卡属性。",
        ];
  const executionAdvice =
    activeVersion?.executionAdvice?.length
      ? activeVersion.executionAdvice
      : [
          "深化阶段建议先锁定主画面比例与关键色值，再进入施工分解。",
          "如现场存在设备或结构遮挡，应同步建立避让关系图。",
        ];
  const quickActions =
    record.quickActions?.length
      ? record.quickActions
      : (proposalQuickActions.slice(0, 3) satisfies ProposalQuickAction[]);
  const currentTemplateLabel = [activeVersion?.templateName || record.templateName, activeVersion?.subtemplateName || record.subtemplateName]
    .filter(Boolean)
    .join(" / ");
  const recommendedTemplateLabel = [record.recommendedTemplateName, record.recommendedSubtemplateName].filter(Boolean).join(" / ");
  const isManualSelection = record.templateSelectionMode === "manual";
  const switchableSubtemplates = templateCatalog.find((item) => item.key === (switchTemplateKey || record.templateKey))?.subtemplates || [];
  const hasSubtemplateOptions = switchableSubtemplates.length > 0;
  const templateSwitchDescription =
    activeVersion?.sourceKind === "template-switch" && activeVersion.templateSwitchSource
      ? `本版由 ${[activeVersion.templateSwitchSource.fromTemplateName, activeVersion.templateSwitchSource.fromSubtemplateName]
          .filter(Boolean)
          .join(" / ")} 切换至 ${[activeVersion.templateName, activeVersion.subtemplateName].filter(Boolean).join(" / ")}。`
      : "";
  const compareLeftVersion = versions.find((item) => item.id === compareLeftId) || activeVersion;
  const compareRightVersion = versions.find((item) => item.id === compareRightId) || previousVersion || activeVersion;
  const differenceSummary = buildDifferenceSummary(compareLeftVersion, compareRightVersion, record);

  async function handleRefine(tweakKey: ProposalAdjustmentKey) {
    if (isRefining || !record) {
      return;
    }

    const currentRecord = record;
    setIsRefining(true);
    setActiveTweakKey(tweakKey);
    setRefineError("");

    try {
      const response = await refineProposal({
        record: currentRecord,
        tweakKey,
        fallbackToMock: true,
      });

      if (!response.ok) {
        setRefineError(response.error.message);
        return;
      }

      setRecord(response.data);
      replaceHistoryRecord(response.data);
    } finally {
      setIsRefining(false);
      setActiveTweakKey(null);
    }
  }

  async function handleTemplateSwitch() {
    if (!record || !switchTemplateKey || isSwitchingTemplate) {
      return;
    }

    const targetTemplateLabel = templateCatalog.find((item) => item.key === switchTemplateKey)?.name || "";
    const targetSubtemplateLabel =
      switchableSubtemplates.find((item) => item.key === switchSubtemplateKey)?.name || "";
    const currentLabel = [record.templateName, record.subtemplateName].filter(Boolean).join(" / ");
    const targetLabel = [targetTemplateLabel, targetSubtemplateLabel].filter(Boolean).join(" / ");

    if (currentLabel && currentLabel === targetLabel) {
      setTemplateSwitchError("当前已在该模板方向，无需重复重出。");
      return;
    }

    setIsSwitchingTemplate(true);
    setTemplateSwitchError("");

    try {
      const response = await generateProposal({
        input: {
          ...record.formValues,
          referenceImage: record.coverImage,
          templateSelection: {
            mode: "manual",
            templateKey: switchTemplateKey,
            subtemplateKey: switchSubtemplateKey || undefined,
          },
        },
        contextRecord: record,
        generationSource: "template-switch",
        templateSwitchSource: {
          trigger: "result-template-switch",
          fromTemplateKey: record.templateKey,
          fromTemplateName: record.templateName,
          fromSubtemplateKey: record.subtemplateKey,
          fromSubtemplateName: record.subtemplateName,
        },
        fallbackToMock: true,
      });

      if (!response.ok) {
        setTemplateSwitchError(response.error.message);
        return;
      }

      setRecord(response.data);
      replaceHistoryRecord(response.data);
    } finally {
      setIsSwitchingTemplate(false);
    }
  }

  return (
    <section className="proposal-board">
      <article className="surface-card proposal-hero">
        <div className="proposal-hero__meta">
          <div>
            <p className="page-eyebrow">墙绘提案展示稿</p>
            <h2>{activeVersion?.title || record.title}</h2>
          </div>
          <div className="proposal-hero__stats">
            <span>{record.formValues.scene}</span>
            <span>{record.formValues.style}</span>
            <span>{record.formValues.colors}</span>
          </div>
        </div>
        <div className="version-bar">
          <div className="version-pill">
            <span className="version-pill__label">当前查看</span>
            <strong>{activeVersion?.label || "当前版本"}</strong>
          </div>
          {previousVersion ? (
            <div className="version-pill version-pill--ghost">
              <span className="version-pill__label">上一版</span>
              <strong>{previousVersion.label}</strong>
            </div>
          ) : null}
          <p className="version-bar__hint">
            已保留原始项目数据，当前结果页可继续向后叠加微调版本，后续可直接扩展为版本对比。
          </p>
        </div>
        {templateSwitchDescription ? <p className="template-switch-note">{templateSwitchDescription}</p> : null}
        <div className="template-summary-bar">
          <div className="template-summary-card">
            <span className="template-summary-card__label">当前使用模板</span>
            <strong>{currentTemplateLabel || "未识别模板"}</strong>
            {isManualSelection ? <em>手动指定</em> : <em>系统推荐</em>}
          </div>
          <div className="template-summary-card template-summary-card--ghost">
            <span className="template-summary-card__label">系统推荐模板</span>
            <strong>{recommendedTemplateLabel || currentTemplateLabel || "待补充"}</strong>
            <p>后续可从这里扩展为“一键切换模板重出”。</p>
            <button type="button" className="button button--secondary" disabled>
              预留：切换模板重出
            </button>
          </div>
        </div>
        {record.templateRecommendationReasons?.length ? (
          <div className="template-reason-inline">
            {record.templateRecommendationReasons.map((reason) => (
              <p key={reason}>{reason}</p>
            ))}
          </div>
        ) : null}
        <p className="proposal-hero__summary">{activeVersion?.summary || record.summary}</p>
        <div className="proposal-stage">
          <div className="proposal-stage__visual">
            <div className="result-canvas result-canvas--hero">
                <Image src={record.generatedImage} alt={record.title} fill unoptimized sizes="100vw" />
              <div className="result-canvas__overlay">
                <span>{activeVersion?.label || "效果图初稿"}</span>
                <strong>{record.formValues.theme}</strong>
                <p>{positioning}</p>
              </div>
            </div>
          </div>
          <aside className="proposal-stage__aside">
            <section className="proposal-panel">
              <p className="proposal-panel__label">方案定位</p>
              <p>{positioning}</p>
            </section>
            <section className="proposal-panel">
              <p className="proposal-panel__label">切换模板重出</p>
              <div className="template-switcher">
                <label>
                  <span>主模板</span>
                  <select
                    value={switchTemplateKey}
                    onChange={(event) => {
                      const nextTemplateKey = event.target.value as ProposalTemplateKey;
                      const nextRecommendedSubtemplate =
                        templateCatalog.find((item) => item.key === nextTemplateKey)?.subtemplates[0]?.key || "";

                      setSwitchTemplateKey(nextTemplateKey);
                      setSwitchSubtemplateKey(nextRecommendedSubtemplate as ProposalSubtemplateKey | "");
                    }}
                    disabled={isSwitchingTemplate}
                  >
                    {templateCatalog.map((template) => (
                      <option key={template.key} value={template.key}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>子模板</span>
                  {hasSubtemplateOptions ? (
                    <select
                      value={switchSubtemplateKey}
                      onChange={(event) => setSwitchSubtemplateKey((event.target.value || "") as ProposalSubtemplateKey | "")}
                      disabled={isSwitchingTemplate}
                    >
                      <option value="">不指定，沿用该主模板下的自动推荐</option>
                      {switchableSubtemplates.map((subtemplate) => (
                        <option key={subtemplate.key} value={subtemplate.key}>
                          {subtemplate.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="template-switcher__empty">该主模板当前没有子模板档位，系统将直接按主模板重出。</div>
                  )}
                </label>
                {templateSwitchError ? <p className="status-message status-message--error">{templateSwitchError}</p> : null}
                <button
                  type="button"
                  className="button button--secondary button--full"
                  onClick={handleTemplateSwitch}
                  disabled={isSwitchingTemplate || !switchTemplateKey}
                >
                  {isSwitchingTemplate ? "正在切换模板重出..." : "按当前项目直接重出一版"}
                </button>
              </div>
              <p className="proposal-panel__hint">
                切换模板重出会沿用当前项目表单和现场图，不回到生成页重填，只新增一个新的提案版本。
              </p>
            </section>
            <section className="proposal-panel">
              <p className="proposal-panel__label">快捷微调</p>
              <div className="quick-action-grid">
                {quickActions.map((action) => (
                  <button
                    key={action.key}
                    type="button"
                    className="quick-action-chip"
                    onClick={() => handleRefine(action.key)}
                    disabled={isRefining}
                  >
                    {activeTweakKey === action.key ? "正在生成..." : action.label}
                  </button>
                ))}
              </div>
              {refineError ? <p className="status-message status-message--error">{refineError}</p> : null}
              <p className="proposal-panel__hint">
                微调会基于当前项目资料和现有提案逻辑生成新版本，不需要重新填写表单。
              </p>
            </section>
          </aside>
        </div>
      </article>

      <section className="surface-card proposal-compare">
        <div className="section-heading">
          <h2>版本对比</h2>
          <p>同一项目下可直接比较不同提案版本，便于向甲方说明方向差异与选择依据。</p>
        </div>
        {versions.length > 1 ? (
          <>
            <div className="compare-toolbar">
              <label>
                <span>对比版本 A</span>
                <select value={compareLeftId} onChange={(event) => setCompareLeftId(event.target.value)}>
                  {versions
                    .slice()
                    .reverse()
                    .map((version) => (
                      <option key={version.id} value={version.id}>
                        {version.label}
                      </option>
                    ))}
                </select>
              </label>
              <label>
                <span>对比版本 B</span>
                <select value={compareRightId} onChange={(event) => setCompareRightId(event.target.value)}>
                  {versions
                    .slice()
                    .reverse()
                    .map((version) => (
                      <option key={version.id} value={version.id}>
                        {version.label}
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <div className="compare-summary">
              <p className="proposal-panel__label">本版差异总结</p>
              <div className="proposal-list">
                {differenceSummary.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>

            <div className="version-compare-grid">
              {[compareLeftVersion, compareRightVersion].map((version, index) => (
                <article key={`${version?.id}-${index}`} className="version-compare-card">
                  <div className="version-compare-card__header">
                    <div>
                      <span className="comparison-card__label">{index === 0 ? "版本 A" : "版本 B"}</span>
                      <h3>{version?.label || "当前版本"}</h3>
                    </div>
                    <div className="version-compare-card__meta">
                      <span>{getVersionSourceLabel(version)}</span>
                      <span>{getVersionTemplateLabel(version, record) || "未识别模板"}</span>
                    </div>
                  </div>
                  <div className="comparison-card__image version-compare-card__image">
                    <Image
                      src={getVersionImage(version, record, "generated")}
                      alt={version?.title || record.title}
                      fill
                      unoptimized
                      sizes="(max-width: 1080px) 100vw, 48vw"
                    />
                  </div>
                  <div className="version-compare-card__body">
                    <h4>{version?.title || record.title}</h4>
                    <p>{version?.positioning || record.positioning}</p>
                  </div>
                  <div className="version-compare-card__section">
                    <p className="proposal-panel__label">画面逻辑</p>
                    <div className="proposal-list">
                      {(version?.visualLogic?.length ? version.visualLogic : record.visualLogic).map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  </div>
                  <div className="version-compare-card__section">
                    <p className="proposal-panel__label">打卡互动亮点</p>
                    <div className="proposal-list">
                      {(version?.interactionHighlights?.length ? version.interactionHighlights : record.interactionHighlights).map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  </div>
                  <div className="version-compare-card__section">
                    <p className="proposal-panel__label">落地执行建议</p>
                    <div className="proposal-list">
                      {(version?.executionAdvice?.length ? version.executionAdvice : record.executionAdvice).map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state empty-state--compare">
            <h2>版本对比待开启</h2>
            <p>当前项目只有一个版本。先做一次微调或模板切换重出，这里就会自动形成可对比的提案视图。</p>
          </div>
        )}
      </section>

      <section className="proposal-grid">
        <article className="surface-card proposal-block">
          <div className="section-heading">
            <h2>画面逻辑</h2>
            <p>从识别效率、空间秩序与传播视角建立视觉结构。</p>
          </div>
          <div className="proposal-list">
            {visualLogic.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </article>

        <article className="surface-card proposal-block">
          <div className="section-heading">
            <h2>打卡互动亮点</h2>
            <p>突出停留点与社交传播点，增强项目的被看见能力。</p>
          </div>
          <div className="proposal-list">
            {interactionHighlights.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </article>

        <article className="surface-card proposal-block">
          <div className="section-heading">
            <h2>落地执行建议</h2>
            <p>优先保障施工可控、完成面质量与后续深化效率。</p>
          </div>
          <div className="proposal-list">
            {executionAdvice.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </article>

        <article className="surface-card proposal-block proposal-block--comparison">
          <div className="section-heading">
            <h2>Before / After</h2>
            <p>为后续真实生成能力预留对比展示位，当前以 mock 版式呈现。</p>
          </div>
          <div className="comparison-grid">
            <div className="comparison-card">
              <span className="comparison-card__label">Before</span>
              <div className="comparison-card__image">
                <Image src={record.coverImage} alt="现场原始墙面" fill unoptimized sizes="(max-width: 1080px) 100vw, 32vw" />
              </div>
              <p>现场原始墙面，主要用于识别界面尺度、结构关系与可改造范围。</p>
            </div>
            <div className="comparison-card">
              <span className="comparison-card__label">After</span>
              <div className="comparison-card__image">
                <Image src={record.generatedImage} alt="墙绘提案效果图" fill unoptimized sizes="(max-width: 1080px) 100vw, 32vw" />
              </div>
              <p>
                {activeVersion?.label || "当前版本"}，重点表达
                {activeVersion?.sourceKind === "template-switch"
                  ? "本轮切换模板后的新提案方向与空间判断。"
                  : activeVersion?.tweakKey
                    ? "本轮微调后的核心方向与传播重点。"
                    : "主题方向、色彩基调和空间记忆点。"}
              </p>
            </div>
          </div>
        </article>
      </section>

      <div className="button-row">
        <Link
          href={`/proposal-export?id=${record.id}&left=${compareLeftVersion.id}&right=${compareRightVersion.id}`}
          className="button button--secondary"
        >
          导出提案
        </Link>
        <Link href="/generate" className="button button--primary">
          继续生成新方案
        </Link>
        <Link href="/history" className="button button--secondary">
          查看历史记录
        </Link>
      </div>
    </section>
  );
}
