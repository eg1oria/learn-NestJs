import type { Metadata } from "next";
import Link from "next/link";
import { BookA, Clock } from "lucide-react";
import { articles, categories } from "@/content/articles";
import { Rich } from "@/components/Rich";

export const metadata: Metadata = { title: "Библиотека" };

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      <header className="mb-10 max-w-2xl">
        <p className="mb-2 text-sm text-muted">Статьи, справочники и разборы кода</p>
        <h1 className="mb-3 font-serif text-[40px] font-semibold leading-[1.08] tracking-[-0.015em] text-ink">Библиотека</h1>
        <p className="text-[17px] leading-relaxed text-ink-2">
          Уроки учат делать, статьи объясняют, как это устроено. Читай их, когда в уроке встречается незнакомое
          или хочется копнуть глубже. Каждый урок сам подсказывает, какие статьи к нему относятся.
        </p>
        <Link
          href="/glossary"
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-line-strong px-3.5 py-2 text-sm text-ink transition-colors hover:bg-surface-2"
        >
          <BookA size={16} aria-hidden /> Словарь терминов
        </Link>
      </header>

      <div className="space-y-12">
        {categories.map((c) => {
          const items = articles.filter((a) => a.category === c.id);
          if (!items.length) return null;
          return (
            <section key={c.id} aria-labelledby={`cat-${c.id}`}>
              <div className="mb-4 flex flex-wrap items-baseline gap-x-3">
                <h2 id={`cat-${c.id}`} className="font-serif text-2xl font-semibold text-ink">{c.title}</h2>
                <span className="text-sm text-muted">{c.description}</span>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/library/${a.slug}`}
                      className="flex h-full flex-col rounded-xl border border-line bg-surface p-5 transition-colors hover:border-line-strong"
                    >
                      <span className="mb-1.5 font-serif text-lg font-semibold leading-snug text-ink">{a.title}</span>
                      <span className="flex-1 text-[15px] leading-snug text-ink-2"><Rich text={a.summary} /></span>
                      <span className="mt-3 flex items-center gap-3 text-xs text-muted">
                        <span className="inline-flex items-center gap-1"><Clock size={12} aria-hidden /> {a.minutes} мин</span>
                        {a.lessons.length ? <span>к урокам {a.lessons.join(", ")}</span> : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
