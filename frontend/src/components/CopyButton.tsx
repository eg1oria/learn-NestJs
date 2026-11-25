"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

export function CopyButton({
  text,
  label,
  copiedLabel = "Скопировано",
  variant = "ghost",
}: {
  text: string;
  label?: string;
  copiedLabel?: string;
  variant?: "ghost" | "primary";
}) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    if (await copyText(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const Icon = copied ? Check : Copy;

  if (variant === "primary") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-strong"
      >
        <Icon size={16} strokeWidth={2} aria-hidden />
        {copied ? copiedLabel : label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label ?? "Скопировать"}
      title={label ?? "Скопировать"}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-surface-2 hover:text-ink"
    >
      <Icon size={14} strokeWidth={2} aria-hidden />
      {label ? <span>{copied ? copiedLabel : label}</span> : null}
    </button>
  );
}
