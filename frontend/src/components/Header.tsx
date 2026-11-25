import Link from "next/link";
import { Suspense } from "react";
import { levelFor, levelName } from "@/content/levels";
import { getProgress, totalXp } from "@/lib/progress";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

async function XpPill() {
  const progress = await getProgress();
  const xp = totalXp(progress);
  const { current, progress: p } = levelFor(xp);
  return (
    <Link
      href="/#level"
      className="hidden items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-surface-2 lg:flex"
      title="Уровень и опыт"
    >
      <span className="font-medium text-ink">{levelName(current)}</span>
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-2">
        <span className="block h-full rounded-full bg-accent" style={{ width: `${Math.round(p * 100)}%` }} />
      </span>
      <span className="font-mono text-xs text-muted">{xp} XP</span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="mr-1 flex shrink-0 items-center gap-2.5 sm:mr-2" aria-label="Гильдия героев — на главную">
          <svg viewBox="0 0 24 24" className="size-6 text-accent" aria-hidden>
            <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" fill="currentColor" opacity=".16" />
            <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M8.5 12.5 11 15l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden font-serif text-[17px] font-semibold tracking-[-0.01em] text-ink md:inline">
            Гильдия героев
          </span>
        </Link>
        <NavLinks />
        <div className="ml-auto flex items-center gap-1">
          <Suspense fallback={<span className="hidden h-8 w-44 rounded-lg bg-surface-2/60 lg:block" />}>
            <XpPill />
          </Suspense>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
