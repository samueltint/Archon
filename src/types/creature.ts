export interface CreaturePreview {
  name: string;
  slug: string;
  maxHp?: number;
  ac?: number;
  stats?: CreatureStats;
  cr?: number;
}

export interface Creature extends CreatureMetadata {
  id: string | number;
  slug?: string;
  name: string;
  isVisible: boolean;
  initiative?: number;
}

export interface CreatureMetadata {
  isPlayer: boolean;
  cr?: number;
  currentHp?: number;
  maxHp?: number;
  tempHp?: number;
  ac?: number;
  initiativeModifier?: number;
  stats?: CreatureStats;
  actions?: CreatureActions;
}

export type CreatureStats = {
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
};

export type CreatureActions = {
  actions?: string;
  bonusActions?: string;
  reactions?: string;
  legendaryActions?: string;
  mythicActions?: string;
  lairActions?: string;
};
