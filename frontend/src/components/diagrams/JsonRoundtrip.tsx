import { SvgScroller } from "./Frame";

/** Объект на сервере → строка в сети → объект у клиента. */
export function JsonRoundtrip() {
  const card = (x: number, title: string, sub: string, lines: string[], tone: string) => (
    <g>
      <text x={x} y="24" className="fill-ink text-[12.5px] font-semibold">{title}</text>
      <text x={x} y="40" className="fill-muted text-[10.5px]">{sub}</text>
      <rect x={x} y="50" width="196" height="118" rx="10" className={tone} strokeWidth="1.3" />
      {lines.map((l, i) => (
        <text key={i} x={x + 12} y={74 + i * 19} className="fill-ink-2 font-mono text-[11px]">{l}</text>
      ))}
    </g>
  );
  return (
    <SvgScroller minWidth={660}>
      <svg viewBox="0 0 720 230" className="w-full font-sans" role="img" aria-label="JSON.stringify на сервере, строка по сети, JSON.parse у клиента">
        {card(8, "Сервер: объект", "живёт в памяти Node.js", ["{", "  id: 7,", "  name: 'Гимли',", "  hiredAt: Date(...)", "}"], "fill-surface stroke-line-strong")}
        {card(262, "В сети: строка", "просто текст, байт за байтом", ['{"id":7,', '"name":"Гимли",', '"hiredAt":', '"2026-11-25T18:00', ':00.000Z"}'], "fill-code-bg stroke-accent")}
        {card(516, "Клиент: снова объект", "после res.json()", ["{", "  id: 7,", "  name: 'Гимли',", "  hiredAt: '2026-…Z'", "}"], "fill-surface stroke-line-strong")}
        <path d="M 206 110 L 258 110" className="stroke-accent flow-line" strokeWidth="2" fill="none" />
        <path d="M 460 110 L 512 110" className="stroke-ok flow-line" strokeWidth="2" fill="none" />
        <text x="232" y="196" textAnchor="middle" className="fill-accent font-mono text-[11px] font-semibold">JSON.stringify</text>
        <text x="232" y="212" textAnchor="middle" className="fill-muted text-[10px]">делает Nest за тебя</text>
        <text x="486" y="196" textAnchor="middle" className="fill-ok font-mono text-[11px] font-semibold">JSON.parse</text>
        <text x="486" y="212" textAnchor="middle" className="fill-muted text-[10px]">делает res.json()</text>
        <text x="620" y="196" textAnchor="middle" className="fill-warn text-[10.5px] font-medium">Date стала строкой!</text>
        <text x="620" y="212" textAnchor="middle" className="fill-muted text-[10px]">функции и undefined пропадут</text>
      </svg>
    </SvgScroller>
  );
}
