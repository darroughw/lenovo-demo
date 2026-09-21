"use client";

import { useEffect, useRef } from "react";

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HelpSection {
  title: string;
  points: string[];
}

const HELP_SECTIONS: HelpSection[] = [
  {
    title: "Agents panel",
    points: [
      "Each agent is in one of six states: idle, running, queued, needs-review, error, or paused.",
      "Click a card to select it — Agent Output, Confidence, and Task Queue update to that agent.",
      "Running agents show a live progress bar polled from the server.",
    ],
  },
  {
    title: "Agent Output",
    points: [
      "Start opens a real streaming connection; Stop cancels it mid-flight; Reset clears it.",
      "Escape also stops an active stream, from anywhere on the page.",
    ],
  },
  {
    title: "Confidence signals",
    points: [
      "When the selected agent is needs-review, a Confidence bar and a trend sparkline (last 5 runs) appear under the output.",
    ],
  },
  {
    title: "Task Queue",
    points: [
      "Type a task and click Queue (or press Enter) to add it to the list.",
      "Cmd/Ctrl+K jumps focus to the input from anywhere on the page.",
    ],
  },
  {
    title: "Agent detail panel",
    points: [
      "Click \"View full history\" next to the selected agent's name.",
      "Pause this agent / Resume agent freezes or restores its state — a running task keeps its progress, a queued one keeps its position.",
      "Thumbs-up/down on any history entry affirms or flags that specific past result.",
      "Once paused, you can also resume directly from the agent's card.",
    ],
  },
  {
    title: "Portfolio Monitor",
    points: [
      "Always-on, no start button — streams anomaly findings in the background every 6-14 seconds.",
      "Accept or Dismiss each finding; it never acts on its own.",
    ],
  },
  {
    title: "Dark mode",
    points: [
      "Toggle in the header, top-right. Light is the default regardless of your OS setting, and your choice persists across reloads.",
    ],
  },
];

// Same native <dialog> pattern as AgentDetailPanel: showModal()/close() for
// free focus trapping and Escape-to-close, and a direct DOM `close` listener
// rather than a React onClose prop for the same version-proofing reason.
export function HelpDialog({ isOpen, onClose }: HelpDialogProps) {
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
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="help-dialog-heading"
      className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-sm border border-ink bg-white p-0 text-ink backdrop:bg-stone-900/40 dark:border-stone-800 dark:bg-stone-900 dark:text-cream dark:backdrop:bg-black/60"
    >
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <h2 id="help-dialog-heading" className="text-base font-semibold">
            How to use this dashboard
          </h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close help"
            className="shrink-0 rounded-sm p-1 text-stone-500 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-stone-400 dark:hover:bg-stone-800"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {HELP_SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-1">
              <h3 className="text-sm font-medium">{section.title}</h3>
              <ul className="flex list-disc flex-col gap-1 pl-4 text-sm text-stone-600 dark:text-stone-300">
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-1 rounded-sm border border-stone-200 p-3 dark:border-stone-800">
            <h3 className="text-sm font-medium">Keyboard shortcuts</h3>
            <dl className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
              <div className="flex items-center gap-2">
                <dt>
                  <kbd className="rounded border border-stone-300 px-1.5 py-0.5 text-xs dark:border-stone-700">
                    ⌘K
                  </kbd>
                </dt>
                <dd>Focus the task input</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt>
                  <kbd className="rounded border border-stone-300 px-1.5 py-0.5 text-xs dark:border-stone-700">
                    Esc
                  </kbd>
                </dt>
                <dd>Stop an active stream, or close an open dialog</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </dialog>
  );
}
