import { course } from "@/content/course";
import { moduleProgress, type Progress } from "@/lib/progress";
import { SystemMap } from "./SystemMap";

/** Карта Гильдии, раскрашенная по реальному прогрессу из progress.json. */
export function ProgressSystemMap({ progress }: { progress: Progress }) {
  const { doneModules, currentModule } = moduleProgress(progress, course);
  return <SystemMap mode={{ kind: "progress", doneModules, currentModule }} />;
}
