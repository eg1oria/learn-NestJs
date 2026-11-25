/**
 * Что «Моя гильдия» спрашивает у бэкенда ученика.
 * После задания 0.4 ментор подстраивает пути под чертёж ученика.
 */
export type GuildView = "greeting" | "health" | "heroes" | "quests" | "leaderboard";

export type GuildEndpoint = {
  view: GuildView;
  title: string;
  method: "GET";
  path: string;
  /** Где эта функция появится: "урок 1.2" или "модуль 2". */
  unlocksIn: string;
  description: string;
};

export const guildEndpoints: GuildEndpoint[] = [
  {
    view: "greeting",
    title: "Приветствие",
    method: "GET",
    path: "/",
    unlocksIn: "уроке 1.2",
    description: "Первые слова твоего сервера.",
  },
  {
    view: "health",
    title: "Табличка у входа",
    method: "GET",
    path: "/health",
    unlocksIn: "уроке 1.4",
    description: "Жив ли сервер и сколько он работает.",
  },
  {
    view: "heroes",
    title: "Герои гильдии",
    method: "GET",
    path: "/heroes",
    unlocksIn: "модуле 2 «Контроллеры и роутинг»",
    description: "Все нанятые герои.",
  },
  {
    view: "quests",
    title: "Доска квестов",
    method: "GET",
    path: "/quests",
    unlocksIn: "модуле 4 «Модули»",
    description: "Задания, которые ждут смельчаков.",
  },
  {
    view: "leaderboard",
    title: "Таблица лидеров",
    method: "GET",
    path: "/leaderboard",
    unlocksIn: "модуле 10, а в реальном времени — в модуле 16",
    description: "Топ героев по опыту.",
  },
];
