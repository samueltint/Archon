
export interface Monster {
  name: string;
  source: string;
  page: number;
  slug: string;

  size: string[];
  type: string | MonsterType;
  alignment: string[];

  ac: number[];

  hp: {
    average: number;
    formula: string;
  };

  speed: Record<string, number>;

  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;

  save?: Record<string, string>;
  skill?: Record<string, string>;

  senses?: string[];
  passive?: number;

  resist?: string[];
  immune?: string[];
  vulnerable?: string[];
  conditionImmune?: string[];

  languages?: string[];
  cr: string;

  spellcasting?: Spellcasting[];

  trait?: EntryBlock[];
  action?: EntryBlock[];
  bonus?: EntryBlock[];
  reaction?: EntryBlock[];
  legendary?: EntryBlock[];

  environment?: string[];

  traitTags?: string[];
  senseTags?: string[];
  actionTags?: string[];
  languageTags?: string[];
  damageTags?: string[];
  damageTagsSpell?: string[];
  spellcastingTags?: string[];
  miscTags?: string[];

  conditionInflict?: string[];
  conditionInflictSpell?: string[];

  savingThrowForced?: string[];
  savingThrowForcedSpell?: string[];

  hasToken?: boolean;
  hasFluff?: boolean;
  hasFluffImages?: boolean;
}

export interface MonsterType {
  type: string;
  tags?: string[];
}

export interface EntryBlock {
  name: string;
  entries: string[];
}

export interface Spellcasting {
  name: string;
  type: string;

  headerEntries?: string[];

  will?: string[];

  daily?: Record<string, string[]>;

  ability?: string;
  displayAs?: string;
}