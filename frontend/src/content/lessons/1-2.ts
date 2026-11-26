import { article as nestStarter } from "../articles/nest-starter";
import type { Lesson, WalkthroughBlock } from "../types";

/** Построчные разборы берём из статьи, чтобы не держать две копии. */
function walkthrough(file: string): WalkthroughBlock {
  const block = nestStarter.blocks.find(
    (b): b is WalkthroughBlock => b.type === "walkthrough" && b.file === file,
  );
  if (!block) throw new Error(`Нет разбора для ${file}`);
  return block;
}

export const lesson: Lesson = {
  id: "1.2",
  moduleId: 1,
  title: "Анатомия Nest-проекта",
  summary: "Что лежит в backend/, как сервер просыпается и кто отвечает на запрос.",
  minutes: 25,
  blocks: [
    {
      type: "p",
      text: "Открой `backend/` в VS Code и держи его рядом с этим уроком: мы пройдёмся по каждому файлу.",
    },

    {
      type: "system",
      focus: ["controller", "service", "modules"],
      caption: "Сегодня твой бэкенд — это один модуль, один контроллер и один сервис. К концу курса блоков станет больше, но все они будут устроены по тому же принципу.",
    },

    { type: "h", id: "files", text: "Карта файлов" },
    {
      type: "table",
      head: ["Файл", "Зачем он"],
      rows: [
        ["`src/main.ts`", "точка входа: создаёт приложение и открывает порт"],
        ["`src/app.module.ts`", "корневой модуль: из чего состоит приложение"],
        ["`src/app.controller.ts`", "принимает HTTP-запросы"],
        ["`src/app.service.ts`", "бизнес-логика"],
        ["`src/app.controller.spec.ts`", "unit-тест контроллера"],
        ["`test/app.e2e-spec.ts`", "e2e-тест: поднимает приложение и шлёт настоящие запросы"],
        ["`test/lessons/`", "тесты к заданиям курса, их пишу я"],
        ["`package.json`", "зависимости и команды (`scripts`)"],
        ["`tsconfig.json`", "настройки TypeScript"],
        ["`.oxlintrc.json`, `.prettierrc`", "линтер (ищет ошибки) и форматтер (наводит красоту)"],
      ],
    },

    { type: "h", id: "restaurant", text: "Кто за что отвечает" },
    {
      type: "analogy",
      title: "Ресторан открывается",
      text: [
        "`main.ts` — администратор, который утром включает свет и **открывает двери** (`listen`).",
        "`AppModule` — **схема ресторана**: какие залы есть и кто в них работает.",
        "**Контроллер** — официант: принимает заказ, приносит блюдо. Сам он не готовит.",
        "**Сервис** — повар: вся настоящая работа происходит у него.",
      ],
    },
    {
      type: "p",
      text: "Что происходит при запуске сервера, по шагам. Пройдись по кнопкам:",
    },
    { type: "diagram", id: "nest-bootstrap" },

    { type: "h", id: "main", text: "main.ts" },
    {
      type: "p",
      text: "Нажимай на шаги под кодом или кликай прямо по строкам: подсветка покажет, о какой части идёт речь.",
    },
    walkthrough("src/main.ts"),
    {
      type: "callout",
      tone: "info",
      title: "Что за Observe?",
      text: "Шаблон Nest 12 сразу подключает **NestJS Observe**, официальный мониторинг: трейсы, ошибки, метрики. Пока он не привязан к аккаунту, он ничего никуда не отправляет. Поэтому при запуске в логе есть строка «Observe is installed but not connected yet», и это нормально. Не трогай этот код, к мониторингу вернёмся в финальном модуле.",
    },

    { type: "h", id: "controller", text: "Контроллер и сервис" },
    walkthrough("src/app.controller.ts"),
    walkthrough("src/app.service.ts"),
    {
      type: "p",
      text: "Итоговый путь склеивается из двух частей: `@Controller('heroes')` + `@Get(':id')` = `GET /heroes/:id`. Сервис помечен `@Injectable()`. Эта наклейка говорит Nest: «этот класс можно создавать и передавать другим».",
    },
    {
      type: "why",
      text: [
        "Почему не написать всё прямо в контроллере? Контроллер знает про **HTTP**: пути, статусы, заголовки. Сервис знает про **дело**: как начислить награду и кто кому должен.",
        "Когда завтра ту же логику понадобится вызвать по расписанию (cron), из очереди или через WebSocket, сервис переиспользуется целиком, а контроллер нет. А ещё сервис легко тестировать без HTTP. Без этого разделения получаются «толстые контроллеры» на 800 строк, которые боятся трогать.",
      ],
    },

    { type: "h", id: "trace", text: "Один запрос по коду" },
    {
      type: "sequence",
      title: "Что происходит при GET /",
      actors: [
        { id: "client", label: "Клиент", sub: "curl / браузер" },
        { id: "nest", label: "Nest", sub: "роутер" },
        { id: "ctrl", label: "AppController", sub: "app.controller.ts" },
        { id: "svc", label: "AppService", sub: "app.service.ts" },
      ],
      steps: [
        { from: "client", to: "nest", label: "GET /", text: "На порт 3000 пришёл текст `GET / HTTP/1.1`." },
        { from: "nest", to: "nest", label: "ищу в таблице", kind: "self", text: "Nest смотрит в таблицу маршрутов, составленную при запуске (строки `Mapped` в логе). Для `GET /` записано: метод `getHello` класса `AppController`." },
        { from: "nest", to: "ctrl", label: "getHello()", text: "Nest вызывает метод контроллера. Объект контроллера уже создан при запуске, и сервис в него уже передан." },
        { from: "ctrl", to: "svc", label: "this.appService.getHello()", text: "Контроллер ничего не решает сам: он зовёт сервис." },
        { from: "svc", to: "ctrl", label: "'Hello World!'", kind: "response", text: "Сервис возвращает строку." },
        { from: "ctrl", to: "nest", label: "'Hello World!'", kind: "response", text: "Контроллер возвращает её дальше. Он просто `return`-ит значение, а не пишет HTTP-ответ сам." },
        { from: "nest", to: "client", label: "200 text/html", kind: "response", text: "Nest сам упаковывает результат в HTTP-ответ: статус `200`, заголовок `Content-Type` (строка → `text/html`, объект → `application/json`) и тело. Это и есть удобство фреймворка: ты пишешь только логику." },
      ],
    },

    { type: "h", id: "json", text: "Строка или объект" },
    {
      type: "p",
      text: "Nest смотрит, что вернул метод контроллера. **Строка** уходит как есть, с `Content-Type: text/html`. **Объект или массив** Nest сам превращает в JSON (через `JSON.stringify`) и ставит `Content-Type: application/json`.",
    },
    {
      type: "code",
      lang: "http",
      code: `GET /potions/menu HTTP/1.1

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"drinks":["эль","морс"],"open":true}`,
      caption: "Ответ метода, который вернул объект { drinks: [...], open: true }",
    },

    { type: "h", id: "tests", text: "Тесты, которые уже есть в проекте" },
    {
      type: "p",
      text: "`nest new` создал два теста. Оба проверяют, что сервер говорит `Hello World!`. В задании 1.2 ты поменяешь это поведение, и оба теста станут красными. Это не поломка, а **так и задумано**: тест описывал старый контракт, и его нужно обновить вместе с кодом.",
    },
    {
      type: "table",
      head: ["Файл", "Вид", "Что проверяет", "Запуск"],
      rows: [
        ["`src/app.controller.spec.ts`", "unit", "вызывает метод контроллера напрямую, без HTTP", "`npm test`"],
        ["`test/app.e2e-spec.ts`", "e2e", "поднимает приложение и шлёт настоящий `GET /`", "`npm run test:e2e -- app`"],
      ],
    },
    {
      type: "code",
      lang: "ts",
      file: "src/app.controller.spec.ts (главное)",
      code: `describe('AppController', () => {          // группа проверок
  // … перед каждой проверкой собирается контроллер с сервисом …

  it('should return "Hello World!"', () => {  // одна проверка
    expect(appController.getHello()).toBe('Hello World!');
    //     ↑ что получили              ↑ что ожидаем
  });
});`,
    },
    {
      type: "callout",
      tone: "tip",
      title: "Тест читается как предложение",
      text: "«Ожидаю (`expect`), что `getHello()` вернёт ровно (`toBe`) строку `Hello World!`». Полный разбор тестов, всех `expect` и красного вывода — в статье [«Как читать тесты и их ошибки»](/library/reading-tests). Прочитай её до задания 1.2.",
    },

    { type: "h", id: "scripts", text: "Команды" },
    {
      type: "table",
      head: ["Команда", "Что делает"],
      rows: [
        ["`npm run start:dev`", "запуск в режиме наблюдения (watch): сохранил файл → пересборка → перезапуск"],
        ["`npm run start`", "обычный запуск без наблюдения"],
        ["`npm run build`", "компиляция TypeScript → `dist/`"],
        ["`npm test`", "unit-тесты (`*.spec.ts` в `src/`)"],
        ["`npm run test:e2e -- lessons/1.2`", "e2e-тест одного задания"],
        ["`npm run lint`", "линтер: подозрительный код и ошибки"],
        ["`npm run format`", "Prettier: единый стиль кода"],
      ],
    },
    {
      type: "p",
      text: "Что физически происходит, когда ты запускаешь сервер и сохраняешь файл:",
    },
    { type: "diagram", id: "compile-pipeline" },
    {
      type: "callout",
      tone: "warn",
      title: "Ловушка watch-режима",
      text: "Если в коде ошибка TypeScript, `start:dev` **не перезапустит** сервер, а напишет ошибку в терминал. Ты обновляешь страницу, видишь старое поведение и не понимаешь почему. Всегда поглядывай в терминал после сохранения.",
    },

    { type: "h", id: "future", text: "Карта на будущее" },
    {
      type: "p",
      text: "Пока у тебя есть только контроллер и сервис. Но в Nest каждый запрос проходит целый конвейер, и к модулю 7 ты будешь знать каждую его станцию:",
    },
    { type: "diagram", id: "request-lifecycle" },

    { type: "read", slugs: ["nest-starter", "reading-tests", "backend-anatomy", "npm"] },

    { type: "h", id: "check", text: "Проверь себя" },
    {
      type: "quiz",
      id: "content-type",
      kind: "predict",
      question: "Метод контроллера возвращает `{ ok: true }`. Какой `Content-Type` будет у ответа?",
      options: ["`text/html`", "`text/plain`", "`application/json`", "Никакого, заголовок нужно ставить вручную"],
      correct: 2,
      explain: "Объект Nest сериализует в JSON и сам выставляет `application/json; charset=utf-8`. Строку отдал бы как `text/html`.",
    },
    {
      type: "quiz",
      id: "double-path",
      kind: "bug",
      question: "Ты ждёшь, что `GET /heroes` вернёт список, а получаешь `404`. Почему?",
      code: {
        lang: "ts",
        code: `@Controller('heroes')
export class HeroesController {
  @Get('heroes')
  findAll() {
    return [];
  }
}`,
      },
      options: [
        "Нужно `@Post` вместо `@Get`",
        "Путь склеился в `/heroes/heroes`",
        "Метод должен называться `getHeroes`",
        "Пустой массив Nest превращает в 404",
      ],
      correct: 1,
      explain: "Префикс контроллера и путь метода складываются. Здесь получилось `GET /heroes/heroes`. Нужно оставить `@Get()` без аргумента. Проверить можно по логу запуска: там будет строка `Mapped {/heroes/heroes, GET}`.",
    },
    {
      type: "quiz",
      id: "where-logic",
      kind: "concept",
      question: "Где должна жить логика «посчитать награду за квест с учётом уровня героя»?",
      options: ["В `main.ts`", "В контроллере", "В сервисе", "В `app.module.ts`"],
      correct: 2,
      explain: "Это бизнес-логика, ей место в сервисе. Контроллер только примет запрос, вызовет сервис и вернёт результат.",
    },
  ],
};
