import type { Article } from "../types";

export const article: Article = {
  slug: "typescript-types",
  title: "TypeScript: типы, которые встретятся в Nest",
  summary: "Аннотации, type и interface, union, Record, Promise<T>, дженерики и как читать ошибку TS.",
  minutes: 12,
  category: "node",
  lessons: ["1.1", "1.4"],
  blocks: [
    {
      type: "p",
      text: "Здесь не весь TypeScript, а ровно то, что понадобится в бэкенде на ближайшие модули. Все примеры на «кузнице» и «зельях», чтобы не подсказывать решения заданий.",
    },
    {
      type: "why",
      text: "Зачем типы на сервере? Бэкенд живёт годами, и его меняют разные люди. Тип — это **договор**, который проверяет компилятор: «эта функция принимает число и возвращает строку». Переименовал поле — и TypeScript покажет все 40 мест, которые нужно поправить, ещё **до** того, как упадёт прод.",
    },

    { type: "h", id: "basics", text: "Аннотации и вывод типов" },
    {
      type: "code",
      lang: "ts",
      code: `let gold: number = 100;          // явная аннотация
let name = 'Гимли';              // тип выведен сам: string
const isMagic = true;            // boolean

function price(base: number, discount: number): number {
  //            ↑ параметры           ↑ что возвращает
  return base - discount;
}

price(100, '10');
// ✗ Argument of type 'string' is not assignable to parameter of type 'number'.`,
    },
    {
      type: "p",
      text: "Правило: аннотируй **параметры функций** и **возвращаемые значения** публичных методов, а внутри функций доверяй выводу типов. В Nest тип возвращаемого значения метода контроллера заодно документирует, что вернёт эндпоинт.",
    },

    { type: "h", id: "objects", text: "Объекты: type и interface" },
    {
      type: "code",
      lang: "ts",
      code: `// Описание формы объекта через interface
interface Potion {
  id: number;
  name: string;
  price: number;
  color?: string;          // ? — необязательное поле
  readonly brewedAt: string; // нельзя менять после создания
}

// То же самое через type
type Alchemist = {
  id: number;
  name: string;
  potions: Potion[];       // массив зелий
};

const potion: Potion = {
  id: 1,
  name: 'Зелье силы',
  price: 40,
  brewedAt: '2026-11-25T18:00:00.000Z',
};`,
    },
    {
      type: "table",
      head: ["", "interface", "type"],
      rows: [
        ["Описать форму объекта", "да", "да"],
        ["Union (`A | B`), примитивы, кортежи", "нет", "да"],
        ["Расширение", "`extends`", "`&` (пересечение)"],
        ["Что выбрать в курсе", "для объектов, которые «живут» в API", "для union и вспомогательных типов"],
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Где хранить типы",
      text: "Тип, который нужен в нескольких файлах (например, и в контроллере, и в сервисе), выносят в отдельный файл и экспортируют: `export interface Potion { … }`. Потом подключают через `import type { Potion } from './potion';`.",
    },

    { type: "h", id: "union", text: "Union и литеральные типы" },
    {
      type: "code",
      lang: "ts",
      code: `type PotionColor = 'red' | 'green' | 'blue';   // только одно из трёх слов
type Result = { ok: true } | { ok: false; reason: string };

function describe(color: PotionColor) { /* … */ }

describe('green');   // ✓
describe('purple');  // ✗ Argument of type '"purple"' is not assignable…`,
    },
    {
      type: "p",
      text: "Литеральный тип `'ok'` — это «строка, но только вот такая». Он отлично подходит для полей вроде `status`: опечатку `'okk'` компилятор не пропустит.",
    },

    { type: "h", id: "record", text: "Record — словарь" },
    {
      type: "code",
      lang: "ts",
      code: `// Record<ТипКлюча, ТипЗначения> — объект-словарь
const stock: Record<string, number> = {
  'кошачий глаз': 3,
  'лунная роса': 0,
};

stock['кошачий глаз'];   // 3
stock['драконья чешуя']; // undefined! ключа нет, хотя тип говорит number

// Проверить, есть ли ключ:
if ('лунная роса' in stock) { /* … */ }
const amount = stock['драконья чешуя'] ?? 0; // ?? — «если undefined/null, то 0»`,
    },
    {
      type: "callout",
      tone: "warn",
      title: "Ловушка Record",
      text: "`Record<string, number>` обещает число по **любому** ключу, но на деле по несуществующему ключу будет `undefined`. Поэтому перед использованием значения проверяй, что оно есть: `if (value === undefined)` или через `in`.",
    },

    { type: "h", id: "promise", text: "Promise<T> и дженерики" },
    {
      type: "p",
      text: "Угловые скобки — это **дженерик** (generic), «тип с параметром». `Promise<string>` читается как «обещание, которое когда-нибудь даст строку». `Potion[]` можно записать как `Array<Potion>`, это одно и то же.",
    },
    {
      type: "code",
      lang: "ts",
      code: `async function brew(name: string): Promise<Potion> {
  // async-функция всегда возвращает Promise<то, что в return>
  await heatCauldron();
  return { id: 2, name, price: 30, brewedAt: new Date().toISOString() };
}

const p = brew('Зелье ловкости');        // тип p: Promise<Potion>
const potion = await brew('Зелье ловкости'); // тип potion: Potion`,
    },

    { type: "h", id: "any", text: "any и unknown" },
    {
      type: "list",
      items: [
        "`any` — «выключи проверку». Компилятор перестаёт помогать, и ошибки всплывают уже в рантайме. В заданиях курса `any` запрещён.",
        "`unknown` — «я не знаю, что тут». Пользоваться значением нельзя, пока не проверишь тип (`typeof x === 'string'`). Это честный способ работать с данными снаружи.",
      ],
    },

    { type: "h", id: "classes", text: "Классы с типами" },
    {
      type: "code",
      lang: "ts",
      code: `export class Cauldron {
  private temperature = 20;                   // тип выведен: number

  constructor(private readonly size: 'small' | 'big') {}

  heat(degrees: number): void {               // void — ничего не возвращает
    this.temperature += degrees;
  }

  getTemperature(): number {
    return this.temperature;
  }
}`,
    },

    { type: "h", id: "errors", text: "Как читать ошибку TypeScript" },
    {
      type: "code",
      lang: "text",
      file: "терминал",
      code: `src/app.controller.ts:10:37 - error TS2554: Expected 0 arguments, but got 1.

10     return this.appService.getHello(42);
                                       ~~`,
    },
    {
      type: "list",
      items: [
        "`src/app.controller.ts:10:37` — файл, **строка 10**, символ 37. В VS Code по этой ссылке можно кликнуть с зажатым Cmd/Ctrl.",
        "`TS2554` — код ошибки. Его можно погуглить, если текст непонятен.",
        "Текст: «ожидалось 0 аргументов, а передан 1».",
        "Тильды `~~` показывают, на что именно ругается компилятор.",
        "Длинные сообщения читай **с конца**: последняя строка обычно самая конкретная.",
      ],
    },
    {
      type: "quiz",
      id: "optional",
      kind: "bug",
      question: "Почему TypeScript ругается на последнюю строку?",
      code: {
        lang: "ts",
        code: `interface Potion { name: string; color?: string }

function shout(p: Potion) {
  return p.color.toUpperCase();
}`,
      },
      options: [
        "У строк нет метода `toUpperCase`",
        "`color` необязательное, там может быть `undefined`",
        "Нужно писать `type` вместо `interface`",
        "Функция не указала тип возвращаемого значения",
      ],
      correct: 1,
      explain: "`color?: string` значит `string | undefined`. Нужна проверка (`if (p.color)`) или безопасный вызов `p.color?.toUpperCase()`. TypeScript ловит здесь будущий `Cannot read properties of undefined`.",
    },
  ],
};
