import { course } from "../course";
import type { Lesson } from "../types";
import { lesson as l01 } from "./0-1";
import { lesson as l02 } from "./0-2";
import { lesson as l03 } from "./0-3";
import { lesson as l04 } from "./0-4";
import { lesson as l11 } from "./1-1";
import { lesson as l12 } from "./1-2";
import { lesson as l13 } from "./1-3";
import { lesson as l14 } from "./1-4";

/** Чтобы добавить урок: создай файл рядом, импортируй сюда и впиши id в course.ts. */
const all: Lesson[] = [l01, l02, l03, l04, l11, l12, l13, l14];

const byId = new Map(all.map((l) => [l.id, l]));

/** Уроки в порядке прохождения (по программе курса). */
export const lessons: Lesson[] = course.flatMap((m) =>
  m.lessonIds.map((id) => byId.get(id)).filter((l): l is Lesson => Boolean(l)),
);

export const toSlug = (id: string) => id.replace(".", "-");
export const fromSlug = (slug: string) => slug.replace("-", ".");

export function getLesson(id: string) {
  return byId.get(id) ?? null;
}

export function neighbours(id: string) {
  const i = lessons.findIndex((l) => l.id === id);
  return { prev: lessons[i - 1] ?? null, next: lessons[i + 1] ?? null };
}
