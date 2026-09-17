import {
  Container,
  Divider,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import OBR, { isImage, type Item } from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";
import { CreatureToImage, ImageToCreature } from "../../util/ImageToCreature";
import { roles, type Creature } from "../../types/creature";
import PermissionsCard from "./permissionsCard";

export default function CreatureSettingsDialog(props: {
  itemId: string | undefined;
  displayNameDefault: boolean | undefined;
}) {
  const { itemId, displayNameDefault } = props;

  const [item, setItem] = useState<Item>();
  const [creature, setCreature] = useState<Creature>();
  const [isLoading, setIsLoading] = useState(() => Boolean(itemId));

  useEffect(() => {
    if (!itemId) return;

    void OBR.scene.items.getItems([itemId]).then(([loadedItem]) => {
      if (!isImage(loadedItem)) return;
      const loadedCreature = ImageToCreature(loadedItem);
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
      CreatureToImage(items[0], creature, true, displayNameDefault ?? false);
    });
  }, [item, creature]);

  const updateCreature = (updates: Partial<Creature>) => {
    setCreature((currentCreature) =>
      currentCreature ? { ...currentCreature, ...updates } : currentCreature,
    );
  };

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
          onChange={(event) => updateCreature({ role: event.target.value })}
        >
          {roles.map((role) => {
            return (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            );
          })}
        </Select>
      </Stack>
      <Stack direction={"row"} sx={{ alignItems: "center", gap: 1 }}>
        <Typography sx={{ fontSize: "1rem" }}>{"Display Name: "}</Typography>
        <Select
          value={creature.displayName}
          size="small"
          sx={{ fontSize: "1rem" }}
          onChange={(event) =>
            updateCreature({ displayName: event.target.value })
          }
        >
          <MenuItem key={"true"} value={"true"}>
            True
          </MenuItem>
          <MenuItem key={"false"} value={"false"}>
            False
          </MenuItem>
          <MenuItem key={"default"} value={"default"}>
            Default
          </MenuItem>
        </Select>
      </Stack>
      <PermissionsCard creature={creature} setCreature={setCreature} />
    </Stack>
  );
}
