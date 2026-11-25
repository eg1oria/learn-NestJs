"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { Rich } from "./Rich";

export type GlossaryItem = {
  term: string;
  en?: string;
  text: string;
  see?: { href: string; label: string };
};

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е");

export function GlossaryList({ items }: { items: GlossaryItem[] }) {
  const [query, setQuery] = useState("");
  const q = norm(useDeferredValue(query).trim());
  const shown = q
    ? items.filter((i) => norm(`${i.term} ${i.en ?? ""} ${i.text}`).includes(q))
    : items;

  return (
    <div>
      <label className="mb-6 flex items-center gap-2.5 rounded-xl border border-line-strong bg-surface px-4 py-2.5 focus-within:border-accent">
        <Search size={17} className="text-muted" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти термин: DI, порт, промис…"
          className="w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-muted focus-visible:outline-none"
          aria-label="Поиск по словарю"
        />
      </label>
      {shown.length === 0 ? (
        <p className="text-ink-2">Ничего не нашлось. Спроси ментора в чате: «Объясни {query}».</p>
      ) : (
        <dl className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {shown.map((i) => (
            <div key={i.term} className="px-5 py-3.5">
              <dt className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-medium text-ink">{i.term}</span>
                {i.en ? <span className="font-mono text-xs text-muted">{i.en}</span> : null}
              </dt>
              <dd className="mt-0.5 text-[15px] leading-snug text-ink-2">
                <Rich text={i.text} />
                {i.see ? (
                  <Link href={i.see.href} className="ml-2 whitespace-nowrap text-sm text-accent hover:underline">
                    → {i.see.label}
                  </Link>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
