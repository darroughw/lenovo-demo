"use client";

import { useEffect, useRef } from "react";
import type { Agent, AgentHistoryEntry, AgentHistoryStatus } from "@/src/types/agent";

interface AgentDetailPanelProps {
  agent: Agent | null;
  history: AgentHistoryEntry[];
  onClose: () => void;
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

// Native <dialog> + showModal() gives focus trapping, Escape-to-close, and an
// inert background for free — imperatively driven via refs/effects rather
// than a React onClose prop, since browser support for that synthetic event
// on <dialog> isn't consistent enough to rely on.
export function AgentDetailPanel({ agent, history, onClose }: AgentDetailPanelProps) {
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
      className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-sm border border-stone-200 bg-white p-0 text-ink backdrop:bg-stone-900/40 dark:border-stone-800 dark:bg-stone-900 dark:text-cream dark:backdrop:bg-black/60"
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
                    className="flex flex-col gap-1 rounded-sm border border-stone-100 p-3 dark:border-stone-800"
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
