"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Карта курса", short: "Курс", match: (p: string) => p === "/" || p.startsWith("/learn") },
  { href: "/path", label: "Путь до Middle", short: "Путь", match: (p: string) => p.startsWith("/path") },
  { href: "/library", label: "Библиотека", short: "Статьи", match: (p: string) => p.startsWith("/library") || p.startsWith("/glossary") },
  { href: "/guild", label: "Моя гильдия", short: "Гильдия", match: (p: string) => p.startsWith("/guild") },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center sm:gap-1" aria-label="Разделы">
      {links.map((l) => {
        const active = l.match(pathname);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-2 py-1.5 text-sm transition-colors sm:px-3 ${
              active ? "bg-surface-2 font-medium text-ink" : "text-muted hover:text-ink"
            }`}
          >
            <span className="sm:hidden">{l.short}</span>
            <span className="hidden sm:inline">{l.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
