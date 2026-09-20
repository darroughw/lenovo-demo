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
    prompt: "Refresh AVM estimates for parcels with valuations older than 90 days",
    taskStatus: { status: "queued", position: 1 },
    createdAt: Date.now(),
  },
  {
    id: "task-2",
    prompt: "Assess flood risk exposure for Region 4 coastal parcels",
    taskStatus: { status: "running", progress: 62 },
    createdAt: Date.now(),
  },
  {
    id: "task-3",
    prompt: "Summarize weekly new-listing intake report",
    taskStatus: { status: "completed" },
    createdAt: Date.now(),
  },
  {
    id: "task-4",
    prompt: "Classify inbound underwriting exception batch",
    taskStatus: { status: "error", message: "Upstream underwriting API timed out." },
    createdAt: Date.now(),
  },
  {
    id: "task-5",
    prompt: "Draft title verification plan for Region 2 parcels",
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
