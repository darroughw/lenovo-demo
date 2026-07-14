import { useCallback, useEffect, useRef, useState } from "react";

interface UseAgentStreamOptions {
  autoStart?: boolean;
}

interface UseAgentStreamResult {
  tokens: string[];
  isStreaming: boolean;
  isDone: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useAgentStream(
  agentId: string,
  { autoStart = false }: UseAgentStreamOptions = {}
): UseAgentStreamResult {
  const [tokens, setTokens] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const sourceRef = useRef<EventSource | null>(null);

  const stop = useCallback(() => {
    sourceRef.current?.close();
    sourceRef.current = null;
    setIsStreaming(false);
  }, []);

  const start = useCallback(() => {
    if (sourceRef.current) return;

    const source = new EventSource(`/api/agents/${agentId}/stream`);
    sourceRef.current = source;
    setIsStreaming(true);
    setIsDone(false);

    source.addEventListener("token", (event) => {
      const { token } = JSON.parse((event as MessageEvent).data) as {
        token: string;
      };
      setTokens((prev) => [...prev, token]);
    });

    source.addEventListener("done", () => {
      source.close();
      sourceRef.current = null;
      setIsStreaming(false);
      setIsDone(true);
    });

    source.onerror = () => {
      source.close();
      sourceRef.current = null;
      setIsStreaming(false);
    };
  }, [agentId]);

  const reset = useCallback(() => {
    stop();
    setIsDone(false);
    setTokens([]);
  }, [stop]);

  useEffect(() => {
    if (autoStart) start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { tokens, isStreaming, isDone, start, stop, reset };
}
