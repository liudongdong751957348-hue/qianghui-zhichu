import { isInquiryAuthConfigured, isInquiryAuthorized } from "@/lib/inquiry-auth";
import { InquiryAccessGate } from "@/components/inquiries/inquiry-access-gate";
import { PageShell } from "@/components/layout/page-shell";
import { InquiryWorkbench } from "@/components/inquiries/inquiry-workbench";

export default async function InquiriesPage() {
  const authorized = await isInquiryAuthorized();
  const configured = isInquiryAuthConfigured();

  return (
    <PageShell>
      {authorized ? <InquiryWorkbench /> : <InquiryAccessGate configured={configured} />}
    </PageShell>
  );
}
