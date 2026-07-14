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
