import type { ReactNode } from "react";

/** Рамка для схемы: на узких экранах SVG можно прокрутить по горизонтали. */
export function SvgScroller({
  children,
  minWidth = 640,
}: {
  children: ReactNode;
  minWidth?: number;
}) {
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <div style={{ minWidth }}>{children}</div>
    </div>
  );
}
