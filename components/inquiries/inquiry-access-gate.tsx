"use client";

import { useState } from "react";

export function InquiryAccessGate({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!configured) {
      return;
    }

    setSubmitting(true);
    setError("");

    const response = await fetch("/api/inquiries/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const result = (await response.json()) as { ok: boolean; error?: { message: string } };

    if (!result.ok) {
      setError(result.error?.message || "验证失败，请稍后重试。");
      setSubmitting(false);
      return;
    }

    window.location.reload();
  }

  return (
    <section className="inquiry-access-page">
      <div className="page-heading">
        <p className="page-eyebrow">内部访问验证</p>
        <h1>线索工作台仅对已验证的内部成员开放。</h1>
        <p className="page-description">当前使用最小可用的内部访问保护方案。验证通过后，本浏览器会保持一段时间的访问状态。</p>
      </div>

      <section className="surface-card inquiry-access-card">
        <div className="section-heading">
          <h2>输入内部访问口令</h2>
          <p>这层保护只用于拦截未授权访问，后续若升级到正式登录体系，可直接替换这一层验证实现。</p>
        </div>

        {!configured ? (
          <p className="status-message status-message--error">当前尚未配置内部访问口令，请先补充环境变量后再使用线索工作台。</p>
        ) : null}

        <label className="field">
          <span>访问口令</span>
          <input
            type="password"
            value={password}
            placeholder="请输入内部访问口令"
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error ? <p className="status-message status-message--error">{error}</p> : null}

        <div className="button-row">
          <button type="button" className="button button--primary" disabled={!configured || submitting} onClick={handleSubmit}>
            {submitting ? "正在验证..." : "进入线索工作台"}
          </button>
        </div>
      </section>
    </section>
  );
}
