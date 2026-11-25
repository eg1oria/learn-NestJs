import type { Article, ArticleCategory } from "../types";
import { article as debugging } from "./debugging";
import { article as git } from "./git";
import { article as howToStudy } from "./how-to-study";
import { article as httpCheatsheet } from "./http-cheatsheet";
import { article as internet } from "./internet";
import { article as nestStarter } from "./nest-starter";
import { article as nodejs } from "./nodejs";
import { article as npm } from "./npm";
import { article as readingTests } from "./reading-tests";
import { article as terminal } from "./terminal";
import { article as typescriptTypes } from "./typescript-types";

/** Порядок здесь = порядок в библиотеке внутри категории. */
export const articles: Article[] = [
  howToStudy,
  terminal,
  npm,
  debugging,
  git,
  internet,
  httpCheatsheet,
  nodejs,
  typescriptTypes,
  nestStarter,
  readingTests,
];

export const categories: { id: ArticleCategory; title: string; description: string }[] = [
  { id: "start", title: "С чего начать", description: "Как устроен курс" },
  { id: "tools", title: "Инструменты", description: "Терминал, npm, git, отладка" },
  { id: "web", title: "Как устроен веб", description: "Сеть под капотом HTTP" },
  { id: "node", title: "Node.js и TypeScript", description: "Среда, в которой живёт сервер" },
  { id: "nest", title: "NestJS", description: "Фреймворк изнутри" },
  { id: "reference", title: "Справочники", description: "Держи открытыми под рукой" },
];

const bySlug = new Map(articles.map((a) => [a.slug, a]));

export function getArticle(slug: string) {
  return bySlug.get(slug) ?? null;
}

export function articlesForLesson(lessonId: string) {
  return articles.filter((a) => a.lessons.includes(lessonId));
}
