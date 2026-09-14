const CONFIDENCE_HISTORY: Record<string, number[]> = {
  "agent-fleet-health": [91, 93, 90, 94, 92],
  "agent-warranty": [88, 79, 74, 65, 58],
  "agent-provisioning": [85, 87, 86, 89, 88],
  "agent-support": [72, 68, 74, 61, 55],
};

const DEFAULT_HISTORY = [80, 78, 75, 72, 70];

export function getConfidenceHistory(agentId: string): number[] {
  return CONFIDENCE_HISTORY[agentId] ?? DEFAULT_HISTORY;
}
