import { NextResponse } from "next/server";

import { isInquiryAuthorized } from "@/lib/inquiry-auth";
import { listProjectInquiries, submitProjectInquiry } from "@/services/project-inquiry-service-server";
import { ProjectInquirySubmitRequest } from "@/types/project-inquiry";

export async function GET() {
  const authorized = await isInquiryAuthorized();

  if (!authorized) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "UNAUTHORIZED",
          message: "当前无权查看线索数据，请先完成内部访问验证。",
        },
      },
      { status: 401 },
    );
  }

  const response = await listProjectInquiries();
  return NextResponse.json(response);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as ProjectInquirySubmitRequest;
  const response = await submitProjectInquiry(payload);
  return NextResponse.json(response);
}
