import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import type { Creature, CreatureStats } from "../../types/creature";
import ControlledInput from "../../components/controlledInput";
import { useEffect, useState } from "react";
import { CreatureToItem, ItemToCreature } from "../../util/itemToCreature";
import OBR, { isImage } from "@owlbear-rodeo/sdk";
import StatsTable from "./statsTable";
import EntryTable from "./entryTable";

function StatblockView(props: { userRole: "GM" | "PLAYER"; userId: string }) {
  const { userRole, userId } = props;
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
  const canRead =
    userRole == "GM" ||
    creature?.permissions?.find((perm) => perm.userId == userId) != undefined;
  const canWrite =
    userRole == "GM" ||
    creature?.permissions?.find(
      (perm) => perm.userId == userId && perm.permission == "write",
    ) != undefined;

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
    if (!itemId || !creature || !canWrite) return;
    OBR.scene.items.updateItems(isImage, (items) => {
      for (const item of items) {
        if (item.id == itemId) {
          CreatureToItem(item, creature, true);
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
              disabled={!canWrite}
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

          {canRead ? (
            <>
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                size={5}
              >
                <Stack
                  spacing={1}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography>HP</Typography>
                  <Stack direction="row" spacing={1}>
                    <ControlledInput
                      disabled={!canWrite}
                      value={creature.currentHp}
                      size="md"
                      onChange={(e) =>
                        onUpdate("currentHp", Number(e.target.value))
                      }
                      onBlur={handleSaveMetadata}
                    />
                    <Typography>/</Typography>
                    <ControlledInput
                      disabled={!canWrite}
                      value={creature.maxHp}
                      size="md"
                      onChange={(e) =>
                        onUpdate("maxHp", Number(e.target.value))
                      }
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
                <Stack
                  spacing={1}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography>AC</Typography>
                  <ControlledInput
                    disabled={!canWrite}
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
                <Stack
                  spacing={1}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography>Initiative</Typography>
                  <ControlledInput
                    disabled={!canWrite}
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
                  canWrite={canWrite}
                />
              )}
              <Grid size={12}>
                <Divider />
              </Grid>
              {creature.allTraits && (
                <Grid size={12}>
                  <EntryTable CreatureTraits={creature.allTraits} />
                </Grid>
              )}
            </>
          ) : (
            <Grid size={12}>
              <Typography>
                This creature's stats are hidden from you.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}

export default StatblockView;
