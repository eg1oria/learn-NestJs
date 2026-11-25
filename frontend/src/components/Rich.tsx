import { Fragment, type ReactNode } from "react";

/**
 * Инлайн-разметка для текстов уроков и заданий:
 * **жирный**, `код`, _курсив_, [ссылка](https://...).
 */
const INLINE =
  /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)\s]+\))|((?<![\p{L}\p{N}_])_[^_\n]+_(?![\p{L}\p{N}_]))/gu;

export function Rich({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(INLINE)) {
    const start = m.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    const [token, code, bold, link, em] = m;
    if (code) {
      nodes.push(
        <code
          key={key++}
          className="rounded-[5px] border border-line bg-surface-2 px-[0.35em] py-[0.08em] font-mono text-[0.86em] text-ink"
        >
          {code.slice(1, -1)}
        </code>,
      );
    } else if (bold) {
      nodes.push(
        <strong key={key++} className="font-semibold text-ink">
          <Rich text={bold.slice(2, -2)} />
        </strong>,
      );
    } else if (link) {
      const [, label, href] = link.match(/^\[([^\]]+)\]\(([^)]+)\)$/) ?? [];
      const external = href?.startsWith("http");
      nodes.push(
        <a
          key={key++}
          href={href}
          className="text-accent underline decoration-accent/40 underline-offset-[3px] hover:decoration-accent"
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {label}
        </a>,
      );
    } else if (em) {
      nodes.push(<em key={key++}>{em.slice(1, -1)}</em>);
    } else {
      nodes.push(token);
    }
    last = start + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes.map((n, i) => <Fragment key={i}>{n}</Fragment>)}</>;
}

/** Несколько абзацев из строки или массива строк. */
export function Paragraphs({
  text,
  className = "",
}: {
  text: string | string[];
  className?: string;
}) {
  const list = Array.isArray(text) ? text : [text];
  return (
    <>
      {list.map((t, i) => (
        <p key={i} className={className}>
          <Rich text={t} />
        </p>
      ))}
    </>
  );
}
