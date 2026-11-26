import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Check, Lock, Swords } from "lucide-react";
import { badges } from "@/content/badges";
import { course } from "@/content/course";
import { getLesson, lessons, toSlug } from "@/content/lessons";
import { levelFor, levelName, levels } from "@/content/levels";
import { BadgeIcon } from "@/components/BadgeIcon";
import { ReadCards } from "@/components/ReadCards";
import { ProgressSystemMap } from "@/components/ProgressSystemMap";
import { StatusIcon } from "@/components/StatusChip";
import { getProgress, isDone, statusLabel, statusOf, totalXp, type Progress } from "@/lib/progress";
import { getTask } from "@/lib/tasks";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      <header className="mb-10 max-w-2xl">
        <p className="mb-2 text-sm text-muted">Персональный курс бэкенда на NestJS</p>
        <h1 className="mb-3 font-serif text-[40px] font-semibold leading-[1.08] tracking-[-0.015em] text-ink sm:text-5xl">
          Гильдия героев
        </h1>
        <p className="text-lg leading-relaxed text-ink-2">
          Один проект на весь курс: API для мини-RPG с героями, квестами и таблицей лидеров.
          Каждый урок добавляет в него один кирпич, и ты сразу видишь результат во вкладке «Моя гильдия».
        </p>
      </header>
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </div>
  );
}

async function Dashboard() {
  const progress = await getProgress();
  return (
    <div className="space-y-14">
      <LevelPanel progress={progress} />
      {totalXp(progress) === 0 ? (
        <ReadCards slugs={["how-to-study", "terminal", "npm", "debugging"]} title="Перед стартом: 4 короткие статьи" />
      ) : null}
      <section aria-labelledby="build-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <h2 id="build-title" className="font-serif text-2xl font-semibold text-ink">Что ты строишь</h2>
          <Link href="/path" className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
            Весь путь до Middle <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
          <ProgressSystemMap progress={progress} />
        </div>
      </section>
      <CourseMap progress={progress} />
      <BadgeShelf progress={progress} />
      <ReviewLog progress={progress} />
    </div>
  );
}

function LevelPanel({ progress }: { progress: Progress }) {
  const xp = totalXp(progress);
  const { current, next, progress: p } = levelFor(xp);
  const currentLesson = lessons.find((l) => !isDone(statusOf(progress, l.id)) && statusOf(progress, l.id) !== "locked");
  const doneCount = lessons.filter((l) => isDone(statusOf(progress, l.id))).length;
  const levelIndex = levels.indexOf(current);

  return (
    <section id="level" className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="mb-1 text-xs font-medium text-muted">Твой уровень</div>
            <div className="font-serif text-3xl font-semibold text-ink">{levelName(current)}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-2xl font-semibold text-accent">{xp} XP</div>
            <div className="text-xs text-muted">
              {next ? `до ${levelName(next)} — ${next.minXp - xp} XP` : "максимальный уровень"}
            </div>
          </div>
        </div>
        <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={Math.round(p * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${Math.max(2, p * 100)}%` }} />
        </div>
        <ol className="flex flex-wrap gap-x-1 gap-y-1 text-[11px]">
          {levels.map((lvl, i) => (
            <li
              key={i}
              className={`rounded px-1.5 py-0.5 ${
                i === levelIndex ? "bg-accent text-accent-ink" : i < levelIndex ? "text-ink-2" : "text-muted/70"
              }`}
            >
              {levelName(lvl)}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 sm:p-7">
        <div>
          <div className="mb-1 text-xs font-medium text-muted">
            Пройдено заданий: {doneCount} из {lessons.length} открытых в программе
          </div>
          {currentLesson ? (
            <>
              <div className="mb-1 mt-3 text-sm text-ink-2">
                {statusOf(progress, currentLesson.id) === "rework" ? "Нужно доработать" : "Сейчас в работе"}
              </div>
              <div className="font-serif text-2xl font-semibold leading-tight text-ink">
                {currentLesson.id} {currentLesson.title}
              </div>
            </>
          ) : (
            <div className="mt-3 text-ink-2">Все открытые задания сданы. Напиши ментору, чтобы открыть следующие уроки.</div>
          )}
        </div>
        {currentLesson ? (
          <Link
            href={`/learn/${toSlug(currentLesson.id)}`}
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-strong"
          >
            Продолжить <ArrowRight size={16} aria-hidden />
          </Link>
        ) : null}
      </div>
    </section>
  );
}

function CourseMap({ progress }: { progress: Progress }) {
  const firstLockedModule = course.find((m) => m.lessonIds.length === 0)?.id ?? 99;
  return (
    <section aria-labelledby="map-title">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 id="map-title" className="font-serif text-2xl font-semibold text-ink">Карта курса</h2>
        <p className="text-sm text-muted">Новые уроки появляются по мере прохождения</p>
      </div>
      <ol className="space-y-3">
        {course.map((m) => {
          const moduleLessons = m.lessonIds.map((id) => getLesson(id)).filter((l) => l !== null);
          const ready = moduleLessons.length > 0;
          const done = moduleLessons.filter((l) => isDone(statusOf(progress, l.id))).length;
          const complete = ready && done === moduleLessons.length;

          if (!ready) {
            return (
              <li key={m.id} className="flex items-start gap-4 rounded-xl border border-dashed border-line px-5 py-3.5">
                <span className="mt-0.5 w-6 shrink-0 font-mono text-sm text-muted">{m.id}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-medium text-ink-2">{m.title}</span>
                    <span className="text-sm text-muted">{m.topics.join(" · ")}</span>
                  </div>
                </div>
                <Lock size={15} className="mt-1 shrink-0 text-muted/70" aria-label={m.id === firstLockedModule ? "Следующий модуль" : "Закрыт"} />
              </li>
            );
          }

          return (
            <li key={m.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line px-5 py-4">
                <span className="font-mono text-sm text-muted">{m.id}</span>
                <h3 className="font-serif text-xl font-semibold text-ink">{m.title}</h3>
                <span className="text-sm text-muted">{m.description.replace(/`/g, "")}</span>
                <span className={`ml-auto inline-flex items-center gap-1 text-xs font-medium ${complete ? "text-ok" : "text-muted"}`}>
                  {complete ? <Check size={13} aria-hidden /> : null}
                  {done}/{moduleLessons.length}
                </span>
              </div>
              <ul className="divide-y divide-line">
                {moduleLessons.map((l) => {
                  const status = statusOf(progress, l.id);
                  const locked = status === "locked";
                  const task = getTask(l.id);
                  const tone = isDone(status)
                    ? "bg-ok-soft text-ok"
                    : status === "open"
                      ? "bg-accent text-accent-ink"
                      : status === "rework"
                        ? "bg-warn-soft text-warn"
                        : "bg-surface-2 text-muted";
                  const row = (
                    <>
                      <span className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full ${tone}`}>
                        {l.boss && !isDone(status) && !locked ? <Swords size={14} aria-hidden /> : <StatusIcon status={status} size={14} />}
                      </span>
                      <span className="w-8 shrink-0 font-mono text-sm text-muted">{l.id}</span>
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate ${locked ? "text-muted" : "text-ink"} ${l.boss ? "font-semibold" : ""}`}>{l.title}</span>
                        <span className="block truncate text-sm text-muted">{l.summary}</span>
                      </span>
                      <span className="hidden shrink-0 text-right sm:block">
                        <span className="block font-mono text-xs text-muted">
                          {progress.tasks[l.id]?.xpAwarded ?? 0}/{task?.meta.xp ?? 0} XP
                        </span>
                        <span className="block text-xs text-muted">
                          {locked ? `${l.minutes} мин` : statusLabel[status]}
                        </span>
                      </span>
                    </>
                  );
                  return (
                    <li key={l.id}>
                      {locked ? (
                        <div className="flex items-center gap-4 px-5 py-3.5 opacity-70" aria-disabled>
                          {row}
                        </div>
                      ) : (
                        <Link href={`/learn/${toSlug(l.id)}`} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-2/60">
                          {row}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function BadgeShelf({ progress }: { progress: Progress }) {
  const earned = new Map(progress.badges.map((b) => [b.id, b.earnedAt]));
  return (
    <section aria-labelledby="badges-title">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 id="badges-title" className="font-serif text-2xl font-semibold text-ink">Бейджи</h2>
        <p className="text-sm text-muted">{earned.size} из {badges.length}</p>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {badges.map((b) => {
          const at = earned.get(b.id);
          return (
            <li
              key={b.id}
              className={`rounded-xl border p-4 ${at ? "border-accent/40 bg-accent-soft/50" : "border-line bg-surface"}`}
            >
              <div className={`mb-3 inline-flex size-10 items-center justify-center rounded-full ${at ? "bg-accent text-accent-ink" : "bg-surface-2 text-muted/60"}`}>
                <BadgeIcon name={b.icon} />
              </div>
              <div className={`text-sm font-medium ${at ? "text-ink" : "text-ink-2"}`}>{b.title}</div>
              <div className="text-xs leading-snug text-muted">{at ? `получен ${at}` : b.description}</div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ReviewLog({ progress }: { progress: Progress }) {
  const entries = [...progress.log].reverse().slice(0, 8);
  return (
    <section aria-labelledby="log-title">
      <h2 id="log-title" className="mb-5 font-serif text-2xl font-semibold text-ink">Журнал проверок</h2>
      {entries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line-strong px-5 py-6 text-ink-2">
          Здесь появятся результаты проверок. Сделай задание 0.1 и напиши ментору <code className="font-mono text-sm">Проверь задание 0.1</code>.
        </p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {entries.map((e, i) => (
            <li key={i} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3">
              <span className="font-mono text-xs text-muted">{e.date}</span>
              <span className="font-mono text-sm text-ink">{e.task}</span>
              <span className="text-sm text-ink-2">{e.grade}</span>
              {e.note ? <span className="text-sm text-muted">{e.note}</span> : null}
              <span className="ml-auto font-mono text-sm font-medium text-accent">+{e.xp} XP</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="h-48 rounded-2xl bg-surface-2" />
        <div className="h-48 rounded-2xl bg-surface-2" />
      </div>
      <div className="h-72 rounded-2xl bg-surface-2" />
    </div>
  );
}
