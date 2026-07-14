interface ConfidenceBarProps {
  label: string;
  value: number;
}

function semanticLabel(value: number): string {
  if (value >= 80) return "high confidence";
  if (value >= 50) return "medium confidence";
  return "low confidence";
}

function colorClass(value: number): string {
  if (value >= 80) return "bg-emerald-500";
  if (value >= 50) return "bg-amber-500";
  return "bg-red-500";
}

export function ConfidenceBar({ label, value }: ConfidenceBarProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${semanticLabel(value)}, ${value}%`}
        className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
      >
        <div
          className={`h-full rounded-full transition-all ${colorClass(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
