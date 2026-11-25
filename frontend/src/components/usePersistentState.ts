"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Маленькое хранилище поверх localStorage с подпиской (между вкладками тоже). */
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function usePersistentState<T>(key: string, fallback: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  let value: T = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      // Битое значение в localStorage — просто игнорируем его.
    }
  }

  const setValue = useCallback(
    (next: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      listeners.forEach((l) => l());
    },
    [key],
  );

  return [value, setValue] as const;
}
