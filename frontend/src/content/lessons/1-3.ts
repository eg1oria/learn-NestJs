import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "1.3",
  moduleId: 1,
  title: "Логи и ошибки",
  summary: "Как читать лог Nest, стектрейсы и самые частые аварии новичка.",
  minutes: 20,
  blocks: [
    {
      type: "analogy",
      title: "Чёрный ящик самолёта",
      text: "Когда самолёт падает, никто не гадает о причинах: открывают **бортовой самописец**, где записан каждый шаг. Лог сервера — такой же самописец. Пользователь видит только «что-то пошло не так». Что именно пошло не так, знает лишь лог.",
    },

    {
      type: "system",
      focus: ["logger", "filter"],
      caption: "Логи и обработка ошибок. Сейчас ошибки ловит встроенный обработчик Nest, свой фильтр ошибок ты напишешь в модуле 6.",
    },

    { type: "h", id: "line", text: "Из чего состоит строка лога" },
    { type: "diagram", id: "log-anatomy" },
    {
      type: "p",
      text: "Вот настоящий лог запуска твоего `backend/`. Его стоит читать как чек-лист: модули собрались, контроллеры найдены, маршруты зарегистрированы, сервер стартовал.",
    },
    {
      type: "code",
      lang: "text",
      file: "терминал",
      code: `[Nest] 13940  - 11/25/2026, 10:25:45 PM     LOG [NestFactory] Starting Nest application...
[Nest] 13940  - 11/25/2026, 10:25:45 PM     LOG [InstanceLoader] AppModule dependencies initialized +0ms
[Nest] 13940  - 11/25/2026, 10:25:45 PM     LOG [InstanceLoader] ObserveModule dependencies initialized +3ms
[Nest] 13940  - 11/25/2026, 10:25:45 PM     LOG [RoutesResolver] AppController {/}: +1ms
[Nest] 13940  - 11/25/2026, 10:25:45 PM     LOG [RouterExplorer] Mapped {/, GET} route +1ms
[Nest] 13940  - 11/25/2026, 10:25:45 PM     LOG [NestApplication] Nest application successfully started +0ms`,
    },
    {
      type: "callout",
      tone: "tip",
      title: "Первое правило отладки маршрутов",
      text: "Если эндпоинт отвечает `404`, сначала найди его в строках `Mapped {...}`. Если строки нет, Nest **не знает** о твоём методе: забыт декоратор, контроллер не добавлен в модуль или путь склеился не так, как ты думал.",
    },

    { type: "h", id: "levels", text: "Уровни и Logger" },
    {
      type: "table",
      head: ["Уровень", "Когда"],
      rows: [
        ["`log`", "обычные события: сервер стартовал, герой создан"],
        ["`warn`", "странно, но работаем: повторная попытка, устаревший параметр"],
        ["`error`", "что-то сломалось, нужен человек"],
        ["`debug` / `verbose`", "подробности для отладки, на проде обычно выключены"],
        ["`fatal`", "всё, процесс дальше жить не может"],
      ],
    },
    {
      type: "p",
      text: "В Nest для логов есть встроенный класс `Logger`. Обычно его создают с **контекстом**: это имя, которое появится в квадратных скобках.",
    },
    {
      type: "code",
      lang: "ts",
      file: "potions.service.ts",
      code: `import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PotionsService {
  private readonly logger = new Logger(PotionsService.name);

  brew(name: string) {
    this.logger.log(\`Варим «\${name}»\`);
    // [Nest] ... LOG [PotionsService] Варим «Зелье силы»
  }
}`,
    },
    {
      type: "why",
      text: "Почему не `console.log`? `Logger` пишет в одном формате с самим Nest: с временем, уровнем и контекстом. Его можно настроить: выключить `debug` на проде, отправлять логи в мониторинг. А `console.log` — это голый текст, который через месяц не найдёшь и не отфильтруешь.",
    },

    { type: "h", id: "stack", text: "Стектрейс: хлебные крошки" },
    {
      type: "p",
      text: "Когда код бросает исключение, Nest ловит его, отвечает клиенту `500` и пишет в лог **стектрейс** (stack trace) — цепочку вызовов «кто кого позвал» до места падения. Это вывод из твоего же проекта, если сервис бросит ошибку:",
    },
    {
      type: "code",
      lang: "text",
      file: "терминал",
      code: `[Nest] 14533  - 11/25/2026, 10:33:28 PM   ERROR [ExceptionsHandler] Error: Таверна сгорела   Trace ID: 01a213c5-…
    at AppService.getWelcome (/…/backend/dist/app.service.js:12:26)
    at AppService.getWelcome (file:///…/node_modules/@nestjs/observe/dist/instrument/…:604:79)
    at AsyncLocalStorage.run (node:internal/async_local_storage/…:63:14)
    at AppController.getWelcome (/…/backend/dist/app.controller.js:20:43)
    at AppController.getWelcome (file:///…/node_modules/@nestjs/observe/dist/instrument/…:604:79)
    …`,
    },
    { type: "diagram", id: "call-stack" },
    {
      type: "list",
      items: [
        "**Первая строка** — что случилось: текст ошибки.",
        "Дальше снизу вверх идёт путь вызовов: контроллер позвал сервис, сервис упал. Читают обычно **сверху**: верхняя строка с твоим файлом — место падения.",
        "Строки из `node_modules` и `node:internal` — чужой код (Nest, Observe, Node.js). Пропускай их и ищи свои файлы.",
        "Обрати внимание: путь ведёт в `dist/…js`, то есть в **скомпилированный** файл, а не в `src/…ts`. Номер строки относится к JS-версии, но имя класса и метода всегда подскажут, где искать.",
      ],
    },
    {
      type: "code",
      lang: "http",
      code: `HTTP/1.1 500 Internal Server Error
Content-Type: application/json; charset=utf-8

{"statusCode":500,"message":"Internal server error"}`,
      caption: "А клиент в это время видит только это, без стектрейса и текста ошибки.",
    },
    {
      type: "sequence",
      title: "Путь ошибки: от throw до 500",
      actors: [
        { id: "client", label: "Клиент" },
        { id: "ctrl", label: "Контроллер" },
        { id: "svc", label: "Сервис" },
        { id: "handler", label: "Обработчик ошибок", sub: "встроен в Nest" },
        { id: "log", label: "Лог", sub: "терминал" },
      ],
      steps: [
        { from: "client", to: "ctrl", label: "GET /", text: "Обычный запрос." },
        { from: "ctrl", to: "svc", label: "getWelcome()", text: "Контроллер зовёт сервис." },
        { from: "svc", to: "handler", label: "throw Error", kind: "error", text: "Сервис бросает исключение. Выполнение метода обрывается, и ошибка летит **вверх по стеку**: сначала через контроллер, потом в Nest." },
        { from: "handler", to: "log", label: "ERROR + стектрейс", kind: "error", text: "Встроенный обработчик ловит её и пишет **полную правду** в лог: текст и стектрейс. Это видишь только ты." },
        { from: "handler", to: "client", label: "500 Internal server error", kind: "error", text: "Клиенту уходит **безопасный минимум**: статус 500 и общий текст. Сервер при этом не падает и продолжает обслуживать другие запросы." },
      ],
    },
    {
      type: "why",
      text: "Почему клиенту не показывают настоящую ошибку? Потому что стектрейс раскрывает **внутренности**: пути к файлам, версии библиотек, иногда куски SQL-запросов и данных. Для взломщика это подарок. Подробности пишут в лог, а клиенту отдают аккуратное сообщение. Как сделать его понятнее, разберём в модуле 6.",
    },

    { type: "h", id: "crashes", text: "Галерея аварий" },
    {
      type: "table",
      head: ["Что видишь", "Что это", "Куда смотреть"],
      rows: [
        ["`EADDRINUSE :::3000`", "порт занят другой программой", "второй терминал со старым сервером"],
        ["`TS2345: Argument of type…`", "ошибка типов, сервер не пересобрался", "файл и строка в начале сообщения"],
        ["`Cannot find module './x'`", "неверный путь импорта", "строка с `import`"],
        ["`{\"statusCode\":404,\"message\":\"Cannot GET /x\"}`", "такого маршрута нет", "строки `Mapped` в логе"],
        ["`{\"statusCode\":500,…}`", "исключение в твоём коде", "стектрейс в логе сервера"],
        ["`Nest can't resolve dependencies…`", "Nest не знает, откуда взять зависимость", "массив `providers` в модуле (модуль 3)"],
      ],
    },

    { type: "read", slugs: ["debugging", "terminal", "typescript-types"] },

    { type: "h", id: "check", text: "Проверь себя" },
    {
      type: "quiz",
      id: "where-500",
      kind: "concept",
      question: "Фронтенд получил `500`. Где искать **причину**?",
      options: [
        "В теле ответа, там всё написано",
        "В логе сервера, в стектрейсе",
        "В DevTools → Console браузера",
        "Нигде, `500` случается сам по себе",
      ],
      correct: 1,
      explain: "Клиенту специально ничего не рассказывают. Вся правда в логе сервера: текст ошибки и цепочка вызовов.",
    },
    {
      type: "quiz",
      id: "not-mapped",
      kind: "bug",
      question: "Ты добавил новый контроллер `TavernController`, но в логе запуска нет ни одной строки `Mapped` с его путями. Самая вероятная причина?",
      options: [
        "Порт 3000 занят",
        "Контроллер не указан в `controllers` модуля",
        "Не установлена база данных",
        "Нужно перезагрузить браузер",
      ],
      correct: 1,
      explain: "Nest знает только то, что перечислено в модулях. Класс с наклейкой `@Controller` сам себя не регистрирует: его нужно добавить в `controllers: [...]`. Если бы был занят порт, сервер вообще бы не стартовал.",
    },
  ],
};
