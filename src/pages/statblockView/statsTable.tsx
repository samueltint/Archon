import { Grid, Stack, Typography } from "@mui/material";
import type { CreatureStats } from "../../types/creature";
import ControlledInput from "../../components/controlledInput";
import { statToModStr } from "../../util/statToModifier";

export default function StatsTable(props: {
  stats: CreatureStats;
  onBlur: () => void;
  onStatUpdate: (field: keyof CreatureStats, value: number) => void;
}) {
  const { stats, onBlur, onStatUpdate } = props;
  return Object.entries(stats).map(([key, value]) => (
    <Grid
      key={key}
      size={2}
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Stack sx={{ alignItems: "center", gap: 0.5 }}>
        <Typography variant="body2">{key.toLocaleUpperCase()}</Typography>
        <ControlledInput
          value={value}
          size="sm"
          onBlur={onBlur}
          onChange={(e) =>
            onStatUpdate(key as keyof CreatureStats, Number(e.target.value))
          }
        />

        <Typography sx={{ fontSize: 16 }}>
          ({statToModStr(value as number)})
        </Typography>
      </Stack>
    </Grid>
  ));
}
