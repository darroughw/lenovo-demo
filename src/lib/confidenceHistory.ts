const CONFIDENCE_HISTORY: Record<string, number[]> = {
  "agent-avm-valuation": [91, 93, 90, 94, 92],
  "agent-climate-risk": [88, 79, 74, 65, 58],
  "agent-title-verification": [85, 87, 86, 89, 88],
  "agent-underwriting-triage": [72, 68, 74, 61, 55],
};

const DEFAULT_HISTORY = [80, 78, 75, 72, 70];

export function getConfidenceHistory(agentId: string): number[] {
  return CONFIDENCE_HISTORY[agentId] ?? DEFAULT_HISTORY;
}
