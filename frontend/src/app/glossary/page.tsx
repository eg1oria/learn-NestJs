import type { Metadata } from "next";
import { buildGlossary } from "@/content/glossary";
import { getArticle } from "@/content/articles";
import { getLesson, toSlug } from "@/content/lessons";
import { GlossaryList, type GlossaryItem } from "@/components/GlossaryList";

export const metadata: Metadata = { title: "Словарь" };

function resolveSee(see?: string): GlossaryItem["see"] {
  if (!see) return undefined;
  const [kind, id] = see.split(":");
  if (kind === "lesson") {
    const l = getLesson(id);
    return l ? { href: `/learn/${toSlug(l.id)}`, label: `урок ${l.id}` } : undefined;
  }
  const a = getArticle(id);
  return a ? { href: `/library/${a.slug}`, label: a.title } : undefined;
}

export default function GlossaryPage() {
  const items: GlossaryItem[] = buildGlossary().map((e) => ({ ...e, see: resolveSee(e.see) }));
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      <header className="mb-8">
        <p className="mb-2 text-sm text-muted">{items.length} терминов</p>
        <h1 className="mb-3 font-serif text-[40px] font-semibold leading-[1.08] tracking-[-0.015em] text-ink">Словарь</h1>
        <p className="text-[17px] leading-relaxed text-ink-2">
          Все слова курса в одном месте: по-русски, в оригинале и простыми словами. Рядом ссылка на урок или статью, где тема разобрана подробно.
        </p>
      </header>
      <GlossaryList items={items} />
    </div>
  );
}
