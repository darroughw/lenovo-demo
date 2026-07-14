const DEFAULT_RESPONSE =
  "Analyzing device fleet telemetry. Identified three devices with degraded battery health. Cross-referencing warranty status. Drafting proactive replacement recommendations for IT admin review.";

const SAMPLE_RESPONSES: Record<string, string> = {
  "agent-fleet-health": DEFAULT_RESPONSE,
  "agent-warranty":
    "Cross-referencing 214 device serials against warranty records. Found 12 devices with expired coverage. Confidence is moderate due to incomplete regional service logs.",
  "agent-provisioning":
    "Drafting provisioning plan for 8 newly enrolled devices. Applying standard security baseline and app bundle. Awaiting queue slot to begin execution.",
  "agent-support":
    "Attempting to classify inbound ticket batch. Upstream ticketing API timed out after 30s. Retrying with backoff.",
};

export function getAgentResponse(agentId: string): string {
  return SAMPLE_RESPONSES[agentId] ?? DEFAULT_RESPONSE;
}
