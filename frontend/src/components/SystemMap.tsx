"use client";

import { useState } from "react";
import { systemNodes, type SystemNode } from "@/content/system";
import type { SystemNodeId } from "@/content/types";
import { Rich } from "./Rich";
import { SvgScroller } from "./diagrams/Frame";

type Mode =
  | { kind: "focus"; focus: SystemNodeId[] }
  | { kind: "progress"; doneModules: number[]; currentModule: number };

function stateOf(node: SystemNode, mode: Mode): "focus" | "done" | "current" | "idle" | "future" {
  if (mode.kind === "focus") return mode.focus.includes(node.id) ? "focus" : "idle";
  if (mode.doneModules.includes(node.module)) return "done";
  if (node.module === mode.currentModule) return "current";
  return node.module < mode.currentModule ? "done" : "future";
}

const STYLE = {
  focus: { rect: "fill-accent-soft stroke-accent", text: "fill-ink", sub: "fill-accent", opacity: 1, width: 2 },
  current: { rect: "fill-accent-soft stroke-accent", text: "fill-ink", sub: "fill-accent", opacity: 1, width: 2 },
  done: { rect: "fill-ok-soft stroke-ok", text: "fill-ink", sub: "fill-ok", opacity: 1, width: 1.5 },
  idle: { rect: "fill-surface stroke-line-strong", text: "fill-ink-2", sub: "fill-muted", opacity: 0.5, width: 1 },
  future: { rect: "fill-surface stroke-line-strong", text: "fill-ink-2", sub: "fill-muted", opacity: 0.55, width: 1 },
} as const;

/**
 * Карта всей будущей Гильдии. В уроке подсвечивает то, чего урок касается;
 * на главной — что уже построено (зелёное) и что строится сейчас (оранжевое).
 */
export function SystemMap({
  mode,
  caption,
}: {
  mode: Mode;
  caption?: string;
}) {
  const initial =
    mode.kind === "focus" ? mode.focus[0] : systemNodes.find((n) => n.module === mode.currentModule)?.id;
  const [selected, setSelected] = useState<SystemNodeId | undefined>(initial);
  const node = systemNodes.find((n) => n.id === selected);

  const center = (id: SystemNodeId) => {
    const b = systemNodes.find((n) => n.id === id)!.box;
    return { x: b.x + b.w / 2, y: b.y + b.h / 2, b };
  };

  return (
    <div className="space-y-3">
      <SvgScroller minWidth={560}>
        <svg viewBox="0 0 760 440" className="w-full font-sans" role="img" aria-label="Карта бэкенда Гильдии героев">
          {/* Рамка Docker и приложения */}
          <rect x="178" y="6" width="574" height="428" rx="14" fill="none" className="stroke-line-strong" strokeDasharray="5 5" />
          <rect x="192" y="20" width="372" height="374" rx="10" className="fill-surface-2/60 stroke-line" />
          <text x="206" y="40" className="fill-muted text-[11px] font-medium">NestJS-приложение · :3000</text>
          <text x="590" y="40" className="fill-muted text-[11px] font-medium">Инфраструктура</text>
          <text x="16" y="40" className="fill-muted text-[11px] font-medium">Клиенты</text>

          {/* Связи */}
          {["browser", "curl", "tests"].map((id) => {
            const c = center(id as SystemNodeId);
            return (
              <path key={id} d={`M ${c.b.x + c.b.w} ${c.y} C 180 ${c.y}, 180 72, 204 72`} fill="none"
                className="stroke-line-strong flow-line" strokeWidth="1.3" />
            );
          })}
          <path d={`M 164 325 C 184 325, 184 254, 204 254`} fill="none" className="stroke-line-strong" strokeWidth="1.3" strokeDasharray="3 4" />
          <text x="170" y="150" className="fill-muted font-mono text-[10px]" transform="rotate(-90 170 150)">HTTP</text>
          <path d="M 509 92 L 509 100 L 289 100 L 289 108" fill="none" className="stroke-line-strong" strokeWidth="1.3" />
          <path d="M 289 158 L 289 170" fill="none" className="stroke-line-strong" strokeWidth="1.3" />
          {(["db", "cache", "queue"] as const).map((id) => {
            const c = center(id);
            return (
              <path key={id} d={`M 564 ${c.y} L ${c.b.x} ${c.y}`} fill="none"
                className="stroke-line-strong" strokeWidth="1.2" strokeDasharray="4 4" />
            );
          })}

          {/* Узлы */}
          {systemNodes.map((n) => {
            const st = STYLE[stateOf(n, mode)];
            const isSel = n.id === selected;
            const small = n.box.h <= 40 || n.id === "docker";
            return (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-label={`${n.label}: ${n.sub}`}
                onClick={() => setSelected(n.id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(n.id)}
                className="cursor-pointer outline-none"
                opacity={st.opacity}
                style={{ transition: "opacity .2s" }}
              >
                <rect
                  x={n.box.x} y={n.box.y} width={n.box.w} height={n.box.h} rx="8"
                  className={st.rect}
                  strokeWidth={isSel ? 2.5 : st.width}
                  strokeDasharray={n.id === "docker" ? "4 3" : undefined}
                />
                <text x={n.box.x + n.box.w / 2} y={n.box.y + (small ? n.box.h / 2 - 1 : 21)} textAnchor="middle"
                  className={`${st.text} ${small ? "text-[11px]" : "text-[12.5px]"} font-semibold`}>
                  {n.label}
                </text>
                <text x={n.box.x + n.box.w / 2} y={n.box.y + (small ? n.box.h / 2 + 11 : 37)} textAnchor="middle"
                  className={`${st.sub} ${small ? "text-[9.5px]" : "text-[10.5px]"}`}>
                  {n.id === "docker" ? "" : n.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </SvgScroller>

      {mode.kind === "progress" ? (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-ok" /> уже построено</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-accent" /> строишь сейчас</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm border border-line-strong" /> впереди</span>
        </div>
      ) : null}

      {node ? (
        <div className="rounded-lg bg-surface-2 px-4 py-3" aria-live="polite">
          <div className="mb-0.5 flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm font-semibold text-ink">{node.label}</span>
            <span className="text-xs text-muted">изучаем: {node.learn}</span>
          </div>
          <p className="text-[15px] leading-relaxed text-ink-2"><Rich text={node.text} /></p>
        </div>
      ) : null}
      {caption ? <p className="text-sm text-muted"><Rich text={caption} /></p> : null}
      <p className="text-xs text-muted">Нажми на любой блок, чтобы узнать, что это и когда ты его построишь.</p>
    </div>
  );
}
