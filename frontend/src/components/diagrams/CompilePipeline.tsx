import { SvgScroller } from "./Frame";

/** src/*.ts → компиляция → dist/*.js → node → сервер; watch-петля и ветка с ошибкой. */
export function CompilePipeline() {
  const box = (x: number, y: number, w: number, title: string, sub: string, tone: string) => (
    <g>
      <rect x={x} y={y} width={w} height="58" rx="10" className={tone} strokeWidth="1.4" />
      <text x={x + w / 2} y={y + 25} textAnchor="middle" className="fill-ink text-[12.5px] font-semibold">{title}</text>
      <text x={x + w / 2} y={y + 43} textAnchor="middle" className="fill-muted font-mono text-[10.5px]">{sub}</text>
    </g>
  );
  return (
    <SvgScroller minWidth={660}>
      <svg viewBox="0 0 720 260" className="w-full font-sans" role="img" aria-label="Код на TypeScript компилируется в JavaScript и запускается в Node.js">
        {box(10, 40, 130, "Твой код", "src/*.ts", "fill-surface stroke-line-strong")}
        {box(190, 40, 150, "Компиляция", "tsc (nest build)", "fill-accent-soft stroke-accent")}
        {box(390, 40, 130, "JavaScript", "dist/*.js", "fill-surface stroke-line-strong")}
        {box(570, 40, 140, "Node.js", "процесс на :3000", "fill-ok-soft stroke-ok")}
        {[[140, 190], [340, 390], [520, 570]].map(([a, b]) => (
          <path key={a} d={`M ${a} 69 L ${b - 4} 69`} className="stroke-line-strong flow-line" strokeWidth="2" fill="none" />
        ))}
        <text x="365" y="122" textAnchor="middle" className="fill-muted text-[10.5px]">типы стираются: в dist/ их уже нет</text>

        {/* watch-петля */}
        <path d="M 75 98 C 75 170, 265 170, 265 100" fill="none" className="stroke-info" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x="170" y="182" textAnchor="middle" className="fill-info text-[11px] font-medium">start:dev: сохранил файл → пересборка → рестарт</text>

        {/* ошибка */}
        <path d="M 265 100 L 265 214" fill="none" className="stroke-bad" strokeWidth="1.5" />
        <rect x="200" y="214" width="300" height="38" rx="8" className="fill-bad-soft stroke-bad" strokeWidth="1.2" />
        <text x="350" y="231" textAnchor="middle" className="fill-bad text-[11.5px] font-semibold">Ошибка типов → «Found 1 error»</text>
        <text x="350" y="246" textAnchor="middle" className="fill-ink-2 text-[10.5px]">рестарта нет, работает СТАРАЯ версия сервера</text>
      </svg>
    </SvgScroller>
  );
}
