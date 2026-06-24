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
  Typography,
  IconButton,
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import type { Creature } from "./types/creature";
import {
  Favorite,
  PriorityHigh,
  Redo,
  Shield,
  Undo,
} from "@mui/icons-material";
import TempHpIcon from "./components/TempHpIcon";
import Dialog from "@mui/material/Dialog";

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
  const [currentInitiative, setCurrentInitiative] = useState(50);
  const [roundCount, setRoundCount] = useState(1);

  const getCreatureInitiative = (creature: Creature | undefined) => {
    if (!creature) {
      return 0;
    } else {
      return (creature.initiative ?? 0) + (creature.initiativeModifier ?? 0);
    }
  };

  const sortCreatures = (creatures: Creature[]) => {
    return [...creatures].sort((a, b) => {
      const diff = getCreatureInitiative(b) - getCreatureInitiative(a);
      if (diff == 0) {
        return (b.initiativeModifier ?? 0) - (a.initiativeModifier ?? 0);
      } else {
        return diff;
      }
    });
  };

  const handleInitiativeBack = () => {
    const sortedCreatures = sortCreatures(creatures);
    console.log(currentInitiative);
    console.log(sortedCreatures.map((c) => getCreatureInitiative(c)));
    const firstCreature = sortedCreatures[0];
    const lastCreature = sortedCreatures[sortedCreatures.length - 1];
    if (currentInitiative >= getCreatureInitiative(firstCreature)) {
      setCurrentInitiative(getCreatureInitiative(lastCreature));
      setRoundCount(Math.max(roundCount - 1, 0));
    } else {
      for (let i = sortedCreatures.length - 1; i >= 0; i--) {
        const c = sortedCreatures[i];
        if (getCreatureInitiative(c) > currentInitiative) {
          setCurrentInitiative(getCreatureInitiative(c));
          break;
        }
      }
    }
  };

  const handleInitiativeNext = () => {
    const sortedCreatures = sortCreatures(creatures);
    console.log(currentInitiative);
    console.log(sortedCreatures.map((c) => getCreatureInitiative(c)));
    const firstCreature = sortedCreatures[0];
    const lastCreature = sortedCreatures[sortedCreatures.length - 1];
    if (currentInitiative <= getCreatureInitiative(lastCreature)) {
      setCurrentInitiative(getCreatureInitiative(firstCreature));
      setRoundCount(roundCount + 1);
    } else {
      for (let i = 0; i < sortedCreatures.length; i++) {
        const c = sortedCreatures[i];
        if (getCreatureInitiative(c) < currentInitiative) {
          setCurrentInitiative(getCreatureInitiative(c));
          break;
        }
      }
    }
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
      {/* Creatures List */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 0,
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
          {/* Table Header */}
          <ListItem key="header" sx={{ padding: 0 }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                p: 1,
                borderRadius: 1,
              }}
            >
              <Box
                sx={{
                  width: "40px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <PriorityHigh fontSize="small" color="primary" />
              </Box>
              <Divider orientation="vertical" flexItem />

              <Typography
                variant="subtitle2"
                color="textSecondary"
                sx={{ flex: 1 }}
              >
                Creature
              </Typography>
              <Divider orientation="vertical" flexItem />

              <Box
                sx={{
                  width: "100px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Favorite fontSize="small" color="primary" />
              </Box>

              <Divider orientation="vertical" flexItem />
              <Box
                sx={{
                  width: "40px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TempHpIcon fontSize="small" color="primary" />
              </Box>

              <Divider orientation="vertical" flexItem />
              <Box
                sx={{
                  width: "40px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Shield fontSize="small" color="primary" />
              </Box>
            </Box>
          </ListItem>

          {sortCreatures(creatures).map((creature) => (
            <ListItem key={creature.id} sx={{ padding: 0 }}>
              <CreatureInitiativeItem
                creature={creature}
                onUpdate={(updatedCreature) => {
                  if (currentInitiative == getCreatureInitiative(creature)) {
                    setCurrentInitiative(
                      getCreatureInitiative(updatedCreature),
                    );
                  }
                  setCreatures((prev) =>
                    prev.map((c) =>
                      c.id === updatedCreature.id ? updatedCreature : c,
                    ),
                  );
                }}
                isActive={currentInitiative == getCreatureInitiative(creature)}
              />
            </ListItem>
          ))}
        </List>
      </Box>
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
            setCurrentInitiative(
              getCreatureInitiative(sortCreatures(newCreatures).at(0)),
            );
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
                setCurrentInitiative(50);
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
