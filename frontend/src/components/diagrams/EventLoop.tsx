"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useState } from "react";
import { highlightLines } from "@/lib/highlight";
import { Rich } from "../Rich";

const CODE = `console.log('A: заказ принят');

setTimeout(() => {
  console.log('D: суп готов');
}, 0);

Promise.resolve().then(() => {
  console.log('C: промис');
});

console.log('B: режу салат');`;

type Frame = {
  line: number | null;
  stack: string[];
  micro: string[];
  timers: string[];
  out: string[];
  text: string;
};

const frames: Frame[] = [
  { line: null, stack: [], micro: [], timers: [], out: [], text: "Повар (поток JavaScript) один. У него есть **стек вызовов** — что он делает прямо сейчас — и две очереди отложенных дел: **микрозадачи** (продолжения промисов) и **таймеры**." },
  { line: 1, stack: ["main()", "console.log"], micro: [], timers: [], out: ["A: заказ принят"], text: "Синхронный код выполняется сразу, сверху вниз. Печатаем A." },
  { line: 3, stack: ["main()", "setTimeout"], micro: [], timers: ["суп (0 мс)"], text: "`setTimeout` **не ждёт**: он отдаёт таймер на сторону (операционной системе) и сразу возвращается. Даже с 0 мс колбэк попадёт в очередь таймеров и выполнится не раньше, чем освободится стек.", out: ["A: заказ принят"] },
  { line: 7, stack: ["main()", "Promise.then"], micro: ["печать C"], timers: ["суп (0 мс)"], out: ["A: заказ принят"], text: "Промис уже выполнен, поэтому его продолжение (`.then`) сразу встаёт в очередь **микрозадач**. Но выполнять его сейчас нельзя: стек ещё занят нашим кодом." },
  { line: 11, stack: ["main()", "console.log"], micro: ["печать C"], timers: ["суп (0 мс)"], out: ["A: заказ принят", "B: режу салат"], text: "Продолжаем синхронный код: печатаем B. Вот почему B появляется раньше C и D, хотя написан ниже них." },
  { line: null, stack: [], micro: ["печать C"], timers: ["суп (0 мс)"], out: ["A: заказ принят", "B: режу салат"], text: "Синхронный код закончился, стек пуст. Цикл событий (event loop) смотрит в очереди: **сначала все микрозадачи**, потом таймеры." },
  { line: 8, stack: ["колбэк .then", "console.log"], micro: [], timers: ["суп (0 мс)"], out: ["A: заказ принят", "B: режу салат", "C: промис"], text: "Выполняется микрозадача: печатаем C. Ровно так же работает код после `await`: он продолжается микрозадачей, когда промис готов." },
  { line: 4, stack: ["колбэк таймера", "console.log"], micro: [], timers: [], out: ["A: заказ принят", "B: режу салат", "C: промис", "D: суп готов"], text: "Микрозадач больше нет, берём таймер: печатаем D. Итог: **A, B, C, D**. Пока очереди пусты, сервер просто ждёт — новых запросов или ответов от базы." },
];

function Column({ title, items, tone, empty }: { title: string; items: string[]; tone: string; empty: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-line bg-surface p-2.5">
      <div className="mb-2 text-[11px] font-medium text-muted">{title}</div>
      <div className="flex min-h-[64px] flex-col-reverse gap-1.5">
        {items.length === 0 ? (
          <span className="text-xs text-muted/70">{empty}</span>
        ) : (
          items.map((it, i) => (
            <span key={i} className={`truncate rounded-md px-2 py-1 font-mono text-[11.5px] ${tone}`}>{it}</span>
          ))
        )}
      </div>
    </div>
  );
}

/** Пошаговая визуализация цикла событий Node.js. */
export function EventLoop() {
  const [i, setI] = useState(0);
  const f = frames[i];
  const lines = highlightLines(CODE, "ts");
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-[1.1fr_1fr]">
        <pre className="overflow-x-auto rounded-xl border border-code-line bg-code-bg py-3 font-mono text-[12.5px] leading-[1.6] text-code-ink">
          <code className="block min-w-max">
            {lines.map((line, n) => (
              <span key={n} className={`flex border-l-2 px-3 ${f.line === n + 1 ? "border-accent bg-accent-soft" : "border-transparent"}`}>
                <span className="mr-3 w-4 shrink-0 select-none text-right text-muted/60">{n + 1}</span>
                <span className="whitespace-pre">
                  {line.length === 0 ? " " : line.map((t, j) => (t.kind ? <span key={j} className={`tok-${t.kind}`}>{t.text}</span> : t.text))}
                </span>
              </span>
            ))}
          </code>
        </pre>
        <div className="grid grid-cols-2 gap-2">
          <Column title="Стек вызовов (сейчас)" items={f.stack} tone="bg-accent-soft text-accent" empty="пусто — повар свободен" />
          <Column title="Консоль" items={[...f.out].reverse()} tone="bg-surface-2 text-ink" empty="пока тихо" />
          <Column title="Микрозадачи (промисы)" items={f.micro} tone="bg-info-soft text-info" empty="нет" />
          <Column title="Таймеры" items={f.timers} tone="bg-warn-soft text-warn" empty="нет" />
        </div>
      </div>
      <div className="min-h-16 rounded-lg bg-surface-2 px-4 py-3 text-[15px] leading-relaxed text-ink-2" aria-live="polite">
        <span className="mr-2 text-xs text-muted">шаг {i + 1}/{frames.length}</span>
        <Rich text={f.text} />
      </div>
      <div className="flex justify-between">
        <button type="button" disabled={i === 0} onClick={() => setI(i - 1)}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-40">
          <ChevronLeft size={16} aria-hidden /> Назад
        </button>
        {i === frames.length - 1 ? (
          <button type="button" onClick={() => setI(0)} className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 px-3 py-1.5 text-sm text-ink hover:bg-line">
            <RotateCcw size={14} aria-hidden /> Сначала
          </button>
        ) : (
          <button type="button" onClick={() => setI(i + 1)} className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-3 py-1.5 text-sm text-ink hover:bg-line">
            Дальше <ChevronRight size={16} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
