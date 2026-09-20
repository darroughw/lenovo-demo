const DEFAULT_RESPONSE =
  "Analyzing parcel-level property data. Identified three parcels with stale valuations. Cross-referencing recent comps. Drafting updated estimates for analyst review.";

const SAMPLE_RESPONSES: Record<string, string> = {
  "agent-avm-valuation": DEFAULT_RESPONSE,
  "agent-climate-risk":
    "Cross-referencing 214 parcels against updated flood zone maps. Found 12 parcels reclassified into a higher-risk tier. Confidence is moderate due to incomplete elevation survey data for Region 4.",
  "agent-title-verification":
    "Drafting title chain verification plan for 8 newly listed parcels. Applying standard lien and easement checks. Awaiting queue slot to begin execution.",
  "agent-underwriting-triage":
    "Attempting to classify inbound underwriting exception batch. Upstream underwriting API timed out after 30s. Retrying with backoff.",
};

export function getAgentResponse(agentId: string): string {
  return SAMPLE_RESPONSES[agentId] ?? DEFAULT_RESPONSE;
}
