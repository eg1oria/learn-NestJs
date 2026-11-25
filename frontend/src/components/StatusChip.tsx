import { Check, CircleDot, Lock, RotateCcw } from "lucide-react";
import { statusLabel, type TaskStatus } from "@/lib/progress";

const TONE: Record<TaskStatus, string> = {
  locked: "text-muted bg-surface-2",
  open: "text-accent bg-accent-soft",
  rework: "text-warn bg-warn-soft",
  accepted: "text-ok bg-ok-soft",
  accepted_with_notes: "text-ok bg-ok-soft",
  accepted_with_solution: "text-info bg-info-soft",
};

export function StatusIcon({ status, size = 14 }: { status: TaskStatus; size?: number }) {
  if (status === "locked") return <Lock size={size} aria-hidden />;
  if (status === "open") return <CircleDot size={size} aria-hidden />;
  if (status === "rework") return <RotateCcw size={size} aria-hidden />;
  return <Check size={size} strokeWidth={2.5} aria-hidden />;
}

export function StatusChip({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE[status]}`}>
      <StatusIcon status={status} size={12} />
      {statusLabel[status]}
    </span>
  );
}
