"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { SequenceBlock } from "@/content/types";
import { Paragraphs } from "./Rich";
import { SvgScroller } from "./diagrams/Frame";

const W = 720;
const TOP = 58;
const ROW = 46;

/**
 * Диаграмма последовательности (sequence diagram): кто кому что отправляет и в каком порядке.
 * Шаги проходятся кнопками; уже пройденные остаются видны, будущие — бледные.
 */
export function Sequence({ block }: { block: SequenceBlock }) {
  const [i, setI] = useState(0);
  const n = block.actors.length;
  const gap = W / n;
  const xOf = (id: string) => gap * block.actors.findIndex((a) => a.id === id) + gap / 2;
  const height = TOP + block.steps.length * ROW + 24;
  const step = block.steps[i];

  return (
    <figure className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      {block.title ? <figcaption className="mb-3 text-sm font-semibold text-ink">{block.title}</figcaption> : null}
      <SvgScroller minWidth={Math.max(480, n * 105)}>
        <svg viewBox={`0 0 ${W} ${height}`} className="w-full font-sans" role="img" aria-label={block.title ?? "Диаграмма последовательности"}>
          <defs>
            {(["accent", "ok", "bad"] as const).map((t) => (
              <marker key={t} id={`seq-arrow-${t}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" className={`fill-${t}`} />
              </marker>
            ))}
          </defs>
          {block.actors.map((a) => {
            const x = xOf(a.id);
            return (
              <g key={a.id}>
                <line x1={x} y1={TOP - 8} x2={x} y2={height - 8} className="stroke-line-strong" strokeDasharray="3 4" />
                <rect x={x - gap / 2 + 8} y="4" width={gap - 16} height="40" rx="8" className="fill-surface-2 stroke-line-strong" />
                <text x={x} y={a.sub ? 21 : 28} textAnchor="middle" className="fill-ink text-[12.5px] font-semibold">{a.label}</text>
                {a.sub ? <text x={x} y="36" textAnchor="middle" className="fill-muted text-[10px]">{a.sub}</text> : null}
              </g>
            );
          })}
          {block.steps.map((s, j) => {
            const y = TOP + j * ROW + 22;
            const x1 = xOf(s.from);
            const x2 = xOf(s.to);
            const active = j === i;
            const past = j < i;
            const tone =
              s.kind === "error" ? "stroke-bad" : s.kind === "response" ? "stroke-ok" : "stroke-accent";
            const marker = `url(#seq-arrow-${s.kind === "error" ? "bad" : s.kind === "response" ? "ok" : "accent"})`;
            const fillTone =
              s.kind === "error" ? "fill-bad" : s.kind === "response" ? "fill-ok" : "fill-accent";
            const opacity = active ? 1 : past ? 0.75 : 0.18;
            const self = s.from === s.to || s.kind === "self";
            return (
              <g key={j} opacity={opacity} style={{ transition: "opacity .25s" }} onClick={() => setI(j)} className="cursor-pointer">
                {self ? (
                  <path d={`M ${x1} ${y - 8} h 36 v 16 h -34`} fill="none" className={tone} strokeWidth={active ? 2.2 : 1.5} markerEnd={marker} />
                ) : (
                  <line x1={x1} y1={y} x2={x2 + (x2 > x1 ? -4 : 4)} y2={y} className={tone} strokeWidth={active ? 2.2 : 1.5}
                    strokeDasharray={s.kind === "response" ? "6 4" : undefined} markerEnd={marker} />
                )}
                <text
                  x={self ? x1 + 44 : (x1 + x2) / 2}
                  y={self ? y + 4 : y - 7}
                  textAnchor={self ? "start" : "middle"}
                  className={`${fillTone} font-mono text-[11px] ${active ? "font-semibold" : ""}`}
                >
                  {s.label}
                </text>
                <text x="6" y={y + 4} className="fill-muted font-mono text-[10px]">{j + 1}</text>
              </g>
            );
          })}
        </svg>
      </SvgScroller>
      <div className="mt-3 min-h-20 rounded-lg bg-surface-2 px-4 py-3" aria-live="polite">
        <div className="mb-1 text-xs font-medium text-muted">шаг {i + 1} из {block.steps.length}</div>
        <div className="space-y-2">
          <Paragraphs text={step.text} className="text-[15px] leading-relaxed text-ink-2" />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <button type="button" disabled={i === 0} onClick={() => setI(i - 1)}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-40">
          <ChevronLeft size={16} aria-hidden /> Назад
        </button>
        {i === block.steps.length - 1 ? (
          <button type="button" onClick={() => setI(0)}
            className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 px-3 py-1.5 text-sm text-ink hover:bg-line">
            <RotateCcw size={14} aria-hidden /> Сначала
          </button>
        ) : (
          <button type="button" onClick={() => setI(i + 1)}
            className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-3 py-1.5 text-sm text-ink hover:bg-line">
            Дальше <ChevronRight size={16} aria-hidden />
          </button>
        )}
      </div>
    </figure>
  );
}
