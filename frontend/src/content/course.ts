import type { CourseModule } from "./types";

/**
 * Программа курса. Уроки модулей 2+ появляются по мере прохождения:
 * ментор дописывает `lessonIds` и файлы в `content/lessons/`.
 */
export const course: CourseModule[] = [
  {
    id: 0,
    title: "Как устроен веб",
    description: "Что происходит между `fetch()` и ответом сервера.",
    topics: ["клиент и сервер", "порты", "HTTP", "JSON", "REST", "curl"],
    lessonIds: ["0.1", "0.2", "0.3", "0.4"],
  },
  {
    id: 1,
    title: "Первый сервер",
    description: "TypeScript для бэкенда, устройство Nest-проекта, логи.",
    topics: ["классы", "async/await", "декораторы", "main.ts", "логи"],
    lessonIds: ["1.1", "1.2", "1.3", "1.4"],
  },
  {
    id: 2,
    title: "Контроллеры и роутинг",
    description: "Эндпоинты для героев: читать, создавать, менять, удалять.",
    topics: ["@Get/@Post/@Patch/@Delete", "@Param", "@Query", "@Body", "статусы"],
    lessonIds: [],
  },
  {
    id: 3,
    title: "Сервисы и DI",
    description: "Провайдеры и внедрение зависимостей. Почему официант не готовит.",
    topics: ["провайдеры", "Dependency Injection", "контейнер"],
    lessonIds: [],
  },
  {
    id: 4,
    title: "Модули",
    description: "Код по фичам: герои отдельно, квесты отдельно.",
    topics: ["@Module", "imports/exports", "фичи"],
    lessonIds: [],
  },
  {
    id: 5,
    title: "Валидация и DTO",
    description: "Не доверяй клиенту: Zod, Standard Schema, pipes.",
    topics: ["Zod", "StandardSchemaValidationPipe", "DTO"],
    lessonIds: [],
  },
  {
    id: 6,
    title: "Ошибки",
    description: "Исключения, HTTP-ошибки и единый формат ответа.",
    topics: ["HttpException", "exception filters"],
    lessonIds: [],
  },
  {
    id: 7,
    title: "Жизненный цикл запроса",
    description: "Middleware → guard → interceptor → pipe → controller.",
    topics: ["middleware", "guards", "interceptors", "pipes"],
    lessonIds: [],
  },
  {
    id: 8,
    title: "Конфигурация",
    description: "Настройки и секреты вне кода.",
    topics: ["@nestjs/config", ".env", "секреты"],
    lessonIds: [],
  },
  {
    id: 9,
    title: "База данных",
    description: "PostgreSQL в Docker, ORM, миграции, связи таблиц.",
    topics: ["PostgreSQL", "Drizzle", "миграции", "1:N", "N:M"],
    lessonIds: [],
  },
  {
    id: 10,
    title: "Нормальный CRUD",
    description: "Пагинация, фильтры, сортировка, транзакции.",
    topics: ["пагинация", "фильтры", "транзакции"],
    lessonIds: [],
  },
  {
    id: 11,
    title: "Аутентификация",
    description: "Кто ты такой? Пароли, сессии, токены.",
    topics: ["хэширование", "JWT", "@nestjs/authentication"],
    lessonIds: [],
  },
  {
    id: 12,
    title: "Авторизация",
    description: "Что тебе можно? Роли и права.",
    topics: ["роли", "права", "@nestjs/authorization"],
    lessonIds: [],
  },
  {
    id: 13,
    title: "Тесты",
    description: "Unit и e2e: пишешь тесты сам.",
    topics: ["Jest", "supertest", "моки"],
    lessonIds: [],
  },
  {
    id: 14,
    title: "Документация API",
    description: "Swagger / OpenAPI из кода.",
    topics: ["@nestjs/swagger", "OpenAPI"],
    lessonIds: [],
  },
  {
    id: 15,
    title: "Связь с фронтом",
    description: "CORS и запросы прямо из браузера.",
    topics: ["CORS", "Next.js", "куки"],
    lessonIds: [],
  },
  {
    id: 16,
    title: "Продвинутое",
    description: "Кэш, rate limiting, очереди, cron, WebSockets.",
    topics: ["кэш", "throttler", "очереди", "cron", "WebSockets"],
    lessonIds: [],
  },
  {
    id: 17,
    title: "Финал",
    description: "Docker Compose, деплой и босс-проект.",
    topics: ["Docker Compose", "деплой", "босс-проект"],
    lessonIds: [],
  },
];
