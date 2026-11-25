import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight, Clock, Lock, Swords } from "lucide-react";
import { course } from "@/content/course";
import { fromSlug, getLesson, lessons, neighbours, toSlug } from "@/content/lessons";
import type { Lesson } from "@/content/types";
import { LessonBlocks } from "@/components/LessonBlocks";
import { StatusChip } from "@/components/StatusChip";
import { TaskCard } from "@/components/TaskCard";
import { getProgress, statusOf } from "@/lib/progress";
import { getTask } from "@/lib/tasks";

export function generateStaticParams() {
  return lessons.map((l) => ({ lessonId: toSlug(l.id) }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[lessonId]">): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = getLesson(fromSlug(lessonId));
  return { title: lesson ? `${lesson.id} ${lesson.title}` : "Урок" };
}

export default function LessonPage({ params }: PageProps<"/learn/[lessonId]">) {
  return (
    <Suspense fallback={<LessonSkeleton />}>
      {params.then(({ lessonId }) => {
        const lesson = getLesson(fromSlug(lessonId));
        if (!lesson) notFound();
        return <LessonGate lesson={lesson} />;
      })}
    </Suspense>
  );
}

async function LessonGate({ lesson }: { lesson: Lesson }) {
  const progress = await getProgress();
  const status = statusOf(progress, lesson.id);
  const task = getTask(lesson.id);
  const mod = course.find((m) => m.id === lesson.moduleId)!;
  const { prev, next } = neighbours(lesson.id);
  const headings = lesson.blocks.filter((b) => b.type === "h");

  if (status === "locked") {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-surface-2 text-muted">
          <Lock size={20} aria-hidden />
        </div>
        <p className="mb-1 text-sm text-muted">Урок {lesson.id}</p>
        <h1 className="mb-3 font-serif text-3xl font-semibold text-ink">{lesson.title}</h1>
        <p className="mb-8 text-ink-2">
          Урок откроется, когда ментор примет {prev ? `задание ${prev.id} «${prev.title}»` : "предыдущее задание"}.
          Один урок — одна идея, и идеи строятся друг на друге.
        </p>
        {prev ? (
          <Link href={`/learn/${toSlug(prev.id)}`} className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-bg">
            <ChevronLeft size={16} aria-hidden /> К уроку {prev.id}
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-14">
        <article className="mx-auto max-w-[720px] lg:mx-0">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted" aria-label="Навигация">
            <Link href="/" className="hover:text-ink">Карта курса</Link>
            <ChevronRight size={14} aria-hidden />
            <span>Модуль {mod.id}. {mod.title}</span>
          </nav>

          <header className="mb-10">
            <div className="mb-3 flex flex-wrap items-center gap-2.5 text-sm">
              <span className="inline-flex items-center gap-1.5 font-medium text-accent">
                {lesson.boss ? <Swords size={15} aria-hidden /> : null}
                {lesson.boss ? "Босс" : "Урок"} {lesson.id}
              </span>
              <span className="inline-flex items-center gap-1 text-muted">
                <Clock size={13} aria-hidden /> {lesson.minutes} мин чтения
              </span>
              {task ? <span className="font-mono text-xs text-muted">задание +{task.meta.xp} XP</span> : null}
              <StatusChip status={status} />
            </div>
            <h1 className="mb-3 font-serif text-[38px] font-semibold leading-[1.1] tracking-[-0.015em] text-ink sm:text-[44px]">
              {lesson.title}
            </h1>
            <p className="text-lg leading-relaxed text-muted">{lesson.summary}</p>
          </header>

          <LessonBlocks blocks={lesson.blocks} lessonId={lesson.id} />

          <div className="mt-14">
            {task ? (
              <TaskCard task={task} status={status} />
            ) : (
              <p className="rounded-xl border border-dashed border-line-strong p-6 text-muted">
                Карточка задания не найдена: <code className="font-mono">learning/tasks/{lesson.id}.md</code>
              </p>
            )}
          </div>

          <nav className="mt-12 grid gap-3 sm:grid-cols-2" aria-label="Соседние уроки">
            {prev ? (
              <Link href={`/learn/${toSlug(prev.id)}`} className="rounded-xl border border-line px-4 py-3 transition-colors hover:border-line-strong hover:bg-surface">
                <span className="flex items-center gap-1 text-xs text-muted"><ChevronLeft size={13} aria-hidden /> Назад</span>
                <span className="text-[15px] text-ink">{prev.id} {prev.title}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/learn/${toSlug(next.id)}`} className="rounded-xl border border-line px-4 py-3 text-right transition-colors hover:border-line-strong hover:bg-surface">
                <span className="flex items-center justify-end gap-1 text-xs text-muted">Дальше <ChevronRight size={13} aria-hidden /></span>
                <span className="text-[15px] text-ink">{next.id} {next.title}</span>
              </Link>
            ) : null}
          </nav>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-3 text-xs font-medium text-muted">В этом уроке</div>
            <ol className="space-y-1.5 border-l border-line text-sm">
              {headings.map((h) =>
                h.type === "h" ? (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="-ml-px block border-l border-transparent py-0.5 pl-3 text-muted transition-colors hover:border-ink hover:text-ink">
                      {h.text}
                    </a>
                  </li>
                ) : null,
              )}
              <li>
                <a href="#task" className="-ml-px block border-l border-accent py-0.5 pl-3 font-medium text-accent">
                  Задание {lesson.id}
                </a>
              </li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}

function LessonSkeleton() {
  return (
    <div className="mx-auto max-w-[720px] animate-pulse px-4 pt-12 sm:px-6 lg:max-w-6xl">
      <div className="mb-4 h-4 w-40 rounded bg-surface-2" />
      <div className="mb-3 h-11 w-3/4 rounded bg-surface-2" />
      <div className="mb-10 h-5 w-2/3 rounded bg-surface-2" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-surface-2" style={{ width: `${90 - i * 7}%` }} />
        ))}
      </div>
    </div>
  );
}
