export interface Creature {
  id: number;
  name: string;
  isPlayer: boolean;
  initiative?: number;
  initiativeModifier?: number;
  currentHp?: number;
  maxHp?: number;
  tempHp?: number;
  AC?: number;
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
}
