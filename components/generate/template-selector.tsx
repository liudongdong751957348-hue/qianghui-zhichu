"use client";

import {
  getRecommendedTemplateSelection,
  getTemplateSelectionCatalog,
} from "@/services/proposal-templates/engine";
import {
  ProposalFormValues,
  ProposalSubtemplateKey,
  ProposalTemplateKey,
  ProposalTemplateSelectionInput,
} from "@/types/proposal";

type TemplateSelectorProps = {
  values: ProposalFormValues;
  selection: ProposalTemplateSelectionInput;
  onChange: (selection: ProposalTemplateSelectionInput) => void;
};

const templateCatalog = getTemplateSelectionCatalog();

export function TemplateSelector({ values, selection, onChange }: TemplateSelectorProps) {
  const recommendation = getRecommendedTemplateSelection(values);
  const activeTemplateKey =
    selection.mode === "manual" && selection.templateKey ? selection.templateKey : recommendation.templateKey;
  const availableSubtemplates = templateCatalog.find((item) => item.key === activeTemplateKey)?.subtemplates || [];

  function handleModeChange(mode: "auto" | "manual") {
    if (mode === "auto") {
      onChange({ mode: "auto" });
      return;
    }

    onChange({
      mode: "manual",
      templateKey: selection.templateKey || recommendation.templateKey,
      subtemplateKey:
        selection.templateKey === recommendation.templateKey
          ? selection.subtemplateKey || recommendation.subtemplateKey
          : recommendation.templateKey === selection.templateKey
            ? recommendation.subtemplateKey
            : undefined,
    });
  }

  function handleTemplateChange(templateKey: ProposalTemplateKey) {
    const recommendedSubtemplate =
      recommendation.templateKey === templateKey ? recommendation.subtemplateKey : undefined;

    onChange({
      mode: "manual",
      templateKey,
      subtemplateKey: recommendedSubtemplate,
    });
  }

  return (
    <section className="surface-card template-selector">
      <div className="section-heading">
        <h2>模板选择</h2>
        <p>系统会先给出推荐模板，你也可以手动指定提案方向，提升出图与提案表达的可控性。</p>
      </div>

      <div className="template-recommendation-card">
        <div className="template-recommendation-card__meta">
          <span className="template-chip template-chip--accent">系统推荐</span>
          <strong>
            {recommendation.templateName}
            {recommendation.subtemplateName ? ` / ${recommendation.subtemplateName}` : ""}
          </strong>
        </div>
        <div className="template-reason-list">
          {recommendation.reasons.map((reason) => (
            <p key={reason}>{reason}</p>
          ))}
        </div>
      </div>

      <div className="template-mode-toggle" role="tablist" aria-label="模板选择模式">
        <button
          type="button"
          className={selection.mode === "auto" ? "template-mode-toggle__button is-active" : "template-mode-toggle__button"}
          onClick={() => handleModeChange("auto")}
        >
          走系统推荐
        </button>
        <button
          type="button"
          className={selection.mode === "manual" ? "template-mode-toggle__button is-active" : "template-mode-toggle__button"}
          onClick={() => handleModeChange("manual")}
        >
          手动指定
        </button>
      </div>

      {selection.mode === "manual" ? (
        <div className="template-form-grid">
          <label>
            <span>主模板</span>
            <select
              value={selection.templateKey || recommendation.templateKey}
              onChange={(event) => handleTemplateChange(event.target.value as ProposalTemplateKey)}
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
            <select
              value={selection.subtemplateKey || ""}
              onChange={(event) =>
                onChange({
                  mode: "manual",
                  templateKey: selection.templateKey || recommendation.templateKey,
                  subtemplateKey: (event.target.value || undefined) as ProposalSubtemplateKey | undefined,
                })
              }
            >
              <option value="">不指定，沿用该主模板下的自动推荐</option>
              {availableSubtemplates.map((subtemplate) => (
                <option key={subtemplate.key} value={subtemplate.key}>
                  {subtemplate.name}
                </option>
              ))}
            </select>
          </label>
          <p className="template-selector__hint">
            手动指定后，首次生成将优先按你选定的模板出图；后续微调会继承这一模板路径继续迭代。
          </p>
        </div>
      ) : (
        <p className="template-selector__hint">
          当前为自动推荐模式，系统会根据场景、风格和主题字段自动匹配最合适的主模板与子模板。
        </p>
      )}
    </section>
  );
}
