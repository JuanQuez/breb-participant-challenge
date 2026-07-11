import type { StatusTone } from "@/lib/mono/status";

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: "bg-surface text-ink/70",
  pending: "bg-brand-indigo/10 text-brand-indigo",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
};

export function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {label}
    </span>
  );
}
