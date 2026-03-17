import Link from "next/link";

import { caseStudies } from "@/lib/case-studies";

export function CaseIndex() {
  return (
    <section className="case-index">
      <div className="page-heading">
        <p className="page-eyebrow">案例化演示</p>
        <h1>用三个典型项目，把墙绘直出的完整工作流讲清楚。</h1>
        <p className="page-description">
          从原墙、首版提案、微调、切模板重出，到导出提案，每个案例都对应一条完整演示路径，适合内部讲解、老客户演示和同行试用说明。
        </p>
      </div>
      <div className="case-index-grid">
        {caseStudies.map((item) => (
          <article key={item.slug} className="case-index-card">
            <span>{item.category}</span>
            <h2>{item.title}</h2>
            <p>{item.summary}</p>
            <div className="tag-row">
              <span>原墙到提案</span>
              <span>微调迭代</span>
              <span>导出汇报</span>
            </div>
            <Link href={`/cases/${item.slug}`} className="button button--secondary">
              查看案例演示
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
