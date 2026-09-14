export type AgentStatus =
  | { status: "idle" }
  | { status: "running"; taskId: string; progress: number }
  | { status: "error"; message: string; taskId: string }
  | { status: "needs-review"; confidence: number; taskId: string }
  | { status: "queued"; position: number };

export type TaskStatus =
  | { status: "queued"; position: number }
  | { status: "running"; progress: number }
  | { status: "completed" }
  | { status: "error"; message: string }
  | { status: "needs-review"; confidence: number };

export interface Agent {
  id: string;
  name: string;
  description: string;
  agentStatus: AgentStatus;
}

export interface Task {
  id: string;
  prompt: string;
  taskStatus: TaskStatus;
  createdAt: number;
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type FindingSeverity = "info" | "warning" | "critical";

export type FindingReviewStatus = "pending" | "accepted" | "dismissed";

export interface Finding {
  id: string;
  summary: string;
  detail: string;
  severity: FindingSeverity;
  confidence: number;
  suggestedAction: string;
  createdAt: number;
  reviewStatus: FindingReviewStatus;
}

export type AgentHistoryStatus = "completed" | "error" | "needs-review";

export interface AgentHistoryEntry {
  id: string;
  prompt: string;
  status: AgentHistoryStatus;
  confidence?: number;
  completedAt: number;
}
