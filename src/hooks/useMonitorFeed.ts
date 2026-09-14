import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import type { Finding, FindingReviewStatus } from "@/src/types/agent";

const MAX_FINDINGS = 8;

type FindingAction =
  | { type: "ADD_FINDING"; finding: Finding }
  | {
      type: "REVIEW_FINDING";
      findingId: string;
      reviewStatus: FindingReviewStatus;
    };

function findingsReducer(state: Finding[], action: FindingAction): Finding[] {
  switch (action.type) {
    case "ADD_FINDING":
      return [action.finding, ...state].slice(0, MAX_FINDINGS);
    case "REVIEW_FINDING":
      return state.map((finding) =>
        finding.id === action.findingId
          ? { ...finding, reviewStatus: action.reviewStatus }
          : finding
      );
  }
}

interface UseMonitorFeedResult {
  findings: Finding[];
  isWatching: boolean;
  reviewFinding: (findingId: string, reviewStatus: FindingReviewStatus) => void;
}

// Always-on: connects on mount and stays connected for the component's
// lifetime, unlike useAgentStream which is start/stop controlled per task.
// EventSource retries automatically on a dropped connection, which is the
// behavior we want here — "isWatching" just reflects that connection state.
export function useMonitorFeed(): UseMonitorFeedResult {
  const [findings, dispatch] = useReducer(findingsReducer, []);
  const [isWatching, setIsWatching] = useState(false);
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const source = new EventSource("/api/monitor/events");
    sourceRef.current = source;

    source.onopen = () => setIsWatching(true);
    source.onerror = () => setIsWatching(false);

    source.addEventListener("finding", (event) => {
      const finding = JSON.parse((event as MessageEvent).data) as Omit<
        Finding,
        "reviewStatus"
      >;
      dispatch({
        type: "ADD_FINDING",
        finding: { ...finding, reviewStatus: "pending" },
      });
    });

    return () => {
      source.close();
      sourceRef.current = null;
    };
  }, []);

  const reviewFinding = useCallback(
    (findingId: string, reviewStatus: FindingReviewStatus) => {
      dispatch({ type: "REVIEW_FINDING", findingId, reviewStatus });
    },
    []
  );

  return { findings, isWatching, reviewFinding };
}
