import { articles } from "./articles";
import { lessons } from "./lessons";

export type GlossaryEntry = {
  term: string;
  en?: string;
  text: string;
  /** Где тема разобрана подробно: "lesson:1.2" или "article:nodejs". */
  see?: string;
};

/** Центральный словарь. Термины из блоков `terms` уроков добавляются автоматически. */
const core: GlossaryEntry[] = [
  { term: "Бэкенд", en: "backend", text: "серверная часть приложения: принимает запросы, проверяет, работает с данными, отвечает", see: "lesson:0.1" },
  { term: "Фронтенд", en: "frontend", text: "то, что работает у пользователя: страницы, кнопки, `fetch` к бэкенду" },
  { term: "Запрос", en: "request", text: "сообщение клиента серверу: метод, путь, заголовки, тело", see: "lesson:0.2" },
  { term: "Ответ", en: "response", text: "сообщение сервера клиенту: статус, заголовки, тело", see: "lesson:0.2" },
  { term: "Эндпоинт", en: "endpoint", text: "конкретная «точка входа» API: метод + путь, например `GET /health`" },
  { term: "Маршрут", en: "route", text: "правило «метод + путь → какой код запустить». В Nest задаётся декораторами `@Controller` и `@Get`/`@Post`…", see: "lesson:1.2" },
  { term: "Ресурс", en: "resource", text: "сущность, с которой работает API: герои, квесты. В REST у ресурса есть адрес", see: "lesson:0.3" },
  { term: "Метод HTTP", en: "HTTP method", text: "глагол запроса: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`", see: "article:http-cheatsheet" },
  { term: "Статус-код", en: "status code", text: "трёхзначный код результата: 2xx успех, 4xx ошибка клиента, 5xx ошибка сервера", see: "article:http-cheatsheet" },
  { term: "Заголовок", en: "header", text: "метаданные сообщения в формате `Имя: значение`", see: "lesson:0.2" },
  { term: "Тело", en: "body", text: "сами данные сообщения, обычно JSON", see: "lesson:0.2" },
  { term: "JSON", en: "JavaScript Object Notation", text: "текстовый формат данных, на котором говорят почти все API", see: "lesson:0.3" },
  { term: "REST", en: "Representational State Transfer", text: "стиль API: ресурсы — существительные в пути, действия — методы HTTP", see: "lesson:0.3" },
  { term: "CRUD", en: "Create, Read, Update, Delete", text: "четыре базовые операции с данными" },
  { term: "Идемпотентность", en: "idempotency", text: "повтор операции даёт тот же результат, что и одна попытка", see: "lesson:0.3" },
  { term: "Query-параметры", en: "query string", text: "часть URL после `?`: фильтры, сортировка, страницы — `?page=2`", see: "lesson:0.3" },
  { term: "IP-адрес", en: "IP address", text: "номер компьютера в сети, например `127.0.0.1`", see: "article:internet" },
  { term: "DNS", en: "Domain Name System", text: "справочник, переводящий имена вроде `github.com` в IP-адреса", see: "article:internet" },
  { term: "TCP", en: "Transmission Control Protocol", text: "протокол надёжной доставки байтов, на котором едет HTTP", see: "article:internet" },
  { term: "TLS", en: "Transport Layer Security", text: "шифрование соединения; `https` = HTTP поверх TLS", see: "article:internet" },
  { term: "Node.js", text: "среда выполнения JavaScript вне браузера: файлы, сеть, процессы", see: "article:nodejs" },
  { term: "Рантайм", en: "runtime", text: "среда, в которой выполняется код, со своими встроенными возможностями", see: "article:nodejs" },
  { term: "Цикл событий", en: "event loop", text: "механизм Node.js: один поток берёт задачи из очереди, а ожидание поручено ОС", see: "article:nodejs" },
  { term: "npm", en: "Node Package Manager", text: "менеджер пакетов: ставит библиотеки и запускает скрипты", see: "article:npm" },
  { term: "Зависимость", en: "dependency", text: "чужой пакет, который нужен проекту; список — в `package.json`", see: "article:npm" },
  { term: "TypeScript", text: "JavaScript с типами; компилируется в обычный JS перед запуском", see: "article:typescript-types" },
  { term: "Компиляция", en: "compilation", text: "превращение TypeScript (`src/*.ts`) в JavaScript (`dist/*.js`)", see: "article:nodejs" },
  { term: "Класс", en: "class", text: "чертёж для создания объектов с полями и методами", see: "lesson:1.1" },
  { term: "Экземпляр", en: "instance", text: "конкретный объект, созданный по классу через `new`", see: "lesson:1.1" },
  { term: "Промис", en: "Promise", text: "обещание результата, который появится позже; `await` его дожидается", see: "lesson:1.1" },
  { term: "Декоратор", en: "decorator", text: "функция-наклейка `@Имя` на класс или метод; Nest читает их, чтобы понять, что делать", see: "lesson:1.1" },
  { term: "Дженерик", en: "generic", text: "тип с параметром: `Promise<string>`, `Array<Hero>`", see: "article:typescript-types" },
  { term: "Модуль Nest", en: "module", text: "класс с `@Module`: описывает, из каких контроллеров и провайдеров состоит часть приложения", see: "article:nest-starter" },
  { term: "Контроллер", en: "controller", text: "принимает HTTP-запросы и отдаёт ответы; сам не решает бизнес-задач", see: "lesson:1.2" },
  { term: "Сервис", en: "service", text: "класс с бизнес-логикой, не знающий про HTTP", see: "lesson:1.2" },
  { term: "Провайдер", en: "provider", text: "любой класс, который Nest создаёт сам и раздаёт другим (чаще всего сервис)", see: "article:nest-starter" },
  { term: "Внедрение зависимостей", en: "Dependency Injection, DI", text: "класс не создаёт нужные объекты сам, а получает их через конструктор от Nest (модуль 3)", see: "article:nest-starter" },
  { term: "Watch-режим", en: "watch mode", text: "`start:dev`: при сохранении файла пересобирает и перезапускает сервер", see: "lesson:1.2" },
  { term: "Лог", en: "log", text: "журнал событий сервера: что, когда и где произошло", see: "lesson:1.3" },
  { term: "Стектрейс", en: "stack trace", text: "цепочка вызовов до места ошибки", see: "lesson:1.3" },
  { term: "Исключение", en: "exception", text: "ошибка, брошенная через `throw`; Nest превращает непойманное в ответ 500", see: "lesson:1.3" },
  { term: "Health-check", text: "эндпоинт «жив ли сервис», который опрашивают балансировщики и мониторинг", see: "lesson:1.4" },
  { term: "Балансировщик", en: "load balancer", text: "распределяет запросы между копиями сервера", see: "lesson:1.4" },
  { term: "ISO 8601", text: "стандартный формат даты-времени: `2026-11-25T18:00:00.000Z`", see: "lesson:0.3" },
  { term: "Unit-тест", en: "unit test", text: "проверка одного класса или функции отдельно от остального", see: "article:reading-tests" },
  { term: "E2E-тест", en: "end-to-end test", text: "проверка всего приложения через настоящие HTTP-запросы", see: "article:reading-tests" },
  { term: "Линтер", en: "linter", text: "программа, которая ищет подозрительный код (`npm run lint`)" },
  { term: "Форматтер", en: "formatter", text: "программа, которая приводит код к единому стилю (`npm run format`)" },
  { term: "Переменная окружения", en: "environment variable", text: "настройка снаружи кода: `process.env.PORT` (модуль 8)", see: "article:nodejs" },
  { term: "Middleware", text: "код, который выполняется до обработчика для всех подходящих запросов (модуль 7)", see: "lesson:1.2" },
  { term: "Guard", text: "«охранник»: решает, пускать ли запрос дальше (модуль 7)", see: "lesson:1.2" },
  { term: "Pipe", text: "проверяет и преобразует входные данные (модули 5 и 7)", see: "lesson:1.2" },
  { term: "Interceptor", text: "оборачивает обработчик: может сделать что-то до и после (модуль 7)", see: "lesson:1.2" },
];

function norm(s: string) {
  return s.toLowerCase().replace(/ё/g, "е").trim();
}

export function buildGlossary(): GlossaryEntry[] {
  const map = new Map<string, GlossaryEntry>();
  for (const e of core) map.set(norm(e.term), e);
  const sources: { id: string; blocks: (typeof lessons)[number]["blocks"] }[] = [
    ...lessons.map((l) => ({ id: `lesson:${l.id}`, blocks: l.blocks })),
    ...articles.map((a) => ({ id: `article:${a.slug}`, blocks: a.blocks })),
  ];
  for (const src of sources) {
    for (const b of src.blocks) {
      if (b.type !== "terms") continue;
      for (const t of b.items) {
        const key = norm(t.ru);
        if (!map.has(key)) map.set(key, { term: t.ru, en: t.en, text: t.text, see: src.id });
      }
    }
  }
  return [...map.values()].sort((a, b) => a.term.localeCompare(b.term, "ru"));
}
