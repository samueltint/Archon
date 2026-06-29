import { Box, Button, ListItem, Stack, Typography } from "@mui/material";
import type { CreaturePreview } from "../../types/creature";

type StatblockPreviewProps = {
  creaturePreview: CreaturePreview;
  onClick: (creature: CreaturePreview) => void;
};

function StatblockSearchItem(props: StatblockPreviewProps) {
  const { creaturePreview, onClick } = props;

  return (
    <ListItem key={creaturePreview.slug} sx={{ px: 0 }}>
      <Button variant="outlined" sx={{ width: "100%", px: 0, py: 1 }}>
        <Stack
          direction="row"
          sx={{
            width: "100%",
            display: "flex",
            direction: "row",
            gap: 1,
            alignItems: "center",
            px: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              align="left"
              onClick={() => onClick(creaturePreview)}
            >
              {creaturePreview.name}
            </Typography>
          </Box>
          <Box sx={{ width: 80 }}>
            <Typography onClick={() => onClick(creaturePreview)}>
              CR: {creaturePreview.cr}
            </Typography>
          </Box>
          <Box sx={{ width: 80 }}>
            <Typography onClick={() => onClick(creaturePreview)}>
              HP: {creaturePreview.maxHp}
            </Typography>
          </Box>
        </Stack>
      </Button>
    </ListItem>
  );
}

export default StatblockSearchItem;
