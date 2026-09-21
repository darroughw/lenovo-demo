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
    onResume: fn(),
  },
} satisfies Meta<typeof AgentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseAgent = {
  id: "agent-avm-valuation",
  name: "AVM Valuation Agent",
  description: "Refreshes automated valuation model estimates as new comps and listing data arrive.",
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
      name: "Title Verification Agent",
      description: "Drafts title chain verification plans for newly listed parcels.",
      agentStatus: { status: "queued", position: 2 },
    } satisfies Agent,
    selected: false,
  },
};

export const NeedsReview: Story = {
  args: {
    agent: {
      ...baseAgent,
      name: "Climate Risk Assessor",
      description: "Cross-references parcels against flood, wildfire, and wind peril models.",
      agentStatus: { status: "needs-review", confidence: 58, taskId: "task-2" },
    } satisfies Agent,
    selected: false,
  },
};

export const ErrorState: Story = {
  args: {
    agent: {
      ...baseAgent,
      name: "Underwriting Exception Triage",
      description: "Classifies and routes mortgage underwriting exceptions by severity.",
      agentStatus: {
        status: "error",
        message: "Upstream underwriting API timed out.",
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

export const Paused: Story = {
  args: {
    agent: {
      ...baseAgent,
      name: "Climate Risk Assessor",
      description: "Cross-references parcels against flood, wildfire, and wind peril models.",
      agentStatus: {
        status: "paused",
        previousStatus: { status: "needs-review", confidence: 58, taskId: "task-2" },
      },
    } satisfies Agent,
    selected: false,
  },
};
