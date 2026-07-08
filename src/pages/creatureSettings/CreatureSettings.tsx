import { Container, FormControlLabel, Switch, Typography } from "@mui/material";
import OBR, { type Item } from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";
import { CreatureToItem, ItemToCreature } from "../../util/itemToCreature";
import type { Creature } from "../../types/creature";

export default function CreatureSettings() {
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("itemIds");

  const [item, setItem] = useState<Item>();
  const [creature, setCreature] = useState<Creature>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!itemId) return;

    void OBR.scene.items.getItems([itemId]).then(([loadedItem]) => {
      const loadedCreature = ItemToCreature(loadedItem);

      setItem(loadedItem);
      setCreature(loadedCreature);
      setIsLoading(false);
    });
  }, [itemId]);

  useEffect(() => {
    if (!item || !creature) return;
    void OBR.scene.items.updateItems([item], (items) => {
      CreatureToItem(items[0], creature);
    });
  }, [item, creature]);

  if (isLoading) {
    return (
      <Container sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!item || !creature) {
    return (
      <Container sx={{ p: 3 }}>
        <Typography>Failed to load creature</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ p: 3 }}>
      <Typography>{item.name}</Typography>
      <FormControlLabel
        sx={{ fontSize: ".5rem" }}
        control={
          <Switch
            checked={creature.isPlayer}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCreature({ ...creature, isPlayer: event.target.checked });
            }}
          />
        }
        label={<Typography sx={{fontSize: "1rem"}}>Mark as Player</Typography>}
      />
    </Container>
  );
}
