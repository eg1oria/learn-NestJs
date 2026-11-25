import { FlowStepper, type FlowStep } from "./FlowStepper";

const steps: FlowStep[] = [
  {
    title: "Запуск файла",
    code: "node dist/main.js",
    text: "`npm run start:dev` компилирует TypeScript в JavaScript (папка `dist/`) и запускает `main.js`. Отсюда начинается вся жизнь сервера.",
  },
  {
    title: "bootstrap()",
    code: "NestFactory.create(AppModule)",
    text: "`NestFactory` — это «прораб». Ему отдают **корневой модуль**, и он строит по нему всё приложение.",
  },
  {
    title: "Чтение модуля",
    code: "@Module({ … })",
    text: "Прораб читает наклейку `@Module`: какие **контроллеры** (`controllers`), какие **провайдеры** (`providers`) и какие другие модули (`imports`) нужны. В логе это строки `InstanceLoader ... dependencies initialized`.",
  },
  {
    title: "Создание сервисов",
    code: "new AppService()",
    text: "Nest **сам** создаёт объекты сервисов. Ты нигде не пишешь `new AppService()`, это делает контейнер внедрения зависимостей (DI container). Подробно разберём в модуле 3.",
  },
  {
    title: "Создание контроллеров",
    code: "new AppController(service)",
    text: "Конструктор контроллера просит `AppService`, и Nest передаёт ему уже созданный экземпляр. Так официант получает своего повара.",
  },
  {
    title: "Регистрация маршрутов",
    code: "Mapped {/, GET}",
    text: "Nest проходит по наклейкам `@Get`, `@Post`... и составляет таблицу «метод + путь → метод класса». Каждая строка таблицы попадает в лог: `Mapped {/, GET} route`.",
  },
  {
    title: "Открываем двери",
    code: "app.listen(3000)",
    text: "Сервер занимает порт `3000` и ждёт запросов. В логе появляется `Nest application successfully started`. Пока процесс жив, сервер работает.",
  },
];

export function NestBootstrap() {
  return <FlowStepper steps={steps} />;
}
