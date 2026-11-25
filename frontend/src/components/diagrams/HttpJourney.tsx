"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Rich } from "../Rich";
import { SvgScroller } from "./Frame";

type Step = { title: string; text: string; packet: [number, number]; link?: "dns" | "tcp"; pulse?: "client" | "dns" | "server" };

const CLIENT: [number, number] = [96, 112];
const DNS: [number, number] = [360, 46];
const SERVER: [number, number] = [624, 112];
const MID: [number, number] = [360, 112];

const steps: Step[] = [
  {
    title: "Разбор URL",
    text: "Браузер или `fetch` разбирает `https://api.guild.dev/heroes`. Схема — `https`, хост — `api.guild.dev`, порт по умолчанию — `443`, путь — `/heroes`.",
    packet: CLIENT,
    pulse: "client",
  },
  {
    title: "DNS: имя → IP",
    text: "Компьютеры не знают имён, им нужен IP-адрес. DNS работает как телефонный справочник: `api.guild.dev` → `203.0.113.7`. Для `localhost` справочник не нужен, это всегда `127.0.0.1`, «этот же компьютер».",
    packet: DNS,
    link: "dns",
    pulse: "dns",
  },
  {
    title: "Соединение",
    text: "Клиент устанавливает TCP-соединение с `203.0.113.7:443`, это как дозвониться: «Алло, слышно?» — «Слышно!». Для `https` поверх него договариваются о шифровании (TLS). Если по этому порту никто не слушает, здесь всё и закончится: `ECONNREFUSED`.",
    packet: MID,
    link: "tcp",
  },
  {
    title: "Запрос отправлен",
    text: "По соединению уходит **текст**: стартовая строка `GET /heroes HTTP/1.1`, заголовки и (если есть) тело. HTTP — это просто договорённость, как этот текст оформлять.",
    packet: SERVER,
    link: "tcp",
  },
  {
    title: "Сервер работает",
    text: "Nest по **методу и пути** находит нужный метод контроллера, тот зовёт сервис, сервис достаёт героев (пока из памяти, потом из базы). Всё, чему посвящён этот курс, происходит на этом шаге.",
    packet: SERVER,
    link: "tcp",
    pulse: "server",
  },
  {
    title: "Ответ",
    text: "Сервер отправляет обратно текст: статус `200 OK`, заголовки (`Content-Type: application/json`) и тело с JSON.",
    packet: MID,
    link: "tcp",
  },
  {
    title: "Клиент получил",
    text: "Браузер рисует страницу, а твой `fetch` резолвит промис: `await res.json()` превращает текст в объект. Круг замкнулся, и сервер уже ждёт следующий запрос.",
    packet: CLIENT,
    pulse: "client",
  },
];

export function HttpJourney() {
  const [i, setI] = useState(0);
  const step = steps[i];
  const back = i === 5;

  const box = (x: number, y: number, w: number, label: string, sub: string, active: boolean) => (
    <g>
      <rect
        x={x - w / 2}
        y={y - 30}
        width={w}
        height="60"
        rx="10"
        className={active ? "fill-accent-soft stroke-accent" : "fill-surface stroke-line-strong"}
        strokeWidth="1.5"
        style={{ transition: "fill .3s, stroke .3s" }}
      />
      <text x={x} y={y - 4} textAnchor="middle" className="fill-ink text-[14px] font-semibold">{label}</text>
      <text x={x} y={y + 15} textAnchor="middle" className="fill-muted font-mono text-[11px]">{sub}</text>
    </g>
  );

  return (
    <div className="space-y-4">
      <SvgScroller minWidth={600}>
        <svg viewBox="0 0 720 170" className="w-full font-sans" role="img" aria-label={`Шаг ${i + 1}: ${step.title}`}>
          <line x1={CLIENT[0] + 70} y1={CLIENT[1]} x2={SERVER[0] - 70} y2={SERVER[1]}
            className={step.link === "tcp" ? "stroke-accent flow-line" : "stroke-line"} strokeWidth="2" />
          <path d={`M ${CLIENT[0] + 40} ${CLIENT[1] - 30} Q 200 46 ${DNS[0] - 70} ${DNS[1]}`} fill="none"
            className={step.link === "dns" ? "stroke-info flow-line" : "stroke-line"} strokeWidth="1.5" strokeDasharray="4 4" />
          {box(CLIENT[0], CLIENT[1], 140, "Клиент", "браузер / fetch", step.pulse === "client")}
          {box(DNS[0], DNS[1], 140, "DNS", "имя → IP", step.pulse === "dns")}
          {box(SERVER[0], SERVER[1], 140, "Сервер", "203.0.113.7:443", step.pulse === "server")}
          <g style={{ transform: `translate(${step.packet[0]}px, ${step.packet[1] + 44}px)`, transition: "transform .55s cubic-bezier(.4,0,.2,1)" }}>
            <rect x="-34" y="-11" width="68" height="22" rx="6" className={back ? "fill-ok" : "fill-accent"} />
            <text y="4" textAnchor="middle" className="fill-surface font-mono text-[10px] font-semibold">
              {back || i === 6 ? "200 OK" : i === 1 ? "IP?" : i === 2 ? "алло?" : "GET /heroes"}
            </text>
          </g>
        </svg>
      </SvgScroller>

      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Шаги">
        {steps.map((s, j) => (
          <button
            key={j}
            type="button"
            role="tab"
            aria-selected={j === i}
            onClick={() => setI(j)}
            className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
              j === i ? "bg-ink text-bg" : j < i ? "bg-surface-2 text-ink-2" : "text-muted hover:bg-surface-2"
            }`}
          >
            {j + 1}. {s.title}
          </button>
        ))}
      </div>

      <div className="min-h-24 rounded-lg bg-surface-2 px-4 py-3 text-[15px] leading-relaxed text-ink-2">
        <Rich text={step.text} />
      </div>

      <div className="flex justify-between">
        <button type="button" disabled={i === 0} onClick={() => setI(i - 1)}
          className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted hover:bg-surface-2 hover:text-ink disabled:opacity-40">
          <ChevronLeft size={16} aria-hidden /> Назад
        </button>
        <button type="button" disabled={i === steps.length - 1} onClick={() => setI(i + 1)}
          className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-3 py-1.5 text-sm text-ink hover:bg-line disabled:opacity-40">
          Дальше <ChevronRight size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}
