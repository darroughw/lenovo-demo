import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ConfidenceTrend } from "./ConfidenceTrend";

const meta = {
  title: "Components/ConfidenceTrend",
  component: ConfidenceTrend,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ConfidenceTrend>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Declining: Story = {
  args: {
    label: "Confidence",
    history: [88, 79, 74, 65, 58],
  },
};

export const Improving: Story = {
  args: {
    label: "Confidence",
    history: [55, 61, 68, 74, 82],
  },
};

export const Stable: Story = {
  args: {
    label: "Confidence",
    history: [91, 93, 90, 94, 92],
  },
};
