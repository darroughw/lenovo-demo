# Parcel Intelligence Console

An AI agent dashboard for a property-data-and-risk use case: active agents with live status,
token-by-token streaming output, confidence signals with historical trend, an always-on
portfolio monitor with human-reviewed recommendations, and a task queue.

Built by [Darrough West](https://darroughw.github.io) as a portfolio piece exploring
AI-native UX patterns — streaming, confidence signaling, human-in-the-loop review, and
accessible custom components — on a modern Next.js/React stack.

## Features

- **Live agents** — status badges (running / queued / needs-review / error) with a
  real-time progress bar polled from a Route Handler
- **Streaming output** — token-by-token SSE from a `ReadableStream`, with start/stop/reset
  controls and an accessible `aria-live` log
- **Confidence signals** — a point-in-time bar plus a Recharts sparkline showing confidence
  trend across recent runs
- **Portfolio Monitor** — an always-on agent (not task-scoped) that streams anomaly findings
  via SSE and requires an explicit Accept or Dismiss per finding; it never acts on its own
- **Agent detail panel** — a native `<dialog>` with an agent's confidence trend, full task
  history with per-task thumbs-up/down feedback, and a Pause/Resume action — the answer to
  "what do you do after deciding to trust or distrust an agent"
- **Task queue** — form-driven task submission with `useReducer`-based state
- **Keyboard shortcuts** — Cmd/Ctrl+K focuses the task input, Escape cancels streaming
- **Dark mode** — manual toggle in the header, top-right; light is always the default
- **Accessibility-first** — ARIA roles/labels, visible focus states, and AA-contrast color
  choices throughout; see the Storybook a11y addon for live checks per component

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS ·
Recharts · Storybook

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

**Agents panel**
- Four agents, each in one of six states: idle, running, queued, needs-review, error, or paused
- Click a card to select it — Agent Output, Confidence, and Task Queue update to that agent
- Running agents show a live progress bar polled from the server

**Agent Output (streaming)**
- **Start** opens a real SSE connection and streams the response token-by-token
- **Stop** cancels mid-flight; **Reset** clears the output
- Also cancelable with **Escape** from anywhere on the page

**Confidence signals**
- When the selected agent is "needs-review," a **Confidence** bar (point-in-time) and a
  **Confidence trend** sparkline (last 5 runs) appear under the streaming output

**Task Queue**
- Type a task and click **Queue** (or press Enter) to add it to the list
- **Cmd/Ctrl+K** jumps focus to the input from anywhere on the page

**Agent detail panel** — click "View full history" next to the selected agent's name
- Shows the confidence trend again plus the agent's full task history
- **Pause this agent** / **Resume agent** freezes or restores its state (a running task keeps
  its progress, a queued one keeps its position) — also resumable directly from the card
- Thumbs-up/down on each history entry affirms or flags that specific past result
- Close with **✕**, **Escape**, or by clicking outside the dialog

**Portfolio Monitor** (bottom of the page)
- Always-on, no start button — streams anomaly findings in the background every 6-14 seconds
- **Accept** or **Dismiss** each finding; it never acts on its own

**Dark mode**
- Toggle (sun/moon icon) in the header, top-right — light is the default regardless of your
  OS setting, and your choice persists across reloads

**Keyboard shortcuts**
- **Cmd/Ctrl+K** — focus the task input
- **Escape** — stop an active stream, or close the history dialog if it's open

## Other scripts

```bash
npm run storybook  # component explorer at :6006, with an accessibility addon panel
npm run test        # runs every *.stories.tsx as a headless-browser Vitest test
npm run build       # production build
npm run lint        # ESLint
```

## Project structure

- `app/` — Next.js App Router pages and Route Handlers (SSE streaming, progress polling,
  monitor findings)
- `src/components/` — UI components, each paired with a `.stories.tsx`
- `src/hooks/` — data-fetching and state hooks (`useAgentStream`, `useMonitorFeed`,
  `useTaskQueue`, …)
- `src/lib/` — canned demo data (streaming samples, findings pool, task/confidence history)
- `src/types/` — shared TypeScript types, built around discriminated unions for agent/task
  status
