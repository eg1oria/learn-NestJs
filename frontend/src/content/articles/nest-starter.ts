import type { Article } from "../types";

export const article: Article = {
  slug: "nest-starter",
  title: "Стартовый проект Nest построчно",
  summary: "Каждая строка main.ts, app.module.ts, контроллера и сервиса: что делает и зачем нужна.",
  minutes: 12,
  category: "nest",
  lessons: ["1.2", "1.3", "1.4"],
  blocks: [
    {
      type: "p",
      text: "Здесь разобраны четыре файла из `backend/src` в том виде, в каком их создал `nest new`. Кликай по шагам или по строкам кода: подсветка покажет, о чём идёт речь. Если откроешь те же файлы в VS Code рядом, будет ещё нагляднее.",
    },

    { type: "h", id: "main", text: "main.ts — точка входа" },
    {
      type: "walkthrough",
      file: "src/main.ts",
      lang: "ts",
      code: `import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();`,
      steps: [
        {
          lines: [1, 1],
          title: "Импорт фабрики",
          text: "`NestFactory` — класс из ядра Nest, который умеет собирать приложение. «Фабрика» (factory) — привычное название для того, что создаёт объекты.",
        },
        {
          lines: [2, 2],
          title: "Импорт корневого модуля",
          text: "`./app.module` — относительный путь: файл `app.module.ts` лежит рядом. Расширение `.ts` не пишут. `ObserveInstrument` — подключение мониторинга, его создаёт `app.module.ts`.",
        },
        {
          lines: [4, 4],
          title: "async function bootstrap",
          text: "«Bootstrap» — «запуск» (дословно «петля на ботинке, за которую его натягивают»). Функция асинхронная: создание приложения и открытие порта требуют ожидания, поэтому внутри используется `await`.",
        },
        {
          lines: [5, 7],
          title: "Сборка приложения",
          text: [
            "`NestFactory.create(AppModule, …)` читает корневой модуль, создаёт все сервисы и контроллеры и связывает их между собой. Это может занять время, поэтому перед вызовом стоит `await`.",
            "Второй аргумент — настройки. Здесь подключается Observe. Позже сюда же можно добавить, например, настройки логгера (звёздочка задания 1.3).",
          ],
        },
        {
          lines: [8, 8],
          title: "Открываем двери",
          text: [
            "`app.listen(порт)` занимает порт и начинает принимать запросы. С этого момента сервер работает, пока процесс жив.",
            "`process.env.PORT ?? 3000` означает: «если задана переменная окружения `PORT`, бери её, иначе 3000». Оператор `??` подставляет правое значение, когда левое равно `undefined` или `null`.",
          ],
        },
        {
          lines: [10, 10],
          title: "Вызов",
          text: "Функцию нужно вызвать, иначе ничего не произойдёт. `void` перед вызовом говорит линтеру: «я осознанно не жду этот промис». Без `void` линтер ругнулся бы правилом `no-floating-promises`, которое включено в `.oxlintrc.json`.",
        },
      ],
    },

    { type: "h", id: "module", text: "app.module.ts — схема приложения" },
    {
      type: "walkthrough",
      file: "src/app.module.ts",
      lang: "ts",
      code: `import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}`,
      steps: [
        {
          lines: [1, 4],
          title: "Импорты",
          text: "`Module` — декоратор из `@nestjs/common`. Дальше подключаются контроллер и сервис из соседних файлов. Пакеты из `node_modules` пишутся по имени (`'@nestjs/common'`), свои файлы — путём (`'./app.service'`).",
        },
        {
          lines: [6, 6],
          title: "Мониторинг",
          text: "Создание модуля NestJS Observe. Синтаксис `const { A, B } = …` — деструктуризация: из возвращённого объекта достаются два поля. Пока ключи не настроены, Observe ничего не отправляет, поэтому смело пропускай эту строку.",
        },
        {
          lines: [8, 8],
          title: "Наклейка @Module",
          text: "Декоратор превращает обычный пустой класс в **модуль Nest**. Всё важное лежит в объекте-аргументе: Nest читает его при запуске.",
        },
        {
          lines: [9, 15],
          title: "imports — другие модули",
          text: "Сюда подключают модули, чьи возможности нужны этому. Сейчас тут только Observe. Позже появятся модули героев и квестов, конфигурация, база данных (модули 4, 8, 9).",
        },
        {
          lines: [16, 16],
          title: "controllers",
          text: "Список контроллеров. **Если контроллера нет в этом списке, Nest о нём не узнает**, и его маршруты не появятся. Это самая частая причина загадочного `404`.",
        },
        {
          lines: [17, 17],
          title: "providers",
          text: "Список провайдеров (providers): классов, которые Nest создаёт сам и раздаёт тем, кто их попросил. Сервис — самый частый вид провайдера. Подробно об этом в модуле 3 про внедрение зависимостей.",
        },
        {
          lines: [19, 19],
          title: "Пустой класс",
          text: "Тело класса пустое, и это нормально. Модуль — это просто «носитель наклейки». Ключевое слово `export` нужно, чтобы `main.ts` мог его импортировать.",
        },
      ],
    },

    { type: "h", id: "controller", text: "app.controller.ts — официант" },
    {
      type: "walkthrough",
      file: "src/app.controller.ts",
      lang: "ts",
      code: `import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}`,
      steps: [
        {
          lines: [4, 4],
          title: "@Controller()",
          text: "Наклейка «этот класс принимает HTTP-запросы». В скобках можно указать **префикс пути**: `@Controller('potions')` сделает все маршруты класса начинающимися с `/potions`. Пустые скобки — корень `/`.",
        },
        {
          lines: [6, 6],
          title: "Конструктор просит сервис",
          text: [
            "Здесь контроллер **не создаёт** сервис через `new`, а **просит** его: «мне нужен `AppService`». Nest видит тип параметра и передаёт уже созданный экземпляр. Это и есть внедрение зависимостей (Dependency Injection).",
            "`private readonly` — параметр-свойство: автоматически создаёт поле `this.appService`, которое нельзя перезаписать.",
          ],
        },
        {
          lines: [8, 8],
          title: "@Get()",
          text: "Наклейка на метод: «вызывай меня на GET-запросы». Путь в скобках добавляется к префиксу контроллера. Здесь его нет, значит, итоговый маршрут — `GET /`. В логе запуска он виден как `Mapped {/, GET} route`.",
        },
        {
          lines: [9, 9],
          title: "Метод-обработчик",
          text: "Имя метода может быть любым: Nest ориентируется на декоратор, а не на имя. Но имя должно объяснять, что метод делает. `: string` — тип результата. Строку Nest отдаст клиенту как `text/html`.",
        },
        {
          lines: [10, 10],
          title: "Делегирование",
          text: "Контроллер ничего не решает сам: он передаёт работу сервису и возвращает результат. Тонкий контроллер — признак хорошего кода.",
        },
      ],
    },

    { type: "h", id: "service", text: "app.service.ts — повар" },
    {
      type: "walkthrough",
      file: "src/app.service.ts",
      lang: "ts",
      code: `import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}`,
      steps: [
        {
          lines: [3, 3],
          title: "@Injectable()",
          text: "Наклейка «этот класс можно внедрять». Вместе со строкой `providers: [AppService]` в модуле она говорит Nest: создай один экземпляр и давай его всем, кто попросит.",
        },
        {
          lines: [4, 8],
          title: "Обычный класс",
          text: "Внутри никакой магии: обычные методы с обычной логикой. Сервис ничего не знает про HTTP: ни про запросы, ни про статусы. Поэтому его легко тестировать и переиспользовать.",
        },
      ],
    },

    { type: "h", id: "flow", text: "Всё вместе" },
    {
      type: "list",
      ordered: true,
      items: [
        "`main.ts` вызывает `NestFactory.create(AppModule)`.",
        "Nest читает `@Module`: видит `AppService` в `providers` и `AppController` в `controllers`.",
        "Создаёт `AppService`, затем `AppController`, передавая ему сервис в конструктор.",
        "Читает наклейки `@Controller` и `@Get` и регистрирует маршрут `GET /`.",
        "`app.listen(3000)` — двери открыты.",
        "Приходит `GET /`: Nest вызывает `appController.getHello()`, тот зовёт сервис, строка уходит клиенту.",
      ],
    },
    { type: "read", slugs: ["reading-tests", "nodejs"] },
  ],
};
