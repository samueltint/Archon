import { useEffect } from "react";
import { type Creature } from "../types/creature";
import { Card, Divider, Typography } from "@mui/material";
import InitiativeItemInput from "./initiativeItemInput";

export default function CreatureInitiativeItem(props: {
  creature: Creature;
  onUpdate: (creature: Creature) => void;
  isActive: boolean;
}) {
  const { creature, onUpdate, isActive } = props;

  useEffect(() => {
    if (creature.currentHp == null) {
      onUpdate({
        ...creature,
        currentHp: creature.maxHp || 0,
      });
    }
  }, [creature, onUpdate]);

  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 0.8,
        p: 1,
        borderRadius: 1,
        backgroundColor: isActive ? "action.selected" : "background.paper",
      }}
      variant="outlined"
    >
      <InitiativeItemInput
        sx={{ width: "auto" }}
        value={
          (creature.initiative ?? 0) +
          (creature.initiativeModifier ?? 0)
        }
        size="sm"
        onChange={(e) => {
          const initiative = parseInt(e.target.value) || 0;
          const modifier = creature.initiativeModifier ?? 0;
          onUpdate({
            ...creature,
            initiative: initiative - modifier,
          });
        }}
      ></InitiativeItemInput>
      
      <Divider orientation="vertical" variant="middle" flexItem />

      <InitiativeItemInput
        size="sm"
        value={creature.name}
        sx={{ flex: 1 , fontWeight: "bold", color: creature.isPlayer ? "primary.main" : "text.primary" }}
        onChange={(e) => {
          onUpdate({ ...creature, name: e.target.value });
        }}
      ></InitiativeItemInput>

      <Divider orientation="vertical" variant="middle" flexItem />
      
      <InitiativeItemInput
        value={creature.currentHp ?? creature.maxHp ?? 0}
        size="sm"
        onChange={(e) => {
          onUpdate({
            ...creature,
            currentHp: parseInt(e.target.value) || 0,
          });
        }}
      ></InitiativeItemInput>

      <Typography>/</Typography>

      <InitiativeItemInput
        value={creature.maxHp}
        size="sm"
        onChange={(e) => {
          onUpdate({
            ...creature,
            maxHp: parseInt(e.target.value) || 0,
          });
        }}
      ></InitiativeItemInput>
      <Divider orientation="vertical" variant="middle" flexItem />

      <InitiativeItemInput
        value={creature.tempHp ?? 0}
        size="sm"
        sx={{ width: "auto" }}
        onChange={(e) => {
          onUpdate({
            ...creature,
            tempHp: parseInt(e.target.value) || 0,
          });
        }}
      ></InitiativeItemInput>

      <Divider orientation="vertical" variant="middle" flexItem />
      <InitiativeItemInput
        value={creature.AC ?? 0}
        size="sm"
        sx={{ width: "auto" }}
        onChange={(e) => {
          onUpdate({
            ...creature,
            AC: parseInt(e.target.value),
          });
        }}
      ></InitiativeItemInput>
    </Card>
  );
}
