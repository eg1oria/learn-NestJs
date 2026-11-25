"use client";

import { Moon, Sun } from "lucide-react";

/**
 * Тема хранится в localStorage и выставляется инлайн-скриптом в <head>
 * до первой отрисовки (см. layout.tsx), поэтому здесь только переключение.
 */
export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Переключить тему"
      title="Переключить тему"
      className="inline-flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-ink"
    >
      <Sun size={18} className="hidden dark:block" aria-hidden />
      <Moon size={18} className="block dark:hidden" aria-hidden />
    </button>
  );
}
