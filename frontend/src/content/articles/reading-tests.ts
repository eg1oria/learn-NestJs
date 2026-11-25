import type { Article } from "../types";

export const article: Article = {
  slug: "reading-tests",
  title: "Как читать тесты и их ошибки",
  summary: "Unit и e2e, describe/it/expect, supertest и разбор настоящего красного вывода Jest.",
  minutes: 11,
  category: "nest",
  lessons: ["1.1", "1.2", "1.4"],
  blocks: [
    {
      type: "p",
      text: "К большинству заданий есть автотест, который написал ментор. Он описывает **контракт**: что должно получиться, а не как это сделать. Эта статья научит читать тест как техзадание, а красный вывод — как подсказку.",
    },
    {
      type: "analogy",
      title: "Тайный покупатель",
      text: "Тест — это тайный покупатель, который приходит в таверну с чек-листом: «заказать эль → ответ за 100 мс → в ответе цена 5 золотых». Ему всё равно, как устроена кухня. Он проверяет только то, что видит гость. Поэтому одно задание можно решить разными способами, и все они пройдут тест.",
    },

    { type: "h", id: "kinds", text: "Unit и e2e" },
    {
      type: "table",
      head: ["", "Unit-тест", "E2E-тест (end-to-end)"],
      rows: [
        ["Проверяет", "один класс или функцию отдельно", "всё приложение целиком, через настоящий HTTP"],
        ["Где лежит", "рядом с кодом: `src/*.spec.ts`", "`test/*.e2e-spec.ts`, `test/lessons/`"],
        ["Запуск", "`npm test`", "`npm run test:e2e`"],
        ["Скорость", "очень быстрый", "медленнее: поднимает приложение"],
        ["Пример", "«метод сервиса вернул нужную строку»", "«на `GET /health` пришёл 200 и JSON»"],
      ],
    },

    { type: "h", id: "anatomy", text: "Анатомия теста" },
    {
      type: "walkthrough",
      file: "test/app.e2e-spec.ts (стартовый)",
      lang: "ts",
      code: `import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterEach(async () => {
    await app.close();
  });
});`,
      steps: [
        {
          lines: [1, 5],
          title: "Инструменты",
          text: "`@nestjs/testing` умеет собирать приложение для тестов. `supertest` отправляет в него настоящие HTTP-запросы. Запускать `start:dev` и занимать порт 3000 для этого не нужно: тест поднимает приложение сам. `AppModule` — твоё приложение, которое будем проверять.",
        },
        {
          lines: [7, 7],
          title: "describe — группа",
          text: "`describe('название', () => {...})` объединяет связанные проверки. Название попадает в отчёт, поэтому в тестах курса оно совпадает с номером задания.",
        },
        {
          lines: [10, 17],
          title: "beforeEach — подготовка",
          text: [
            "Выполняется **перед каждой** проверкой. Здесь собирается свежее приложение из `AppModule`, как это делает `main.ts`, только без `listen`.",
            "Есть варианты: `beforeAll` (один раз перед всеми), `afterEach` и `afterAll` (после). В тестах курса чаще используется `beforeAll`, чтобы не пересобирать приложение каждый раз.",
          ],
        },
        {
          lines: [19, 24],
          title: "it — одна проверка",
          text: [
            "`it('что проверяем', () => {...})` — один сценарий. Читается как предложение: «it (оно) отвечает 200 на GET /».",
            "`request(app.getHttpServer()).get('/')` отправляет запрос. `.expect(200)` проверяет статус. `.expect('Hello World!')` проверяет тело. Если хоть одно ожидание не выполнится, тест красный.",
          ],
        },
        {
          lines: [26, 28],
          title: "Уборка",
          text: "После проверки приложение закрывается, чтобы не держать ресурсы и не мешать следующим тестам.",
        },
      ],
    },

    { type: "h", id: "expect", text: "expect: язык ожиданий" },
    {
      type: "table",
      head: ["Запись", "Читается как"],
      rows: [
        ["`expect(x).toBe(5)`", "x строго равно 5 (как `===`)"],
        ["`expect(obj).toEqual({ a: 1 })`", "объект с таким же содержимым (глубокое сравнение)"],
        ["`expect(text).toContain('Гильдия')`", "строка (или массив) содержит это"],
        ["`expect(text).toMatch(/^\\d{4}-/)`", "строка подходит под регулярное выражение"],
        ["`expect(n).toBeGreaterThan(0)`", "число больше 0 (есть и `…OrEqual`, `toBeLessThan`)"],
        ["`expect(x).toBeInstanceOf(Promise)`", "x — экземпляр класса"],
        ["`expect(arr).toHaveLength(3)`", "длина равна 3"],
        ["`await expect(p).resolves.toBe('ok')`", "промис выполнится со значением 'ok'"],
        ["`await expect(p).rejects.toThrow('нет')`", "промис отклонится с ошибкой, в тексте которой «нет»"],
        ["`expect(x).not.toContain('Hello')`", "`not` переворачивает любое ожидание"],
      ],
    },

    { type: "h", id: "run", text: "Как запускать" },
    {
      type: "code",
      lang: "bash",
      code: `cd backend
npm test                          # все unit-тесты (src/**/*.spec.ts)
npm run test:e2e                  # все e2e-тесты, включая ещё не открытые уроки
npm run test:e2e -- lessons/1.2   # только тест задания 1.2  ← так и надо
npm run test:e2e -- app           # только test/app.e2e-spec.ts`,
    },
    {
      type: "callout",
      tone: "info",
      title: "Это предупреждение не страшное",
      text: "Каждый запуск начинается со строки `ExperimentalWarning: VM Modules is an experimental feature`. Это предупреждение о режиме, в котором Jest запускается в этом проекте. На результат оно не влияет, просто пропускай его.",
    },

    { type: "h", id: "red", text: "Читаем красный вывод" },
    {
      type: "p",
      text: "Вот настоящий вывод теста 1.2 на нетронутом проекте:",
    },
    {
      type: "walkthrough",
      file: "терминал",
      lang: "text",
      code: `FAIL test/lessons/1.2.e2e-spec.ts
  ● 1.2 — Первые слова Гильдии › GET / приветствует Гильдию героев

    expect(received).toContain(expected) // indexOf

    Expected substring: "Гильдию героев"
    Received string:    "Hello World!"

      30 |   it('GET / приветствует Гильдию героев', async () => {
      31 |     const res = await request(app.getHttpServer()).get('/');
    > 32 |     expect(res.text).toContain('Гильдию героев');
         |                      ^
      33 |   });

      at Object.<anonymous> (lessons/1.2.e2e-spec.ts:32:22)

Test Suites: 1 failed, 1 total
Tests:       2 failed, 1 passed, 3 total`,
      steps: [
        {
          lines: [1, 1],
          title: "Какой файл",
          text: "`FAIL` — в этом файле хотя бы одна проверка не прошла. Если всё хорошо, будет зелёный `PASS`.",
        },
        {
          lines: [2, 2],
          title: "Какая проверка",
          text: "После `●` идёт путь: название `describe` › название `it`. Это готовое описание того, **чего от тебя ждут**: «GET / приветствует Гильдию героев».",
        },
        {
          lines: [4, 7],
          title: "Ожидание и реальность",
          text: [
            "Самое важное место. **Expected** — что тест ожидал, **Received** — что пришло на самом деле.",
            "Ожидалась подстрока «Гильдию героев», пришло «Hello World!». Значит, сервер всё ещё отвечает заводским текстом. Это и есть твоя задача.",
          ],
        },
        {
          lines: [9, 15],
          title: "Где в тесте",
          text: "Кусок кода теста. Стрелка `>` указывает на строку, где сработала проверка. Полезно заглянуть: иногда по коду теста становится понятнее, что именно проверяется.",
        },
        {
          lines: [17, 18],
          title: "Итог",
          text: "Из трёх проверок одна прошла (статус 200 уже был), две нет. Задача — сделать зелёными все.",
        },
      ],
    },

    { type: "h", id: "missing", text: "Cannot find module — тоже нормально" },
    {
      type: "code",
      lang: "text",
      code: `FAIL test/lessons/1.1.e2e-spec.ts
  ● Test suite failed to run

    Cannot find module '../../src/playground/tavern' from 'lessons/1.1.e2e-spec.ts'`,
    },
    {
      type: "p",
      text: "Тест пытается импортировать файл, которого ещё нет. До начала задания так и должно быть. Создай файл по пути из задания, и ошибка сменится на обычные проверки. Если ошибка осталась, сверь путь и имя файла буква в букву. А если тест ругается уже на имя класса, проверь, что он экспортирован: `export class Tavern`.",
    },

    { type: "h", id: "rules", text: "Правила работы с тестами курса" },
    {
      type: "list",
      items: [
        "**Не меняй** файлы в `test/lessons/`: это контракт. Подогнать тест под код — то же самое, что исправить градусник, чтобы не было температуры.",
        "Стартовые тесты (`src/app.controller.spec.ts`, `test/app.e2e-spec.ts`) — твои. Их **нужно** обновлять, когда ты осознанно меняешь поведение (задание 1.2).",
        "Зелёный тест — необходимое, но не достаточное условие. Ментор смотрит ещё и на читаемость, архитектуру и критерии, которые тест проверить не может.",
        "Красный тест — это не провал, а подсказка с точным адресом.",
      ],
    },
    {
      type: "quiz",
      id: "received",
      kind: "concept",
      question: "Тест пишет `Expected: 200, Received: 404`. Что это значит?",
      options: [
        "Сервер упал",
        "Маршрута, который проверяет тест, у приложения нет",
        "Тест сломан",
        "Нужно перезапустить `start:dev`",
      ],
      correct: 1,
      explain: "`404` — «не найдено». Значит, у приложения нет такого маршрута: забыт декоратор, путь написан иначе или контроллер не добавлен в модуль. Перезапуск не поможет: e2e-тест собирает приложение сам, `start:dev` ему не нужен.",
    },
  ],
};
