import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { AgentDetailPanel } from "./AgentDetailPanel";
import type { Agent, AgentHistoryEntry } from "@/src/types/agent";

const meta = {
  title: "Components/AgentDetailPanel",
  component: AgentDetailPanel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Renders as a native <dialog> opened via showModal() when `agent` is non-null, so it appears automatically on mount in these stories.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof AgentDetailPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const agent: Agent = {
  id: "agent-warranty",
  name: "Warranty Reconciliation",
  description: "Cross-references device serials against warranty and service records.",
  agentStatus: { status: "needs-review", confidence: 58, taskId: "task-2" },
};

const history: AgentHistoryEntry[] = [
  {
    id: "hist-1",
    prompt: "Reconcile warranty status for Region 4 devices",
    status: "needs-review",
    confidence: 58,
    completedAt: Date.now() - 1000 * 60 * 12,
  },
  {
    id: "hist-2",
    prompt: "Cross-check serials against OEM warranty API",
    status: "needs-review",
    confidence: 65,
    completedAt: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    id: "hist-3",
    prompt: "Reconcile warranty status for Region 1 devices",
    status: "completed",
    completedAt: Date.now() - 1000 * 60 * 60 * 30,
  },
];

export const WithHistory: Story = {
  args: {
    agent,
    history,
  },
};

export const EmptyHistory: Story = {
  args: {
    agent,
    history: [],
  },
};
