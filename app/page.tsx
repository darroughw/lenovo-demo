"use client";

import { useMemo, useState } from "react";
import { AgentCard } from "@/src/components/AgentCard";
import { ConfidenceBar } from "@/src/components/ConfidenceBar";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";
import { StreamingOutput } from "@/src/components/StreamingOutput";
import { TaskQueue } from "@/src/components/TaskQueue";
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
  const { tasks, addTask } = useTaskQueue(INITIAL_TASKS);

  const selectedAgent = useMemo(
    () => AGENTS.find((agent) => agent.id === selectedAgentId),
    [selectedAgentId]
  );

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
    <div className="flex flex-1 flex-col gap-6 bg-zinc-50 px-6 py-8 dark:bg-black sm:px-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          xIQ Agent Platform
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
          {selectedAgent && (
            <ErrorBoundary fallbackLabel="Agent output panel">
              <>
                <StreamingOutput agentId={selectedAgent.id} />
                {selectedAgent.agentStatus.status === "needs-review" && (
                  <ConfidenceBar
                    label="Confidence"
                    value={selectedAgent.agentStatus.confidence}
                  />
                )}
              </>
            </ErrorBoundary>
          )}
          <ErrorBoundary fallbackLabel="Task queue">
            <TaskQueue tasks={tasks} onAddTask={handleAddTask} />
          </ErrorBoundary>
        </section>
      </div>
    </div>
  );
}
