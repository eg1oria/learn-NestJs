import { Star, Swords } from "lucide-react";
import type { TaskStatus } from "@/lib/progress";
import type { Task } from "@/lib/tasks";
import { CopyButton } from "./CopyButton";
import { Hints } from "./Hints";
import { Markdown } from "./Markdown";
import { StatusChip } from "./StatusChip";

export function TaskCard({ task, status }: { task: Task; status: TaskStatus }) {
  const { meta } = task;
  return (
    <section id="task" className="scroll-mt-24 overflow-hidden rounded-2xl border border-line-strong bg-surface">
      <header className={`border-b border-line px-5 py-5 sm:px-7 ${meta.boss ? "bg-accent-soft/70" : "bg-surface-2/60"}`}>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent">
            {meta.boss ? <Swords size={14} aria-hidden /> : null}
            {meta.boss ? "Босс модуля" : "Задание"} {meta.id}
          </span>
          <StatusChip status={status} />
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-2xl font-semibold leading-tight text-ink">
            {meta.id} — {meta.title}
          </h2>
          <span className="font-mono text-sm font-semibold text-accent">+{meta.xp} XP</span>
        </div>
      </header>

      <div className="space-y-7 px-5 py-6 sm:px-7">
        {task.sections.map((s) => (
          <div key={s.title}>
            <h3 className="mb-3 text-[15px] font-semibold text-ink">{s.title}</h3>
            <Markdown source={s.body} />
          </div>
        ))}

        {task.hints.length ? (
          <div>
            <h3 className="mb-3 text-[15px] font-semibold text-ink">Подсказки</h3>
            <Hints
              taskId={meta.id}
              titles={task.hints.map((h) => h.title)}
              bodies={task.hints.map((h) => (
                <Markdown key={h.title} source={h.body} />
              ))}
            />
          </div>
        ) : null}

        {task.star ? (
          <details className="group rounded-lg border border-line px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-[15px] font-medium text-ink">
              <Star size={16} className="text-warn" aria-hidden />
              Звёздочка: необязательное усложнение
              <span className="ml-auto text-xs text-muted group-open:hidden">показать</span>
            </summary>
            <div className="mt-3">
              <Markdown source={task.star.body} />
            </div>
          </details>
        ) : null}
      </div>

      <footer className="flex flex-col gap-3 border-t border-line bg-surface-2/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p className="text-sm text-muted">
          Сделал? Скопируй запрос и вставь его ментору в чат.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton text={`Подсказка ${meta.id}`} label="Попросить подсказку" copiedLabel="Скопировано: «Подсказка»" />
          <CopyButton
            variant="primary"
            text={`Проверь задание ${meta.id}`}
            label="Скопировать запрос на проверку"
            copiedLabel={`Скопировано: «Проверь задание ${meta.id}»`}
          />
        </div>
      </footer>
    </section>
  );
}
