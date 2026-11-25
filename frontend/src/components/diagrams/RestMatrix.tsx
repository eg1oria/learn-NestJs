const rows = [
  { m: "GET", path: "/potions", what: "список всех зелий", ok: "200", scope: "коллекция" },
  { m: "POST", path: "/potions", what: "сварить новое зелье", ok: "201", scope: "коллекция" },
  { m: "GET", path: "/potions/12", what: "одно зелье по id", ok: "200", scope: "элемент" },
  { m: "PATCH", path: "/potions/12", what: "поменять часть полей", ok: "200", scope: "элемент" },
  { m: "DELETE", path: "/potions/12", what: "вылить зелье", ok: "204", scope: "элемент" },
  { m: "GET", path: "/alchemists/3/potions", what: "зелья алхимика 3", ok: "200", scope: "вложенный" },
  { m: "GET", path: "/potions?color=green&page=2", what: "фильтр и страница", ok: "200", scope: "query" },
];

const METHOD_TONE: Record<string, string> = {
  GET: "bg-info-soft text-info",
  POST: "bg-ok-soft text-ok",
  PATCH: "bg-warn-soft text-warn",
  DELETE: "bg-bad-soft text-bad",
};

/** Один ресурс — один набор адресов; действие выбирает метод. */
export function RestMatrix() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-separate border-spacing-y-1.5 text-sm">
        <thead>
          <tr className="text-left text-xs text-muted">
            <th className="px-3 font-medium">Метод</th>
            <th className="px-3 font-medium">Путь (ресурс)</th>
            <th className="px-3 font-medium">Смысл</th>
            <th className="px-3 font-medium">Успех</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="bg-surface-2">
              <td className="rounded-l-lg px-3 py-2">
                <span className={`inline-block w-16 rounded-md px-1.5 py-0.5 text-center font-mono text-xs font-semibold ${METHOD_TONE[r.m]}`}>{r.m}</span>
              </td>
              <td className="px-3 py-2 font-mono text-[13px] text-ink">{r.path}</td>
              <td className="px-3 py-2 text-ink-2">
                {r.what} <span className="ml-1 text-xs text-muted">· {r.scope}</span>
              </td>
              <td className="rounded-r-lg px-3 py-2 font-mono text-[13px] text-ink-2">{r.ok}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
