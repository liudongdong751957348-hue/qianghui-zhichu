import { colorOptions, sceneOptions, styleOptions } from "@/lib/mock";
import { ProposalFormValues } from "@/types/proposal";

type BriefFormProps = {
  values: ProposalFormValues;
  onChange: (field: keyof ProposalFormValues, value: string) => void;
};

export function BriefForm({ values, onChange }: BriefFormProps) {
  return (
    <section className="surface-card">
      <div className="section-heading">
        <h2>方案需求表单</h2>
        <p>通过结构化表单沉淀提案信息，便于后续接入真实生成能力。</p>
      </div>
      <div className="form-grid">
        <label>
          <span>项目名称</span>
          <input
            value={values.projectName}
            onChange={(event) => onChange("projectName", event.target.value)}
            placeholder="例如：山谷民宿入口形象墙"
          />
        </label>
        <label>
          <span>主题方向</span>
          <input
            value={values.theme}
            onChange={(event) => onChange("theme", event.target.value)}
            placeholder="例如：在地文化与自然共生"
          />
        </label>
        <label>
          <span>风格</span>
          <select value={values.style} onChange={(event) => onChange("style", event.target.value)}>
            {styleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>色彩策略</span>
          <select value={values.colors} onChange={(event) => onChange("colors", event.target.value)}>
            {colorOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>应用场景</span>
          <select value={values.scene} onChange={(event) => onChange("scene", event.target.value)}>
            {sceneOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="form-grid__full">
          <span>补充说明</span>
          <textarea
            rows={5}
            value={values.notes}
            onChange={(event) => onChange("notes", event.target.value)}
            placeholder="例如：希望便于拍照传播，墙面右侧需要预留导视位。"
          />
        </label>
      </div>
    </section>
  );
}
