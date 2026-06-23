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
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import type { Creature } from "./types/creature";
import { Favorite, PriorityHigh, Shield } from "@mui/icons-material";
import TempHpIcon from "./components/TempHpIcon";
import Dialog from "@mui/material/Dialog";

function App() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
                <PriorityHigh fontSize="small" />
              </Box>
              <Divider orientation="vertical" flexItem />

              <Typography
                variant="caption"
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
                <Favorite fontSize="small" />
              </Box>

              <Divider orientation="vertical" flexItem />
              <Box
                sx={{
                  width: "40px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TempHpIcon fontSize="small" />
              </Box>

              <Divider orientation="vertical" flexItem />
              <Box
                sx={{
                  width: "40px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Shield fontSize="small" />
              </Box>
            </Box>
          </ListItem>

          {creatures
            .sort(
              (a, b) =>
                (b.initiative ?? 0) +
                (b.initiativeModifier ?? 0) -
                (a.initiative ?? 0) -
                (a.initiativeModifier ?? 0),
            )
            .map((creature) => (
              <ListItem key={creature.id} sx={{ padding: 0 }}>
                <CreatureInitiativeItem
                  creature={creature}
                  onUpdate={(updatedCreature) => {
                    setCreatures((prev) =>
                      prev.map((c) =>
                        c.id === updatedCreature.id ? updatedCreature : c,
                      ),
                    );
                  }}
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
                  : Math.floor(Math.random() * 20) + 1,
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
              onClick={() => setCreatures([])}
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
