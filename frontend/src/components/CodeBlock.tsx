import { highlightLines } from "@/lib/highlight";
import type { CodeLang } from "@/content/types";
import { CopyButton } from "./CopyButton";

const LANG_LABEL: Record<CodeLang, string> = {
  ts: "TypeScript",
  json: "JSON",
  bash: "Терминал",
  http: "HTTP",
  text: "Текст",
};

export function CodeBlock({
  code,
  lang,
  file,
  caption,
  compact = false,
}: {
  code: string;
  lang: CodeLang;
  file?: string;
  caption?: string;
  compact?: boolean;
}) {
  const lines = highlightLines(code, lang);
  const showNumbers = !compact && lines.length > 3 && lang !== "bash";

  return (
    <figure className="group overflow-hidden rounded-xl border border-code-line bg-code-bg">
      <div className="flex items-center justify-between border-b border-code-line px-3 py-1.5">
        <span className="font-mono text-xs text-muted">{file ?? LANG_LABEL[lang]}</span>
        <CopyButton text={code.replace(/\n$/, "")} />
      </div>
      <pre className="overflow-x-auto py-3 font-mono text-[13px] leading-[1.65] text-code-ink">
        <code className="block min-w-max">
          {lines.map((line, i) => (
            <span key={i} className="flex px-4">
              {showNumbers ? (
                <span
                  aria-hidden
                  className="mr-4 inline-block w-5 shrink-0 select-none text-right text-muted/60"
                >
                  {i + 1}
                </span>
              ) : null}
              <span className="whitespace-pre">
                {line.length === 0
                  ? " "
                  : line.map((tok, j) =>
                      tok.kind ? (
                        <span key={j} className={`tok-${tok.kind}`}>
                          {tok.text}
                        </span>
                      ) : (
                        tok.text
                      ),
                    )}
              </span>
            </span>
          ))}
        </code>
      </pre>
      {caption ? (
        <figcaption className="border-t border-code-line px-4 py-2 text-xs text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
