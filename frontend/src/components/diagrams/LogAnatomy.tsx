const parts = [
  { text: "[Nest]", label: "Кто пишет", note: "логгер фреймворка" },
  { text: "13940", label: "PID", note: "номер процесса в ОС" },
  { text: "11/25/2026, 10:25:45 PM", label: "Когда", note: "дата и время" },
  { text: "LOG", label: "Уровень", note: "log · warn · error · debug · verbose · fatal" },
  { text: "[RouterExplorer]", label: "Контекст", note: "какая часть приложения пишет" },
  { text: "Mapped {/, GET} route", label: "Сообщение", note: "что произошло" },
  { text: "+1ms", label: "Дельта", note: "сколько прошло с прошлой строки" },
];

export function LogAnatomy() {
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-code-line bg-code-bg px-3 py-3 font-mono text-[12.5px]">
        <div className="flex min-w-max gap-1.5">
          {parts.map((p, i) => (
            <span key={i} className="flex flex-col items-start gap-1">
              <span className={`whitespace-pre rounded px-1 ${i === 3 ? "text-ok" : i === 4 ? "text-warn" : i === 5 ? "text-ink" : "text-muted"}`}>
                {p.text}
              </span>
              <span className="flex items-center gap-1 pl-1 font-sans text-[11px] text-accent">
                <span className="inline-flex size-4 items-center justify-center rounded-full bg-accent-soft text-[10px] font-semibold">{i + 1}</span>
              </span>
            </span>
          ))}
        </div>
      </div>
      <ol className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
        {parts.map((p, i) => (
          <li key={i} className="flex gap-2">
            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent">{i + 1}</span>
            <span>
              <span className="font-medium text-ink">{p.label}</span>
              <span className="text-muted"> — {p.note}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
