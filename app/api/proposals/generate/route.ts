import { NextResponse } from "next/server";

import { generateProposal } from "@/services/proposal-service-server";
import { ProposalGenerateRequest } from "@/types/proposal";

export async function POST(request: Request) {
  const payload = (await request.json()) as ProposalGenerateRequest;
  const response = await generateProposal(payload);
  return NextResponse.json(response);
}
