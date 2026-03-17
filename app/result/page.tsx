import { Suspense } from "react";

import { PageShell } from "@/components/layout/page-shell";
import { ResultView } from "@/components/result/result-view";

export default function ResultPage() {
  return (
    <PageShell
      eyebrow="结果页"
      title="墙绘提案展示稿"
      description="以提案板式呈现效果图、方案逻辑与落地建议，更适合对甲方进行方向沟通。"
    >
      <Suspense fallback={<section className="surface-card">正在读取方案结果...</section>}>
        <ResultView />
      </Suspense>
    </PageShell>
  );
}
