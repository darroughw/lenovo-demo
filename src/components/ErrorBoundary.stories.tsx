import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ErrorBoundary } from "./ErrorBoundary";

function Safe() {
  return (
    <div className="rounded-sm border border-stone-200 bg-white p-4 text-sm text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
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
