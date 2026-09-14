"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AgentCard } from "@/src/components/AgentCard";
import { AgentDetailPanel } from "@/src/components/AgentDetailPanel";
import { ConfidenceBar } from "@/src/components/ConfidenceBar";
import { ConfidenceTrend } from "@/src/components/ConfidenceTrend";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";
import { MonitorPanel } from "@/src/components/MonitorPanel";
import { StreamingOutput, type StreamingOutputHandle } from "@/src/components/StreamingOutput";
import { TaskQueue } from "@/src/components/TaskQueue";
import { getAgentHistory } from "@/src/lib/agentHistory";
import { getConfidenceHistory } from "@/src/lib/confidenceHistory";
import { useAnimatedNumber } from "@/src/hooks/useAnimatedNumber";
import { useTaskQueue } from "@/src/hooks/useTaskQueue";
import type { Agent, Task } from "@/src/types/agent";

const AGENTS: Agent[] = [
  {
    id: "agent-fleet-health",
    name: "Fleet Health Monitor",
    description:
      "Watches device telemetry across the managed fleet for anomalies.",
    agentStatus: { status: "running", taskId: "task-1", progress: 62 },
  },
  {
    id: "agent-warranty",
    name: "Warranty Reconciliation",
    description:
      "Cross-references device serials against warranty and service records.",
    agentStatus: { status: "needs-review", confidence: 58, taskId: "task-2" },
  },
  {
    id: "agent-provisioning",
    name: "Provisioning Assistant",
    description: "Drafts provisioning plans for newly enrolled devices.",
    agentStatus: { status: "queued", position: 2 },
  },
  {
    id: "agent-support",
    name: "Support Ticket Triage",
    description: "Classifies and routes inbound support tickets by severity.",
    agentStatus: {
      status: "error",
      message: "Upstream ticketing API timed out.",
      taskId: "task-4",
    },
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    prompt: "Scan fleet for battery health below 80%",
    taskStatus: { status: "running", progress: 62 },
    createdAt: Date.now() - 1000 * 60 * 5,
  },
  {
    id: "task-2",
    prompt: "Reconcile warranty status for Region 4 devices",
    taskStatus: { status: "needs-review", confidence: 58 },
    createdAt: Date.now() - 1000 * 60 * 12,
  },
];

let taskIdCounter = INITIAL_TASKS.length;

function MetricCard({ label, value }: { label: string; value: number }) {
  const displayValue = useAnimatedNumber(value);
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
        {displayValue}
      </p>
    </div>
  );
}

export default function Home() {
  const [selectedAgentId, setSelectedAgentId] = useState(AGENTS[0].id);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { tasks, addTask } = useTaskQueue(INITIAL_TASKS);

  const promptInputRef = useRef<HTMLInputElement>(null);
  const streamingRef = useRef<StreamingOutputHandle>(null);

  const selectedAgent = useMemo(
    () => AGENTS.find((agent) => agent.id === selectedAgentId),
    [selectedAgentId]
  );

  // Cmd/Ctrl+K focuses the task prompt input; Escape cancels streaming.
  // Both are skipped while the history dialog is open — it already owns
  // Escape natively, and stealing focus out of an open modal breaks the
  // dialog's focus trap.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isFocusShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (isFocusShortcut) {
        if (isHistoryOpen) return;
        event.preventDefault();
        promptInputRef.current?.focus();
        return;
      }

      if (event.key === "Escape" && !isHistoryOpen) {
        streamingRef.current?.stop();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHistoryOpen]);

  const metrics = useMemo(() => {
    const running = AGENTS.filter(
      (agent) => agent.agentStatus.status === "running"
    ).length;
    const needsReview = AGENTS.filter(
      (agent) => agent.agentStatus.status === "needs-review"
    ).length;
    const queued = tasks.filter(
      (task) => task.taskStatus.status === "queued"
    ).length;
    return { running, needsReview, queued, total: AGENTS.length };
  }, [tasks]);

  function handleAddTask(prompt: string) {
    taskIdCounter += 1;
    addTask({
      id: `task-${taskIdCounter}`,
      prompt,
      taskStatus: { status: "queued", position: tasks.length + 1 },
      createdAt: Date.now(),
    });
  }

  return (
    <main className="flex flex-1 flex-col gap-6 bg-zinc-50 px-6 py-8 dark:bg-black sm:px-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Fleet Ops Agent Console
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Live view of active agents, task queue, and confidence signals.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Total Agents" value={metrics.total} />
        <MetricCard label="Running" value={metrics.running} />
        <MetricCard label="Needs Review" value={metrics.needsReview} />
        <MetricCard label="Queued Tasks" value={metrics.queued} />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Agents
          </h2>
          <ErrorBoundary fallbackLabel="Agents panel">
            <div className="flex flex-col gap-3">
              {AGENTS.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  selected={agent.id === selectedAgentId}
                  onSelect={setSelectedAgentId}
                />
              ))}
            </div>
          </ErrorBoundary>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="sr-only">Agent Output &amp; Task Queue</h2>
          {selectedAgent && (
            <ErrorBoundary fallbackLabel="Agent output panel">
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Selected: {selectedAgent.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsHistoryOpen(true)}
                    className="rounded text-xs font-medium text-teal-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-teal-400"
                  >
                    View full history
                  </button>
                </div>
                <StreamingOutput agentId={selectedAgent.id} ref={streamingRef} />
                {selectedAgent.agentStatus.status === "needs-review" && (
                  <>
                    <ConfidenceBar
                      label="Confidence"
                      value={selectedAgent.agentStatus.confidence}
                    />
                    <ConfidenceTrend
                      label="Confidence"
                      history={getConfidenceHistory(selectedAgent.id)}
                    />
                  </>
                )}
              </>
            </ErrorBoundary>
          )}
          <ErrorBoundary fallbackLabel="Task queue">
            <TaskQueue tasks={tasks} onAddTask={handleAddTask} ref={promptInputRef} />
          </ErrorBoundary>
        </section>
      </div>

      <AgentDetailPanel
        agent={isHistoryOpen ? (selectedAgent ?? null) : null}
        history={selectedAgent ? getAgentHistory(selectedAgent.id) : []}
        onClose={() => setIsHistoryOpen(false)}
      />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Fleet Monitor
        </h2>
        <ErrorBoundary fallbackLabel="Fleet monitor">
          <MonitorPanel />
        </ErrorBoundary>
      </section>
    </main>
  );
}
