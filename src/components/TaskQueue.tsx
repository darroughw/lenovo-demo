"use client";

import { useState, type FormEvent } from "react";
import type { Task, TaskStatus } from "@/src/types/agent";

interface TaskQueueProps {
  tasks: Task[];
  onAddTask: (prompt: string) => void;
  ref?: React.Ref<HTMLInputElement>;
}

const STATUS_LABEL: Record<TaskStatus["status"], string> = {
  queued: "Queued",
  running: "Running",
  completed: "Completed",
  error: "Error",
  "needs-review": "Needs Review",
};

const STATUS_BADGE_CLASS: Record<TaskStatus["status"], string> = {
  queued: "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400",
  running: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  error: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  "needs-review":
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
};

export function TaskQueue({ tasks, onAddTask, ref }: TaskQueueProps) {
  const [prompt, setPrompt] = useState("");
  const [confirmation, setConfirmation] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) return;
    onAddTask(trimmed);
    setPrompt("");
    setConfirmation(`Task queued: "${trimmed}"`);
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
        Task Queue
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={ref}
            type="text"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            aria-label="New task prompt"
            placeholder="Describe a task for the agent..."
            className="w-full rounded-md border border-zinc-300 px-3 py-1.5 pr-12 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
          <kbd
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-zinc-300 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 sm:block dark:border-zinc-700 dark:text-zinc-500"
          >
            ⌘K
          </kbd>
        </div>
        <button
          type="submit"
          className="rounded-md bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
        >
          Queue
        </button>
      </form>
      <p aria-live="polite" className="sr-only">
        {confirmation}
      </p>

      <ul className="flex flex-col gap-2">
        {tasks.length === 0 && (
          <li className="text-sm text-zinc-500 dark:text-zinc-400">
            No tasks queued yet.
          </li>
        )}
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between rounded-md border border-zinc-100 px-3 py-2 dark:border-zinc-800"
          >
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              {task.prompt}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASS[task.taskStatus.status]}`}
            >
              {STATUS_LABEL[task.taskStatus.status]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
