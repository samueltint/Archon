import {
  Checkbox,
  Container,
  Divider,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import OBR, { isImage, type Item } from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";
import { CreatureToItem, ItemToCreature } from "../../util/itemToCreature";
import { roles, type Creature } from "../../types/creature";
import PermissionsCard from "./permissionsCard";

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
      if (!isImage(loadedItem)) return;
      const loadedCreature = ItemToCreature(loadedItem);
      if (!loadedCreature) return;

      setItem(loadedItem);
      setCreature(loadedCreature);
      setIsLoading(false);
    });
  }, [itemId]);

  useEffect(() => {
    if (!item || !creature) return;
    void OBR.scene.items.updateItems([item], (items) => {
      if (!isImage(items[0])) return;
      CreatureToItem(items[0], creature, true);
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
    <Stack sx={{ p: 3, gap: 1 }}>
      <Typography>{item.name}</Typography>
      <Divider sx={{ my: 1 }} />
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
      <Stack direction={"row"} sx={{ alignItems: "center", gap: 1 }}>
        <Typography sx={{ fontSize: "1rem" }}>{"Display Name: "}</Typography>
        <Checkbox
          checked={creature.displayName}
          onChange={(e) => {
            const nextDisplayName = e.target.checked;
            setCreature({ ...creature, displayName: nextDisplayName });
          }}
        ></Checkbox>
      </Stack>
      <PermissionsCard creature={creature} setCreature={setCreature} />
    </Stack>
  );
}
