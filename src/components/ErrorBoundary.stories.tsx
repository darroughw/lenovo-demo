import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ErrorBoundary } from "./ErrorBoundary";

function Safe() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
      Renders normally.
    </div>
  );
}

function Throws(): never {
  throw new Error("Simulated render crash for the ErrorBoundary story.");
}

const meta = {
  title: "Components/ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Recovers: Story = {
  args: {
    fallbackLabel: "Agents panel",
    children: <Safe />,
  },
};

export const CatchesError: Story = {
  args: {
    fallbackLabel: "Agents panel",
    children: <Throws />,
  },
};
