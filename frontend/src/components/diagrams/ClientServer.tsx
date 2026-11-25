import { SvgScroller } from "./Frame";

/** Клиент → дом (хост) → квартиры (порты). */
export function ClientServer() {
  const reqPath = "M 214 118 C 300 118, 330 96, 420 96";
  const resPath = "M 420 132 C 330 132, 300 154, 214 154";
  return (
    <SvgScroller>
      <svg viewBox="0 0 720 290" className="w-full font-sans" role="img" aria-label="Браузер отправляет запрос на порт 3000 компьютера и получает ответ">
        {/* Клиент */}
        <rect x="16" y="64" width="198" height="140" rx="12" className="fill-surface stroke-line-strong" strokeWidth="1.5" />
        <rect x="16" y="64" width="198" height="26" rx="12" className="fill-surface-2" />
        <rect x="16" y="78" width="198" height="12" className="fill-surface-2" />
        <circle cx="32" cy="77" r="4" className="fill-line-strong" />
        <circle cx="45" cy="77" r="4" className="fill-line-strong" />
        <circle cx="58" cy="77" r="4" className="fill-line-strong" />
        <text x="115" y="124" textAnchor="middle" className="fill-ink text-[15px] font-semibold">Клиент</text>
        <text x="115" y="145" textAnchor="middle" className="fill-muted text-[12px]">браузер, curl, мобилка,</text>
        <text x="115" y="161" textAnchor="middle" className="fill-muted text-[12px]">другой сервер</text>
        <text x="115" y="188" textAnchor="middle" className="fill-accent font-mono text-[11px]">начинает разговор</text>

        {/* Запрос и ответ */}
        <path d={reqPath} fill="none" className="stroke-accent flow-line" strokeWidth="2" />
        <path d={resPath} fill="none" className="stroke-ok flow-line" strokeWidth="2" />
        <text x="318" y="88" textAnchor="middle" className="fill-accent font-mono text-[11px]">GET /heroes →</text>
        <text x="318" y="174" textAnchor="middle" className="fill-ok font-mono text-[11px]">← 200 OK + JSON</text>
        <circle r="5" className="fill-accent motion-dot">
          <animateMotion dur="2.4s" repeatCount="indefinite" path={reqPath} keyPoints="0;1;1" keyTimes="0;0.45;1" calcMode="linear" />
        </circle>
        <circle r="5" className="fill-ok motion-dot">
          <animateMotion dur="2.4s" repeatCount="indefinite" path={resPath} keyPoints="0;0;1" keyTimes="0;0.55;1" calcMode="linear" />
        </circle>

        {/* Дом = компьютер-сервер */}
        <path d="M 420 40 L 562 8 L 704 40 Z" className="fill-surface-2 stroke-line-strong" strokeWidth="1.5" />
        <rect x="420" y="40" width="284" height="236" rx="4" className="fill-surface stroke-line-strong" strokeWidth="1.5" />
        <text x="562" y="32" textAnchor="middle" className="fill-ink-2 text-[12px] font-medium">хост: localhost · 127.0.0.1</text>

        {/* Квартиры = порты */}
        <g>
          <rect x="440" y="64" width="244" height="58" rx="8" className="fill-accent-soft stroke-accent" strokeWidth="1.5" />
          <text x="456" y="89" className="fill-accent font-mono text-[15px] font-semibold">:3000</text>
          <text x="520" y="89" className="fill-ink text-[13px] font-medium">NestJS — твой бэкенд</text>
          <text x="520" y="107" className="fill-muted text-[11px]">ждёт запросов (listen)</text>
        </g>
        <g>
          <rect x="440" y="134" width="244" height="58" rx="8" className="fill-surface-2 stroke-line" strokeWidth="1" />
          <text x="456" y="159" className="fill-ink-2 font-mono text-[15px] font-semibold">:3001</text>
          <text x="520" y="159" className="fill-ink-2 text-[13px] font-medium">Next.js — эта платформа</text>
          <text x="520" y="177" className="fill-muted text-[11px]">другая программа, другой порт</text>
        </g>
        <g opacity="0.6">
          <rect x="440" y="204" width="244" height="58" rx="8" className="fill-surface stroke-line" strokeDasharray="4 4" strokeWidth="1" />
          <text x="456" y="229" className="fill-muted font-mono text-[15px] font-semibold">:5432</text>
          <text x="520" y="229" className="fill-muted text-[13px] font-medium">PostgreSQL</text>
          <text x="520" y="247" className="fill-muted text-[11px]">заселится в модуле 9</text>
        </g>
      </svg>
    </SvgScroller>
  );
}
