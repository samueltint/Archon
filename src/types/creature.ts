export interface Creature extends CreatureMetadata {
  id: string | number;
  name: string;
  isVisible: boolean;
  initiative?: number;
}

export type CreatureMetadata = {
  isPlayer: boolean;
  currentHp?: number;
  maxHp?: number;
  tempHp?: number;
  AC?: number;
  initiativeModifier?: number;
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
};
