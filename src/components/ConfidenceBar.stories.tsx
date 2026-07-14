import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ConfidenceBar } from "./ConfidenceBar";

const meta = {
  title: "Components/ConfidenceBar",
  component: ConfidenceBar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ConfidenceBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HighConfidence: Story = {
  args: {
    label: "Accuracy",
    value: 92,
  },
};

export const MediumConfidence: Story = {
  args: {
    label: "Completeness",
    value: 65,
  },
};

export const LowConfidence: Story = {
  args: {
    label: "Source Quality",
    value: 28,
  },
};
