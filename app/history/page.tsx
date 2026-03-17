import { HistoryList } from "@/components/history/history-list";
import { PageShell } from "@/components/layout/page-shell";

export default function HistoryPage() {
  return (
    <PageShell
      eyebrow="历史记录页"
      title="本地历史方案记录"
      description="自动保存最近生成的 mock 提案，便于回看结果页结构与后续演进接口层。"
    >
      <HistoryList />
    </PageShell>
  );
}
