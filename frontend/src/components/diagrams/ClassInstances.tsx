import { SvgScroller } from "./Frame";

/** Класс — чертёж, экземпляры — изделия со своим состоянием. */
export function ClassInstances() {
  const inst = (y: number, call: string, city: string, orders: number) => (
    <g>
      <path d={`M 250 110 C 300 110, 300 ${y + 40}, 350 ${y + 40}`} fill="none" className="stroke-accent flow-line" strokeWidth="1.6" />
      <text x="300" y={y + 26} textAnchor="middle" className="fill-accent font-mono text-[10.5px]">{call}</text>
      <rect x="352" y={y} width="210" height="80" rx="10" className="fill-ok-soft stroke-ok" strokeWidth="1.3" />
      <text x="368" y={y + 24} className="fill-ink text-[12.5px] font-semibold">экземпляр Forge</text>
      <text x="368" y={y + 46} className="fill-ink-2 font-mono text-[11.5px]">city: &apos;{city}&apos;</text>
      <text x="368" y={y + 66} className="fill-ink-2 font-mono text-[11.5px]">orders: {orders}</text>
      <text x="578" y={y + 46} className="fill-muted text-[10.5px]">своя память,</text>
      <text x="578" y={y + 62} className="fill-muted text-[10.5px]">свои значения</text>
    </g>
  );
  return (
    <SvgScroller minWidth={620}>
      <svg viewBox="0 0 720 230" className="w-full font-sans" role="img" aria-label="Класс Forge и два экземпляра с разным состоянием">
        <rect x="16" y="30" width="234" height="160" rx="10" className="fill-surface stroke-line-strong" strokeWidth="1.4" strokeDasharray="5 4" />
        <text x="32" y="22" className="fill-muted text-[11px]">чертёж (class)</text>
        <text x="32" y="56" className="fill-ink font-mono text-[12.5px] font-semibold">class Forge</text>
        <text x="32" y="82" className="fill-ink-2 font-mono text-[11.5px]">city: string</text>
        <text x="32" y="102" className="fill-ink-2 font-mono text-[11.5px]">orders = 0</text>
        <text x="32" y="130" className="fill-ink-2 font-mono text-[11.5px]">describe(): string</text>
        <text x="32" y="168" className="fill-muted text-[10.5px]">описывает форму, но</text>
        <text x="32" y="182" className="fill-muted text-[10.5px]">данных в нём нет</text>
        {inst(14, "new Forge('Ривенделл')", "Ривенделл", 3)}
        {inst(124, "new Forge('Мория')", "Мория", 0)}
      </svg>
    </SvgScroller>
  );
}
