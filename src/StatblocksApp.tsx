import "./index.css";
import StatblockSearchList from "./components/statblocks/statblockSearchList";
import { Box, Container, IconButton, Stack, Tab, Tabs } from "@mui/material";
import { Close } from "@mui/icons-material";
import OBR, { type Item } from "@owlbear-rodeo/sdk";
import { a11yProps } from "./util/a11yProps";
import CustomTabPanel from "./components/customTabPanel";
import { useEffect, useState, type SyntheticEvent } from "react";
import Statblock from "./components/statblocks/statblock";
import type { Creature } from "./types/creature";
import ItemToCreature from "./util/itemToCreature";

const getInitialTab = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("panel") === "search" ? 1 : 0;
};

function StatblocksApp() {
  const [tabValue, setTabValue] = useState(getInitialTab);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // const [items, setItems] = useState<Item[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ids = params.get("itemIds");
    const itemIds = ids ? ids.split(",").map(decodeURIComponent) : [];

    if (itemIds.length === 0) return;

    // OBR.scene.items.getItems(itemIds).then(setItems);
    OBR.scene.items.getItems(itemIds).then((items) => {
      setCreatures(items.map(ItemToCreature));
    });
  }, []);

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
      <Stack sx={{ gap: 1 }}>
        <Stack direction="row" sx={{ alignItems: "center" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="Statblock" sx={{ fontSize: 14 }} {...a11yProps(0)} />
            <Tab
              label="Search Statblocks"
              sx={{ fontSize: 14 }}
              {...a11yProps(1)}
            />
          </Tabs>
          <Box sx={{ flex: 1 }} />
          <IconButton
            color="error"
            onClick={() => OBR.popover.close("archon/statblock")}
          >
            <Close />
          </IconButton>
        </Stack>
      </Stack>

      <CustomTabPanel value={tabValue} index={0}>
        <Statblock creature={creatures[0]} />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        <StatblockSearchList/>
      </CustomTabPanel>
    </Container>
  );
}

export default StatblocksApp;
