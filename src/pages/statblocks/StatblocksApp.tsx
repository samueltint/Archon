import "../../index.css";
import StatblockSearchList from "./statblockSearchList";
import {
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";
import Statblock from "./statblock";
import type { Creature } from "../../types/creature";
import { ItemToCreature } from "../../util/itemToCreature";

function StatblocksApp() {
  // const [itemIds, setItemIds] = useState<string>();
  const [creatures, setCreatures] = useState<Creature[]>([]);

  const params = new URLSearchParams(window.location.search);
  const panel = params.get("panel") === "searchStatblocks" ? 0 : 1;

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
      <Stack direction="row" sx={{ alignItems: "center" }}>
        {panel == 0 ? (
          <Typography sx={{ flex: 1 }}>Set Statblock</Typography>
        ) : (
          <Typography sx={{ flex: 1 }}>View Statblock</Typography>
        )}

        <IconButton
          color="error"
          onClick={() => OBR.popover.close("archon/statblock")}
          size="small"
        >
          <Close sx={{ fontSize: "1.5rem" }} />
        </IconButton>
      </Stack>
      <Divider sx={{ my: 1 }} />
      {panel == 0 ? (
        <StatblockSearchList />
      ) : (
        <Statblock creature={creatures[0]} />
      )}
    </Container>
  );
}

export default StatblocksApp;
