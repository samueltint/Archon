import {
  Container,
  Divider,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import OBR, { type Item } from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";
import { CreatureToItem, ItemToCreature } from "../../util/itemToCreature";
import { roles, type Creature } from "../../types/creature";

export default function CreatureSettingsDialog(props: {
  itemId: string | undefined;
}) {
  const { itemId } = props;

  const [item, setItem] = useState<Item>();
  const [creature, setCreature] = useState<Creature>();
  const [isLoading, setIsLoading] = useState(() => Boolean(itemId));

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
        <Typography>{itemId}</Typography>
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
      <Divider sx={{ my:1}}/>
      <Stack direction={"row"} sx={{ alignItems: "center", gap: 1 }}>
        <Typography sx={{ fontSize: "1rem" }}>{"Role: "}</Typography>
        <Select
          value={creature.role ?? "enemy"}
          size="small"
          sx={{ fontSize: "1rem" }}
          onChange={(e) => {
            setCreature({ ...creature, role: e.target.value });
          }}
        >
          {roles.map((role) => {
            return <MenuItem value={role}>{role}</MenuItem>;
          })}
        </Select>
      </Stack>
    </Container>
  );
}
