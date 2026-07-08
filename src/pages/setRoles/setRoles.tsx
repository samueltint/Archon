import { Box, Button, Container, Stack, Typography } from "@mui/material";
import {
  roles,
  type CreatureMetadata,
  type CreatureRole,
} from "../../types/creature";
import OBR, { isImage } from "@owlbear-rodeo/sdk";
import { getPluginId } from "../../util/getPluginId";

export default function SetRoles() {
  async function handleConfirm(role: CreatureRole) {
    const ids = await OBR.player.getSelection();
    if (!ids) {
      OBR.notification.show("Select some items to assign roles.", "ERROR");
      return;
    }
    OBR.scene.items.updateItems(isImage, (items) => {
      for (const item of items) {
        if (ids.includes(item.id)) {
          const metadataPath = getPluginId("creature/metadata");
          const metadata = item.metadata[metadataPath] as
            | CreatureMetadata
            | undefined;

          item.metadata[metadataPath] = {
            ...metadata,
            role,
          };
        }
      }
    });
  }

  return (
    <Stack sx={{ gap: 1, p: 2 }}>
      <Typography>Set Roles</Typography>

      <Box sx={{ flex: 1 }} />
      {roles.map((role) => (
        <Button
          sx={{ fontSize: ".8rem" }}
          variant="outlined"
          size="small"
          onClick={() => handleConfirm(role)}
        >
          Set to {role}
        </Button>
      ))}
    </Stack>
  );
}
