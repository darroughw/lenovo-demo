import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MonitorPanel } from "./MonitorPanel";

const meta = {
  title: "Components/MonitorPanel",
  component: MonitorPanel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Connects to a real SSE endpoint (`/api/monitor/events`) on mount. Outside of `next dev` — e.g. in Storybook's Vite runtime — that endpoint doesn't exist, so this story renders the disconnected empty state. Run `npm run dev` and view the dashboard directly to see live findings stream in.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MonitorPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
