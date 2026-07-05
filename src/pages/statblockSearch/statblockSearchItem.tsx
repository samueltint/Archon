import {
  Box,
  Button,
  Divider,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import type { Creature } from "../../types/creature";

type StatblockPreviewProps = {
  creature: Creature;
  onClick: (creature: Creature) => void;
};

function StatblockSearchItem(props: StatblockPreviewProps) {
  const { creature, onClick } = props;

  return (
    <ListItem key={creature.slug} sx={{ p: 0 }}>
      <Button variant="outlined" sx={{ width: "100%", px: 0, py: .5, borderRadius: .4 }}>
        <Stack
          direction="row"
          sx={{
            width: "100%",
            display: "flex",
            direction: "row",
            gap: 1,
            alignItems: "center",
            px: 1,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{ fontSize: ".8rem" }}
              align="left"
              onClick={() => onClick(creature)}
            >
              {creature.name}
            </Typography>
          </Box>
          <Divider flexItem orientation="vertical" />
          <Box sx={{ width: 40 }}>
            <Typography
              sx={{ fontSize: ".8rem" }}
              onClick={() => onClick(creature)}
            >
              CR: {creature.cr}
            </Typography>
          </Box>
          <Divider flexItem orientation="vertical" />
          <Box sx={{ width: 50 }}>
            <Typography
              sx={{ fontSize: ".8rem" }}
              onClick={() => onClick(creature)}
            >
              HP: {creature.maxHp}
            </Typography>
          </Box>
        </Stack>
      </Button>
    </ListItem>
  );
}

export default StatblockSearchItem;
