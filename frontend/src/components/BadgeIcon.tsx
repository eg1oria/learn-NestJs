import {
  Brain,
  Bug,
  Castle,
  Database,
  DraftingCompass,
  FlaskConical,
  HeartPulse,
  KeyRound,
  Network,
  Plug,
  Radio,
  ScrollText,
  Send,
  ShieldCheck,
  Star,
  type LucideIcon,
} from "lucide-react";
import type { BadgeIcon as IconName } from "@/content/badges";

const ICONS: Record<IconName, LucideIcon> = {
  send: Send,
  compass: DraftingCompass,
  plug: Plug,
  scroll: ScrollText,
  heart: HeartPulse,
  star: Star,
  brain: Brain,
  bug: Bug,
  network: Network,
  shield: ShieldCheck,
  database: Database,
  key: KeyRound,
  flask: FlaskConical,
  radio: Radio,
  castle: Castle,
};

export function BadgeIcon({ name, size = 20 }: { name: IconName; size?: number }) {
  const Icon = ICONS[name];
  return <Icon size={size} strokeWidth={1.75} aria-hidden />;
}
