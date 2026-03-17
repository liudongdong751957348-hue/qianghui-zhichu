import { GenerateWorkbench } from "@/components/generate/generate-workbench";
import { PageShell } from "@/components/layout/page-shell";

export default function GeneratePage() {
  return (
    <PageShell
      eyebrow="生成页"
      title="上传墙面照片并生成墙绘提案初稿"
      description="第一版先使用 mock 数据跑通上传、表单填写、结果展示与历史记录保存的完整流程。"
    >
      <GenerateWorkbench />
    </PageShell>
  );
}
