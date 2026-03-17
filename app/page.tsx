import { CapabilitySection } from "@/components/home/capability-section";
import { CooperationSection } from "@/components/home/cooperation-section";
import { CtaSection } from "@/components/home/cta-section";
import { LandingHero } from "@/components/home/landing-hero";
import { ProcessSection } from "@/components/home/process-section";
import { ScenarioSection } from "@/components/home/scenario-section";
import { ShowcaseSection } from "@/components/home/showcase-section";
import { PageShell } from "@/components/layout/page-shell";

export default function Home() {
  return (
    <PageShell>
      <LandingHero />
      <ProcessSection />
      <CapabilitySection />
      <ScenarioSection />
      <ShowcaseSection />
      <CooperationSection />
      <CtaSection />
    </PageShell>
  );
}
