import type { Article } from "../types";

export const article: Article = {
  slug: "npm",
  title: "npm, package.json и node_modules",
  summary: "Откуда берутся библиотеки, что такое скрипты и зачем `--` в команде теста.",
  minutes: 7,
  category: "tools",
  lessons: ["1.1", "1.2"],
  blocks: [
    {
      type: "p",
      text: "Ты уже ставил пакеты в Next-проект через `npm install`. Здесь разберём то, что обычно пропускают: что именно лежит в `package.json` бэкенда и как работают команды, которые ты запускаешь в каждом задании.",
    },
    {
      type: "analogy",
      title: "Список покупок и кладовка",
      text: "`package.json` — это **список покупок**: что нужно проекту. `node_modules/` — **кладовка**, куда npm всё это сложил. `package-lock.json` — **чек**, где записаны точные версии того, что купили. Список и чек хранят в git, а кладовку нет: её всегда можно заново наполнить командой `npm install`.",
    },

    { type: "h", id: "deps", text: "dependencies и devDependencies" },
    {
      type: "walkthrough",
      file: "backend/package.json (фрагмент)",
      lang: "json",
      code: `{
  "scripts": {
    "build": "nest build",
    "start:dev": "nest start --watch",
    "lint": "oxlint --type-aware src/ test/",
    "test": "node --experimental-vm-modules ./node_modules/jest/bin/jest.js",
    "test:e2e": "node --experimental-vm-modules ./node_modules/jest/bin/jest.js --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/common": "^12.0.1",
    "@nestjs/core": "^12.0.1",
    "@nestjs/platform-express": "^12.0.1",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^12.0.0",
    "@nestjs/testing": "^12.0.1",
    "jest": "^30.0.0",
    "supertest": "^7.0.0",
    "typescript": "^6.0.2"
  }
}`,
      steps: [
        {
          lines: [2, 8],
          title: "scripts — твои команды",
          text: [
            "Короткие имена для длинных команд. `npm run build` выполнит `nest build`, а `npm run start:dev` выполнит `nest start --watch`.",
            "Внутри скриптов npm умеет находить программы из `node_modules/.bin`. Поэтому `nest` работает в скрипте, но не работает, если набрать его в терминале напрямую.",
          ],
        },
        {
          lines: [9, 15],
          title: "dependencies — нужно в продакшене",
          text: "Без этих пакетов сервер не запустится. `@nestjs/core` — ядро фреймворка, `@nestjs/common` — декораторы (`@Controller`, `@Get`) и базовые классы, `platform-express` — HTTP-сервер под капотом. `reflect-metadata` нужен декораторам, а `rxjs` используется внутри Nest.",
        },
        {
          lines: [16, 22],
          title: "devDependencies — нужно только разработчику",
          text: "Инструменты: CLI для сборки, Jest и supertest для тестов, сам компилятор TypeScript. На продакшен-сервере они не нужны: там запускают уже скомпилированный JavaScript из `dist/`.",
        },
        {
          lines: [10, 10],
          title: "Что значит ^12.0.1",
          text: "Это **диапазон версий**. Знак `^` означает: «12.0.1 или новее, но в пределах 12.x». Версия читается как МАЖОР.МИНОР.ПАТЧ: патч чинит баги, минор добавляет возможности, мажор может что-то сломать. Поэтому на новую мажорную версию npm сам не переходит.",
        },
      ],
    },

    { type: "h", id: "run", text: "npm run и двойной дефис" },
    {
      type: "p",
      text: "В заданиях ты запускаешь тест так: `npm run test:e2e -- lessons/1.2`. Всё, что идёт **после** `--`, npm не трогает, а дописывает в конец команды скрипта. На деле выполнится:",
    },
    {
      type: "code",
      lang: "bash",
      code: `node … jest.js --config ./test/jest-e2e.json lessons/1.2
#                                           ↑ это пришло после --`,
    },
    {
      type: "p",
      text: "А Jest понимает `lessons/1.2` как фильтр: «запусти только файлы тестов, в пути которых есть это». Простой аргумент дошёл бы до скрипта и без `--`, а вот флаги вида `--watch` npm забрал бы себе. Поэтому привычка всегда ставить `--` перед аргументами для скрипта — самая надёжная.",
    },
    {
      type: "callout",
      tone: "info",
      title: "Исключения: start и test",
      text: "Для скриптов `start` и `test` слово `run` можно не писать: `npm start`, `npm test`. Для всех остальных (`start:dev`, `test:e2e`, `lint`) оно обязательно.",
    },

    { type: "h", id: "npx", text: "npx — запустить, не устанавливая" },
    {
      type: "p",
      text: "`npx` запускает программу из пакета: из `node_modules` проекта, а если там её нет — скачивает на время. Например, `npx ts-node файл.ts` в задании 1.1 выполняет TypeScript-файл напрямую, без сборки. А `npx nest --help` показывает справку CLI проекта.",
    },

    { type: "h", id: "install", text: "Когда запускать npm install" },
    {
      type: "list",
      items: [
        "После `git clone`: кладовки `node_modules` в репозитории нет.",
        "Когда ментор (или ты) добавил новый пакет в `package.json`.",
        "Когда видишь `Cannot find module '@nestjs/…'`: возможно, пакет не установлен.",
        "Ставить новый пакет нужно **в папке** нужного проекта: `cd backend && npm install zod`.",
      ],
    },
    {
      type: "quiz",
      id: "dashdash",
      kind: "predict",
      question: "Что выполнится при `npm run test:e2e -- lessons/1.4`?",
      options: [
        "Все e2e-тесты проекта",
        "Только тесты, в пути которых есть `lessons/1.4`",
        "Ошибка: у `test:e2e` нет аргументов",
        "Unit-тесты из `src/`",
      ],
      correct: 1,
      explain: "`lessons/1.4` передаётся Jest как фильтр по пути файла. Под него подходит `test/lessons/1.4.e2e-spec.ts`.",
    },
  ],
};
