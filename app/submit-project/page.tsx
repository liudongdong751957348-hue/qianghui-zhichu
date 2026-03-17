import { PageShell } from "@/components/layout/page-shell";
import { ProjectSubmitView } from "@/components/submit/project-submit-view";

export default async function SubmitProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const params = await searchParams;

  return (
    <PageShell>
      <ProjectSubmitView sourceParam={params.source} />
    </PageShell>
  );
}
