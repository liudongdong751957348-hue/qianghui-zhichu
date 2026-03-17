import { NextResponse } from "next/server";

import { refineProposal } from "@/services/proposal-service-server";
import { ProposalRefineRequest } from "@/types/proposal";

export async function POST(request: Request) {
  const payload = (await request.json()) as ProposalRefineRequest;
  const response = await refineProposal(payload);
  return NextResponse.json(response);
}
