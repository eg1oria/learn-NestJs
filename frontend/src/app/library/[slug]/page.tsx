import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { articles, categories, getArticle } from "@/content/articles";
import { getLesson, toSlug } from "@/content/lessons";
import type { Article } from "@/content/types";
import { LessonBlocks } from "@/components/LessonBlocks";
import { Rich } from "@/components/Rich";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/library/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  return { title: article?.title ?? "Статья", description: article?.summary.replace(/`/g, "") };
}

export default function ArticlePage({ params }: PageProps<"/library/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto h-96 max-w-[720px] px-4 pt-12" />}>
      {params.then(({ slug }) => {
        const article = getArticle(slug);
        if (!article) notFound();
        return <ArticleView article={article} />;
      })}
    </Suspense>
  );
}

function ArticleView({ article }: { article: Article }) {
  const category = categories.find((c) => c.id === article.category);
  const i = articles.indexOf(article);
  const prev = articles[i - 1] ?? null;
  const next = articles[i + 1] ?? null;
  const headings = article.blocks.filter((b) => b.type === "h");
  const related = article.lessons.map(getLesson).filter((l) => l !== null);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-14">
        <article className="mx-auto max-w-[720px] lg:mx-0">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted" aria-label="Навигация">
            <Link href="/library" className="hover:text-ink">Библиотека</Link>
            <ChevronRight size={14} aria-hidden />
            <span>{category?.title}</span>
          </nav>

          <header className="mb-10">
            <div className="mb-3 flex flex-wrap items-center gap-2.5 text-sm">
              <span className="font-medium text-accent">Статья</span>
              <span className="inline-flex items-center gap-1 text-muted">
                <Clock size={13} aria-hidden /> {article.minutes} мин чтения
              </span>
            </div>
            <h1 className="mb-3 font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.015em] text-ink sm:text-[42px]">
              {article.title}
            </h1>
            <p className="text-lg leading-relaxed text-muted"><Rich text={article.summary} /></p>
          </header>

          <LessonBlocks blocks={article.blocks} lessonId={`article:${article.slug}`} />

          {related.length ? (
            <section className="mt-12 rounded-xl border border-line bg-surface px-5 py-4">
              <div className="mb-2 text-sm font-semibold text-ink">Где это пригодится</div>
              <ul className="flex flex-wrap gap-2">
                {related.map((l) => (
                  <li key={l.id}>
                    <Link
                      href={`/learn/${toSlug(l.id)}`}
                      className="inline-block rounded-md bg-surface-2 px-2.5 py-1 text-sm text-ink-2 hover:text-ink"
                    >
                      Урок {l.id} · {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <nav className="mt-12 grid gap-3 sm:grid-cols-2" aria-label="Соседние статьи">
            {prev ? (
              <Link href={`/library/${prev.slug}`} className="rounded-xl border border-line px-4 py-3 transition-colors hover:border-line-strong hover:bg-surface">
                <span className="flex items-center gap-1 text-xs text-muted"><ChevronLeft size={13} aria-hidden /> Предыдущая</span>
                <span className="text-[15px] text-ink">{prev.title}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/library/${next.slug}`} className="rounded-xl border border-line px-4 py-3 text-right transition-colors hover:border-line-strong hover:bg-surface">
                <span className="flex items-center justify-end gap-1 text-xs text-muted">Следующая <ChevronRight size={13} aria-hidden /></span>
                <span className="text-[15px] text-ink">{next.title}</span>
              </Link>
            ) : null}
          </nav>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-3 text-xs font-medium text-muted">В этой статье</div>
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
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
