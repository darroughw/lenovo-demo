import type { AgentHistoryEntry } from "@/src/types/agent";

const HOUR_MS = 1000 * 60 * 60;

const AGENT_HISTORY: Record<string, AgentHistoryEntry[]> = {
  "agent-fleet-health": [
    {
      id: "hist-fleet-1",
      prompt: "Scan fleet for battery health below 80%",
      status: "completed",
      completedAt: Date.now() - HOUR_MS * 2,
    },
    {
      id: "hist-fleet-2",
      prompt: "Check firmware compliance across Region 3",
      status: "completed",
      completedAt: Date.now() - HOUR_MS * 9,
    },
    {
      id: "hist-fleet-3",
      prompt: "Flag devices with repeated thermal throttling",
      status: "needs-review",
      confidence: 61,
      completedAt: Date.now() - HOUR_MS * 27,
    },
  ],
  "agent-warranty": [
    {
      id: "hist-warranty-1",
      prompt: "Reconcile warranty status for Region 4 devices",
      status: "needs-review",
      confidence: 58,
      completedAt: Date.now() - HOUR_MS * 0.2,
    },
    {
      id: "hist-warranty-2",
      prompt: "Cross-check serials against OEM warranty API",
      status: "needs-review",
      confidence: 65,
      completedAt: Date.now() - HOUR_MS * 6,
    },
    {
      id: "hist-warranty-3",
      prompt: "Reconcile warranty status for Region 1 devices",
      status: "completed",
      completedAt: Date.now() - HOUR_MS * 30,
    },
    {
      id: "hist-warranty-4",
      prompt: "Reconcile warranty status for Region 3 devices",
      status: "completed",
      completedAt: Date.now() - HOUR_MS * 54,
    },
  ],
  "agent-provisioning": [
    {
      id: "hist-provisioning-1",
      prompt: "Draft provisioning plan for 8 newly enrolled devices",
      status: "completed",
      completedAt: Date.now() - HOUR_MS * 4,
    },
    {
      id: "hist-provisioning-2",
      prompt: "Apply standard security baseline to Region 2 batch",
      status: "completed",
      completedAt: Date.now() - HOUR_MS * 20,
    },
  ],
  "agent-support": [
    {
      id: "hist-support-1",
      prompt: "Classify inbound ticket batch",
      status: "error",
      completedAt: Date.now() - HOUR_MS * 1,
    },
    {
      id: "hist-support-2",
      prompt: "Route Region 2 login-issue tickets to on-call",
      status: "completed",
      completedAt: Date.now() - HOUR_MS * 5,
    },
    {
      id: "hist-support-3",
      prompt: "Summarize weekly ticket volume by severity",
      status: "completed",
      completedAt: Date.now() - HOUR_MS * 22,
    },
  ],
};

export function getAgentHistory(agentId: string): AgentHistoryEntry[] {
  return AGENT_HISTORY[agentId] ?? [];
}
