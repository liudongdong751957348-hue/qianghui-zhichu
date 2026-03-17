"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { BriefForm } from "@/components/generate/brief-form";
import { TemplateSelector } from "@/components/generate/template-selector";
import { UploadPanel } from "@/components/generate/upload-panel";
import { saveHistoryRecord } from "@/lib/storage";
import { generateProposal } from "@/services/proposal-service";
import { ProposalFormValues, ProposalTemplateSelectionInput } from "@/types/proposal";

const initialValues: ProposalFormValues = {
  projectName: "墙绘直出示范项目",
  theme: "在地文化与公共空间活化",
  style: "现代几何壁画",
  colors: "陶土橙与米白",
  scene: "文旅街区外立面",
  notes: "希望整体克制高级，兼顾品牌识别与游客拍照传播。",
};

export function GenerateWorkbench() {
  const router = useRouter();
  const [values, setValues] = useState<ProposalFormValues>(initialValues);
  const [templateSelection, setTemplateSelection] = useState<ProposalTemplateSelectionInput>({ mode: "auto" });
  const [previewImage, setPreviewImage] = useState("/placeholders/wall-demo-1.svg");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function updateField(field: keyof ProposalFormValues, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await generateProposal({
        input: {
          ...values,
          referenceImage: previewImage,
          templateSelection,
        },
        fallbackToMock: true,
      });

      if (!response.ok) {
        setSubmitError(response.error.message);
        return;
      }

      saveHistoryRecord(response.data);
      router.push(`/result?id=${response.data.id}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="workbench-grid">
      <UploadPanel previewImage={previewImage} onFileChange={handleFileChange} />
      <div className="workbench-grid__side">
        <BriefForm values={values} onChange={updateField} />
        <TemplateSelector values={values} selection={templateSelection} onChange={setTemplateSelection} />
        <section className="surface-card surface-card--dense">
          <div className="section-heading">
            <h2>生成动作</h2>
            <p>当前会基于推荐或手动指定模板生成提案，并自动保存到本地历史记录。</p>
          </div>
          {submitError ? <p className="status-message status-message--error">{submitError}</p> : null}
          <button className="button button--primary button--full" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "正在生成方案..." : "生成墙绘效果图初稿"}
          </button>
        </section>
      </div>
    </section>
  );
}
