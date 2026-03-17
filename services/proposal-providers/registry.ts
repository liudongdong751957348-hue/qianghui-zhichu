import { ProposalProvider } from "@/services/proposal-providers/types";
import { mockProposalProvider } from "@/services/proposal-providers/mock-provider";
import { realProposalProvider } from "@/services/proposal-providers/real-provider";
import { ProposalProviderId, ProposalServiceMode } from "@/types/proposal";

const providers: Record<ProposalProviderId, ProposalProvider> = {
  mock: mockProposalProvider,
  "external-adapter": realProposalProvider,
};

export function getDefaultMode(): ProposalServiceMode {
  const value = process.env.PROPOSAL_SERVICE_MODE || "mock";

  if (value === "real" || value === "auto" || value === "mock") {
    return value;
  }

  return "mock";
}

export function getDefaultProviderId(): ProposalProviderId {
  const value = process.env.PROPOSAL_PROVIDER || "mock";

  if (value === "external-adapter" || value === "mock") {
    return value;
  }

  return "mock";
}

export function resolveProvider(
  mode: ProposalServiceMode,
  requestedProvider?: ProposalProviderId,
) {
  if (mode === "mock") {
    return providers.mock;
  }

  if (requestedProvider) {
    return providers[requestedProvider];
  }

  return providers[getDefaultProviderId()];
}
