"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RefreshButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      onClick={() => start(() => router.refresh())}
      className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-3.5 py-2 text-sm text-ink transition-colors hover:bg-surface-2"
    >
      <RefreshCw size={15} className={pending ? "animate-spin" : ""} aria-hidden />
      {pending ? "Спрашиваю сервер…" : "Обновить"}
    </button>
  );
}
