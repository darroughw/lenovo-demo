import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { HelpDialog } from "./HelpDialog";

const meta = {
  title: "Components/HelpDialog",
  component: HelpDialog,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Renders as a native <dialog> opened via showModal() when `isOpen` is true, so it appears automatically on mount in this story.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof HelpDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
  },
};
