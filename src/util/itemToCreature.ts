import { isImage, type Image, type Item } from "@owlbear-rodeo/sdk";
import type { Creature, CreatureMetadata } from "../types/creature";
import { getPluginId } from "./getPluginId";

function ImageToCreature(item: Item, initiative?: number): Creature | undefined {
  if (!isImage(item)) return undefined;

  const creatureMetadata = item.metadata[
    getPluginId("creature/metadata")
  ] as CreatureMetadata;
  const fallbackName = item.text?.plainText || item.name;
  const name = creatureMetadata?.name || fallbackName;

  return {
    id: item.id,
    name: name,
    initiative: initiative ?? 0,
    initiativeModifier: creatureMetadata?.initiativeModifier ?? 0,
    role: creatureMetadata?.role,
    isVisible: item.visible,
    maxHp: creatureMetadata?.maxHp ?? 0,
    currentHp: creatureMetadata?.currentHp ?? creatureMetadata?.maxHp ?? 0,
    tempHp: creatureMetadata?.tempHp ?? 0,
    ac: creatureMetadata?.ac ?? 0,
    stats: creatureMetadata?.stats,
    allTraits: creatureMetadata?.allTraits,
    permissions: creatureMetadata?.permissions,
    displayName: creatureMetadata?.displayName ?? false,
  } as Creature;
}

function CreatureToImage(
  image: Image,
  creature: Creature,
  updateName?: boolean,
): void {
  if ((creature.currentHp ?? 0) > (creature.maxHp ?? 0)) {
    creature.currentHp = creature.maxHp;
  }

  if (updateName) {
    image.name = creature.name;
    const nextText = creature.displayName ? creature.name : "";
    image.text = {
      ...image.text,
      type: "PLAIN",
      plainText: nextText,
      richText: creature.displayName
        ? [
            {
              type: "paragraph",
              children: [{ text: nextText }],
            },
          ]
        : [],
    };
  }

  image.metadata[getPluginId("creature/metadata")] = {
    name: creature.name,
    maxHp: creature.maxHp,
    currentHp: creature.currentHp,
    tempHp: creature.tempHp,
    ac: creature.ac,
    initiativeModifier: creature.initiativeModifier,
    stats: creature.stats,
    allTraits: creature.allTraits,
    role: creature.role,
    permissions: creature.permissions,
    displayName: creature.displayName,
  };
}

export { ImageToCreature as ItemToCreature, CreatureToImage as CreatureToItem };
