import OBR from "@owlbear-rodeo/sdk";

const ID = "com.initiative.archon";

export function setupContextMenu() {
  OBR.contextMenu.create({
    id: `${ID}/add`,
    icons: [
      {
        icon: "/plus.svg",
        label: "Track in Archon",
        filter: {
          every: [{ key: "layer", value: "CHARACTER" }],
        },
      },
    ],
    onClick(context) {
      OBR.scene.items.updateItems(context.items, (items) => {
        for (const item of items) {
          item.metadata[`${ID}/metadata`] = {
            id: item.id,
            name: item.name,
            initiative: 0,
            initiativeModifier: 0,
            currentHp: 0,
            maxHp: 0,
            tempHp: 0,
            AC: 0,
            isPlayer: false,
          };
        }
      });
    },
  });
  OBR.contextMenu.create({
    id: `${ID}/remove`,
    icons: [
      {
        icon: "/x.svg",
        label: "Untrack in Archon",
        filter: {
          every: [{ key: "layer", value: "CHARACTER" }],
        },
      },
    ],
    onClick(context) {
      OBR.scene.items.updateItems(context.items, (items) => {
        for (const item of items) {
          delete item.metadata[`${ID}/metadata`];
        }
      });
    },
  });
}
