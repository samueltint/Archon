import OBR from "@owlbear-rodeo/sdk";

const ID = "com.tutorial.initiative-tracker";

export function setupContextMenu() {
  OBR.contextMenu.create({
    id: `${ID}/context-menu`,
    icons: [
      {
        icon: "/add.svg",
        label: "Add to Initiative",
        filter: {
          every: [{ key: "layer", value: "CHARACTER" }],
        },
      },
    ],
    onClick() {},
  });
}