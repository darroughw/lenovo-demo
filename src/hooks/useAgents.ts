import { useCallback, useReducer } from "react";
import type { Agent } from "@/src/types/agent";

type AgentAction =
  | { type: "PAUSE"; agentId: string }
  | { type: "RESUME"; agentId: string };

function agentsReducer(state: Agent[], action: AgentAction): Agent[] {
  switch (action.type) {
    case "PAUSE":
      return state.map((agent) =>
        agent.id === action.agentId && agent.agentStatus.status !== "paused"
          ? {
              ...agent,
              agentStatus: { status: "paused", previousStatus: agent.agentStatus },
            }
          : agent
      );
    case "RESUME":
      return state.map((agent) =>
        agent.id === action.agentId && agent.agentStatus.status === "paused"
          ? { ...agent, agentStatus: agent.agentStatus.previousStatus }
          : agent
      );
  }
}

// Pausing wraps the agent's current status rather than discarding it, so
// resuming restores exactly what the agent was doing — a running task picks
// back up "running" at its last-known progress, a queued agent goes back to
// its queue position — instead of resetting to some generic idle state.
export function useAgents(initialAgents: Agent[]) {
  const [agents, dispatch] = useReducer(agentsReducer, initialAgents);

  const pauseAgent = useCallback((agentId: string) => {
    dispatch({ type: "PAUSE", agentId });
  }, []);

  const resumeAgent = useCallback((agentId: string) => {
    dispatch({ type: "RESUME", agentId });
  }, []);

  return { agents, pauseAgent, resumeAgent };
}
