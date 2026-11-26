import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: "1.1",
  moduleId: 1,
  title: "TypeScript для бэкенда",
  summary: "Классы, async/await и декораторы — три кита, на которых стоит Nest.",
  minutes: 30,
  blocks: [
    {
      type: "p",
      text: "Открой любой файл в `backend/src`, и ты увидишь три вещи: `class`, `async` и строчки с `@`. Если разобраться в них сейчас, Nest не будет казаться магией. Это единственный урок курса, где мы почти не трогаем HTTP.",
    },

    {
      type: "system",
      focus: ["controller", "service", "modules"],
      caption: "Контроллеры, сервисы и модули — это классы с декораторами. Этот урок про язык, на котором они написаны.",
    },

    { type: "h", id: "classes", text: "Классы: чертёж и изделия" },
    {
      type: "analogy",
      title: "Форма для пирога",
      text: "**Класс** — это форма, а **объект** (экземпляр, instance) — пирог, испечённый в ней. Форма одна, пирогов много, и у каждого своя начинка. В двух тавернах, созданных по одному классу, выручка будет разная.",
    },
    {
      type: "code",
      lang: "ts",
      file: "forge.ts",
      code: `class Forge {
  private orders = 0; // обычное поле, у каждого экземпляра своё

  // Длинная запись: объявить поле и присвоить в конструкторе
  private readonly city: string;
  constructor(city: string) {
    this.city = city;
  }

  describe(): string {
    this.orders += 1;
    return \`Кузница в городе \${this.city}, заказов: \${this.orders}\`;
  }
}

const forge = new Forge('Ривенделл');
forge.describe(); // "Кузница в городе Ривенделл, заказов: 1"`,
    },
    { type: "diagram", id: "class-instances" },
    {
      type: "p",
      text: "В Nest почти везде используют **короткую запись** — параметры-свойства (parameter properties). Модификатор прямо в параметре конструктора сам объявляет поле и присваивает его:",
    },
    {
      type: "code",
      lang: "ts",
      code: `class Forge {
  constructor(private readonly city: string) {}
  // ↑ то же самое, что три строки выше: поле + присваивание
}`,
    },
    {
      type: "why",
      text: "Зачем Nest классы? Nest **сам** создаёт объекты твоих контроллеров и сервисов и передаёт им всё нужное. Для этого ему нужен «чертёж» с описанием: «чтобы создать `HeroesController`, мне нужен `HeroesService`». Конструктор класса и есть это описание. Механизм называется внедрением зависимостей, и ему посвящён модуль 3.",
    },
    {
      type: "callout",
      tone: "info",
      title: "private и readonly живут только в TypeScript",
      text: "Это проверки на этапе компиляции. В скомпилированном JavaScript их нет. Но этого хватает: если ты попробуешь перезаписать `readonly`-поле, редактор подчеркнёт ошибку, а `npm run build` упадёт.",
    },

    { type: "h", id: "types", text: "Типы: самое нужное для задания" },
    {
      type: "p",
      text: "TypeScript — это JavaScript, к которому приписаны **типы**: что лежит в переменной, что принимает функция и что возвращает. Типы проверяются при сборке, а в работающей программе их уже нет. Три записи, которые встретятся прямо сейчас:",
    },
    {
      type: "code",
      lang: "ts",
      code: `// 1. Аннотация: после двоеточия — тип
function cost(price: number, count: number): number {
  return price * count;
}

// 2. Record<Ключ, Значение> — объект-словарь
const prices: Record<string, number> = { меч: 50, щит: 30 };
prices['меч'];    // 50
prices['лук'];    // undefined — ключа нет! Проверяй перед использованием

// 3. Promise<T> — «обещание, которое даст T»
async function forgeItem(item: string): Promise<string> {
  return \`\${item} готов\`;
}`,
    },
    {
      type: "callout",
      tone: "info",
      title: "Подробнее",
      text: "Всё про `interface`, `type`, union, `Record`, дженерики и чтение ошибок TypeScript — в статье [«TypeScript: типы, которые встретятся в Nest»](/library/typescript-types). Она понадобится и в боссе 1.4.",
    },

    { type: "h", id: "async", text: "async/await: ждать, не блокируя" },
    {
      type: "analogy",
      title: "Пейджер на фудкорте",
      text: [
        "Ты делаешь заказ и получаешь **пейджер**. Это **Promise**: обещание, что заказ будет готов, или что придут сказать «закончилась картошка».",
        "`await` значит «жду, пока завибрирует». Важно, что повар в это время не стоит над тобой: он готовит заказы следующих гостей. JavaScript однопоточный, но пока один запрос ждёт базу, сервер обслуживает другие.",
      ],
    },
    {
      type: "p",
      text: "Как именно «повар» переключается между делами, видно в пошаговой схеме. Нажимай «Дальше» и следи за колонками:",
    },
    { type: "diagram", id: "event-loop" },
    {
      type: "why",
      text: "Один процесс Node.js обслуживает тысячи запросов. Если бы он **синхронно** ждал ответа базы (скажем, 50 мс), то за это время все остальные клиенты стояли бы в очереди. Асинхронность позволяет «отложить» запрос, пока ждём, и заняться другими.",
    },
    {
      type: "code",
      lang: "ts",
      file: "weather.ts",
      code: `// Функция, которая возвращает Promise вручную
function fetchWeather(city: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!city) return reject(new Error('Город не указан'));
    setTimeout(() => resolve(\`В \${city} солнечно\`), 500);
  });
}

// async-функция ВСЕГДА возвращает Promise
async function morningReport(): Promise<string> {
  const weather = await fetchWeather('Шир'); // ждём ~500 мс
  return \`Доклад: \${weather}\`;
}`,
    },
    {
      type: "list",
      items: [
        "`async` перед функцией означает, что она всегда возвращает `Promise`, даже если внутри написан обычный `return`.",
        "`throw` внутри `async`-функции превращается в **отклонённый** (rejected) промис.",
        "Поймать ошибку можно через `try { await ... } catch (e) { ... }` или через `.catch(...)`.",
      ],
    },

    { type: "h", id: "parallel", text: "По очереди или параллельно" },
    {
      type: "p",
      text: "Самая частая ошибка новичка в бэкенде — ждать по очереди то, что можно ждать одновременно. Кузнице нужно выковать меч, щит и шлем, по 100 мс каждый:",
    },
    { type: "diagram", id: "async-timeline" },
    {
      type: "code",
      lang: "ts",
      code: `// По очереди: каждое await ждёт завершения предыдущего
const sword = await forgeItem('меч');
const shield = await forgeItem('щит');

// Параллельно: запускаем оба сразу, ждём оба вместе
const [sword2, shield2] = await Promise.all([
  forgeItem('меч'),
  forgeItem('щит'),
]);`,
    },
    {
      type: "callout",
      tone: "warn",
      title: "Promise.all падает целиком",
      text: "Если хотя бы один промис из списка отклонён, `Promise.all` тоже отклоняется. Обычно это и нужно: зачем собирать доспех без шлема? Если нужны все результаты, даже с ошибками, есть `Promise.allSettled`.",
    },

    { type: "h", id: "decorators", text: "Декораторы: наклейки на коробках" },
    {
      type: "analogy",
      title: "Склад",
      text: "На коробке наклейка «хрупкое». Коробке всё равно, а вот **грузчик** читает наклейку и несёт аккуратно. Декораторы — такие наклейки на классах и методах. `@Controller('potions')` значит «эта коробка отвечает за `/potions`», `@Get()` — «этот метод для GET-запросов». Грузчик здесь — Nest.",
    },
    { type: "diagram", id: "decorators" },
    {
      type: "p",
      text: "Никакой магии нет: **декоратор — это обычная функция**, которую TypeScript вызывает один раз, в момент объявления класса. Вот игрушечный аналог того, что делает Nest:",
    },
    {
      type: "code",
      lang: "ts",
      file: "mini-nest.ts",
      code: `const routes: string[] = [];

// Фабрика декоратора: принимает путь, возвращает сам декоратор
function Route(path: string) {
  return function (target: object, methodName: string) {
    routes.push(\`\${path} → \${methodName}()\`);
  };
}

class PotionShop {
  @Route('/potions')
  list() {}

  @Route('/potions/:id')
  findOne() {}
}

console.log(routes);
// ['/potions → list()', '/potions/:id → findOne()']`,
    },
    {
      type: "callout",
      tone: "info",
      title: "Две галочки в tsconfig.json",
      text: "Nest использует «классические» декораторы TypeScript. Их включают опции `experimentalDecorators` и `emitDecoratorMetadata` в `backend/tsconfig.json`: открой файл и найди их. Вторая опция сохраняет типы параметров конструктора. Именно по ним Nest понимает, какой сервис куда передать.",
    },
    {
      type: "code",
      lang: "json",
      file: "backend/tsconfig.json (фрагмент)",
      code: `{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}`,
    },

    { type: "read", slugs: ["nodejs", "typescript-types"] },

    { type: "h", id: "check", text: "Проверь себя" },
    {
      type: "quiz",
      id: "order",
      kind: "predict",
      question: "В каком порядке появятся буквы в консоли?",
      code: {
        lang: "ts",
        code: `async function brew() {
  console.log('B');
  await delay(10);
  console.log('D');
}

console.log('A');
brew();
console.log('C');`,
      },
      options: ["A B C D", "A B D C", "A C B D", "B A C D"],
      correct: 0,
      explain: "`brew()` выполняется синхронно до первого `await` (печатает B), потом «засыпает» и возвращает управление. Дальше печатается C. Через 10 мс функция просыпается и печатает D. Обрати внимание: `brew()` вызвали без `await`, поэтому код дальше не ждал.",
    },
    {
      type: "quiz",
      id: "missing-await",
      kind: "bug",
      question: "Функция возвращает `undefined` вместо имени героя. Почему?",
      code: {
        lang: "ts",
        code: `async function getHeroName(id: number) {
  const hero = loadHero(id); // loadHero возвращает Promise<Hero>
  return hero.name;
}`,
      },
      options: [
        "Нужно написать `function` без `async`",
        "Не хватает `await` перед `loadHero(id)`",
        "У `Promise` нельзя брать свойства, нужен `try/catch`",
        "`id` должен быть строкой",
      ],
      correct: 1,
      explain: "Без `await` в `hero` лежит **пейджер** (Promise), а не сам герой. У промиса нет поля `name`, отсюда `undefined`. TypeScript, кстати, подчеркнёт эту строку: тип `Promise<Hero>` не содержит `name`.",
    },
    {
      type: "quiz",
      id: "when-decorator",
      kind: "concept",
      question: "Когда выполняется функция-декоратор `@Route('/potions')` из примера выше?",
      options: [
        "При каждом вызове метода `list()`",
        "Один раз, когда объявляется класс",
        "Когда на сервер приходит запрос",
        "Никогда, это просто комментарий для Nest",
      ],
      correct: 1,
      explain: "Декоратор срабатывает при объявлении класса, то есть ещё до того, как создан хоть один объект. Поэтому Nest знает все маршруты сразу при запуске и пишет их в лог как `Mapped {...} route`.",
    },
  ],
};
