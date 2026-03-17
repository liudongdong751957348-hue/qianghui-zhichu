import { NextResponse } from "next/server";

import { isInquiryAuthorized } from "@/lib/inquiry-auth";
import { updateProjectInquiryStatus } from "@/services/project-inquiry-service-server";
import { ProjectInquiryStatusUpdateRequest } from "@/types/project-inquiry";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authorized = await isInquiryAuthorized();

  if (!authorized) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "UNAUTHORIZED",
          message: "当前无权更新线索状态，请先完成内部访问验证。",
        },
      },
      { status: 401 },
    );
  }

  const { id } = await params;
  const payload = (await request.json()) as ProjectInquiryStatusUpdateRequest;
  const response = await updateProjectInquiryStatus(id, payload.status);
  return NextResponse.json(response);
}
