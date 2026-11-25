import fs from "node:fs";
import path from "node:path";

/**
 * Карточка задания — это markdown-файл `learning/tasks/<id>.md`.
 * Он же — единственный источник правды: и для ментора, и для страницы урока.
 *
 * Формат: frontmatter (`key: value`), разделы `## Заголовок`,
 * подсказки — подразделы `### ...` внутри «## Подсказки».
 */

export type TaskMeta = {
  id: string;
  title: string;
  xp: number;
  boss: boolean;
  test?: string;
};

export type TaskSection = { title: string; body: string };

export type Task = {
  meta: TaskMeta;
  sections: TaskSection[];
  hints: TaskSection[];
  star?: TaskSection;
};

const TASKS_DIR = path.join(process.cwd(), "..", "learning", "tasks");

function parseFrontmatter(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  const meta: Record<string, string> = {};
  if (!match) return { meta, body: source };
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line
      .slice(idx + 1)
      .trim()
      .replace(/^"(.*)"$/, "$1");
    meta[key] = value;
  }
  return { meta, body: source.slice(match[0].length) };
}

function splitSections(body: string, marker: "## " | "### "): TaskSection[] {
  const sections: TaskSection[] = [];
  let current: TaskSection | null = null;
  let inFence = false;
  for (const line of body.split("\n")) {
    if (line.trimStart().startsWith("```")) inFence = !inFence;
    if (!inFence && line.startsWith(marker)) {
      if (current) sections.push(current);
      current = { title: line.slice(marker.length).trim(), body: "" };
      continue;
    }
    if (current) current.body += line + "\n";
  }
  if (current) sections.push(current);
  return sections.map((s) => ({ ...s, body: s.body.trim() }));
}

/** Чтение синхронное и не зависит от запроса — страница может пререндериться. */
export function getTask(id: string): Task | null {
  const file = path.join(TASKS_DIR, `${id}.md`);
  if (!fs.existsSync(file)) return null;
  const { meta, body } = parseFrontmatter(fs.readFileSync(file, "utf8"));

  const all = splitSections(body, "## ");
  const hintsSection = all.find((s) => s.title.startsWith("Подсказки"));
  const starSection = all.find((s) => s.title.includes("Звёздочка"));
  const sections = all.filter((s) => s !== hintsSection && s !== starSection);

  return {
    meta: {
      id: meta.id ?? id,
      title: meta.title ?? id,
      xp: Number(meta.xp ?? 0),
      boss: meta.boss === "true",
      test: meta.test,
    },
    sections,
    hints: hintsSection ? splitSections(hintsSection.body, "### ") : [],
    star: starSection,
  };
}
