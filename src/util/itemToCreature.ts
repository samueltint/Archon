import { isImage, type Item } from "@owlbear-rodeo/sdk";
import type { Creature, CreatureMetadata } from "../types/creature";
import { getPluginId } from "./getPluginId";

function ItemToCreature(item: Item, initiative?: number) {
  const creatureMetadata = item.metadata[
    getPluginId("creature/metadata")
  ] as CreatureMetadata;
  const name = isImage(item) ? item.text.plainText || item.name : item.name;

  return {
    id: item.id,
    name: name,
    initiative: initiative ?? 0,
    initiativeModifier: creatureMetadata?.initiativeModifier ?? 0,
    isPlayer: creatureMetadata?.isPlayer,
    isVisible: item.visible,
    maxHp: creatureMetadata?.maxHp ?? 0,
    currentHp: creatureMetadata?.currentHp ?? creatureMetadata?.maxHp ?? 0,
    tempHp: creatureMetadata?.tempHp ?? 0,
    ac: creatureMetadata?.ac ?? 0,
    stats: creatureMetadata?.stats,
    allTraits: creatureMetadata?.allTraits,
  } as Creature;
}

function CreatureToItem(
  item: Item,
  creature: Creature,
  updateInitiative?: boolean,
  updateName?: boolean,
): void {
  if ((creature.currentHp ?? 0) > (creature.maxHp ?? 0)) {
    creature.currentHp = creature.maxHp;
  }

  if (updateName) {
    item.name = creature.name;
  }

  item.metadata[getPluginId("creature/metadata")] = {
    maxHp: creature.maxHp,
    currentHp: creature.currentHp,
    tempHp: creature.tempHp,
    ac: creature.ac,
    initiativeModifier: creature.initiativeModifier,
    stats: creature.stats,
    allTraits: creature.allTraits,
    isPlayer: creature.isPlayer,
  };

  if (updateInitiative) {
    item.metadata[getPluginId("initiative/metadata")] = {
      initiative: creature.initiative,
    };
  }
}

export { ItemToCreature, CreatureToItem };
