"use client";

import { Check, RotateCcw, X } from "lucide-react";
import type { QuizBlock } from "@/content/types";
import { CodeBlock } from "./CodeBlock";
import { Rich } from "./Rich";
import { usePersistentState } from "./usePersistentState";

const KIND_LABEL: Record<QuizBlock["kind"], string> = {
  predict: "Угадай, что вернёт сервер",
  bug: "Где ошибка?",
  concept: "Проверь себя",
};

export function Quiz({ quiz, lessonId }: { quiz: QuizBlock; lessonId: string }) {
  const [picked, setPicked] = usePersistentState<number | null>(
    `quiz:${lessonId}:${quiz.id}`,
    null,
  );
  const answered = picked !== null;
  const right = picked === quiz.correct;

  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-accent">{KIND_LABEL[quiz.kind]}</span>
        {answered ? (
          <button
            type="button"
            onClick={() => setPicked(null)}
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink"
          >
            <RotateCcw size={12} aria-hidden /> Заново
          </button>
        ) : null}
      </div>
      <p className="mb-4 font-medium leading-relaxed text-ink">
        <Rich text={quiz.question} />
      </p>
      {quiz.code ? (
        <div className="mb-4">
          <CodeBlock code={quiz.code.code} lang={quiz.code.lang} compact />
        </div>
      ) : null}
      <div className="grid gap-2">
        {quiz.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = i === quiz.correct;
          let tone = "border-line hover:border-line-strong hover:bg-surface-2";
          if (answered && isCorrect) tone = "border-ok/60 bg-ok-soft";
          else if (answered && isPicked) tone = "border-bad/60 bg-bad-soft";
          else if (answered) tone = "border-line opacity-60";
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => setPicked(i)}
              className={`flex items-start gap-3 rounded-lg border px-3.5 py-2.5 text-left text-[15px] leading-snug text-ink-2 transition-colors disabled:cursor-default ${tone}`}
            >
              <span
                className={`mt-px inline-flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium ${
                  answered && isCorrect
                    ? "border-ok bg-ok text-surface"
                    : answered && isPicked
                      ? "border-bad bg-bad text-surface"
                      : "border-line-strong text-muted"
                }`}
              >
                {answered && isCorrect ? (
                  <Check size={12} strokeWidth={3} aria-hidden />
                ) : answered && isPicked ? (
                  <X size={12} strokeWidth={3} aria-hidden />
                ) : (
                  String.fromCharCode(1040 + i)
                )}
              </span>
              <span>
                <Rich text={opt} />
              </span>
            </button>
          );
        })}
      </div>
      {answered ? (
        <div
          role="status"
          className={`mt-4 rounded-lg px-4 py-3 text-[15px] leading-relaxed ${
            right ? "bg-ok-soft text-ink" : "bg-warn-soft text-ink"
          }`}
        >
          <span className={`font-semibold ${right ? "text-ok" : "text-warn"}`}>
            {right ? "Верно. " : "Не совсем. "}
          </span>
          <Rich text={quiz.explain} />
        </div>
      ) : null}
    </section>
  );
}
