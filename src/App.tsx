import { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import type { Creature } from "./types/creature";
import CreatureInitiativeList from "./components/creatureInitiativeList";
import OBR from "@owlbear-rodeo/sdk";

function App() {
  const [sceneReady, setSceneReady] = useState(false);
  const [creatures, setCreatures] = useState<Creature[]>([]);

  useEffect(() => {
    OBR.scene.isReady().then(setSceneReady);
    return OBR.scene.onReadyChange(setSceneReady);
  }, []);

  if (!sceneReady) {
    return <Typography>Waiting</Typography>;
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        py: 4,
      }}
    >
      <CreatureInitiativeList
        creatures={creatures}
        setCreatures={setCreatures}
      />
    </Container>
  );
}

export default App;
