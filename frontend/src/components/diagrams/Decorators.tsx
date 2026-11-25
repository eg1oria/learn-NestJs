import { SvgScroller } from "./Frame";

/** Декораторы — наклейки на коробках; Nest — грузчик, который их читает. */
export function Decorators() {
  const sticker = (x: number, y: number, w: number, text: string) => (
    <g transform={`rotate(-2 ${x} ${y})`}>
      <rect x={x} y={y} width={w} height="24" rx="4" className="fill-accent" />
      <text x={x + 10} y={y + 16} className="fill-accent-ink font-mono text-[12px] font-semibold">{text}</text>
    </g>
  );
  return (
    <SvgScroller minWidth={640}>
      <svg viewBox="0 0 720 250" className="w-full font-sans" role="img" aria-label="Декораторы на классе читаются Nest и превращаются в таблицу маршрутов">
        {/* Коробка-класс */}
        <rect x="16" y="40" width="300" height="190" rx="10" className="fill-surface stroke-line-strong" strokeWidth="1.5" />
        <text x="32" y="30" className="fill-muted text-[12px]">твой класс</text>
        {sticker(30, 52, 196, "@Controller('potions')")}
        <text x="34" y="104" className="fill-ink-2 font-mono text-[13px]">class PotionsController {"{"}</text>
        {sticker(52, 116, 82, "@Get()")}
        <text x="56" y="160" className="fill-ink-2 font-mono text-[13px]">list() {"{ … }"}</text>
        {sticker(52, 172, 112, "@Get(':id')")}
        <text x="56" y="216" className="fill-ink-2 font-mono text-[13px]">findOne() {"{ … }"}</text>

        {/* Nest читает */}
        <path d="M 330 135 L 420 135" className="stroke-accent flow-line" strokeWidth="2" fill="none" />
        <path d="M 412 128 L 422 135 L 412 142" className="stroke-accent" strokeWidth="2" fill="none" />
        <text x="375" y="122" textAnchor="middle" className="fill-muted text-[11px]">Nest читает</text>
        <text x="375" y="156" textAnchor="middle" className="fill-muted text-[11px]">наклейки</text>

        {/* Таблица маршрутов */}
        <rect x="430" y="70" width="274" height="130" rx="10" className="fill-surface-2 stroke-line" />
        <text x="446" y="96" className="fill-ink text-[13px] font-semibold">Таблица маршрутов</text>
        <text x="446" y="128" className="fill-ink-2 font-mono text-[12px]">GET  /potions</text>
        <text x="600" y="128" className="fill-muted font-mono text-[12px]">→ list()</text>
        <text x="446" y="154" className="fill-ink-2 font-mono text-[12px]">GET  /potions/:id</text>
        <text x="600" y="154" className="fill-muted font-mono text-[12px]">→ findOne()</text>
        <text x="446" y="184" className="fill-muted text-[11px]">в логе: Mapped {"{/potions, GET}"} route</text>
      </svg>
    </SvgScroller>
  );
}
