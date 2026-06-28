import { Box } from "@mui/material";
import type { Creature } from "../../types/creature";

function Statblock(props: { creature: Creature }) {
  const { creature } = props;
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        height: "100%",
      }}
    >
      {JSON.stringify(creature, null, 2)}
    </Box>
  );
}

export default Statblock;
