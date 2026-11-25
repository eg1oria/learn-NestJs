import type { CodeLang } from "@/content/types";

/**
 * Маленькая синхронная подсветка синтаксиса для ts / json / bash / http.
 * Без зависимостей: работает и в серверных, и в клиентских компонентах.
 */

export type TokKind =
  | "kw"
  | "str"
  | "num"
  | "lit"
  | "com"
  | "fn"
  | "type"
  | "dec"
  | "prop"
  | "muted";

export type Tok = { text: string; kind?: TokKind };

const TS_KEYWORDS = new Set(
  (
    "import export from as default const let var function return async await " +
    "class extends implements interface type enum new this super if else for " +
    "of in while do switch case break continue throw try catch finally " +
    "private public protected readonly static abstract declare keyof typeof " +
    "instanceof void delete yield get set satisfies"
  ).split(" "),
);
const TS_LITERALS = new Set(["true", "false", "null", "undefined", "NaN"]);

const TS_RE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`)|(@[\p{L}_$][\p{L}\p{N}_$]*)|(\b\d[\d_]*(?:\.\d+)?\b)|([\p{L}_$][\p{L}\p{N}_$]*)|(\s+)|([^\s])/gu;

function tokenizeTs(src: string): Tok[] {
  const out: Tok[] = [];
  let prevSignificant = "";
  for (const m of src.matchAll(TS_RE)) {
    const [text, com, str, dec, num, ident] = m;
    if (com) out.push({ text, kind: "com" });
    else if (str) out.push({ text, kind: "str" });
    else if (dec) out.push({ text, kind: "dec" });
    else if (num) out.push({ text, kind: "num" });
    else if (ident) {
      const rest = src.slice((m.index ?? 0) + text.length);
      if (TS_KEYWORDS.has(text)) out.push({ text, kind: "kw" });
      else if (TS_LITERALS.has(text)) out.push({ text, kind: "lit" });
      else if (/^\s*(<[^>]*>)?\s*\(/.test(rest)) out.push({ text, kind: "fn" });
      else if (/^[A-Z]/.test(text)) out.push({ text, kind: "type" });
      else if (prevSignificant === ".") out.push({ text, kind: "prop" });
      else out.push({ text });
    } else out.push({ text });
    if (text.trim()) prevSignificant = text;
  }
  return out;
}

const JSON_RE =
  /("(?:\\.|[^"\\])*")(\s*:)?|(-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|\b(true|false|null)\b|(\s+)|([^\s])/g;

function tokenizeJson(src: string): Tok[] {
  const out: Tok[] = [];
  for (const m of src.matchAll(JSON_RE)) {
    const [text, str, colon, num, lit] = m;
    if (str) {
      out.push({ text: str, kind: colon ? "prop" : "str" });
      if (colon) out.push({ text: colon });
    } else if (num) out.push({ text, kind: "num" });
    else if (lit) out.push({ text, kind: "lit" });
    else out.push({ text });
  }
  return out;
}

function tokenizeBashLine(line: string): Tok[] {
  const out: Tok[] = [];
  if (/^\s*#/.test(line)) return [{ text: line, kind: "com" }];
  const re =
    /(^\s*\$\s)|('[^']*'|"(?:\\.|[^"\\])*")|((?<=\s)#.*$)|((?<=\s)--?[\w-]+)|(https?:\/\/[^\s'"]+)|(\|\||&&|\|)|([^\s'"|&]+)|(\s+)|(.)/g;
  let expectCommand = true;
  for (const m of line.matchAll(re)) {
    const [text, prompt, str, com, flag, url, op, word] = m;
    if (prompt) out.push({ text, kind: "muted" });
    else if (str || url) {
      out.push({ text, kind: "str" });
      expectCommand = false;
    } else if (com) out.push({ text, kind: "com" });
    else if (flag) out.push({ text, kind: "kw" });
    else if (op) {
      out.push({ text, kind: "muted" });
      expectCommand = true;
    } else if (word) {
      out.push({ text, kind: expectCommand ? "fn" : undefined });
      expectCommand = false;
    } else out.push({ text });
  }
  return out;
}

const HTTP_METHOD = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)(\s+)(\S+)(.*)$/;
const HTTP_STATUS = /^(HTTP\/[\d.]+)(\s+)(\d{3})(.*)$/;
const HTTP_HEADER = /^([A-Za-z][\w-]*)(:)(.*)$/;

function tokenizeHttp(src: string): Tok[] {
  const out: Tok[] = [];
  const lines = src.split("\n");
  let inBody = false;
  let body: string[] = [];

  const flushBody = () => {
    if (!body.length) return;
    const text = body.join("\n");
    const trimmed = text.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("["))
      out.push(...tokenizeJson(text));
    else out.push({ text });
    out.push({ text: "\n" });
    body = [];
  };

  lines.forEach((line, i) => {
    const nl = i < lines.length - 1 ? "\n" : "";
    if (line.startsWith("###")) {
      flushBody();
      inBody = false;
      out.push({ text: line + nl, kind: "com" });
      return;
    }
    if (inBody) {
      body.push(line);
      if (!nl) flushBody();
      return;
    }
    let m: RegExpMatchArray | null;
    if (/^\s*#/.test(line) || line.startsWith("//")) {
      out.push({ text: line + nl, kind: "com" });
    } else if ((m = line.match(/^(@[\w-]+)(\s*=\s*)(.*)$/))) {
      out.push({ text: m[1], kind: "dec" }, { text: m[2] }, { text: m[3] + nl, kind: "str" });
    } else if ((m = line.match(HTTP_METHOD))) {
      out.push(
        { text: m[1], kind: "kw" },
        { text: m[2] },
        { text: m[3], kind: "str" },
        { text: m[4] + nl, kind: "muted" },
      );
    } else if ((m = line.match(HTTP_STATUS))) {
      out.push(
        { text: m[1], kind: "muted" },
        { text: m[2] },
        { text: m[3], kind: "num" },
        { text: m[4] + nl },
      );
    } else if ((m = line.match(HTTP_HEADER))) {
      out.push({ text: m[1], kind: "prop" }, { text: m[2] }, { text: m[3] + nl });
    } else if (line.trim() === "") {
      out.push({ text: line + nl });
      // Пустая строка после заголовков — дальше тело.
      const hasHeaderBefore = out.some((t) => t.kind === "prop" || t.kind === "kw" || t.kind === "num");
      if (hasHeaderBefore) inBody = true;
    } else {
      out.push({ text: line + nl });
    }
  });
  flushBody();
  return out;
}

function tokenize(code: string, lang: CodeLang): Tok[] {
  switch (lang) {
    case "ts":
      return tokenizeTs(code);
    case "json":
      return tokenizeJson(code);
    case "bash":
      return code.split("\n").flatMap((line, i, all) => [
        ...tokenizeBashLine(line),
        ...(i < all.length - 1 ? [{ text: "\n" }] : []),
      ]);
    case "http":
      return tokenizeHttp(code);
    default:
      return [{ text: code }];
  }
}

/** Разбивает токены по строкам — так проще рисовать номера строк. */
export function highlightLines(code: string, lang: CodeLang): Tok[][] {
  const lines: Tok[][] = [[]];
  for (const tok of tokenize(code.replace(/\n$/, ""), lang)) {
    const parts = tok.text.split("\n");
    parts.forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ text: part, kind: tok.kind });
    });
  }
  return lines;
}
