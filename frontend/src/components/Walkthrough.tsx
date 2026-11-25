"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { WalkthroughBlock } from "@/content/types";
import { highlightLines } from "@/lib/highlight";
import { Paragraphs } from "./Rich";

/**
 * Построчный разбор кода. Слева код, шаг подсвечивает свои строки,
 * под кодом объяснение. Клик по строке открывает шаг, в который она входит.
 */
export function Walkthrough({ block }: { block: WalkthroughBlock }) {
  const [active, setActive] = useState(0);
  const lines = highlightLines(block.code, block.lang);
  const step = block.steps[active];
  const [from, to] = step.lines;

  const stepForLine = (n: number) =>
    block.steps.findIndex((s) => n >= s.lines[0] && n <= s.lines[1]);

  return (
    <figure className="overflow-hidden rounded-xl border border-code-line bg-code-bg">
      <div className="flex items-center justify-between border-b border-code-line px-3 py-1.5">
        <span className="font-mono text-xs text-muted">{block.file}</span>
        <span className="text-xs text-muted">разбор по строкам · шаг {active + 1} из {block.steps.length}</span>
      </div>

      <pre className="overflow-x-auto py-3 font-mono text-[13px] leading-[1.65] text-code-ink">
        <code className="block min-w-max">
          {lines.map((line, i) => {
            const n = i + 1;
            const on = n >= from && n <= to;
            const owner = stepForLine(n);
            return (
              <span
                key={i}
                onClick={owner >= 0 ? () => setActive(owner) : undefined}
                className={`flex border-l-2 px-4 transition-[opacity,background-color] duration-200 ${
                  on ? "border-accent bg-accent-soft/70 opacity-100" : "border-transparent opacity-45"
                } ${owner >= 0 && !on ? "cursor-pointer hover:opacity-80" : ""}`}
              >
                <span aria-hidden className="mr-4 inline-block w-5 shrink-0 select-none text-right text-muted/70">
                  {n}
                </span>
                <span className="whitespace-pre">
                  {line.length === 0
                    ? " "
                    : line.map((tok, j) =>
                        tok.kind ? (
                          <span key={j} className={`tok-${tok.kind}`}>{tok.text}</span>
                        ) : (
                          tok.text
                        ),
                      )}
                </span>
              </span>
            );
          })}
        </code>
      </pre>

      <div className="border-t border-code-line bg-surface px-4 py-4 sm:px-5">
        <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Шаги разбора">
          {block.steps.map((s, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                i === active ? "bg-ink text-bg" : "bg-surface-2 text-ink-2 hover:bg-line"
              }`}
            >
              {i + 1}. {s.title}
            </button>
          ))}
        </div>
        <div className="min-h-20 space-y-2" aria-live="polite">
          <div className="text-sm font-semibold text-ink">
            {step.title}{" "}
            <span className="font-mono text-xs font-normal text-muted">
              {from === to ? `строка ${from}` : `строки ${from}–${to}`}
            </span>
          </div>
          <Paragraphs text={step.text} className="text-[15.5px] leading-[1.65] text-ink-2" />
        </div>
        <div className="mt-3 flex justify-between">
          <button
            type="button"
            disabled={active === 0}
            onClick={() => setActive(active - 1)}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-40"
          >
            <ChevronLeft size={16} aria-hidden /> Назад
          </button>
          <button
            type="button"
            disabled={active === block.steps.length - 1}
            onClick={() => setActive(active + 1)}
            className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-3 py-1.5 text-sm text-ink hover:bg-line disabled:opacity-40"
          >
            Дальше <ChevronRight size={16} aria-hidden />
          </button>
        </div>
      </div>
    </figure>
  );
}
