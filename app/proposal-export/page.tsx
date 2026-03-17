import { Suspense } from "react";

import { ProposalExportView } from "@/components/proposal/proposal-export-view";

export default function ProposalExportPage() {
  return (
    <Suspense fallback={<section className="surface-card">正在整理导出提案...</section>}>
      <ProposalExportView />
    </Suspense>
  );
}
