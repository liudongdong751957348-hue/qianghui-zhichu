"use client";

import { useEffect, useMemo, useState } from "react";

import { inquirySourceLabels, inquiryStatusLabels, inquiryStatusOptions, projectTypeOptions } from "@/lib/project-inquiry";
import { listProjectInquiries, updateProjectInquiryStatus } from "@/services/project-inquiry-service";
import { ProjectInquiryRecord, ProjectInquiryStatus } from "@/types/project-inquiry";

const notificationLabels = {
  email: "邮件通知",
  feishu: "飞书通知",
  wecom: "企业微信通知",
} as const;

type FilterState = {
  status: ProjectInquiryStatus | "all";
  source: ProjectInquiryRecord["source"] | "all";
  projectType: ProjectInquiryRecord["projectType"] | "all";
};

const initialFilters: FilterState = {
  status: "all",
  source: "all",
  projectType: "all",
};

export function InquiryWorkbench() {
  const [records, setRecords] = useState<ProjectInquiryRecord[]>([]);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function load() {
      const response = await listProjectInquiries();

      if (!response.ok) {
        setError(response.error.message);
        setLoading(false);
        return;
      }

      setRecords(response.data);
      setSelectedId(response.data[0]?.id || "");
      setLoading(false);
    }

    void load();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      if (filters.status !== "all" && item.status !== filters.status) {
        return false;
      }

      if (filters.source !== "all" && item.source !== filters.source) {
        return false;
      }

      if (filters.projectType !== "all" && item.projectType !== filters.projectType) {
        return false;
      }

      return true;
    });
  }, [filters, records]);

  const selectedRecord =
    filteredRecords.find((item) => item.id === selectedId) ||
    records.find((item) => item.id === selectedId) ||
    filteredRecords[0] ||
    null;

  async function handleStatusChange(status: ProjectInquiryStatus) {
    if (!selectedRecord) {
      return;
    }

    setSavingStatus(true);
    const response = await updateProjectInquiryStatus(selectedRecord.id, status);

    if (response.ok) {
      setRecords((current) => current.map((item) => (item.id === response.data.id ? response.data : item)));
      setSelectedId(response.data.id);
    } else {
      setError(response.error.message);
    }

    setSavingStatus(false);
  }

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/inquiries/session", {
      method: "DELETE",
    });
    window.location.reload();
  }

  return (
    <section className="inquiry-workbench">
      <div className="page-heading">
        <p className="page-eyebrow">内部线索工作台</p>
        <h1>在线查看项目线索，不用再翻本地 JSON 文件。</h1>
        <p className="page-description">这是一版最小可用的内部线索查看页，适合先查看提交记录、筛选线索并更新跟进状态。</p>
        <div className="button-row">
          <button type="button" className="button button--secondary" disabled={loggingOut} onClick={handleLogout}>
            {loggingOut ? "正在退出..." : "退出内部访问"}
          </button>
        </div>
      </div>

      <section className="surface-card inquiry-filter-bar">
        <div className="field">
          <span>按状态筛选</span>
          <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value as FilterState["status"] }))}>
            <option value="all">全部状态</option>
            {inquiryStatusOptions.map((item) => (
              <option key={item} value={item}>
                {inquiryStatusLabels[item]}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <span>按来源入口筛选</span>
          <select value={filters.source} onChange={(event) => setFilters((current) => ({ ...current, source: event.target.value as FilterState["source"] }))}>
            <option value="all">全部来源</option>
            {Object.entries(inquirySourceLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <span>按项目类型筛选</span>
          <select
            value={filters.projectType}
            onChange={(event) => setFilters((current) => ({ ...current, projectType: event.target.value as FilterState["projectType"] }))}
          >
            <option value="all">全部类型</option>
            {projectTypeOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      {error ? <p className="status-message status-message--error">{error}</p> : null}

      <div className="inquiry-layout">
        <section className="surface-card inquiry-list-card">
          <div className="section-heading">
            <h2>线索列表</h2>
            <p>默认按最新提交时间排序，先看最需要响应的项目。</p>
          </div>

          {loading ? <p className="empty-state">正在读取线索列表...</p> : null}

          {!loading && filteredRecords.length === 0 ? (
            <div className="empty-state">
              <h2>暂无匹配线索</h2>
              <p>当前筛选条件下没有可显示的项目提交记录。</p>
            </div>
          ) : null}

          <div className="inquiry-list">
            {filteredRecords.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`inquiry-list-item ${selectedRecord?.id === item.id ? "is-active" : ""}`}
                onClick={() => setSelectedId(item.id)}
              >
                <div className="inquiry-list-item__top">
                  <strong>{item.projectName}</strong>
                  <span>{inquiryStatusLabels[item.status]}</span>
                </div>
                <div className="inquiry-list-item__meta">
                  <span>{item.id}</span>
                  <span>{item.contactName}</span>
                  <span>{item.contactInfo}</span>
                </div>
                <div className="tag-row">
                  <span>{item.projectType}</span>
                  <span>{item.projectLocation}</span>
                  <span>{item.budgetRange}</span>
                  <span>{inquirySourceLabels[item.source]}</span>
                </div>
                <p>{new Date(item.createdAt).toLocaleString("zh-CN")}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="surface-card inquiry-detail-card">
          <div className="section-heading">
            <h2>线索详情</h2>
            <p>查看完整项目资料、通知状态，并直接在本地更新跟进状态。</p>
          </div>

          {!selectedRecord ? (
            <div className="empty-state">
              <h2>尚未选择线索</h2>
              <p>请先从左侧列表中选择一条项目线索。</p>
            </div>
          ) : (
            <div className="inquiry-detail">
              <div className="inquiry-detail__hero">
                <div>
                  <span>{selectedRecord.id}</span>
                  <h3>{selectedRecord.projectName}</h3>
                  <p>
                    {selectedRecord.projectType} · {selectedRecord.projectLocation} · {inquirySourceLabels[selectedRecord.source]}
                  </p>
                </div>
                <div className="field">
                  <span>当前状态</span>
                  <select
                    value={selectedRecord.status}
                    disabled={savingStatus}
                    onChange={(event) => void handleStatusChange(event.target.value as ProjectInquiryStatus)}
                  >
                    {inquiryStatusOptions.map((item) => (
                      <option key={item} value={item}>
                        {inquiryStatusLabels[item]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="inquiry-detail__grid">
                <article className="inquiry-detail__block">
                  <strong>基础信息</strong>
                  <div className="proposal-list">
                    <p>联系人姓名：{selectedRecord.contactName}</p>
                    <p>联系方式：{selectedRecord.contactInfo}</p>
                    <p>项目名称：{selectedRecord.projectName}</p>
                    <p>项目类型：{selectedRecord.projectType}</p>
                    <p>项目地点：{selectedRecord.projectLocation}</p>
                  </div>
                </article>

                <article className="inquiry-detail__block">
                  <strong>项目判断</strong>
                  <div className="proposal-list">
                    <p>当前需求阶段：{selectedRecord.demandStage}</p>
                    <p>预算范围：{selectedRecord.budgetRange}</p>
                    <p>期望交付类型：{selectedRecord.deliveryType}</p>
                    <p>来源入口：{inquirySourceLabels[selectedRecord.source]}</p>
                    <p>提交时间：{new Date(selectedRecord.createdAt).toLocaleString("zh-CN")}</p>
                  </div>
                </article>

                <article className="inquiry-detail__block inquiry-detail__block--full">
                  <strong>补充说明</strong>
                  <p>{selectedRecord.notes || "未填写补充说明。"}</p>
                </article>

                <article className="inquiry-detail__block inquiry-detail__block--full">
                  <strong>通知状态</strong>
                  <div className="tag-row">
                    <span>本地保存：已完成</span>
                    {selectedRecord.delivery.notifications.map((item) => (
                      <span key={item.channel}>
                        {notificationLabels[item.channel]}：{item.ok ? "已发送" : "未发送"}
                      </span>
                    ))}
                  </div>
                  <div className="proposal-list">
                    {selectedRecord.delivery.notifications.map((item) => (
                      <p key={`${item.channel}-${item.message}`}>{item.message}</p>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
