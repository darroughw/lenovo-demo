import { useEffect, useRef, useState } from "react";

const POLL_INTERVAL_MS = 1500;

// Polls the agent progress endpoint while `enabled`, self-scheduling with
// setTimeout so it naturally stops once progress reaches 100 instead of
// firing dead requests off a setInterval.
export function useAgentProgress(
  agentId: string,
  enabled: boolean,
  initialProgress: number
): number {
  const [progress, setProgress] = useState(initialProgress);
  const progressRef = useRef(initialProgress);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch(`/api/agents/${agentId}/progress`);
        if (res.ok && !cancelled) {
          const data = (await res.json()) as { progress: number };
          progressRef.current = data.progress;
          setProgress(data.progress);
        }
      } catch {
        // Network hiccup — the next poll will retry.
      }
      if (!cancelled && progressRef.current < 100) {
        timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    timeoutId = setTimeout(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [agentId, enabled]);

  return progress;
}
