/**
 * Модель контента курса. Уроки — это данные (массив блоков), а вёрстка
 * живёт в компонентах. Новый урок = новый файл в `content/lessons/`.
 *
 * В текстовых полях работает мини-разметка: **жирный**, `код`,
 * _курсив_, [ссылка](https://...).
 */

export type CodeLang = "ts" | "json" | "bash" | "http" | "text";

export type DiagramId =
  | "client-server"
  | "http-journey"
  | "http-anatomy"
  | "rest-matrix"
  | "async-timeline"
  | "decorators"
  | "nest-bootstrap"
  | "request-lifecycle"
  | "log-anatomy"
  | "health-balancer"
  | "event-loop"
  | "json-roundtrip"
  | "class-instances"
  | "compile-pipeline"
  | "call-stack"
  | "url-tree";

/** Узлы большой карты бэкенда (content/system.ts). */
export type SystemNodeId =
  | "browser"
  | "curl"
  | "tests"
  | "ws"
  | "middleware"
  | "guard"
  | "interceptor"
  | "pipe"
  | "controller"
  | "filter"
  | "service"
  | "docs"
  | "modules"
  | "config"
  | "logger"
  | "health"
  | "db"
  | "cache"
  | "queue"
  | "docker";

export type SequenceBlock = {
  type: "sequence";
  title?: string;
  actors: { id: string; label: string; sub?: string }[];
  steps: {
    from: string;
    to: string;
    /** Подпись на стрелке, коротко: "GET /health". */
    label: string;
    kind?: "request" | "response" | "self" | "error";
    /** Объяснение шага под диаграммой. */
    text: string;
  }[];
};

export type QuizKind = "predict" | "bug" | "concept";

export type QuizBlock = {
  type: "quiz";
  id: string;
  kind: QuizKind;
  question: string;
  code?: { lang: CodeLang; code: string };
  options: string[];
  correct: number;
  explain: string;
};

export type Block =
  | { type: "h"; id: string; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "analogy"; title: string; text: string | string[] }
  | { type: "why"; text: string | string[] }
  | {
      type: "callout";
      tone: "info" | "tip" | "warn";
      title?: string;
      text: string | string[];
    }
  | {
      type: "code";
      lang: CodeLang;
      code: string;
      file?: string;
      caption?: string;
    }
  | { type: "diagram"; id: DiagramId; caption?: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "terms"; items: { ru: string; en: string; text: string }[] }
  /** Карточки статей из библиотеки: «почитать подробнее». */
  | { type: "read"; slugs: string[]; title?: string }
  /** Построчный разбор кода: шаги подсвечивают диапазоны строк. */
  | WalkthroughBlock
  /** Большая карта бэкенда с подсветкой того, чего касается урок. */
  | { type: "system"; focus: SystemNodeId[]; caption?: string }
  | SequenceBlock
  /** Цепочка шагов с объяснениями (кликабельная). */
  | { type: "flow"; steps: { title: string; code: string; text: string }[] }
  | QuizBlock;

export type WalkthroughBlock = {
  type: "walkthrough";
  file: string;
  lang: CodeLang;
  code: string;
  steps: { lines: [number, number]; title: string; text: string | string[] }[];
};

export type Lesson = {
  /** Номер урока и задания, например "1.4". */
  id: string;
  moduleId: number;
  title: string;
  summary: string;
  minutes: number;
  boss?: boolean;
  blocks: Block[];
};

export type ArticleCategory = "start" | "tools" | "web" | "node" | "nest" | "reference";

export type Article = {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  category: ArticleCategory;
  /** Уроки, к которым статья относится (для перекрёстных ссылок). */
  lessons: string[];
  blocks: Block[];
};

export type CourseModule = {
  id: number;
  title: string;
  description: string;
  topics: string[];
  /** Пусто — модуль ещё не сгенерирован (откроется по мере прохождения). */
  lessonIds: string[];
  /** План уроков модуля (названия), пока сами уроки не написаны. */
  planned?: string[];
  /** Что в итоге появится в Гильдии после модуля. */
  outcome?: string;
};
