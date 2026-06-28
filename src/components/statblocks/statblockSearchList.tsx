import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  List,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
// bestiaryJson is loaded lazily on first search to avoid blocking initial render
import { useState } from "react";
import { Search } from "@mui/icons-material";
import type { CreaturePreview } from "../../types/creature";
import query from "../../util/query";
import type { Monster } from "../../types/5eToolsMonster";
import StatblockPreview from "./statblockPreview";
import OBR, { isImage } from "@owlbear-rodeo/sdk";
import { getPluginId } from "../../util/getPluginId";
import statToModifier from "../../util/statToModifier";

// Cache the bestiary after first load so subsequent searches are instant
let bestiaryCache: unknown = null;

function monsterToCreaturePreview(monster: Monster) {
  return {
    name: monster.name,
    slug: monster.slug,
    maxHp: monster.hp.average,
    ac: parseSimpleValue(monster.ac),
    cr: parseSimpleValue(monster.cr),
    stats: {
      str: monster.str,
      dex: monster.dex,
      con: monster.con,
      int: monster.int,
      wis: monster.wis,
      cha: monster.cha,
    },
  };
}

function parseSimpleValue(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (Array.isArray(value)) {
    return parseSimpleValue(value[0]);
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const direct = obj.value ?? obj.ac ?? obj.cr;
    return parseSimpleValue(direct);
  }
  return 0;
}

function StatblockSearchList() {
  const [searchValue, setSearchValue] = useState("");
  const [filteredCreatures, setFilteredCreatures] = useState<CreaturePreview[]>(
    [],
  );
  const [creature, setCreature] = useState<CreaturePreview>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  async function searchNames() {
    setFilteredCreatures([]);
    setIsLoading(true);

    // Lazy-load the bestiary only when first search is triggered
    if (!bestiaryCache) {
      const mod = await import("../../util/bestiaryTiny.json");
      bestiaryCache = mod.default;
    }

    const output = query<Monster[]>(
      bestiaryCache,
      `filter(regex(.name, "${searchValue}", "i")) `,
    );
    const newCreatures = output.map((c: Monster) => {
      return monsterToCreaturePreview(c);
    });
    setFilteredCreatures(newCreatures ?? []);
    setIsLoading(false);
  }

  async function handlePreviewClick(creature: CreaturePreview) {
    const ids = await OBR.player.getSelection();
    if (!ids) {
      OBR.notification.show("Select some items to assign statblocks.", "ERROR");
      return;
    }
    setSelectedIds(ids);
    setCreature(creature);
    setConfirmDialogOpen(true);
  }

  function handleConfirm() {
    if (!selectedIds || !creature) {
      OBR.notification.show("Failed to set items.", "ERROR");
      return;
    }

    OBR.scene.items.updateItems(isImage, (items) => {
      let i = 0;
      for (const item of items) {
        if (selectedIds.includes(item.id)) {
          item.metadata[getPluginId("creature/metadata")] = {
            maxHp: creature.maxHp,
            ac: creature.ac,
            stats: creature.stats,
            cr: creature.cr,
            initiativeModifier: statToModifier(creature?.stats?.dex ?? 10),
          };
          i++;
        }
      }
      OBR.notification.show(`Updated ${i} Tokens`);
    });
  }

  function handleClose() {
    setConfirmDialogOpen(false);
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        height: "100%",
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "center",
          py: 1,
          gap: 1,
        }}
      >
        <TextField
          size="small"
          sx={{ flex: 1 }}
          value={searchValue}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              searchNames();
            }
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchValue(event.target.value);
          }}
        />
        <IconButton onClick={searchNames}>
          <Search />
        </IconButton>
      </Stack>
      {/* <Typography>{selectedIds?.length}</Typography> */}
      <Typography variant="subtitle1">
        {filteredCreatures.length} Results
      </Typography>
      {/* <Typography>{JSON.stringify(creature)}</Typography> */}
      <List
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          mt: 2,
        }}
      >
        {isLoading ? (
          <CircularProgress sx={{ mt: 4 }} />
        ) : (
          filteredCreatures.map((c: CreaturePreview) => {
            return (
              <StatblockPreview
                creaturePreview={c}
                onClick={handlePreviewClick}
              />
            );
          })
        )}
      </List>
      <Dialog open={confirmDialogOpen}>
        <Card sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography>
                Assign the {creature?.name ?? "ERROR"} statblock to{" "}
                {selectedIds?.length ?? "ERROR"} token
                {(selectedIds?.length ?? 0) != 1 && "s"}
              </Typography>
            </Grid>
            <Grid
              size={6}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button variant="outlined" color="error" onClick={handleClose}>
                Cancel
              </Button>
            </Grid>
            <Grid
              size={6}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  handleConfirm();
                  handleClose();
                }}
              >
                Confirm
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Dialog>
    </Box>
  );
}
export default StatblockSearchList;
