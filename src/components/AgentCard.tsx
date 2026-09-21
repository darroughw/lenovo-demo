"use client";

import { useAgentProgress } from "@/src/hooks/useAgentProgress";
import type { Agent, AgentStatus } from "@/src/types/agent";

interface AgentCardProps {
  agent: Agent;
  selected: boolean;
  onSelect: (agentId: string) => void;
  onResume: (agentId: string) => void;
}

const STATUS_LABEL: Record<AgentStatus["status"], string> = {
  idle: "Idle",
  running: "Running",
  error: "Error",
  "needs-review": "Needs Review",
  queued: "Queued",
  paused: "Paused",
};

const STATUS_BADGE_CLASS: Record<AgentStatus["status"], string> = {
  idle: "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
  running: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  error: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  "needs-review":
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  queued: "bg-stone-100 text-stone-600 dark:bg-stone-900 dark:text-stone-400",
  paused: "bg-stone-300 text-stone-800 dark:bg-stone-700 dark:text-stone-200",
};

export function AgentCard({ agent, selected, onSelect, onResume }: AgentCardProps) {
  const { agentStatus } = agent;
  const isPaused = agentStatus.status === "paused";
  // The supplementary line below (progress bar / queue position / confidence
  // / error) reflects what the agent was doing when paused, not "paused"
  // itself — the top badge already says that. isRunning stays tied to the
  // real top-level status so a paused-while-running agent stops polling for
  // progress instead of quietly continuing in the background.
  const displayStatus = isPaused ? agentStatus.previousStatus : agentStatus;
  const statusLabel = STATUS_LABEL[agentStatus.status];
  const isRunning = agentStatus.status === "running";
  const liveProgress = useAgentProgress(
    agent.id,
    isRunning,
    isRunning ? agentStatus.progress : 0
  );

  return (
    <div
      className={`flex flex-col gap-2 rounded-sm border p-4 transition-colors ${
        selected
          ? "border-violet-600 bg-violet-50 dark:bg-violet-950/40"
          : "border-ink bg-white hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700"
      } ${isPaused ? "opacity-70" : ""}`}
    >
      <button
        type="button"
        aria-pressed={selected}
        aria-label={`${agent.name}, status: ${statusLabel}${isRunning ? `, ${liveProgress}% complete` : ""}`}
        onClick={() => onSelect(agent.id)}
        className="flex w-full flex-col gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-ink"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-ink dark:text-cream">
            {agent.name}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASS[agentStatus.status]}`}
          >
            {statusLabel}
          </span>
        </div>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {agent.description}
        </p>
        {isRunning && (
          <div
            aria-hidden="true"
            className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800"
          >
            <div
              className="h-full rounded-full bg-violet-600 transition-all"
              style={{ width: `${liveProgress}%` }}
            />
          </div>
        )}
        {displayStatus.status === "queued" && (
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Position {displayStatus.position} in queue
          </span>
        )}
        {displayStatus.status === "needs-review" && (
          <span className="text-xs text-amber-600 dark:text-amber-400">
            {displayStatus.confidence}% confidence — flagged for review
          </span>
        )}
        {displayStatus.status === "error" && (
          <span className="text-xs text-red-600 dark:text-red-400">
            {displayStatus.message}
          </span>
        )}
      </button>
      {isPaused && (
        <button
          type="button"
          onClick={() => onResume(agent.id)}
          aria-label={`Resume ${agent.name}`}
          className="self-start rounded-sm border border-ink px-3 py-1 text-xs font-medium text-ink hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-stone-700 dark:text-cream dark:hover:bg-stone-800 dark:focus-visible:ring-offset-stone-900"
        >
          Resume
        </button>
      )}
    </div>
  );
}
