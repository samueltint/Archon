import { useEffect, useState, type SyntheticEvent } from "react";
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import type { Creature } from "./types/creature";
import CreatureInitiativeList from "./components/creatureInitiativeList";
import OBR from "@owlbear-rodeo/sdk";
import StatblockList from "./components/statblockList";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{
        flex: 1,
        display: value === index ? "flex" : "none",
        flexDirection: "column",
        minHeight: 0,
      }}
      {...other}
    >
      <Box
        sx={{
          py: 3,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {children}
      </Box>
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function App() {
  const [sceneReady, setSceneReady] = useState(false);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    OBR.scene.isReady().then(setSceneReady);
    return OBR.scene.onReadyChange(setSceneReady);
  }, []);

  if (!sceneReady) {
    return <Typography>Open a Scene to use Archon</Typography>;
  }

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
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="basic tabs example"
      >
        <Tab label="Initiative" {...a11yProps(0)} />
        <Tab label="Statblocks" {...a11yProps(1)} />
      </Tabs>
      <CustomTabPanel value={tabValue} index={0}>
        <CreatureInitiativeList
          creatures={creatures}
          setCreatures={setCreatures}
        />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        <StatblockList />
      </CustomTabPanel>
    </Container>
  );
}

export default App;
