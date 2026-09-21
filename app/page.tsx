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
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { getAgentHistory } from "@/src/lib/agentHistory";
import { getConfidenceHistory } from "@/src/lib/confidenceHistory";
import { useAgentHistories } from "@/src/hooks/useAgentHistories";
import { useAgents } from "@/src/hooks/useAgents";
import { useAnimatedNumber } from "@/src/hooks/useAnimatedNumber";
import { useTaskQueue } from "@/src/hooks/useTaskQueue";
import type { Agent, Task } from "@/src/types/agent";

const INITIAL_AGENTS: Agent[] = [
  {
    id: "agent-avm-valuation",
    name: "AVM Valuation Agent",
    description:
      "Refreshes automated valuation model estimates as new comps and listing data arrive.",
    agentStatus: { status: "running", taskId: "task-1", progress: 62 },
  },
  {
    id: "agent-climate-risk",
    name: "Climate Risk Assessor",
    description:
      "Cross-references parcels against flood, wildfire, and wind peril models.",
    agentStatus: { status: "needs-review", confidence: 58, taskId: "task-2" },
  },
  {
    id: "agent-title-verification",
    name: "Title Verification Agent",
    description: "Drafts title chain verification plans for newly listed parcels.",
    agentStatus: { status: "queued", position: 2 },
  },
  {
    id: "agent-underwriting-triage",
    name: "Underwriting Exception Triage",
    description:
      "Classifies and routes mortgage underwriting exceptions by severity.",
    agentStatus: {
      status: "error",
      message: "Upstream underwriting API timed out.",
      taskId: "task-4",
    },
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    prompt: "Refresh AVM estimates for parcels with valuations older than 90 days",
    taskStatus: { status: "running", progress: 62 },
    createdAt: Date.now() - 1000 * 60 * 5,
  },
  {
    id: "task-2",
    prompt: "Assess flood risk exposure for Region 4 coastal parcels",
    taskStatus: { status: "needs-review", confidence: 58 },
    createdAt: Date.now() - 1000 * 60 * 12,
  },
];

const INITIAL_HISTORIES: Record<string, ReturnType<typeof getAgentHistory>> =
  Object.fromEntries(
    INITIAL_AGENTS.map((agent) => [agent.id, getAgentHistory(agent.id)])
  );

let taskIdCounter = INITIAL_TASKS.length;

function MetricCard({ label, value }: { label: string; value: number }) {
  const displayValue = useAnimatedNumber(value);
  return (
    <div className="rounded-sm border border-ink bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      <p className="font-mono text-xs text-violet-700 dark:text-violet-300">{label}</p>
      <p className="text-2xl font-semibold tabular-nums text-ink dark:text-cream">
        {displayValue}
      </p>
    </div>
  );
}

export default function Home() {
  const [selectedAgentId, setSelectedAgentId] = useState(INITIAL_AGENTS[0].id);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { tasks, addTask } = useTaskQueue(INITIAL_TASKS);
  const { agents, pauseAgent, resumeAgent } = useAgents(INITIAL_AGENTS);
  const { histories, setFeedback } = useAgentHistories(INITIAL_HISTORIES);

  const promptInputRef = useRef<HTMLInputElement>(null);
  const streamingRef = useRef<StreamingOutputHandle>(null);

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId),
    [agents, selectedAgentId]
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
    const running = agents.filter(
      (agent) => agent.agentStatus.status === "running"
    ).length;
    const needsReview = agents.filter(
      (agent) => agent.agentStatus.status === "needs-review"
    ).length;
    const queued = tasks.filter(
      (task) => task.taskStatus.status === "queued"
    ).length;
    return { running, needsReview, queued, total: agents.length };
  }, [agents, tasks]);

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
    <main className="flex flex-1 flex-col gap-6 bg-cream px-6 py-8 dark:bg-ink sm:px-10">
      <header className="relative flex flex-col items-center gap-3 pt-10 pb-2 text-center sm:pt-4">
        <div className="absolute right-0 top-0">
          <ThemeToggle />
        </div>
        <h1 className="text-4xl font-semibold text-ink dark:text-cream sm:text-5xl lg:text-6xl">
          Parcel Intelligence Console
        </h1>
        <p className="max-w-2xl text-base text-stone-600 dark:text-stone-400 sm:text-lg">
          Live view of active agents, task queue, and confidence signals across
          the property portfolio.
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
          <h2 className="text-sm font-medium text-ink dark:text-cream">
            Agents
          </h2>
          <ErrorBoundary fallbackLabel="Agents panel">
            <div className="flex flex-col gap-3">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  selected={agent.id === selectedAgentId}
                  onSelect={setSelectedAgentId}
                  onResume={resumeAgent}
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
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    Selected: {selectedAgent.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsHistoryOpen(true)}
                    className="rounded text-xs font-medium text-violet-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:text-violet-400"
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
        history={selectedAgent ? (histories[selectedAgent.id] ?? []) : []}
        confidenceHistory={
          selectedAgent ? getConfidenceHistory(selectedAgent.id) : []
        }
        isPaused={selectedAgent?.agentStatus.status === "paused"}
        onClose={() => setIsHistoryOpen(false)}
        onPause={pauseAgent}
        onResume={resumeAgent}
        onFeedback={setFeedback}
      />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-ink dark:text-cream">
          Portfolio Monitor
        </h2>
        <ErrorBoundary fallbackLabel="Portfolio monitor">
          <MonitorPanel />
        </ErrorBoundary>
      </section>
    </main>
  );
}
