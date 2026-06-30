import { Box, Button, ListItem, Stack, Typography } from "@mui/material";
import type { Creature } from "../../types/creature";

type StatblockPreviewProps = {
  creature: Creature;
  onClick: (creature: Creature) => void;
};

function StatblockSearchItem(props: StatblockPreviewProps) {
  const { creature, onClick } = props;

  return (
    <ListItem key={creature.slug} sx={{ px: 0 }}>
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
              onClick={() => onClick(creature)}
            >
              {creature.name}
            </Typography>
          </Box>
          <Box sx={{ width: 80 }}>
            <Typography onClick={() => onClick(creature)}>
              CR: {creature.cr}
            </Typography>
          </Box>
          <Box sx={{ width: 80 }}>
            <Typography onClick={() => onClick(creature)}>
              HP: {creature.maxHp}
            </Typography>
          </Box>
        </Stack>
      </Button>
    </ListItem>
  );
}

export default StatblockSearchItem;
