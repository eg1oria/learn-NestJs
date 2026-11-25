import { SvgScroller } from "./Frame";

const instances = [
  { y: 46, ok: true, label: "сервер №1" },
  { y: 126, ok: true, label: "сервер №2" },
  { y: 206, ok: false, label: "сервер №3" },
];

/** Балансировщик опрашивает /health и убирает из ротации тех, кто не ответил. */
export function HealthBalancer() {
  return (
    <SvgScroller minWidth={620}>
      <svg viewBox="0 0 720 270" className="w-full font-sans" role="img" aria-label="Балансировщик опрашивает GET /health у трёх серверов, третий не отвечает и исключается">
        <text x="70" y="114" textAnchor="middle" className="fill-ink text-[13px] font-semibold">Пользователи</text>
        <path d="M 120 126 L 220 126" className="stroke-line-strong flow-line" strokeWidth="2" fill="none" />

        <rect x="226" y="86" width="150" height="80" rx="10" className="fill-surface stroke-line-strong" strokeWidth="1.5" />
        <text x="301" y="118" textAnchor="middle" className="fill-ink text-[13px] font-semibold">Балансировщик</text>
        <text x="301" y="138" textAnchor="middle" className="fill-muted text-[11px]">load balancer</text>
        <text x="301" y="154" textAnchor="middle" className="fill-muted font-mono text-[10.5px]">каждые 5 с</text>

        {instances.map((s) => {
          const path = `M 376 126 C 440 126, 450 ${s.y + 22}, 510 ${s.y + 22}`;
          return (
            <g key={s.label}>
              <path d={path} fill="none" strokeWidth="1.5"
                className={s.ok ? "stroke-ok flow-line" : "stroke-bad"} strokeDasharray={s.ok ? undefined : "3 5"} />
              <rect x="510" y={s.y} width="194" height="48" rx="8"
                className={s.ok ? "fill-ok-soft stroke-ok" : "fill-bad-soft stroke-bad"} strokeWidth="1.2" />
              <text x="524" y={s.y + 20} className="fill-ink text-[12.5px] font-medium">{s.label}</text>
              <text x="690" y={s.y + 20} textAnchor="end"
                className={`text-[11px] font-medium ${s.ok ? "fill-ok" : "fill-bad pulse-soft"}`}>
                {s.ok ? "в ротации" : "вне ротации"}
              </text>
              <text x="524" y={s.y + 38} className={`font-mono text-[10.5px] ${s.ok ? "fill-ok" : "fill-bad"}`}>
                {s.ok ? "GET /health → 200 ok" : "GET /health → тишина"}
              </text>
            </g>
          );
        })}
      </svg>
    </SvgScroller>
  );
}
