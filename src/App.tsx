import { useEffect, useState, type SyntheticEvent } from "react";
import { Container, Tab, Tabs, Typography } from "@mui/material";
import type { Creature } from "./types/creature";
import CreatureInitiativeList from "./components/initiative/creatureInitiativeList";
import OBR from "@owlbear-rodeo/sdk";
import StatblockSearchList from "./components/statblocks/statblockSearchList";
import { getPluginId } from "./util/getPluginId";
import { a11yProps } from "./util/a11yProps";
import CustomTabPanel from "./components/customTabPanel";

function App() {
  const [sceneReady, setSceneReady] = useState(false);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    OBR.scene.isReady().then(setSceneReady);
    return OBR.scene.onReadyChange(setSceneReady);
  }, []);

  useEffect(() => {
    if (sceneReady) {
      // initiative list
      OBR.contextMenu.create({
        icons: [
          {
            icon: "/plus.svg",
            label: "Add to Initiative",
            filter: {
              every: [
                { key: "layer", value: "CHARACTER", coordinator: "||" },
                { key: "layer", value: "MOUNT" },
                { key: "type", value: "IMAGE" },
                {
                  key: ["metadata", getPluginId("initiative/metadata")],
                  value: undefined,
                },
              ],
              permissions: ["UPDATE"],
            },
          },
          {
            icon: "/x.svg",
            label: "Remove from Initiative",
            filter: {
              every: [
                { key: "layer", value: "CHARACTER", coordinator: "||" },
                { key: "layer", value: "MOUNT" },
                { key: "type", value: "IMAGE" },
              ],
              permissions: ["UPDATE"],
            },
          },
        ],
        id: getPluginId("menu/toggleInitiative"),
        onClick(context) {
          OBR.scene.items.updateItems(context.items, (items) => {
            const addToInitiative = items.every(
              (item) =>
                item.metadata[getPluginId("initiative/metadata")] === undefined,
            );
            for (const item of items) {
              if (addToInitiative) {
                item.metadata[getPluginId("initiative/metadata")] = {
                  initiative: 0,
                };
              } else {
                delete item.metadata[getPluginId("initiative/metadata")];
              }
            }
          });
        },
      });

      // statblocks list

      OBR.contextMenu.create({
        icons: [
          {
            icon: "/user-pen.svg",
            label: "Set Statblock",
            filter: {
              every: [
                { key: "layer", value: "CHARACTER", coordinator: "||" },
                { key: "layer", value: "MOUNT" },
                { key: "type", value: "IMAGE" },
              ],
              permissions: ["UPDATE"],
            },
          },
        ],
        id: getPluginId("menu/setStatblock"),
        onClick(context) {
          const itemIds = context.items.map((item) => item.id).join(",");

          OBR.popover.open({
            id: "archon/statblock",
            url: `/statblocks.html?panel=search&itemIds=${encodeURIComponent(itemIds)}`,
            height: 500,
            width: 400,
            disableClickAway: true,
            anchorElementId: context.items[0].id,
            anchorPosition: { left: 200, top: 0 },
            transformOrigin: {
              horizontal: "RIGHT",
              vertical: "TOP",
            },
          });
        },
      });

      OBR.contextMenu.create({
        icons: [
          {
            icon: "/square-user-round.svg",
            label: "View Statblock",
            filter: {
              every: [
                { key: "layer", value: "CHARACTER", coordinator: "||" },
                { key: "layer", value: "MOUNT" },
                { key: "type", value: "IMAGE" },
                {
                  key: ["metadata", getPluginId("creature/metadata")],
                  value: undefined,
                  operator: "!=",
                },
              ],
              permissions: ["UPDATE"],
            },
          },
        ],
        id: getPluginId("menu/viewStatblock"),
        onClick(context) {
          const itemIds = context.items[0].id;

          OBR.popover.open({
            id: "archon/statblock",
            url: `/statblocks.html?panel=view&itemIds=${encodeURIComponent(itemIds)}`,
            height: 500,
            width: 400,
            disableClickAway: true,
            anchorElementId: context.items[0].id,
            anchorPosition: { left: 200, top: 0 },
            transformOrigin: {
              horizontal: "RIGHT",
              vertical: "TOP",
            },
          });
        },
      });
    }
  }, [sceneReady]);

  if (!sceneReady) {
    return (
      <Container sx={{ p: 4 }}>
        <Typography>Open a Scene to use Archon</Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        py: 1,
      }}
    >
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="basic tabs example"
      >
        <Tab label="Initiative" {...a11yProps(0)} />
        <Tab label="Statblocks" {...a11yProps(1)} />
      </Tabs>
      <CustomTabPanel value={tabValue} index={0}>
        <CreatureInitiativeList
          creatures={creatures}
          setCreatures={setCreatures}
        />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        <StatblockSearchList />
      </CustomTabPanel>
    </Container>
  );
}

export default App;
