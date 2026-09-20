import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { StreamingOutput } from "./StreamingOutput";

const meta = {
  title: "Components/StreamingOutput",
  component: StreamingOutput,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StreamingOutput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: {
    agentId: "agent-avm-valuation",
  },
};

export const AutoStart: Story = {
  args: {
    agentId: "agent-climate-risk",
    autoStart: true,
  },
};
