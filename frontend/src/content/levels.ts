export type Level = { title: string; rank: string; minXp: number };

/** Junior → Middle → Senior → Архитектор, у первых трёх по три ступени. */
export const levels: Level[] = [
  { title: "Junior", rank: "I", minXp: 0 },
  { title: "Junior", rank: "II", minXp: 300 },
  { title: "Junior", rank: "III", minXp: 700 },
  { title: "Middle", rank: "I", minXp: 1200 },
  { title: "Middle", rank: "II", minXp: 1800 },
  { title: "Middle", rank: "III", minXp: 2500 },
  { title: "Senior", rank: "I", minXp: 3300 },
  { title: "Senior", rank: "II", minXp: 4200 },
  { title: "Senior", rank: "III", minXp: 5200 },
  { title: "Архитектор", rank: "", minXp: 6500 },
];

export function levelFor(xp: number) {
  let index = 0;
  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].minXp) index = i;
  }
  const current = levels[index];
  const next = levels[index + 1] ?? null;
  const progress = next
    ? (xp - current.minXp) / (next.minXp - current.minXp)
    : 1;
  return { current, next, progress: Math.min(1, Math.max(0, progress)) };
}

export function levelName(level: Level) {
  return level.rank ? `${level.title} ${level.rank}` : level.title;
}
