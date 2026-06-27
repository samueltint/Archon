import "./index.css";
import StatblockSearchList from "./components/statblocks/statblockSearchList";
import {
  Box,
  Container,
  IconButton,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import OBR from "@owlbear-rodeo/sdk";
import { a11yProps } from "./util/a11yProps";
import CustomTabPanel from "./components/customTabPanel";
import { useState, type SyntheticEvent } from "react";

function StatblocksApp() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        py: 1,
      }}
    >
      <Stack sx={{ gap: 1 }}>
        <Stack direction="row" sx={{ py: 1, alignItems: "center" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="Statblock" {...a11yProps(0)} />
            <Tab label="Search Statblocks" {...a11yProps(1)} />
          </Tabs>
          <Box sx={{ flex: 1 }} />
          <IconButton
            color="error"
            onClick={() => OBR.popover.close("archon/statblock")}
          >
            <Close />
          </IconButton>
        </Stack>
      </Stack>

      <CustomTabPanel value={tabValue} index={0}>
        <StatblockSearchList />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        <StatblockSearchList />
      </CustomTabPanel>
    </Container>
  );
}

export default StatblocksApp;
