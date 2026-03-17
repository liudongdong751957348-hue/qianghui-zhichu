import {
  ProposalGenerateRequest,
  ProposalRefineRequest,
  ProposalServiceResponse,
} from "@/types/proposal";

import { proposalQuickActions } from "@/services/proposal-providers/mock-provider";

async function postProposalRequest<TRequest extends ProposalGenerateRequest | ProposalRefineRequest>(
  endpoint: string,
  payload: TRequest,
): Promise<ProposalServiceResponse> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return {
      ok: false,
      data: null,
      error: {
        code: "REQUEST_FAILED",
        message: "提案服务请求失败，请稍后重试。",
        detail: `HTTP ${response.status}`,
        recoverable: true,
      },
      meta: {
        modeRequested: payload.mode || "mock",
        modeResolved: payload.mode || "mock",
        providerRequested: payload.provider || "mock",
        providerResolved: payload.provider || "mock",
        fallbackUsed: false,
        capabilities: [],
      },
    };
  }

  return (await response.json()) as ProposalServiceResponse;
}

export async function generateProposal(request: ProposalGenerateRequest): Promise<ProposalServiceResponse> {
  return postProposalRequest("/api/proposals/generate", request);
}

export async function refineProposal(request: ProposalRefineRequest): Promise<ProposalServiceResponse> {
  return postProposalRequest("/api/proposals/refine", request);
}

export async function summarizeProposal() {
  throw new Error("客户端不直接执行 summarizeProposal，请通过服务端 provider 调用。");
}

export function normalizeProposalResult() {
  throw new Error("客户端不直接执行 normalizeProposalResult，请通过服务端 provider 调用。");
}

export { proposalQuickActions };
