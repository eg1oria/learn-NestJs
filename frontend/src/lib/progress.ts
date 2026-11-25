import { readFile } from "node:fs/promises";
import path from "node:path";
import { connection } from "next/server";
import { cache } from "react";

export type TaskStatus =
  | "locked"
  | "open"
  | "rework"
  | "accepted"
  | "accepted_with_notes"
  | "accepted_with_solution";

export type TaskProgress = {
  status: TaskStatus;
  openedAt?: string;
  finishedAt?: string;
  grade?: string;
  xpAwarded?: number;
  star?: boolean;
  notes?: string;
};

export type Progress = {
  startedAt?: string;
  tasks: Record<string, TaskProgress>;
  badges: { id: string; earnedAt: string }[];
  weakSpots: string[];
  log: { date: string; task: string; grade: string; xp: number; note?: string }[];
};

const EMPTY: Progress = { tasks: {}, badges: [], weakSpots: [], log: [] };

/** learning/progress.json лежит в корне репозитория, на уровень выше frontend/. */
const PROGRESS_FILE = path.join(process.cwd(), "..", "learning", "progress.json");

/**
 * Читает прогресс на каждый запрос: файл обновляет ментор после проверки,
 * поэтому кэшировать его нельзя. `connection()` откладывает чтение до запроса.
 */
export const getProgress = cache(async (): Promise<Progress> => {
  await connection();
  try {
    const raw = await readFile(PROGRESS_FILE, "utf8");
    const data = JSON.parse(raw) as Partial<Progress>;
    return {
      ...EMPTY,
      ...data,
      tasks: data.tasks ?? {},
      badges: data.badges ?? [],
      weakSpots: data.weakSpots ?? [],
      log: data.log ?? [],
    };
  } catch {
    return EMPTY;
  }
});

export function statusOf(progress: Progress, taskId: string): TaskStatus {
  return progress.tasks[taskId]?.status ?? "locked";
}

export function isDone(status: TaskStatus) {
  return status.startsWith("accepted");
}

export function totalXp(progress: Progress) {
  return Object.values(progress.tasks).reduce(
    (sum, task) => sum + (task.xpAwarded ?? 0),
    0,
  );
}

export const statusLabel: Record<TaskStatus, string> = {
  locked: "Закрыто",
  open: "Открыто",
  rework: "На доработку",
  accepted: "Принято",
  accepted_with_notes: "Принято с замечаниями",
  accepted_with_solution: "Принято с решением",
};
