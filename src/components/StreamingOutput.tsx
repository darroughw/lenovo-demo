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
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Agent Output
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={start}
            disabled={isStreaming}
            className="rounded-md bg-teal-700 px-3 py-1 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
          >
            Start
          </button>
          <button
            type="button"
            onClick={stop}
            disabled={!isStreaming}
            className="rounded-md bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:bg-zinc-800 dark:text-zinc-200 dark:focus-visible:ring-offset-zinc-900"
          >
            Stop
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:border-zinc-700 dark:text-zinc-300 dark:focus-visible:ring-offset-zinc-900"
          >
            Reset
          </button>
        </div>
      </div>
      <div
        role="log"
        aria-live="polite"
        className="min-h-24 whitespace-pre-wrap rounded-md bg-zinc-50 p-3 font-mono text-sm text-zinc-700 dark:bg-black dark:text-zinc-300"
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
