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
