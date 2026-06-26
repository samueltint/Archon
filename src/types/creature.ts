export interface Creature extends CreatureMetadata {
  id: string | number;
  name: string;
  isVisible: boolean;
  initiative?: number;
}

export interface CreatureMetadata {
  isPlayer: boolean;
  currentHp?: number;
  maxHp?: number;
  tempHp?: number;
  AC?: number;
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
  lairActiosn?: string;
};
