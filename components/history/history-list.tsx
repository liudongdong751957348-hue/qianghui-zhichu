"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getHistoryRecords } from "@/lib/storage";
import { formatDateTime } from "@/lib/utils";
import { ProposalRecord } from "@/types/proposal";

export function HistoryList() {
  const [records, setRecords] = useState<ProposalRecord[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setRecords(getHistoryRecords());
    });
  }, []);

  if (!records.length) {
    return (
      <section className="surface-card empty-state">
        <h2>还没有历史方案</h2>
        <p>先前往生成页完成一次 mock 方案生成，结果会自动保存在本地。</p>
        <Link href="/generate" className="button button--primary">
          前往生成页
        </Link>
      </section>
    );
  }

  return (
    <section className="history-grid">
      {records.map((record) => (
        <article key={record.id} className="surface-card history-card">
          <div className="history-card__image">
            <Image src={record.coverImage} alt={record.title} fill unoptimized sizes="(max-width: 1080px) 100vw, 280px" />
          </div>
          <div className="history-card__body">
            <p className="page-eyebrow">{formatDateTime(record.createdAt)}</p>
            <h2>{record.title}</h2>
            <p>{record.summary}</p>
            <div className="tag-row">
              <span>{record.formValues.scene}</span>
              <span>{record.formValues.style}</span>
            </div>
            <Link href={`/result?id=${record.id}`} className="button button--secondary">
              查看方案详情
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
