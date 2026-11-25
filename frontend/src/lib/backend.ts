import { connection } from "next/server";

export const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3000";

export type HttpResult = {
  kind: "ok" | "missing" | "error";
  status: number;
  statusText: string;
  ms: number;
  contentType: string;
  text: string;
  json: unknown;
};

export type ProbeResult = { kind: "offline"; error: string } | HttpResult;

/**
 * Запрос к бэкенду ученика с сервера Next.js. Браузер в нём не участвует,
 * поэтому CORS пока не нужен (до модуля 15).
 */
export async function probe(path: string): Promise<ProbeResult> {
  await connection();
  const started = performance.now();
  try {
    const res = await fetch(BACKEND_URL + path, {
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
      headers: { Accept: "application/json, text/plain;q=0.9, */*;q=0.8" },
    });
    const text = await res.text();
    const ms = Math.round(performance.now() - started);
    const contentType = res.headers.get("content-type") ?? "";
    let json: unknown = undefined;
    if (contentType.includes("json")) {
      try {
        json = JSON.parse(text);
      } catch {}
    }
    return {
      kind: res.status === 404 ? "missing" : res.ok ? "ok" : "error",
      status: res.status,
      statusText: res.statusText,
      ms,
      contentType,
      text,
      json,
    };
  } catch (e) {
    const cause = (e as { cause?: { code?: string } }).cause?.code;
    return { kind: "offline", error: cause ?? (e as Error).name };
  }
}
