import { notFound } from "next/navigation";

import { CaseStudyView } from "@/components/cases/case-study-view";
import { PageShell } from "@/components/layout/page-shell";
import { caseStudies, getCaseStudyBySlug } from "@/lib/case-studies";

export function generateStaticParams() {
  return caseStudies.map((item) => ({
    slug: item.slug,
  }));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  return (
    <PageShell>
      <CaseStudyView study={study} />
    </PageShell>
  );
}
