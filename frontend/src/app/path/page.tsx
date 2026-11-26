import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Check, Circle, Swords } from "lucide-react";
import { course } from "@/content/course";
import { getLesson, toSlug } from "@/content/lessons";
import { juniorSkills, middleSkills, type Skill } from "@/content/skills";
import { ProgressSystemMap } from "@/components/ProgressSystemMap";
import { getProgress, isDone, moduleProgress, statusOf, type Progress } from "@/lib/progress";

export const metadata: Metadata = { title: "Путь до Middle" };

export default function PathPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      <header className="mb-10 max-w-2xl">
        <p className="mb-2 text-sm text-muted">От нуля до junior-middle</p>
        <h1 className="mb-3 font-serif text-[40px] font-semibold leading-[1.08] tracking-[-0.015em] text-ink">Путь до Middle</h1>
        <p className="text-[17px] leading-relaxed text-ink-2">
          Что ты строишь, какие навыки за этим стоят и в каком порядке они появятся. Здесь курс целиком.
          Сами уроки открываются по мере прохождения и подстраиваются под то, что у тебя получается лучше или хуже.
        </p>
      </header>
      <Suspense fallback={<div className="h-[600px] animate-pulse rounded-2xl bg-surface-2" />}>
        <PathBody />
      </Suspense>
    </div>
  );
}

async function PathBody() {
  const progress = await getProgress();
  const { doneModules, currentModule } = moduleProgress(progress, course);
  return (
    <div className="space-y-14">
      <section aria-labelledby="map-title">
        <h2 id="map-title" className="mb-2 font-serif text-2xl font-semibold text-ink">Что ты строишь</h2>
        <p className="mb-5 max-w-2xl text-ink-2">
          Так будет выглядеть бэкенд Гильдии к концу курса. Это типичная архитектура настоящего продакшен-сервиса:
          поняв её, ты поймёшь устройство большинства бэкендов, с которыми встретишься на работе.
        </p>
        <div className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
          <ProgressSystemMap progress={progress} />
        </div>
      </section>

      <section aria-labelledby="skills-title">
        <h2 id="skills-title" className="mb-5 font-serif text-2xl font-semibold text-ink">Навыки</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <SkillColumn title="Junior" note="может сам сделать фичу по понятной задаче" skills={juniorSkills} done={doneModules} />
          <SkillColumn title="Middle" note="сам проектирует, думает о надёжности, безопасности и скорости" skills={middleSkills} done={doneModules} />
        </div>
      </section>

      <section aria-labelledby="plan-title">
        <h2 id="plan-title" className="mb-5 font-serif text-2xl font-semibold text-ink">Программа целиком</h2>
        <ol className="space-y-3">
          {course.map((m) => (
            <ModulePlan key={m.id} module={m} progress={progress} done={doneModules.includes(m.id)} current={m.id === currentModule} />
          ))}
        </ol>
      </section>
    </div>
  );
}

function SkillColumn({ title, note, skills, done }: { title: string; note: string; skills: Skill[]; done: number[] }) {
  const have = skills.filter((s) => s.modules.every((m) => done.includes(m))).length;
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-xl font-semibold text-ink">{title}</h3>
        <span className="font-mono text-sm text-muted">{have}/{skills.length}</span>
      </div>
      <p className="mb-4 text-sm text-muted">{note}</p>
      <ul className="space-y-2.5">
        {skills.map((s) => {
          const ok = s.modules.every((m) => done.includes(m));
          return (
            <li key={s.title} className="flex gap-3">
              <span className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full ${ok ? "bg-ok text-surface" : "border border-line-strong text-transparent"}`}>
                <Check size={12} strokeWidth={3} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className={`block text-[15px] ${ok ? "text-ink" : "text-ink-2"}`}>{s.title}</span>
                <span className="block text-sm text-muted">
                  {s.detail} · модул{s.modules.length > 1 ? "и" : "ь"} {s.modules.join(", ")}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ModulePlan({
  module: m,
  progress,
  done,
  current,
}: {
  module: (typeof course)[number];
  progress: Progress;
  done: boolean;
  current: boolean;
}) {
  const lessons = m.lessonIds.map(getLesson).filter((l) => l !== null);
  return (
    <li className={`rounded-xl border px-5 py-4 ${current ? "border-accent/50 bg-accent-soft/40" : "border-line bg-surface"}`}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-sm text-muted">{m.id}</span>
        <h3 className="font-serif text-lg font-semibold text-ink">{m.title}</h3>
        {done ? <span className="text-xs font-medium text-ok">пройден</span> : current ? <span className="text-xs font-medium text-accent">ты здесь</span> : null}
      </div>
      {m.outcome ? <p className="mt-1 text-sm text-ink-2"><span className="text-muted">Итог:</span> {m.outcome}</p> : null}
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {lessons.length
          ? lessons.map((l) => {
              const st = statusOf(progress, l.id);
              const open = st !== "locked";
              const cls = `inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ${
                isDone(st) ? "bg-ok-soft text-ok" : open ? "bg-surface-2 text-ink" : "bg-surface-2/60 text-muted"
              }`;
              const content = (
                <>
                  {l.boss ? <Swords size={11} aria-hidden /> : isDone(st) ? <Check size={11} aria-hidden /> : <Circle size={9} aria-hidden />}
                  {l.id} {l.title}
                </>
              );
              return (
                <li key={l.id}>
                  {open ? <Link href={`/learn/${toSlug(l.id)}`} className={`${cls} hover:text-ink`}>{content}</Link> : <span className={cls}>{content}</span>}
                </li>
              );
            })
          : (m.planned ?? []).map((t, i) => (
              <li key={t} className="inline-flex items-center gap-1 rounded-md border border-dashed border-line px-2 py-1 text-xs text-muted">
                {t.startsWith("Босс") ? <Swords size={11} aria-hidden /> : null}
                {m.id}.{i + 1} {t}
              </li>
            ))}
      </ul>
    </li>
  );
}
