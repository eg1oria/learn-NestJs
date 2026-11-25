import type { Metadata } from "next";
import { Suspense } from "react";
import { Hammer, PlugZap, Terminal } from "lucide-react";
import { guildEndpoints, type GuildEndpoint } from "@/content/guild-endpoints";
import { CodeBlock } from "@/components/CodeBlock";
import { RefreshButton } from "@/components/RefreshButton";
import { BACKEND_URL, probe, type HttpResult, type ProbeResult } from "@/lib/backend";

export const metadata: Metadata = { title: "Моя гильдия" };

export default function GuildPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm text-muted">Живой результат твоего кода</p>
          <h1 className="mb-3 font-serif text-[40px] font-semibold leading-[1.08] tracking-[-0.015em] text-ink">Моя гильдия</h1>
          <p className="text-[17px] leading-relaxed text-ink-2">
            Эта страница отправляет запросы в твой бэкенд на <code className="font-mono text-[0.9em]">{BACKEND_URL}</code> и
            показывает, что он уже умеет. Запросы идут с сервера Next.js, а не из браузера. Почему так, узнаешь в модуле 15 про CORS.
          </p>
        </div>
        <RefreshButton />
      </header>
      <Suspense fallback={<GuildSkeleton />}>
        <GuildBoard />
      </Suspense>
    </div>
  );
}

async function GuildBoard() {
  const results = await Promise.all(guildEndpoints.map((e) => probe(e.path)));
  const offline = results.every((r) => r.kind === "offline");

  if (offline) {
    const error = results[0].kind === "offline" ? results[0].error : "";
    return (
      <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-bad-soft text-bad">
            <PlugZap size={18} aria-hidden />
          </span>
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">Таверна закрыта: бэкенд не отвечает</h2>
            <p className="text-sm text-muted">
              {error === "ECONNREFUSED"
                ? "ECONNREFUSED — на порту никто не слушает. Помнишь урок 0.1?"
                : `Ошибка соединения: ${error}`}
            </p>
          </div>
        </div>
        <p className="mb-4 text-ink-2">Запусти сервер в отдельном терминале и нажми «Обновить»:</p>
        <div className="max-w-lg">
          <CodeBlock lang="bash" code={"cd backend\nnpm run start:dev"} compact />
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {guildEndpoints.map((endpoint, i) => (
        <EndpointCard key={endpoint.path} endpoint={endpoint} result={results[i]} wide={endpoint.view === "heroes"} />
      ))}
    </div>
  );
}

function EndpointCard({ endpoint, result, wide }: { endpoint: GuildEndpoint; result: ProbeResult; wide?: boolean }) {
  const live = result.kind === "ok";
  return (
    <section className={`flex flex-col overflow-hidden rounded-2xl border bg-surface ${live ? "border-line-strong" : "border-line"} ${wide ? "md:col-span-2" : ""}`}>
      <header className="flex items-start justify-between gap-4 px-5 pb-3 pt-5">
        <div>
          <h2 className="font-serif text-xl font-semibold text-ink">{endpoint.title}</h2>
          <p className="text-sm text-muted">{endpoint.description}</p>
        </div>
        <span
          className={`mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            live ? "bg-ok-soft text-ok" : result.kind === "error" ? "bg-bad-soft text-bad" : "bg-surface-2 text-muted"
          }`}
        >
          <span className={`size-1.5 rounded-full ${live ? "bg-ok" : result.kind === "error" ? "bg-bad" : "bg-muted/60"}`} />
          {live ? "работает" : result.kind === "error" ? "ошибка" : "ещё не построено"}
        </span>
      </header>

      <div className="flex-1 px-5 pb-5">
        {result.kind === "ok" ? (
          <LiveView endpoint={endpoint} result={result} />
        ) : result.kind === "error" ? (
          <p className="rounded-lg bg-bad-soft px-4 py-3 text-[15px] text-ink-2">
            Сервер ответил <b className="font-mono">{result.status}</b>. Загляни в лог бэкенда: там стектрейс (урок 1.3).
          </p>
        ) : (
          <div className="flex items-start gap-3 rounded-lg border border-dashed border-line-strong px-4 py-4">
            <Hammer size={18} className="mt-0.5 shrink-0 text-muted" aria-hidden />
            <p className="text-[15px] leading-relaxed text-ink-2">
              Этот функционал откроется в {endpoint.unlocksIn}. Сейчас сервер честно отвечает{" "}
              <span className="font-mono text-sm">404</span>: такого маршрута у него ещё нет.
            </p>
          </div>
        )}
      </div>

      <RequestLine endpoint={endpoint} result={result} />
    </section>
  );
}

function RequestLine({ endpoint, result }: { endpoint: GuildEndpoint; result: ProbeResult }) {
  if (result.kind === "offline") return null;
  const tone = result.status < 300 ? "text-ok" : result.status < 500 ? "text-warn" : "text-bad";
  return (
    <details className="group border-t border-line bg-surface-2/50 text-sm">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-2 gap-y-1 px-5 py-2.5 font-mono text-xs text-muted">
        <Terminal size={13} aria-hidden />
        <span className="text-ink">{endpoint.method} {endpoint.path}</span>
        <span>→</span>
        <span className={`font-semibold ${tone}`}>{result.status} {result.statusText}</span>
        <span>· {result.ms} мс</span>
        {result.contentType ? <span className="truncate">· {result.contentType.split(";")[0]}</span> : null}
        <span className="ml-auto font-sans group-open:hidden">сырой ответ</span>
      </summary>
      <div className="px-5 pb-4">
        <CodeBlock
          compact
          lang={result.json !== undefined ? "json" : "text"}
          code={result.json !== undefined ? JSON.stringify(result.json, null, 2) : result.text || "(пустое тело)"}
        />
      </div>
    </details>
  );
}

type OkResult = HttpResult;

function LiveView({ endpoint, result }: { endpoint: GuildEndpoint; result: OkResult }) {
  switch (endpoint.view) {
    case "greeting":
      return <Greeting result={result} />;
    case "health":
      return <Health result={result} />;
    case "heroes":
    case "leaderboard":
      return <EntityList result={result} ranked={endpoint.view === "leaderboard"} />;
    case "quests":
      return <EntityList result={result} />;
  }
}

function Greeting({ result }: { result: OkResult }) {
  const text = typeof result.json === "string" ? result.json : result.text;
  const stock = text.includes("Hello World");
  return (
    <div>
      <blockquote className="font-serif text-2xl leading-snug text-ink">«{text.slice(0, 200)}»</blockquote>
      {stock ? (
        <p className="mt-3 text-sm text-muted">Сервер жив, но говорит заводскими словами. В задании 1.2 ты это исправишь.</p>
      ) : null}
    </div>
  );
}

function formatUptime(sec: number) {
  if (sec < 60) return `${sec.toFixed(1)} с`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m} мин ${Math.floor(sec % 60)} с`;
  const h = Math.floor(m / 60);
  return `${h} ч ${m % 60} мин`;
}

function Health({ result }: { result: OkResult }) {
  const body = (result.json ?? {}) as { status?: unknown; uptime?: unknown; timestamp?: unknown };
  const ok = body.status === "ok";
  return (
    <dl className="grid grid-cols-3 gap-3">
      <div className="rounded-lg bg-surface-2 px-3 py-2.5">
        <dt className="text-xs text-muted">status</dt>
        <dd className={`flex items-center gap-1.5 font-mono font-semibold ${ok ? "text-ok" : "text-warn"}`}>
          <span className={`size-2 rounded-full ${ok ? "bg-ok pulse-soft" : "bg-warn"}`} />
          {String(body.status ?? "—")}
        </dd>
      </div>
      <div className="rounded-lg bg-surface-2 px-3 py-2.5">
        <dt className="text-xs text-muted">uptime</dt>
        <dd className="font-mono text-ink">{typeof body.uptime === "number" ? formatUptime(body.uptime) : "—"}</dd>
      </div>
      <div className="rounded-lg bg-surface-2 px-3 py-2.5">
        <dt className="text-xs text-muted">timestamp</dt>
        <dd className="truncate font-mono text-xs leading-6 text-ink" title={String(body.timestamp ?? "")}>
          {typeof body.timestamp === "string" ? body.timestamp.replace("T", " ").slice(0, 19) : "—"}
        </dd>
      </div>
    </dl>
  );
}

type Entity = Record<string, unknown>;

function pickTitle(e: Entity) {
  return String(e.name ?? e.title ?? e.heroName ?? `#${e.id ?? "?"}`);
}

function EntityList({ result, ranked = false }: { result: OkResult; ranked?: boolean }) {
  const data = result.json;
  const list: Entity[] | null = Array.isArray(data)
    ? (data as Entity[])
    : data && typeof data === "object" && Array.isArray((data as { items?: unknown }).items)
      ? ((data as { items: Entity[] }).items)
      : data && typeof data === "object" && Array.isArray((data as { data?: unknown }).data)
        ? ((data as { data: Entity[] }).data)
        : null;

  if (!list) {
    return <p className="text-[15px] text-ink-2">Сервер ответил, но не массивом. Посмотри сырой ответ ниже.</p>;
  }
  if (list.length === 0) {
    return <p className="text-[15px] text-ink-2">Пока пусто. Добавь кого-нибудь через <code className="font-mono text-sm">POST</code> из <code className="font-mono text-sm">guild.http</code>.</p>;
  }

  const stats = ["class", "level", "xp", "gold", "difficulty", "reward", "status"];
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {list.slice(0, 24).map((e, i) => (
        <li key={String(e.id ?? i)} className="flex gap-3 rounded-lg border border-line bg-bg/40 px-3.5 py-3">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft font-serif text-base font-semibold text-accent">
            {ranked ? i + 1 : pickTitle(e).slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="truncate font-medium text-ink">{pickTitle(e)}</div>
            <div className="flex flex-wrap gap-x-2.5 text-xs text-muted">
              {stats
                .filter((k) => e[k] !== undefined && typeof e[k] !== "object")
                .map((k) => (
                  <span key={k}>
                    {k}: <span className="font-mono text-ink-2">{String(e[k])}</span>
                  </span>
                ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function GuildSkeleton() {
  return (
    <div className="grid animate-pulse gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-44 rounded-2xl bg-surface-2" />
      ))}
    </div>
  );
}
