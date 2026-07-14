"use client";

import { useAgentProgress } from "@/src/hooks/useAgentProgress";
import type { Agent, AgentStatus } from "@/src/types/agent";

interface AgentCardProps {
  agent: Agent;
  selected: boolean;
  onSelect: (agentId: string) => void;
}

const STATUS_LABEL: Record<AgentStatus["status"], string> = {
  idle: "Idle",
  running: "Running",
  error: "Error",
  "needs-review": "Needs Review",
  queued: "Queued",
};

const STATUS_BADGE_CLASS: Record<AgentStatus["status"], string> = {
  idle: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  running: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  error: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  "needs-review":
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  queued: "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400",
};

export function AgentCard({ agent, selected, onSelect }: AgentCardProps) {
  const { agentStatus } = agent;
  const statusLabel = STATUS_LABEL[agentStatus.status];
  const isRunning = agentStatus.status === "running";
  const liveProgress = useAgentProgress(
    agent.id,
    isRunning,
    isRunning ? agentStatus.progress : 0
  );

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${agent.name}, status: ${statusLabel}`}
      onClick={() => onSelect(agent.id)}
      className={`flex w-full flex-col gap-2 rounded-lg border p-4 text-left transition-colors ${
        selected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40"
          : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-zinc-900 dark:text-zinc-50">
          {agent.name}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASS[agentStatus.status]}`}
        >
          {statusLabel}
        </span>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {agent.description}
      </p>
      {isRunning && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${liveProgress}%` }}
          />
        </div>
      )}
      {agentStatus.status === "queued" && (
        <span className="text-xs text-zinc-400">
          Position {agentStatus.position} in queue
        </span>
      )}
      {agentStatus.status === "needs-review" && (
        <span className="text-xs text-amber-600 dark:text-amber-400">
          {agentStatus.confidence}% confidence — flagged for review
        </span>
      )}
      {agentStatus.status === "error" && (
        <span className="text-xs text-red-600 dark:text-red-400">
          {agentStatus.message}
        </span>
      )}
    </button>
  );
}
