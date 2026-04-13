import { cn } from "@/lib/utils";

interface ScoreBarProps {
  score: number; // 0.0 to 1.0
  className?: string;
  showLabel?: boolean;
}

function getScoreColor(score: number) {
  if (score < 0.4) return "bg-success";
  if (score < 0.7) return "bg-warning";
  return "bg-destructive";
}

function getScoreTextColor(score: number) {
  if (score < 0.4) return "text-success";
  if (score < 0.7) return "text-warning";
  return "text-destructive";
}

export default function ScoreBar({ score, className, showLabel = true }: ScoreBarProps) {
  const pct = Math.min(Math.max(score, 0), 1) * 100;
  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Score d'anomalie</span>
          <span className={cn("font-mono font-semibold", getScoreTextColor(score))}>
            {score.toFixed(2)} / 1.00
          </span>
        </div>
      )}
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", getScoreColor(score))}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
