import { SvgScroller } from "./Frame";

const frames = [
  { label: "AppService.getWelcome()", note: "throw new Error(…) — упал здесь", tone: "fill-bad-soft stroke-bad", trace: "at AppService.getWelcome (dist/app.service.js:12)" },
  { label: "AppController.getWelcome()", note: "позвал сервис", tone: "fill-accent-soft stroke-accent", trace: "at AppController.getWelcome (dist/app.controller.js:20)" },
  { label: "Nest: обработчик маршрута", note: "нашёл метод по GET /", tone: "fill-surface stroke-line-strong", trace: "at …/@nestjs/core/router/… (node_modules)" },
  { label: "HTTP-сервер (Express)", note: "принял запрос", tone: "fill-surface stroke-line-strong", trace: "at …/express/… (node_modules)" },
];

/** Стопка вызовов в момент ошибки и как она превращается в стектрейс. */
export function CallStack() {
  return (
    <SvgScroller minWidth={660}>
      <svg viewBox="0 0 720 250" className="w-full font-sans" role="img" aria-label="Стек вызовов и соответствующий стектрейс">
        <text x="16" y="20" className="fill-muted text-[11px]">стек вызовов: кто кого позвал (растёт вверх)</text>
        <text x="380" y="20" className="fill-muted text-[11px]">стектрейс в логе: читается сверху вниз</text>
        {frames.map((f, i) => {
          const y = 34 + i * 52;
          return (
            <g key={i}>
              <rect x="16" y={y} width="300" height="42" rx="8" className={f.tone} strokeWidth="1.3" />
              <text x="30" y={y + 18} className="fill-ink font-mono text-[11.5px] font-semibold">{f.label}</text>
              <text x="30" y={y + 33} className="fill-muted text-[10.5px]">{f.note}</text>
              <path d={`M 316 ${y + 21} L 376 ${y + 21}`} className="stroke-line-strong" strokeDasharray="3 3" />
              <text x="384" y={y + 25} className={`font-mono text-[10.5px] ${i < 2 ? "fill-ink" : "fill-muted"} ${i === 0 ? "font-semibold" : ""}`}>{f.trace}</text>
            </g>
          );
        })}
        <text x="384" y="244" className="fill-accent text-[11px] font-medium">↑ ищи первые строки со своими файлами (не node_modules)</text>
      </svg>
    </SvgScroller>
  );
}
