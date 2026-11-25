import { SvgScroller } from "./Frame";

const stages = [
  { name: "Middleware", role: "общий вход", x: 120 },
  { name: "Guard", role: "пускать ли?", x: 222 },
  { name: "Interceptor", role: "до и после", x: 324 },
  { name: "Pipe", role: "проверка данных", x: 426 },
  { name: "Controller", role: "принять запрос", x: 528, main: true },
  { name: "Service", role: "сделать работу", x: 630, main: true },
];

/** Конвейер, через который проходит каждый запрос в Nest. */
export function RequestLifecycle() {
  const forward = "M 34 80 L 680 80";
  const backward = "M 630 150 L 324 150 L 34 150";
  return (
    <SvgScroller minWidth={680}>
      <svg viewBox="0 0 720 200" className="w-full font-sans" role="img" aria-label="Middleware, Guard, Interceptor, Pipe, Controller, Service и обратно через Interceptor">
        <text x="20" y="40" className="fill-muted text-[11px]">запрос</text>
        <path d={forward} className="stroke-accent" strokeWidth="2" fill="none" />
        <path d={backward} className="stroke-ok flow-line" strokeWidth="2" fill="none" />
        <text x="20" y="178" className="fill-muted text-[11px]">ответ</text>
        <circle r="6" className="fill-accent motion-dot">
          <animateMotion dur="3.6s" repeatCount="indefinite" path={forward} keyPoints="0;0.95;0.95" keyTimes="0;0.6;1" calcMode="linear" />
        </circle>
        {stages.map((s) => (
          <g key={s.name}>
            <rect x={s.x - 46} y="58" width="92" height="44" rx="8"
              className={s.main ? "fill-accent-soft stroke-accent" : "fill-surface stroke-line-strong"} strokeWidth="1.5" />
            <text x={s.x} y="78" textAnchor="middle" className="fill-ink text-[12.5px] font-semibold">{s.name}</text>
            <text x={s.x} y="94" textAnchor="middle" className="fill-muted text-[10.5px]">{s.role}</text>
          </g>
        ))}
        <rect x={324 - 46} y="136" width="92" height="28" rx="8" className="fill-surface stroke-line-strong" strokeWidth="1.5" />
        <text x="324" y="154" textAnchor="middle" className="fill-ink-2 text-[11px] font-medium">Interceptor (после)</text>
        <text x="360" y="30" textAnchor="middle" className="fill-muted text-[11px]">подробно — в модуле 7; сейчас у тебя есть только Controller и Service</text>
      </svg>
    </SvgScroller>
  );
}
