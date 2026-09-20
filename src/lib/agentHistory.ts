import type { AgentHistoryEntry } from "@/src/types/agent";

const HOUR_MS = 1000 * 60 * 60;

const AGENT_HISTORY: Record<string, AgentHistoryEntry[]> = {
  "agent-avm-valuation": [
    {
      id: "hist-avm-1",
      prompt: "Refresh AVM estimates for parcels with valuations older than 90 days",
      status: "completed",
      completedAt: Date.now() - HOUR_MS * 2,
    },
    {
      id: "hist-avm-2",
      prompt: "Recalculate comps for Region 3 condo listings",
      status: "completed",
      completedAt: Date.now() - HOUR_MS * 9,
    },
    {
      id: "hist-avm-3",
      prompt: "Flag parcels with repeated appraisal variance",
      status: "needs-review",
      confidence: 61,
      completedAt: Date.now() - HOUR_MS * 27,
    },
  ],
  "agent-climate-risk": [
    {
      id: "hist-climate-1",
      prompt: "Assess flood risk exposure for Region 4 coastal parcels",
      status: "needs-review",
      confidence: 58,
      completedAt: Date.now() - HOUR_MS * 0.2,
    },
    {
      id: "hist-climate-2",
      prompt: "Cross-check elevation survey data against FEMA flood maps",
      status: "needs-review",
      confidence: 65,
      completedAt: Date.now() - HOUR_MS * 6,
    },
    {
      id: "hist-climate-3",
      prompt: "Assess wildfire risk exposure for Region 1 parcels",
      status: "completed",
      completedAt: Date.now() - HOUR_MS * 30,
    },
    {
      id: "hist-climate-4",
      prompt: "Assess flood risk exposure for Region 3 parcels",
      status: "completed",
      completedAt: Date.now() - HOUR_MS * 54,
    },
  ],
  "agent-title-verification": [
    {
      id: "hist-title-1",
      prompt: "Draft title chain verification plan for 8 newly listed parcels",
      status: "completed",
      completedAt: Date.now() - HOUR_MS * 4,
    },
    {
      id: "hist-title-2",
      prompt: "Apply standard lien and easement checks to Region 2 batch",
      status: "completed",
      completedAt: Date.now() - HOUR_MS * 20,
    },
  ],
  "agent-underwriting-triage": [
    {
      id: "hist-underwriting-1",
      prompt: "Classify inbound underwriting exception batch",
      status: "error",
      completedAt: Date.now() - HOUR_MS * 1,
    },
    {
      id: "hist-underwriting-2",
      prompt: "Route Region 2 income-verification exceptions to on-call",
      status: "completed",
      completedAt: Date.now() - HOUR_MS * 5,
    },
    {
      id: "hist-underwriting-3",
      prompt: "Summarize weekly exception volume by severity",
      status: "completed",
      completedAt: Date.now() - HOUR_MS * 22,
    },
  ],
};

export function getAgentHistory(agentId: string): AgentHistoryEntry[] {
  return AGENT_HISTORY[agentId] ?? [];
}
