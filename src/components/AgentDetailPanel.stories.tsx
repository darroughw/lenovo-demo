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
  id: "agent-climate-risk",
  name: "Climate Risk Assessor",
  description: "Cross-references parcels against flood, wildfire, and wind peril models.",
  agentStatus: { status: "needs-review", confidence: 58, taskId: "task-2" },
};

const history: AgentHistoryEntry[] = [
  {
    id: "hist-1",
    prompt: "Assess flood risk exposure for Region 4 coastal parcels",
    status: "needs-review",
    confidence: 58,
    completedAt: Date.now() - 1000 * 60 * 12,
  },
  {
    id: "hist-2",
    prompt: "Cross-check elevation survey data against FEMA flood maps",
    status: "needs-review",
    confidence: 65,
    completedAt: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    id: "hist-3",
    prompt: "Assess wildfire risk exposure for Region 1 parcels",
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
