import {
  Card,
  Divider,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import type { Creature, Permission } from "../../types/creature";
import OBR, { isImage, type Player } from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";
import { CreatureToItem } from "../../util/itemToCreature";

export default function PermissionsCard(props: {
  creature: Creature;
  setCreature: React.Dispatch<React.SetStateAction<Creature | undefined>>;
}) {
  const { creature, setCreature } = props;
  const [players, setPlayers] = useState<Player[]>();

  useEffect(() => {
    let isMounted = true;

    OBR.onReady(async () => {
      const players = await OBR.party.getPlayers();
      if (isMounted) {
        setPlayers(players);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Divider sx={{ my: 1 }} />
      <Typography sx={{ flex: 1 }}>Permissions</Typography>

      {players?.map((player) => {
        const permission = creature?.permissions?.find(
          (perm) => perm.userId == player.id,
        );
        return (
          <PermissionItem
            userId={player.id}
            name={player.name}
            permission={permission}
            creature={creature}
            setCreature={setCreature}
          />
        );
      })}
    </>
  );
}

function PermissionItem(props: {
  userId: string;
  name: string;
  permission: Permission | undefined;
  setCreature: React.Dispatch<React.SetStateAction<Creature | undefined>>;
  creature: Creature;
}) {
  const { userId, name, permission, setCreature, creature } = props;

  const persistCreature = (nextCreature: Creature) => {
    if (!nextCreature.id) return;

    void OBR.scene.items.updateItems([nextCreature.id], (items) => {
      const item = items[0];
      if (!item || !isImage(item)) return;

      CreatureToItem(item, nextCreature);
    });
  };

  return (
    <Card sx={{ py: 1, px: 2 }}>
      <Stack direction="row" sx={{ alignItems: "center" }}>
        <Typography sx={{ flex: 1 }}>{name}</Typography>
        <Select
          value={permission?.permission ?? "none"}
          size="small"
          sx={{ fontSize: "1rem" }}
          onChange={(e) => {
            const otherPerms = [
              ...(creature.permissions?.filter(
                (perm) => perm.userId != userId,
              ) ?? []),
            ];
            const newPerm = e.target.value;
            const nextCreature = {
              ...creature,
              permissions: [
                ...otherPerms,
                {
                  userId: userId,
                  permission: newPerm == "none" ? undefined : newPerm,
                },
              ],
            };

            setCreature(nextCreature);
            persistCreature(nextCreature);
          }}
        >
          <MenuItem value={"none"}>None</MenuItem>
          <MenuItem value={"read"}>View</MenuItem>
          <MenuItem value={"write"}>Edit</MenuItem>
        </Select>
      </Stack>
    </Card>
  );
}
