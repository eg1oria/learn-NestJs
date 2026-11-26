const tree = [
  { path: "/potions", depth: 0, methods: ["GET", "POST"], note: "коллекция: список и создание" },
  { path: "/potions/:id", depth: 1, methods: ["GET", "PATCH", "DELETE"], note: "один элемент коллекции" },
  { path: "/potions/:id/ingredients", depth: 2, methods: ["GET"], note: "вложенная коллекция: ингредиенты зелья" },
  { path: "/alchemists", depth: 0, methods: ["GET", "POST"], note: "другая коллекция" },
  { path: "/alchemists/:id", depth: 1, methods: ["GET"], note: "один алхимик" },
  { path: "/alchemists/:id/potions", depth: 2, methods: ["GET"], note: "зелья этого алхимика (связь 1:N)" },
];

const TONE: Record<string, string> = {
  GET: "bg-info-soft text-info",
  POST: "bg-ok-soft text-ok",
  PATCH: "bg-warn-soft text-warn",
  DELETE: "bg-bad-soft text-bad",
};

/** Адреса REST-API складываются в дерево, как папки на диске. */
export function UrlTree() {
  return (
    <div className="space-y-1.5 font-mono text-[13px]">
      {tree.map((n) => (
        <div key={n.path} className="flex flex-wrap items-center gap-x-3 gap-y-1" style={{ paddingLeft: n.depth * 22 }}>
          <span className="text-muted">{n.depth ? "└─" : "■"}</span>
          <span className="text-ink">{n.path}</span>
          <span className="flex gap-1">
            {n.methods.map((m) => (
              <span key={m} className={`rounded px-1.5 py-px text-[10.5px] font-semibold ${TONE[m]}`}>{m}</span>
            ))}
          </span>
          <span className="font-sans text-xs text-muted">{n.note}</span>
        </div>
      ))}
    </div>
  );
}
