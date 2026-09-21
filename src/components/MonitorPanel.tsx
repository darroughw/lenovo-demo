"use client";

import { useMonitorFeed } from "@/src/hooks/useMonitorFeed";
import type { FindingSeverity } from "@/src/types/agent";

const SEVERITY_LABEL: Record<FindingSeverity, string> = {
  info: "Info",
  warning: "Warning",
  critical: "Critical",
};

const SEVERITY_BADGE_CLASS: Record<FindingSeverity, string> = {
  info: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function MonitorPanel() {
  const { findings, isWatching, reviewFinding } = useMonitorFeed();

  return (
    <div className="flex flex-col gap-3 rounded-sm border border-ink bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`h-2 w-2 shrink-0 rounded-full ${
            isWatching
              ? "animate-pulse bg-violet-500 motion-reduce:animate-none"
              : "bg-stone-300 dark:bg-stone-700"
          }`}
        />
        <span className="text-xs text-stone-500 dark:text-stone-400">
          {isWatching
            ? "Watching portfolio data for anomalies"
            : "Reconnecting to portfolio data…"}
        </span>
      </div>

      <ul role="log" aria-live="polite" className="flex flex-col gap-2">
        {findings.length === 0 && (
          <li className="text-sm text-stone-500 dark:text-stone-400">
            No findings yet — the monitor is watching portfolio data in the
            background.
          </li>
        )}
        {findings.map((finding) => (
          <li
            key={finding.id}
            className="flex flex-col gap-2 rounded-sm border border-ink p-3 dark:border-stone-800"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-ink dark:text-cream">
                {finding.summary}
              </span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_BADGE_CLASS[finding.severity]}`}
              >
                {SEVERITY_LABEL[finding.severity]}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {finding.detail}
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              {finding.confidence}% confidence — suggested:{" "}
              {finding.suggestedAction}
            </p>
            {finding.reviewStatus === "pending" ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => reviewFinding(finding.id, "accepted")}
                  aria-label={`Accept recommendation: ${finding.suggestedAction}`}
                  className="rounded-sm bg-ink px-3 py-1 text-xs font-medium text-cream hover:opacity-90 dark:bg-cream dark:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-900"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => reviewFinding(finding.id, "dismissed")}
                  aria-label={`Dismiss finding: ${finding.summary}`}
                  className="rounded-sm border border-stone-300 px-3 py-1 text-xs font-medium text-stone-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:border-stone-700 dark:text-stone-300 dark:focus-visible:ring-offset-stone-900"
                >
                  Dismiss
                </button>
              </div>
            ) : (
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
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
