import { Checkbox, Divider, Stack, Typography } from "@mui/material";
import type { SettingsMetadata } from "./creatureInitiativeList";

export default function SceneSettingsDialog(props: {
  settingsMetadata: SettingsMetadata | undefined;
  updateSettingsMetadata: (updates: Partial<SettingsMetadata>) => void;
}) {
  const { settingsMetadata, updateSettingsMetadata } = props;

  return (
    <Stack sx={{ p: 3, gap: 1 }}>
      <Typography>Settings</Typography>
      <Divider sx={{ my: 1 }} />
      <Stack direction={"row"} sx={{ alignItems: "center", gap: 1 }}>
        <Typography sx={{ fontSize: "1rem" }}>
          {"Show enemy health to players: "}
        </Typography>
        <Checkbox
          checked={settingsMetadata?.showEnemyHealth ?? false}
          onChange={(event) =>
            updateSettingsMetadata({ showEnemyHealth: event.target.checked })
          }
        />
      </Stack>
      <Stack direction={"row"} sx={{ alignItems: "center", gap: 1 }}>
        <Typography sx={{ fontSize: "1rem" }}>
          {"Display creature names by default: "}
        </Typography>
        <Checkbox
          checked={settingsMetadata?.displayNamesDefault ?? false}
          onChange={(event) =>
            updateSettingsMetadata({
              displayNamesDefault: event.target.checked,
            })
          }
        />
      </Stack>
    </Stack>
  );
}
