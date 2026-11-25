import type { ReactNode } from "react";
import type { CodeLang } from "@/content/types";
import { CodeBlock } from "./CodeBlock";
import { Rich } from "./Rich";

/**
 * Рендер подмножества markdown для карточек заданий:
 * абзацы, заголовки ###, списки (вложенные, с чекбоксами), ```код```, > цитаты.
 */

type ListItem = { text: string; checkbox: boolean; children: MdBlock[] };
type MdBlock =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "code"; lang: CodeLang; code: string }
  | { t: "quote"; text: string }
  | { t: "list"; ordered: boolean; items: ListItem[] };

const LIST_RE = /^(\s*)([-*]|\d+\.)\s+(.*)$/;
const KNOWN_LANGS = new Set(["ts", "json", "bash", "http", "text"]);

function indentOf(line: string) {
  return line.match(/^\s*/)?.[0].length ?? 0;
}

function parse(lines: string[]): MdBlock[] {
  const blocks: MdBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const fence = line.trim().match(/^```(\w*)/);
    if (fence) {
      const base = indentOf(line);
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        body.push(lines[i].slice(Math.min(base, indentOf(lines[i]))));
        i++;
      }
      i++;
      const lang = (KNOWN_LANGS.has(fence[1]) ? fence[1] : fence[1] === "typescript" ? "ts" : "text") as CodeLang;
      blocks.push({ t: "code", lang, code: body.join("\n") });
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ t: "h", text: line.slice(4) });
      i++;
      continue;
    }
    if (line.startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ t: "quote", text: quote.join(" ") });
      continue;
    }
    const li = line.match(LIST_RE);
    if (li) {
      const base = indentOf(line);
      const ordered = /\d/.test(li[2]);
      const items: ListItem[] = [];
      while (i < lines.length) {
        const cur = lines[i];
        const m = cur.match(LIST_RE);
        if (m && indentOf(cur) === base) {
          let text = m[3];
          const checkbox = /^\[[ xX]\]\s/.test(text);
          if (checkbox) text = text.slice(4);
          const childLines: string[] = [];
          i++;
          while (
            i < lines.length &&
            (lines[i].trim() === "" || indentOf(lines[i]) > base) &&
            !(lines[i].trim() === "" && (i + 1 >= lines.length || indentOf(lines[i + 1]) <= base))
          ) {
            childLines.push(lines[i]);
            i++;
          }
          const minIndent = Math.min(
            ...childLines.filter((l) => l.trim()).map(indentOf),
          );
          const children = childLines.length
            ? parse(childLines.map((l) => l.slice(Math.min(minIndent, indentOf(l)))))
            : [];
          items.push({ text, checkbox, children });
        } else if (cur.trim() === "" && i + 1 < lines.length && lines[i + 1].match(LIST_RE) && indentOf(lines[i + 1]) === base) {
          i++;
        } else break;
      }
      blocks.push({ t: "list", ordered, items });
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !LIST_RE.test(lines[i]) &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].startsWith("### ") &&
      !lines[i].startsWith(">")
    ) {
      para.push(lines[i].trim());
      i++;
    }
    blocks.push({ t: "p", text: para.join(" ") });
  }
  return blocks;
}

function renderBlocks(blocks: MdBlock[], nested = false): ReactNode[] {
  return blocks.map((b, i) => {
    switch (b.t) {
      case "p":
        return (
          <p key={i} className="leading-relaxed text-ink-2">
            <Rich text={b.text} />
          </p>
        );
      case "h":
        return (
          <h4 key={i} className="pt-1 font-semibold text-ink">
            <Rich text={b.text} />
          </h4>
        );
      case "quote":
        return (
          <blockquote key={i} className="border-l-2 border-line-strong pl-4 text-muted">
            <Rich text={b.text} />
          </blockquote>
        );
      case "code":
        return <CodeBlock key={i} code={b.code} lang={b.lang} compact />;
      case "list": {
        const allChecks = b.items.every((it) => it.checkbox);
        if (allChecks) {
          return (
            <ul key={i} className="space-y-2">
              {b.items.map((it, j) => (
                <li key={j} className="flex gap-3 leading-relaxed text-ink-2">
                  <span
                    aria-hidden
                    className="mt-[0.3em] size-4 shrink-0 rounded-[4px] border-[1.5px] border-line-strong"
                  />
                  <div className="min-w-0 space-y-2">
                    <Rich text={it.text} />
                    {it.children.length ? renderBlocks(it.children, true) : null}
                  </div>
                </li>
              ))}
            </ul>
          );
        }
        const Tag = b.ordered ? "ol" : "ul";
        return (
          <Tag
            key={i}
            className={`space-y-1.5 pl-5 leading-relaxed text-ink-2 marker:text-muted ${
              b.ordered ? "list-decimal" : "list-disc"
            } ${nested ? "mt-1.5" : ""}`}
          >
            {b.items.map((it, j) => (
              <li key={j} className="pl-1">
                <Rich text={it.text} />
                {it.children.length ? (
                  <div className="mt-1.5 space-y-2">{renderBlocks(it.children, true)}</div>
                ) : null}
              </li>
            ))}
          </Tag>
        );
      }
    }
  });
}

export function Markdown({ source }: { source: string }) {
  return <div className="space-y-3.5">{renderBlocks(parse(source.split("\n")))}</div>;
}
