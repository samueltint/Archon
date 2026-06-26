import { Box, Typography } from "@mui/material";

type StatblockListProps = {};

function StatblockList(props: StatblockListProps) {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 0,
        gap: 1,
      }}
    >
      <Typography>Saved Statblocks</Typography>
    </Box>
  );
}

export default StatblockList;
