export type BadgeIcon =
  | "send"
  | "compass"
  | "plug"
  | "scroll"
  | "heart"
  | "star"
  | "brain"
  | "bug"
  | "network"
  | "shield"
  | "database"
  | "key"
  | "flask"
  | "radio"
  | "castle";

export type Badge = {
  id: string;
  title: string;
  description: string;
  icon: BadgeIcon;
};

/** Бейджи выдаёт ментор при проверке (поле `badges` в progress.json). */
export const badges: Badge[] = [
  { id: "first-request", title: "Первый запрос", description: "Отправил HTTP-запрос руками", icon: "send" },
  { id: "blueprint", title: "Чертёжник", description: "Спроектировал API Гильдии", icon: "compass" },
  { id: "first-endpoint", title: "Первый эндпоинт", description: "Сервер заговорил твоими словами", icon: "plug" },
  { id: "log-reader", title: "Читатель логов", description: "Разобрал аварии по логам", icon: "scroll" },
  { id: "on-duty", title: "Дежурный", description: "Сделал health-check", icon: "heart" },
  { id: "star-gazer", title: "Звездочёт", description: "Выполнил задание со звёздочкой", icon: "star" },
  { id: "own-mind", title: "Своим умом", description: "Победил босса без подсказок", icon: "brain" },
  { id: "bug-hunter", title: "Охотник за багами", description: "Нашёл и починил подброшенный баг", icon: "bug" },
  { id: "di-master", title: "Мастер DI", description: "Подружился с внедрением зависимостей", icon: "network" },
  { id: "gate-guard", title: "Страж ворот", description: "Не пустил кривые данные", icon: "shield" },
  { id: "archivist", title: "Хранитель архивов", description: "Подключил настоящую базу данных", icon: "database" },
  { id: "gatekeeper", title: "Привратник", description: "Сделал вход по паролю", icon: "key" },
  { id: "tester", title: "Испытатель", description: "Написал свои тесты", icon: "flask" },
  { id: "herald", title: "Глашатай", description: "Лидерборд в реальном времени", icon: "radio" },
  { id: "architect", title: "Архитектор Гильдии", description: "Прошёл финального босса", icon: "castle" },
];
