"use client";

import { useMonitorFeed } from "@/src/hooks/useMonitorFeed";
import type { FindingSeverity } from "@/src/types/agent";

const SEVERITY_LABEL: Record<FindingSeverity, string> = {
  info: "Info",
  warning: "Warning",
  critical: "Critical",
};

const SEVERITY_BADGE_CLASS: Record<FindingSeverity, string> = {
  info: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function MonitorPanel() {
  const { findings, isWatching, reviewFinding } = useMonitorFeed();

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`h-2 w-2 shrink-0 rounded-full ${
            isWatching
              ? "animate-pulse bg-teal-500 motion-reduce:animate-none"
              : "bg-zinc-300 dark:bg-zinc-700"
          }`}
        />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {isWatching
            ? "Watching fleet data for anomalies"
            : "Reconnecting to fleet data…"}
        </span>
      </div>

      <ul role="log" aria-live="polite" className="flex flex-col gap-2">
        {findings.length === 0 && (
          <li className="text-sm text-zinc-500 dark:text-zinc-400">
            No findings yet — the monitor is watching fleet data in the
            background.
          </li>
        )}
        {findings.map((finding) => (
          <li
            key={finding.id}
            className="flex flex-col gap-2 rounded-md border border-zinc-100 p-3 dark:border-zinc-800"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {finding.summary}
              </span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_BADGE_CLASS[finding.severity]}`}
              >
                {SEVERITY_LABEL[finding.severity]}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {finding.detail}
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              {finding.confidence}% confidence — suggested:{" "}
              {finding.suggestedAction}
            </p>
            {finding.reviewStatus === "pending" ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => reviewFinding(finding.id, "accepted")}
                  aria-label={`Accept recommendation: ${finding.suggestedAction}`}
                  className="rounded-md bg-teal-700 px-3 py-1 text-xs font-medium text-white hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => reviewFinding(finding.id, "dismissed")}
                  aria-label={`Dismiss finding: ${finding.summary}`}
                  className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:border-zinc-700 dark:text-zinc-300 dark:focus-visible:ring-offset-zinc-900"
                >
                  Dismiss
                </button>
              </div>
            ) : (
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {finding.reviewStatus === "accepted"
                  ? "Recommendation accepted"
                  : "Finding dismissed"}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
