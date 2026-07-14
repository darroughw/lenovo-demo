import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { TaskQueue } from "./TaskQueue";
import type { Task } from "@/src/types/agent";

const meta = {
  title: "Components/TaskQueue",
  component: TaskQueue,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onAddTask: fn(),
  },
} satisfies Meta<typeof TaskQueue>;

export default meta;
type Story = StoryObj<typeof meta>;

const ALL_STATUSES: Task[] = [
  {
    id: "task-1",
    prompt: "Scan fleet for battery health below 80%",
    taskStatus: { status: "queued", position: 1 },
    createdAt: Date.now(),
  },
  {
    id: "task-2",
    prompt: "Reconcile warranty status for Region 4 devices",
    taskStatus: { status: "running", progress: 62 },
    createdAt: Date.now(),
  },
  {
    id: "task-3",
    prompt: "Summarize weekly device enrollment report",
    taskStatus: { status: "completed" },
    createdAt: Date.now(),
  },
  {
    id: "task-4",
    prompt: "Classify inbound support ticket batch",
    taskStatus: { status: "error", message: "Upstream ticketing API timed out." },
    createdAt: Date.now(),
  },
  {
    id: "task-5",
    prompt: "Draft provisioning plan for Region 2 devices",
    taskStatus: { status: "needs-review", confidence: 58 },
    createdAt: Date.now(),
  },
];

export const AllStatuses: Story = {
  args: {
    tasks: ALL_STATUSES,
  },
};

export const Empty: Story = {
  args: {
    tasks: [],
  },
};
