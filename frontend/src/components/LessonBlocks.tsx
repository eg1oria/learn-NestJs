import { HelpCircle, Info, Lightbulb, TriangleAlert } from "lucide-react";
import type { Block } from "@/content/types";
import { CodeBlock } from "./CodeBlock";
import { Diagram } from "./diagrams";
import { Quiz } from "./Quiz";
import { ReadCards } from "./ReadCards";
import { Sequence } from "./Sequence";
import { SystemMap } from "./SystemMap";
import { FlowStepper } from "./diagrams/FlowStepper";
import { Walkthrough } from "./Walkthrough";
import { Paragraphs, Rich } from "./Rich";

const CALLOUT = {
  info: { icon: Info, cls: "border-info/30 bg-info-soft", title: "text-info" },
  tip: { icon: Lightbulb, cls: "border-ok/30 bg-ok-soft", title: "text-ok" },
  warn: { icon: TriangleAlert, cls: "border-warn/30 bg-warn-soft", title: "text-warn" },
} as const;

const prose = "text-[17px] leading-[1.75] text-ink-2";

function BlockView({ block, lessonId }: { block: Block; lessonId: string }) {
  switch (block.type) {
    case "h":
      return (
        <h2 id={block.id} className="scroll-mt-24 pt-6 font-serif text-[26px] font-semibold leading-tight tracking-[-0.01em] text-ink">
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p className={prose}>
          <Rich text={block.text} />
        </p>
      );
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className={`${prose} space-y-2 pl-6 marker:text-muted ${block.ordered ? "list-decimal" : "list-disc"}`}>
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              <Rich text={item} />
            </li>
          ))}
        </Tag>
      );
    }
    case "analogy":
      return (
        <aside className="relative rounded-xl border border-line bg-surface px-5 py-4 sm:px-6 sm:py-5">
          <div className="mb-2 flex items-baseline gap-2">
            <span className="text-xs font-medium text-muted">Аналогия</span>
            <span className="font-serif text-lg italic text-ink">{block.title}</span>
          </div>
          <div className="space-y-3">
            <Paragraphs text={block.text} className="text-[16px] leading-[1.7] text-ink-2" />
          </div>
        </aside>
      );
    case "why":
      return (
        <aside className="rounded-r-xl border-l-[3px] border-accent bg-accent-soft/60 px-5 py-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-accent">
            <HelpCircle size={16} aria-hidden /> Зачем это?
          </div>
          <div className="space-y-3">
            <Paragraphs text={block.text} className="text-[16px] leading-[1.7] text-ink-2" />
          </div>
        </aside>
      );
    case "callout": {
      const c = CALLOUT[block.tone];
      const Icon = c.icon;
      return (
        <aside className={`rounded-xl border px-5 py-4 ${c.cls}`}>
          {block.title ? (
            <div className={`mb-1.5 flex items-center gap-2 text-sm font-semibold ${c.title}`}>
              <Icon size={16} aria-hidden /> {block.title}
            </div>
          ) : null}
          <div className="space-y-2">
            <Paragraphs text={block.text} className="text-[15.5px] leading-[1.65] text-ink-2" />
          </div>
        </aside>
      );
    }
    case "code":
      return <CodeBlock code={block.code} lang={block.lang} file={block.file} caption={block.caption} />;
    case "diagram":
      return (
        <figure className="rounded-xl border border-line bg-surface p-4 sm:p-6">
          <Diagram id={block.id} />
          {block.caption ? (
            <figcaption className="mt-3 text-sm text-muted">
              <Rich text={block.caption} />
            </figcaption>
          ) : null}
        </figure>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-[15px]">
            <thead className="bg-surface-2 text-xs text-muted">
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} className="px-4 py-2.5 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className={`px-4 py-2.5 align-top leading-snug ${j === 0 ? "text-ink" : "text-ink-2"}`}>
                      <Rich text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "terms":
      return (
        <section className="rounded-xl border border-line bg-surface px-5 py-4">
          <div className="mb-3 text-xs font-medium text-muted">Словарик урока</div>
          <dl className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {block.items.map((t, i) => (
              <div key={i}>
                <dt className="text-[15px] font-medium text-ink">
                  {t.ru} <span className="font-mono text-xs font-normal text-muted">{t.en}</span>
                </dt>
                <dd className="text-sm leading-snug text-ink-2">
                  <Rich text={t.text} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      );
    case "quiz":
      return <Quiz quiz={block} lessonId={lessonId} />;
    case "read":
      return <ReadCards slugs={block.slugs} title={block.title} />;
    case "walkthrough":
      return <Walkthrough block={block} />;
    case "system":
      return (
        <figure className="rounded-xl border border-line bg-surface p-4 sm:p-6">
          <div className="mb-3 text-sm font-semibold text-ink">Где мы на карте Гильдии</div>
          <SystemMap mode={{ kind: "focus", focus: block.focus }} caption={block.caption} />
        </figure>
      );
    case "sequence":
      return <Sequence block={block} />;
    case "flow":
      return (
        <figure className="rounded-xl border border-line bg-surface p-4 sm:p-6">
          <FlowStepper steps={block.steps} />
        </figure>
      );
  }
}

export function LessonBlocks({ blocks, lessonId }: { blocks: Block[]; lessonId: string }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} lessonId={lessonId} />
      ))}
    </div>
  );
}
