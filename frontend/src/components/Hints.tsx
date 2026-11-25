"use client";

import { Lightbulb } from "lucide-react";
import type { ReactNode } from "react";
import { usePersistentState } from "./usePersistentState";

/** Подсказки открываются строго по одной: намёк → направление → почти решение. */
export function Hints({
  taskId,
  titles,
  bodies,
}: {
  taskId: string;
  titles: string[];
  bodies: ReactNode[];
}) {
  const [opened, setOpened] = usePersistentState<number>(`hints:${taskId}`, 0);

  return (
    <div className="space-y-3">
      {titles.map((title, i) => {
        const isOpen = i < opened;
        const isNext = i === opened;
        return (
          <div
            key={i}
            className={`rounded-lg border ${
              isOpen ? "border-line bg-surface" : "border-dashed border-line-strong"
            }`}
          >
            {isOpen ? (
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-warn">
                  <Lightbulb size={15} aria-hidden /> {title}
                </div>
                {bodies[i]}
              </div>
            ) : (
              <button
                type="button"
                disabled={!isNext}
                onClick={() => setOpened(i + 1)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-muted transition-colors enabled:hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb size={15} aria-hidden /> {title}
                </span>
                <span className="text-xs">
                  {isNext ? "Открыть" : "Сначала предыдущая"}
                </span>
              </button>
            )}
          </div>
        );
      })}
      {opened > 0 ? (
        <p className="text-xs text-muted">
          Открыто подсказок: {opened} из {titles.length}. На проверке скажи, сколько понадобилось. Это честно и помогает настроить курс.
        </p>
      ) : null}
    </div>
  );
}
