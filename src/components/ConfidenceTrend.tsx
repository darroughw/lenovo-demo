"use client";

import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

interface ConfidenceTrendProps {
  label: string;
  history: number[];
}

export function ConfidenceTrend({ label, history }: ConfidenceTrendProps) {
  const data = history.map((value, index) => ({ index, value }));
  const summary = `${label} over the last ${history.length} runs: ${history.join("%, ")}%.`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between font-mono text-xs text-stone-500 dark:text-stone-400">
        <span>{label} trend</span>
        <span className="sr-only">{summary}</span>
      </div>
      <div aria-hidden="true" className="h-10 w-full text-violet-600 dark:text-violet-400">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
            <YAxis domain={[0, 100]} hide />
            <Line
              type="monotone"
              dataKey="value"
              stroke="currentColor"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
