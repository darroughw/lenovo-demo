"use client";

import { useEffect, useRef } from "react";
import { ConfidenceTrend } from "@/src/components/ConfidenceTrend";
import type {
  Agent,
  AgentHistoryEntry,
  AgentHistoryFeedback,
  AgentHistoryStatus,
} from "@/src/types/agent";

interface AgentDetailPanelProps {
  agent: Agent | null;
  history: AgentHistoryEntry[];
  confidenceHistory: number[];
  isPaused: boolean;
  onClose: () => void;
  onPause: (agentId: string) => void;
  onResume: (agentId: string) => void;
  onFeedback: (agentId: string, entryId: string, feedback: AgentHistoryFeedback) => void;
}

const STATUS_LABEL: Record<AgentHistoryStatus, string> = {
  completed: "Completed",
  error: "Error",
  "needs-review": "Needs Review",
};

const STATUS_BADGE_CLASS: Record<AgentHistoryStatus, string> = {
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  error: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  "needs-review":
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
};

function formatRelativeTime(timestamp: number): string {
  const diffMinutes = Math.round((Date.now() - timestamp) / 60000);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.round(diffHours / 24)}d ago`;
}

function ThumbUpIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3Zm0 0 4.5-8a2 2 0 0 1 2 2.2L12.5 10H18a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 16.6 21H10a3 3 0 0 1-3-3" />
    </svg>
  );
}

function ThumbDownIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 13V4h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-3Zm0 0-4.5 8a2 2 0 0 1-2-2.2l1-5.8H6a2 2 0 0 1-2-2.4l1.4-7A2 2 0 0 1 7.4 3H14a3 3 0 0 1 3 3" />
    </svg>
  );
}

// Native <dialog> + showModal() gives focus trapping, Escape-to-close, and an
// inert background for free — imperatively driven via refs/effects rather
// than a React onClose prop, since browser support for that synthetic event
// on <dialog> isn't consistent enough to rely on.
export function AgentDetailPanel({
  agent,
  history,
  confidenceHistory,
  isPaused,
  onClose,
  onPause,
  onResume,
  onFeedback,
}: AgentDetailPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (agent && !dialog.open) dialog.showModal();
    if (!agent && dialog.open) dialog.close();
  }, [agent]);

  const sortedHistory = [...history].sort((a, b) => b.completedAt - a.completedAt);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="agent-detail-heading"
      className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-sm border border-ink bg-white p-0 text-ink backdrop:bg-stone-900/40 dark:border-stone-800 dark:bg-stone-900 dark:text-cream dark:backdrop:bg-black/60"
    >
      {agent && (
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="agent-detail-heading" className="text-base font-semibold">
                {agent.name}
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {agent.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close agent history"
              className="shrink-0 rounded-sm p-1 text-stone-500 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-stone-400 dark:hover:bg-stone-800"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-sm border border-stone-200 p-3 dark:border-stone-800">
            <span className="text-sm text-stone-600 dark:text-stone-300">
              {isPaused
                ? "This agent is paused and won't pick up new tasks."
                : "Not confident in this agent's output? Pause it until reviewed."}
            </span>
            {isPaused ? (
              <button
                type="button"
                onClick={() => onResume(agent.id)}
                className="shrink-0 rounded-sm bg-ink px-3 py-1.5 text-xs font-medium text-cream hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:bg-cream dark:text-ink"
              >
                Resume agent
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onPause(agent.id)}
                className="shrink-0 rounded-sm border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                Pause this agent
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium">Confidence trend</h3>
            <ConfidenceTrend label="Confidence" history={confidenceHistory} />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Task history</h3>
            {sortedHistory.length === 0 ? (
              <p className="text-sm text-stone-500 dark:text-stone-400">
                No task history yet for this agent.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {sortedHistory.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex flex-col gap-1 rounded-sm border border-ink p-3 dark:border-stone-800"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm text-stone-700 dark:text-stone-300">
                        {entry.prompt}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASS[entry.status]}`}
                      >
                        {STATUS_LABEL[entry.status]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                      <span>{formatRelativeTime(entry.completedAt)}</span>
                      {entry.confidence != null && (
                        <span>{entry.confidence}% confidence</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => onFeedback(agent.id, entry.id, "affirmed")}
                        aria-pressed={entry.feedback === "affirmed"}
                        aria-label={`Affirm this result: ${entry.prompt}`}
                        className={`rounded-sm p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                          entry.feedback === "affirmed"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "text-stone-400 hover:bg-stone-100 dark:text-stone-500 dark:hover:bg-stone-800"
                        }`}
                      >
                        <ThumbUpIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => onFeedback(agent.id, entry.id, "flagged")}
                        aria-pressed={entry.feedback === "flagged"}
                        aria-label={`Flag this result as wrong: ${entry.prompt}`}
                        className={`rounded-sm p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                          entry.feedback === "flagged"
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : "text-stone-400 hover:bg-stone-100 dark:text-stone-500 dark:hover:bg-stone-800"
                        }`}
                      >
                        <ThumbDownIcon />
                      </button>
                      {entry.feedback && (
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          {entry.feedback === "affirmed"
                            ? "Marked correct"
                            : "Flagged as wrong"}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
