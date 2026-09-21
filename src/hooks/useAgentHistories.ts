import { useCallback, useReducer } from "react";
import type { AgentHistoryEntry, AgentHistoryFeedback } from "@/src/types/agent";

type HistoriesState = Record<string, AgentHistoryEntry[]>;

type HistoryAction = {
  type: "SET_FEEDBACK";
  agentId: string;
  entryId: string;
  feedback: AgentHistoryFeedback;
};

function historiesReducer(state: HistoriesState, action: HistoryAction): HistoriesState {
  switch (action.type) {
    case "SET_FEEDBACK":
      return {
        ...state,
        [action.agentId]: (state[action.agentId] ?? []).map((entry) =>
          entry.id === action.entryId ? { ...entry, feedback: action.feedback } : entry
        ),
      };
  }
}

// History is keyed by agent id rather than one flat list, since feedback on
// a task belongs to a specific agent's record — mirroring how useTaskQueue
// centralizes task transitions in one reducer instead of scattering setState
// calls across event handlers.
export function useAgentHistories(initialHistories: HistoriesState) {
  const [histories, dispatch] = useReducer(historiesReducer, initialHistories);

  const setFeedback = useCallback(
    (agentId: string, entryId: string, feedback: AgentHistoryFeedback) => {
      dispatch({ type: "SET_FEEDBACK", agentId, entryId, feedback });
    },
    []
  );

  return { histories, setFeedback };
}
