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
    isPlayer: false,
    isVisible: item.visible,
    maxHp: creatureMetadata?.maxHp ?? 0,
    currentHp: creatureMetadata?.currentHp ?? creatureMetadata?.maxHp ?? 0,
    tempHp: creatureMetadata?.tempHp ?? 0,
    ac: creatureMetadata?.ac ?? 0,
  } as Creature;
}

export default ItemToCreature;
