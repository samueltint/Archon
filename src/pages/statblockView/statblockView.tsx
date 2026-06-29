import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import type { Creature, CreatureStats } from "../../types/creature";
import { statToModStr } from "../../util/statToModifier";
import ControlledInput from "../../components/controlledInput";
import { useEffect, useState } from "react";
import { ItemToCreature } from "../../util/itemToCreature";
import OBR from "@owlbear-rodeo/sdk";

function StatElements(props: { stats: CreatureStats }) {
  // return JSON.stringify(Object.entries(props.stats));
  return Object.entries(props.stats).map(([key, value]) => (
    <Grid
      key={key}
      size={2}
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="body2">{key.toLocaleUpperCase()}</Typography>
      <ControlledInput value={value} size="xs" />

      <Typography sx={{ fontSize: 16 }}>
        ({statToModStr(value as number)}){" "}
      </Typography>
    </Grid>
  ));
}

function StatblockView() {
  const [creature, setCreature] = useState<Creature>();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ids = params.get("itemIds");
    const itemIds = ids ? ids.split(",").map(decodeURIComponent) : [];

    if (itemIds.length === 0) return;

    // OBR.scene.items.getItems(itemIds).then(setItems);
    OBR.scene.items.getItems(itemIds).then((items) => {
      setCreature(items.map(ItemToCreature)[0]);
    });
  }, []);
  // const handleSaveMetadata = () => {
  //   OBR.scene.items.updateItems(isImage, (items) => {
  //     for (const item of items) {
  //       const creature = creatures.find((creature) => creature.id === item.id);

  //       if (creature == undefined) continue;

  //       CreatureToItem(item, creature, true);
  //     }
  //   });
  // };

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
            <ControlledInput value={creature.name} size="xl" textAlign="left" />
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
                <ControlledInput value={creature.currentHp} size="md" />
                <Typography>/</Typography>
                <ControlledInput value={creature.maxHp} size="md" />
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
              <ControlledInput value={creature.ac} size="md" />
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
              <ControlledInput value={creature.initiativeModifier} size="md" />
            </Stack>
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
          {creature.stats && <StatElements stats={creature.stats} />}
          <Grid size={12}>
            <Divider />
          </Grid>
        </Grid>
      )}
      {JSON.stringify(creature, null, 2)}
    </Box>
  );
}

export default StatblockView;
