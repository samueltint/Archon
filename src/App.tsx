import { useState } from "react";
import CreatureInitiativeItem from "./components/creatureInitiativeItem";
import {
  Button,
  Container,
  Box,
  Stack,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";

function App() {
  const [creatures, setCreatures] = useState([
    {
      id: 1,
      name: "Goblin",
      isPlayer: false,
      initiative: 12,
      initiativeModifier: 2,
      maxHp: 7,
    },
    {
      id: 2,
      name: "Orc",
      isPlayer: false,
      initiative: 10,
      initiativeModifier: 1,
      maxHp: 15,
    },
    {
      id: 3,
      name: "Dragon",
      isPlayer: false,
      initiative: 18,
      initiativeModifier: 4,
      maxHp: 200,
    },
    {
      id: 4,
      name: "Player",
      isPlayer: true,
      initiative: 18,
      initiativeModifier: 4,
      maxHp: 200,
    },
  ]);

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
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
        }}
      >
        <List
          sx={{
            width: "100%",
            gap: 1.5,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {creatures
            .sort(
              (a, b) =>
                b.initiative +
                b.initiativeModifier -
                a.initiative -
                a.initiativeModifier,
            )
            .map((creature) => (
              <ListItem key={creature.id} sx={{ padding: 0 }}>
                <CreatureInitiativeItem {...creature} />
              </ListItem>
            ))}
        </List>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<CasinoIcon />}
          onClick={() => {
            setCreatures((prev) =>
              prev.map((creature) => ({
                ...creature,
                initiative: creature.isPlayer
                  ? creature.initiative
                  : Math.floor(Math.random() * 20) +
                    1 +
                    (creature.initiativeModifier || 0),
              })),
            );
          }}
        >
          Roll Initiative
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DoNotDisturbIcon />}
          onClick={() => setCreatures([])}
        >
          Clear
        </Button>
      </Stack>
    </Container>
  );
}

export default App;
