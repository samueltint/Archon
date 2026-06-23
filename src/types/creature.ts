export interface Creature {
  id: number;
  name: string;
  initiative?: number;
  initiativeModifier?: number;
  maxHp?: number;
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
}