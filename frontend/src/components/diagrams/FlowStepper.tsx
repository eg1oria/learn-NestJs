"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Rich } from "../Rich";

export type FlowStep = { title: string; code: string; text: string };

/** Цепочка шагов: кликаешь по шагу — видишь, что происходит. */
export function FlowStepper({ steps }: { steps: FlowStep[] }) {
  const [i, setI] = useState(0);
  return (
    <div className="space-y-4">
      <ol className="flex flex-wrap items-center gap-y-2">
        {steps.map((s, j) => (
          <li key={j} className="flex items-center">
            <button
              type="button"
              onClick={() => setI(j)}
              aria-current={j === i ? "step" : undefined}
              className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                j === i
                  ? "border-accent bg-accent-soft"
                  : j < i
                    ? "border-line bg-surface-2"
                    : "border-line hover:border-line-strong"
              }`}
            >
              <span className="block text-[11px] text-muted">шаг {j + 1}</span>
              <span className="block font-mono text-[12.5px] text-ink">{s.code}</span>
            </button>
            {j < steps.length - 1 ? (
              <ChevronRight size={16} className="mx-0.5 shrink-0 text-line-strong" aria-hidden />
            ) : null}
          </li>
        ))}
      </ol>
      <div className="min-h-24 rounded-lg bg-surface-2 px-4 py-3 text-[15px] leading-relaxed text-ink-2" aria-live="polite">
        <div className="mb-1 text-sm font-semibold text-ink">{steps[i].title}</div>
        <Rich text={steps[i].text} />
      </div>
    </div>
  );
}
