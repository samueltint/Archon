import { Box, Card, ListItem, Stack, Typography } from "@mui/material";
import type { CreaturePreview } from "../../types/creature";

type StatblockPreviewProps = {
  creaturePreview: CreaturePreview;
  onClick: (creature: CreaturePreview) => void;
};

function StatblockPreview(props: StatblockPreviewProps) {
  const { creaturePreview, onClick } = props;

  return (
    <ListItem key={creaturePreview.slug} sx={{ px: 0 }}>
      <Card sx={{ width: "100%", p: 1 }}>
        <Stack
          direction="row"
          sx={{
            display: "flex",
            direction: "row",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              onClick={() => onClick(creaturePreview)}
            >
              {creaturePreview.name}
            </Typography>
          </Box>
          <Box sx={{ width: 80 }}>
            <Typography onClick={() => onClick(creaturePreview)}>
              HP: {creaturePreview.maxHp}
            </Typography>{" "}
          </Box>
          <Box sx={{ width: 80 }}>
            <Typography onClick={() => onClick(creaturePreview)}>
              CR: {creaturePreview.cr}
            </Typography>{" "}
          </Box>
        </Stack>
      </Card>
    </ListItem>
  );
}

export default StatblockPreview;
