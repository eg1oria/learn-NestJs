import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";
import { getArticle } from "@/content/articles";
import { Rich } from "./Rich";

export function ReadCards({ slugs, title = "Почитать подробнее" }: { slugs: string[]; title?: string }) {
  const items = slugs.map(getArticle).filter((a) => a !== null);
  if (!items.length) return null;
  return (
    <section className="rounded-xl border border-line bg-surface-2/50 p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
        <BookOpen size={16} className="text-accent" aria-hidden /> {title}
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/library/${a.slug}`}
              className="block h-full rounded-lg border border-line bg-surface px-3.5 py-3 transition-colors hover:border-line-strong"
            >
              <span className="block text-[15px] font-medium leading-snug text-ink">{a.title}</span>
              <span className="mt-0.5 block text-sm leading-snug text-muted"><Rich text={a.summary} /></span>
              <span className="mt-1.5 inline-flex items-center gap-1 text-xs text-muted">
                <Clock size={12} aria-hidden /> {a.minutes} мин
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
