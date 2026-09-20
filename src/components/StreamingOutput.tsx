"use client";

import { useImperativeHandle } from "react";
import { useAgentStream } from "@/src/hooks/useAgentStream";

export interface StreamingOutputHandle {
  stop: () => void;
}

interface StreamingOutputProps {
  agentId: string;
  autoStart?: boolean;
  ref?: React.Ref<StreamingOutputHandle>;
}

// React 19 lets a function component take `ref` as a plain prop, so no
// forwardRef wrapper is needed to expose this imperative handle.
export function StreamingOutput({ agentId, autoStart, ref }: StreamingOutputProps) {
  const { tokens, isStreaming, start, stop, reset } = useAgentStream(agentId, {
    autoStart,
  });

  useImperativeHandle(ref, () => ({ stop }), [stop]);

  return (
    <div className="flex flex-col gap-3 rounded-sm border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-ink dark:text-cream">
          Agent Output
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={start}
            disabled={isStreaming}
            className="rounded-sm bg-ink px-3 py-1 text-xs font-medium text-cream hover:opacity-90 disabled:opacity-40 dark:bg-cream dark:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-900"
          >
            Start
          </button>
          <button
            type="button"
            onClick={stop}
            disabled={!isStreaming}
            className="rounded-sm bg-stone-200 px-3 py-1 text-xs font-medium text-stone-700 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:bg-stone-800 dark:text-stone-200 dark:focus-visible:ring-offset-stone-900"
          >
            Stop
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-sm border border-stone-300 px-3 py-1 text-xs font-medium text-stone-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-stone-700 dark:text-stone-300 dark:focus-visible:ring-offset-stone-900"
          >
            Reset
          </button>
        </div>
      </div>
      <div
        role="log"
        aria-live="polite"
        className="min-h-24 whitespace-pre-wrap rounded-sm bg-cream p-3 font-mono text-sm text-stone-700 dark:bg-ink dark:text-stone-300"
      >
        {tokens.join(" ")}
        {isStreaming && (
          <span
            aria-hidden="true"
            className="ml-0.5 animate-pulse motion-reduce:animate-none"
          >
            ▍
          </span>
        )}
      </div>
    </div>
  );
}
