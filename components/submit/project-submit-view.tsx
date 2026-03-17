"use client";

import Link from "next/link";
import { useState } from "react";

import {
  budgetRangeOptions,
  deliveryTypeOptions,
  demandStageOptions,
  initialInquiryValues,
  inquirySourceLabels,
  preparationNotes,
  projectTypeOptions,
} from "@/lib/project-inquiry";
import { submitProjectInquiry } from "@/services/project-inquiry-service";
import { InquirySource, ProjectInquiryFormValues, ProjectInquiryResponse } from "@/types/project-inquiry";

type FieldConfig = {
  key: keyof ProjectInquiryFormValues;
  label: string;
  type?: "text" | "textarea";
  options?: string[];
  placeholder?: string;
};

const fieldConfigs: FieldConfig[] = [
  { key: "contactName", label: "联系人姓名", placeholder: "请填写联系人姓名" },
  { key: "contactInfo", label: "联系方式", placeholder: "手机、微信或邮箱均可" },
  { key: "projectName", label: "项目名称", placeholder: "例如：古镇入口墙绘更新项目" },
  { key: "projectType", label: "项目类型", options: projectTypeOptions },
  { key: "projectLocation", label: "项目地点", placeholder: "例如：浙江杭州 / 安徽黄山" },
  { key: "demandStage", label: "当前需求阶段", options: demandStageOptions },
  { key: "budgetRange", label: "预算范围", options: budgetRangeOptions },
  { key: "deliveryType", label: "期望交付类型", options: deliveryTypeOptions },
  { key: "notes", label: "补充说明", type: "textarea", placeholder: "可补充现场情况、汇报节点、偏好风格、施工限制等" },
];

const notificationLabels = {
  email: "邮件通知",
  feishu: "飞书通知",
  wecom: "企业微信通知",
} as const;

function resolveSource(value: string | null): InquirySource {
  if (value === "home" || value === "case-study" || value === "proposal-export") {
    return value;
  }

  return "direct";
}

export function ProjectSubmitView({ sourceParam }: { sourceParam?: string }) {
  const source = resolveSource(sourceParam || null);
  const [values, setValues] = useState<ProjectInquiryFormValues>({ ...initialInquiryValues, source });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<ProjectInquiryResponse | null>(null);

  function updateField(key: keyof ProjectInquiryFormValues, value: string) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setError("");

    const result = await submitProjectInquiry({
      input: values,
    });

    setResponse(result);

    if (!result.ok) {
      setError(result.error.message);
    }

    setIsSubmitting(false);
  }

  const sourceLabel = inquirySourceLabels[source];

  return (
    <section className="submit-project-page">
      <div className="page-heading">
        <p className="page-eyebrow">项目提交入口</p>
        <h1>提交真实项目资料，先把沟通入口建起来。</h1>
        <p className="page-description">
          这条链路用于收集项目基础信息、需求阶段和期望交付方式。当前不做复杂支付，先把提案合作的第一步走通。
        </p>
      </div>

      <section className="submit-project-hero surface-card">
        <div>
          <span className="submit-project-hero__label">当前入口来源</span>
          <strong>{sourceLabel}</strong>
          <p>无论你从首页、案例页还是导出提案页进入，都会统一走这条项目提交链路，便于后续继续沟通。</p>
        </div>
        <div className="tag-row">
          <span>真实表单入口</span>
          <span>统一留资结构</span>
          <span>后续可接邮箱 / 飞书 / CRM</span>
        </div>
      </section>

      <div className="submit-project-layout">
        <section className="surface-card submit-project-form">
          <div className="section-heading">
            <h2>提交项目资料</h2>
            <p>建议先把联系人、项目基本信息和当前需求阶段补齐，方便后续判断最合适的合作方式。</p>
          </div>

          <div className="submit-project-form__grid">
            {fieldConfigs.map((field) => (
              <label key={field.key} className={field.type === "textarea" ? "field field--full" : "field"}>
                <span>{field.label}</span>
                {field.options ? (
                  <select value={values[field.key] as string} onChange={(event) => updateField(field.key, event.target.value)}>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    rows={6}
                    value={values[field.key] as string}
                    placeholder={field.placeholder}
                    onChange={(event) => updateField(field.key, event.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    value={values[field.key] as string}
                    placeholder={field.placeholder}
                    onChange={(event) => updateField(field.key, event.target.value)}
                  />
                )}
              </label>
            ))}
          </div>

          {error ? <p className="status-message status-message--error">{error}</p> : null}

          <div className="button-row">
            <button type="button" className="button button--primary" disabled={isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? "正在提交项目..." : "提交项目资料"}
            </button>
            <Link href="/generate" className="button button--secondary">
              先去试用生成
            </Link>
          </div>
        </section>

        <div className="submit-project-sidebar">
          <section className="surface-card submit-project-note">
            <div className="section-heading">
              <h2>建议准备的资料</h2>
              <p>资料越完整，越容易判断适合先做 AI 初稿、人工精修，还是直接整理整套提案。</p>
            </div>
            <div className="proposal-list">
              {preparationNotes.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </section>

          <section className="surface-card submit-project-note">
            <div className="section-heading">
              <h2>提交后会发生什么</h2>
              <p>先明确预期，避免让用户提交完之后只看到一条冷冰冰的提示。</p>
            </div>
            <div className="proposal-list">
              <p>我们会先按项目类型、需求阶段和期望交付方式做初步判断。</p>
              <p>如果资料完整，下一步通常会围绕提案方向、交付深度和时间节点继续沟通。</p>
              <p>当前演示版建议以你留下的联系方式和回执编号作为后续对接依据。</p>
            </div>
          </section>
        </div>
      </div>

      {response?.ok ? (
        <section className="surface-card submit-project-success">
          <div className="section-heading">
            <h2>已收到你的项目资料</h2>
            <p>这不是简单的提交成功提示，而是一张可继续对接的项目回执。</p>
          </div>
          <div className="submit-project-success__meta">
            <div>
              <span>回执编号</span>
              <strong>{response.data.id}</strong>
            </div>
            <div>
              <span>项目名称</span>
              <strong>{response.data.projectName}</strong>
            </div>
            <div>
              <span>提交时间</span>
              <strong>{new Date(response.data.createdAt).toLocaleString("zh-CN")}</strong>
            </div>
          </div>
          <div className="proposal-list">
            {response.nextSteps.map((item) => (
              <p key={item}>{item}</p>
            ))}
            <p>建议响应时效：演示版默认以工作时间内 1 个工作日内响应为参考，正式版可继续接入邮件、飞书或表单投递服务。</p>
          </div>
          <div className="submit-project-success__delivery">
            <div className="tag-row">
              <span>本地保存：{response.delivery.storageSaved ? "已完成" : "未启用持久化"}</span>
              {response.delivery.notifications.map((item) => (
                <span key={item.channel}>{notificationLabels[item.channel]}：{item.ok ? "已发送" : "未发送"}</span>
              ))}
            </div>
            <div className="proposal-list">
              {response.delivery.notifications.map((item) => (
                <p key={`${item.channel}-${item.message}`}>{item.message}</p>
              ))}
              <p>
                当前状态：
                {response.delivery.storageSaved
                  ? "项目资料已经进入系统留档，正在安排后续跟进，不会因为通知状态影响你的提交结果。"
                  : "当前部署环境未启用持久化存储，但本次提交已生成正式回执并已尝试发送通知，不会影响用户收到提交结果。"}
              </p>
            </div>
          </div>
          <div className="button-row">
            <Link href="/inquiries" className="button button--secondary">
              查看线索工作台
            </Link>
            <Link href="/cases" className="button button--secondary">
              查看案例演示
            </Link>
            <Link href="/generate" className="button button--primary">
              返回生成页
            </Link>
          </div>
        </section>
      ) : null}
    </section>
  );
}
