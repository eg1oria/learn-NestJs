/**
 * Что должен уметь бэкендер уровня Junior и Middle и в каких модулях курса это закрывается.
 * Навык считается освоенным, когда пройдены все его модули.
 */
export type Skill = { title: string; detail: string; modules: number[] };

export const juniorSkills: Skill[] = [
  { title: "HTTP и REST", detail: "методы, статусы, заголовки, проектирование адресов", modules: [0] },
  { title: "Инструменты", detail: "терминал, npm, git, curl, чтение логов и стектрейсов", modules: [0, 1] },
  { title: "Основы NestJS", detail: "контроллеры, сервисы, модули, DI", modules: [1, 2, 3, 4] },
  { title: "Валидация входных данных", detail: "схемы Zod, pipes, 400 на кривые данные", modules: [5] },
  { title: "Обработка ошибок", detail: "исключения, правильные статусы, единый формат", modules: [6] },
  { title: "SQL и ORM", detail: "таблицы, запросы, связи, миграции", modules: [9] },
  { title: "Полноценный CRUD", detail: "пагинация, фильтры, сортировка", modules: [10] },
  { title: "Аутентификация", detail: "хэширование паролей, JWT, вход и регистрация", modules: [11] },
  { title: "Тесты", detail: "unit и e2e, моки", modules: [13] },
  { title: "Docker на базовом уровне", detail: "база в контейнере, Compose", modules: [9, 17] },
];

export const middleSkills: Skill[] = [
  { title: "Проектирование API", detail: "контракт заранее, версионирование, документация", modules: [0, 14] },
  { title: "Архитектура по модулям", detail: "границы фич, зависимости, провайдеры", modules: [3, 4] },
  { title: "Конвейер запроса", detail: "middleware, guards, interceptors, pipes — когда что", modules: [7] },
  { title: "Конфигурация и секреты", detail: "окружения dev / test / prod, проверка конфига", modules: [8] },
  { title: "Транзакции и гонки", detail: "всё или ничего, блокировки, конкурентные запросы", modules: [10] },
  { title: "Производительность БД", detail: "индексы, N+1, план запроса", modules: [9, 10] },
  { title: "Авторизация и безопасность", detail: "права на ресурсы, OWASP, rate limiting", modules: [12, 16] },
  { title: "Асинхронная обработка", detail: "кэш, очереди, cron, события, WebSockets", modules: [16] },
  { title: "Надёжность", detail: "идемпотентность, повторы, health-check", modules: [1, 16] },
  { title: "Поставка и эксплуатация", detail: "CI, деплой, логи, метрики, трейсы", modules: [17] },
];
