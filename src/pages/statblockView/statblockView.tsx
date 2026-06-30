import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import type { Creature, CreatureStats } from "../../types/creature";
import ControlledInput from "../../components/controlledInput";
import { useEffect, useState } from "react";
import { CreatureToItem, ItemToCreature } from "../../util/itemToCreature";
import OBR, { isImage } from "@owlbear-rodeo/sdk";
import StatsTable from "./statsTable";
import EntryTable from "./entryTable";

function StatblockView() {
  const [state, setState] = useState<{ creature?: Creature; itemId?: string }>(
    {},
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idString = params.get("itemIds");
    const itemIds = idString ? idString.split(",").map(decodeURIComponent) : [];

    if (itemIds.length === 0) return;

    OBR.scene.items.getItems(itemIds).then((items) => {
      setState({ itemId: itemIds[0], creature: items.map(ItemToCreature)[0] });
    });
  }, []);

  const { creature, itemId } = state;

  const onUpdate = <K extends keyof Creature>(field: K, value: Creature[K]) => {
    setState((prev) =>
      prev.creature
        ? { ...prev, creature: { ...prev.creature, [field]: value } }
        : prev,
    );
  };

  const onStatUpdate = (field: keyof CreatureStats, value: number) => {
    const newStats = { ...creature?.stats };
    newStats[field] = value;
    setState((prev) =>
      prev.creature
        ? { ...prev, creature: { ...prev.creature, stats: newStats } }
        : prev,
    );
  };

  const handleSaveMetadata = () => {
    if (!itemId || !creature) return;
    OBR.scene.items.updateItems(isImage, (items) => {
      for (const item of items) {
        if (item.id == itemId) {
          CreatureToItem(item, creature, false, true);
        }
      }
    });
  };

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
      {!creature ? (
        <Typography>No Creature Data Available</Typography>
      ) : (
        <Grid container spacing={1}>
          <Grid size={12}>
            <ControlledInput
              value={creature.name}
              size="xl"
              textAlign="left"
              onChange={(e) => onUpdate("name", e.target.value)}
              onBlur={handleSaveMetadata}
            />
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            size={5}
          >
            <Stack spacing={1} sx={{ display: "flex", alignItems: "center" }}>
              <Typography>HP</Typography>
              <Stack direction="row" spacing={1}>
                <ControlledInput
                  value={creature.currentHp}
                  size="md"
                  onChange={(e) =>
                    onUpdate("currentHp", Number(e.target.value))
                  }
                  onBlur={handleSaveMetadata}
                />
                <Typography>/</Typography>
                <ControlledInput
                  value={creature.maxHp}
                  size="md"
                  onChange={(e) => onUpdate("maxHp", Number(e.target.value))}
                  onBlur={handleSaveMetadata}
                />
              </Stack>
            </Stack>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            size={3}
          >
            <Stack spacing={1} sx={{ display: "flex", alignItems: "center" }}>
              <Typography>AC</Typography>
              <ControlledInput
                value={creature.ac}
                size="md"
                onChange={(e) => onUpdate("ac", Number(e.target.value))}
                onBlur={handleSaveMetadata}
              />
            </Stack>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            size={4}
          >
            <Stack spacing={1} sx={{ display: "flex", alignItems: "center" }}>
              <Typography>Initiative</Typography>
              <ControlledInput
                value={creature.initiativeModifier}
                size="md"
                onChange={(e) =>
                  onUpdate("initiativeModifier", Number(e.target.value))
                }
                onBlur={handleSaveMetadata}
              />
            </Stack>
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
          {creature.stats && (
            <StatsTable
              stats={creature.stats}
              onBlur={handleSaveMetadata}
              onStatUpdate={onStatUpdate}
            />
          )}
          <Grid size={12}>
            <Divider />
          </Grid>
          {creature.allTraits && (
            <>
              <Grid size={12}>
                <EntryTable CreatureTraits={creature.allTraits} />
              </Grid>
              <Grid size={12}>
                <Divider />
              </Grid>
            </>
          )}
        </Grid>
      )}
      <Box sx={{ py: 2 }}>{JSON.stringify(creature, null, 2)}</Box>
    </Box>
  );
}

export default StatblockView;
