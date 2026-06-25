import { Favorite, PriorityHigh, Shield } from "@mui/icons-material";
import { Box, Divider, List, ListItem, Typography } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import TempHpIcon from "./TempHpIcon";
import CreatureInitiativeItem from "./creatureInitiativeItem";
import type { Creature } from "../types/creature";

type CreatureInitiativeListProps = {
  creatures: Creature[];
  setCreatures: Dispatch<SetStateAction<Creature[]>>;
  sortCreatures: (creatures: Creature[]) => Creature[];
  compareCreatureInitiatives: (a: Creature, b: Creature) => number;
  getCreatureInitiative: (creature: Creature) => number;
  activeCreatureId: Creature["id"] | null;
};

function CreatureInitiativeList(props: CreatureInitiativeListProps) {
  const activeCreature = props.creatures.find(
    (creature) => creature.id === props.activeCreatureId,
  );

  return (
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
        <Divider />
        {props.creatures.length ? (
          props.sortCreatures(props.creatures).map((creature) => (
            <ListItem key={creature.id} sx={{ padding: 0 }}>
              <CreatureInitiativeItem
                creature={creature}
                onUpdate={(updatedCreature) => {
                  props.setCreatures((prev) =>
                    prev.map((c) =>
                      c.id === updatedCreature.id ? updatedCreature : c,
                    ),
                  );
                }}
                isActive={activeCreature?.id === creature.id}
              />
            </ListItem>
          ))
        ) : (
          <Typography align="center">No Creatures Added Yet</Typography>
        )}
      </List>
    </Box>
  );
}

export default CreatureInitiativeList;
