import { useState } from "react";
import {
  Button,
  Container,
  Box,
  Stack,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import type { Creature } from "./types/creature";
import { Redo, Undo } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import CreatureInitiativeList from "./components/creatureInitiativeList";

function App() {
  // Clear dialog controls
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Creatures list
  const [creatures, setCreatures] = useState<Creature[]>([
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
      initiative: 11,
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

  // initiative state
  const [activeCreatureId, setActiveCreatureId] = useState<Creature["id"] | null>(null);
  const [roundCount, setRoundCount] = useState(1);

  const getCreatureInitiative = (creature: Creature | undefined) => {
    if (!creature) {
      return 0;
    } else {
      return (creature.initiative ?? 0) + (creature.initiativeModifier ?? 0);
    }
  };

  const sortCreatures = (creatures: Creature[]) => {
    return [...creatures].sort(compareCreatureInitiatives);
  };

  const handleInitiativeBack = () => {
    const sortedCreatures = sortCreatures(creatures);
    if (!sortedCreatures.length) {
      return;
    }

    const activeIndex = sortedCreatures.findIndex(
      (creature) => creature.id === activeCreatureId,
    );
    const nextIndex =
      activeIndex === -1 ? sortedCreatures.length - 1 : (activeIndex - 1 + sortedCreatures.length) % sortedCreatures.length;

    setActiveCreatureId(sortedCreatures[nextIndex].id);
    setRoundCount(
      Math.max(roundCount - (activeIndex === -1 || nextIndex > activeIndex ? 1 : 0), 0),
    );
  };

  const handleInitiativeNext = () => {
    const sortedCreatures = sortCreatures(creatures);
    if (!sortedCreatures.length) {
      return;
    }

    const activeIndex = sortedCreatures.findIndex(
      (creature) => creature.id === activeCreatureId,
    );
    const nextIndex =
      activeIndex === -1 ? 0 : (activeIndex + 1) % sortedCreatures.length;

    setActiveCreatureId(sortedCreatures[nextIndex].id);
    setRoundCount(roundCount + (activeIndex === -1 || nextIndex <= activeIndex ? 1 : 0));
  };
  
  const compareCreatureInitiatives = (a: Creature, b: Creature) => {
    const diff = getCreatureInitiative(b) - getCreatureInitiative(a);
    if (diff == 0) {
      return (b.initiativeModifier ?? 0) - (a.initiativeModifier ?? 0);
    }
    return diff;
  };

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
        sortCreatures={sortCreatures}
        compareCreatureInitiatives={compareCreatureInitiatives}
        getCreatureInitiative={getCreatureInitiative}
        activeCreatureId={activeCreatureId}
      />
      <Box sx={{ flex: 1 }} />

      <Divider sx={{ my: 2 }} />
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          justifyContent: "center",
          flexWrap: "wrap",
          paddingBottom: 2,
        }}
      >
        <IconButton onClick={handleInitiativeBack}>
          <Undo />
        </IconButton>
        <Typography variant="subtitle1" sx={{ alignSelf: "center" }}>
          Round {roundCount}
        </Typography>
        <IconButton onClick={handleInitiativeNext}>
          <Redo />
        </IconButton>
      </Stack>
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
            const newCreatures = creatures.map((creature) => ({
              ...creature,
              initiative: creature.isPlayer
                ? creature.initiative
                : Math.floor(Math.random() * 20) + 1,
            }));
            setCreatures(newCreatures);
            setRoundCount(1);
            setActiveCreatureId(sortCreatures(newCreatures).at(0)?.id ?? null);
          }}
        >
          Roll Initiative
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DoNotDisturbIcon />}
          onClick={handleClickOpen}
        >
          Clear
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <Typography variant="subtitle1" sx={{ p: 3 }}>
            Are you sure you want to clear all creatures?
          </Typography>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              justifyContent: "center",
              flexWrap: "wrap",
              padding: "0 0 10px",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setCreatures([]);
                setRoundCount(1);
                setActiveCreatureId(null);
              }}
            >
              Clear
            </Button>
            <Button variant="outlined" color="primary" onClick={handleClose}>
              Cancel
            </Button>
          </Stack>
        </Dialog>
      </Stack>
    </Container>
  );
}

export default App;
