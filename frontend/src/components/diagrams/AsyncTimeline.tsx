import { SvgScroller } from "./Frame";

const X0 = 170;
const SCALE = 1.6; // px за мс

function Bar({ y, start, ms, label, tone }: { y: number; start: number; ms: number; label: string; tone: string }) {
  return (
    <g>
      <rect x={X0 + start * SCALE} y={y} width={ms * SCALE - 3} height="22" rx="5" className={tone} />
      <text x={X0 + start * SCALE + 8} y={y + 15} className="fill-surface text-[11px] font-medium">{label}</text>
    </g>
  );
}

/** Кузница куёт три предмета по 100 мс: по очереди и параллельно. */
export function AsyncTimeline() {
  return (
    <SvgScroller minWidth={620}>
      <svg viewBox="0 0 720 215" className="w-full font-sans" role="img" aria-label="По очереди 300 мс, параллельно 100 мс">
        {[0, 100, 200, 300].map((t) => (
          <g key={t}>
            <line x1={X0 + t * SCALE} y1="18" x2={X0 + t * SCALE} y2="190" className="stroke-line" strokeDasharray="3 4" />
            <text x={X0 + t * SCALE} y="207" textAnchor="middle" className="fill-muted font-mono text-[11px]">{t} мс</text>
          </g>
        ))}

        <text x="16" y="44" className="fill-ink text-[13px] font-semibold">По очереди</text>
        <text x="16" y="61" className="fill-muted font-mono text-[10.5px]">await в цикле</text>
        <Bar y={30} start={0} ms={100} label="меч" tone="fill-warn" />
        <Bar y={56} start={100} ms={100} label="щит" tone="fill-warn" />
        <Bar y={82} start={200} ms={100} label="шлем" tone="fill-warn" />
        <text x={X0 + 300 * SCALE + 10} y="98" className="fill-warn font-mono text-[12px] font-semibold">≈ 300 мс</text>

        <text x="16" y="136" className="fill-ink text-[13px] font-semibold">Параллельно</text>
        <text x="16" y="153" className="fill-muted font-mono text-[10.5px]">Promise.all([...])</text>
        <Bar y={114} start={0} ms={100} label="меч" tone="fill-ok" />
        <Bar y={139} start={0} ms={100} label="щит" tone="fill-ok" />
        <Bar y={164} start={0} ms={100} label="шлем" tone="fill-ok" />
        <text x={X0 + 100 * SCALE + 10} y="155" className="fill-ok font-mono text-[12px] font-semibold">≈ 100 мс</text>
      </svg>
    </SvgScroller>
  );
}
