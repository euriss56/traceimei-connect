import { cn } from "@/lib/utils";
import type { IMEIStatut } from "@/types";

interface StatusBadgeProps {
  statut: IMEIStatut;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const config: Record<IMEIStatut, { label: string; icon: string; className: string }> = {
  legitime: { label: "LÉGITIME", icon: "🟢", className: "status-legitime" },
  suspect: { label: "SUSPECT", icon: "🟠", className: "status-suspect" },
  vole: { label: "SIGNALÉ VOLÉ", icon: "🔴", className: "status-vole" },
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-2 font-bold",
};

export default function StatusBadge({ statut, size = "md", className }: StatusBadgeProps) {
  const c = config[statut];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full font-semibold", c.className, sizeClasses[size], className)}>
      <span>{c.icon}</span>
      {c.label}
    </span>
  );
}
