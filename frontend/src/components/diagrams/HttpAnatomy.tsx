"use client";

import { useState } from "react";
import { Rich } from "../Rich";

type Part = { id: string; label: string; lines: string[]; text: string; tone: string };

const request: Part[] = [
  {
    id: "req-start",
    label: "Стартовая строка",
    lines: ["POST /heroes HTTP/1.1"],
    text: "Три слова через пробел: **метод** (что сделать), **путь** (с каким ресурсом) и **версия протокола**. Именно по методу и пути Nest решает, какой код запустить.",
    tone: "text-[var(--syn-kw)]",
  },
  {
    id: "req-headers",
    label: "Заголовки",
    lines: ["Host: localhost:3000", "Content-Type: application/json", "Accept: application/json"],
    text: "Метаданные в формате `Имя: значение`, это пометки на конверте. `Content-Type` говорит, в каком формате **тело** этого запроса, а `Accept` — какой формат клиент хочет получить в ответ.",
    tone: "text-[var(--syn-prop)]",
  },
  {
    id: "req-blank",
    label: "Пустая строка",
    lines: [""],
    text: "Обязательная граница: здесь заканчиваются заголовки и начинается тело. Без неё сервер прочитает тело как ещё один заголовок.",
    tone: "text-muted",
  },
  {
    id: "req-body",
    label: "Тело",
    lines: ['{"name":"Гимли","class":"warrior"}'],
    text: "Сами данные. У `GET` и `DELETE` тела обычно нет, у `POST`/`PATCH` чаще всего есть: что создать или что поменять.",
    tone: "text-[var(--syn-str)]",
  },
];

const response: Part[] = [
  {
    id: "res-start",
    label: "Статусная строка",
    lines: ["HTTP/1.1 201 Created"],
    text: "Версия, **код статуса** и короткая фраза. Клиенту важен именно код: `201` значит «создано». Фраза нужна для людей.",
    tone: "text-[var(--syn-num)]",
  },
  {
    id: "res-headers",
    label: "Заголовки",
    lines: ["Content-Type: application/json; charset=utf-8", "Content-Length: 52"],
    text: "Сервер сообщает, что лежит в теле (JSON в UTF-8) и сколько оно весит в байтах.",
    tone: "text-[var(--syn-prop)]",
  },
  {
    id: "res-blank",
    label: "Пустая строка",
    lines: [""],
    text: "Та же граница, что и в запросе.",
    tone: "text-muted",
  },
  {
    id: "res-body",
    label: "Тело",
    lines: ['{"id":7,"name":"Гимли","class":"warrior","level":1}'],
    text: "Результат: созданный герой, и у него уже есть `id`, который выдал сервер. Клиент сможет запросить его позже по адресу `/heroes/7`.",
    tone: "text-[var(--syn-str)]",
  },
];

function Message({ title, parts, active, onPick }: { title: string; parts: Part[]; active: string; onPick: (id: string) => void }) {
  return (
    <div className="min-w-0">
      <div className="mb-2 text-xs font-medium text-muted">{title}</div>
      <div className="overflow-x-auto rounded-xl border border-code-line bg-code-bg p-2 font-mono text-[12.5px] leading-[1.7]">
        {parts.map((p) => (
          <button
            key={p.id}
            type="button"
            onMouseEnter={() => onPick(p.id)}
            onFocus={() => onPick(p.id)}
            onClick={() => onPick(p.id)}
            className={`group relative block w-full rounded-md px-2 text-left transition-colors ${
              active === p.id ? "bg-accent-soft ring-1 ring-accent/50" : "hover:bg-surface-2"
            }`}
          >
            {p.lines.map((l, i) => (
              <span key={i} className={`block whitespace-pre ${p.tone}`}>
                {l || <span className="text-muted/70">⏎ (пустая строка)</span>}
              </span>
            ))}
          </button>
        ))}
      </div>
    </div>
  );
}

export function HttpAnatomy() {
  const [active, setActive] = useState("req-start");
  const part = [...request, ...response].find((p) => p.id === active)!;
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">Наведи или нажми на любую часть сообщения.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <Message title="Запрос (request)" parts={request} active={active} onPick={setActive} />
        <Message title="Ответ (response)" parts={response} active={active} onPick={setActive} />
      </div>
      <div className="min-h-20 rounded-lg bg-surface-2 px-4 py-3 text-[15px] leading-relaxed text-ink-2" aria-live="polite">
        <div className="mb-1 text-sm font-semibold text-ink">{part.label}</div>
        <Rich text={part.text} />
      </div>
    </div>
  );
}
