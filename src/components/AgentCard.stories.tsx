import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { AgentCard } from "./AgentCard";
import type { Agent } from "@/src/types/agent";

const meta = {
  title: "Components/AgentCard",
  component: AgentCard,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onSelect: fn(),
  },
} satisfies Meta<typeof AgentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseAgent = {
  id: "agent-fleet-health",
  name: "Fleet Health Monitor",
  description: "Watches device telemetry across the managed fleet for anomalies.",
};

export const Idle: Story = {
  args: {
    agent: { ...baseAgent, agentStatus: { status: "idle" } } satisfies Agent,
    selected: false,
  },
};

export const Running: Story = {
  args: {
    agent: {
      ...baseAgent,
      agentStatus: { status: "running", taskId: "task-1", progress: 62 },
    } satisfies Agent,
    selected: false,
  },
};

export const Queued: Story = {
  args: {
    agent: {
      ...baseAgent,
      name: "Provisioning Assistant",
      description: "Drafts provisioning plans for newly enrolled devices.",
      agentStatus: { status: "queued", position: 2 },
    } satisfies Agent,
    selected: false,
  },
};

export const NeedsReview: Story = {
  args: {
    agent: {
      ...baseAgent,
      name: "Warranty Reconciliation",
      description: "Cross-references device serials against warranty and service records.",
      agentStatus: { status: "needs-review", confidence: 58, taskId: "task-2" },
    } satisfies Agent,
    selected: false,
  },
};

export const ErrorState: Story = {
  args: {
    agent: {
      ...baseAgent,
      name: "Support Ticket Triage",
      description: "Classifies and routes inbound support tickets by severity.",
      agentStatus: {
        status: "error",
        message: "Upstream ticketing API timed out.",
        taskId: "task-4",
      },
    } satisfies Agent,
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    agent: {
      ...baseAgent,
      agentStatus: { status: "running", taskId: "task-1", progress: 62 },
    } satisfies Agent,
    selected: true,
  },
};
