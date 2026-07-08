import type { EntryBlock } from "./5eToolsMonster";

export interface Creature extends CreatureMetadata {
  id?: string;
  slug?: string;
  name: string;
  isVisible: boolean;
  initiative?: number;
}

export interface CreatureMetadata {
  role: "enemy" | "player" | "ally";
  cr?: number;
  currentHp?: number;
  maxHp?: number;
  tempHp?: number;
  ac?: number;
  initiativeModifier?: number;
  stats?: CreatureStats;
  allTraits?: CreatureTraits;
}

export type CreatureStats = {
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
};

export type CreatureTraits = {
  traits?: EntryBlock[];
  actions?: EntryBlock[];
  bonusActions?: EntryBlock[];
  reactions?: EntryBlock[];
  legendaryActions?: EntryBlock[];
};
