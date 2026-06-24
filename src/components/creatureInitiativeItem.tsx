import { type Creature } from "../types/creature";
import { Card, Divider, Typography } from "@mui/material";
import InitiativeItemInput from "./initiativeItemInput";

export default function CreatureInitiativeItem(props: {
  creature: Creature;
  onUpdate: (creature: Creature) => void;
  isActive: boolean;
}) {
  if (!props.creature.currentHp) {
    props.onUpdate({
      ...props.creature,
      currentHp: props.creature.maxHp || 0,
    });
  }

  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 0.8,
        p: 1,
        borderRadius: 1,
        backgroundColor: props.isActive ? "action.selected" : "background.paper",
      }}
      variant="outlined"
    >
      <InitiativeItemInput
        sx={{ width: "auto" }}
        value={
          (props.creature.initiative ?? 0) +
          (props.creature.initiativeModifier ?? 0)
        }
        size="sm"
        onChange={(e) => {
          const initiative = parseInt(e.target.value) || 0;
          const modifier = props.creature.initiativeModifier ?? 0;
          props.onUpdate({
            ...props.creature,
            initiative: initiative - modifier,
          });
        }}
      ></InitiativeItemInput>
      
      <Divider orientation="vertical" variant="middle" flexItem />

      <InitiativeItemInput
        size="sm"
        value={props.creature.name}
        sx={{ flex: 1 , fontWeight: "bold", color: props.creature.isPlayer ? "primary.main" : "text.primary" }}
        onChange={(e) => {
          props.onUpdate({ ...props.creature, name: e.target.value });
        }}
      ></InitiativeItemInput>

      <Divider orientation="vertical" variant="middle" flexItem />
      
      <InitiativeItemInput
        value={props.creature.currentHp}
        size="sm"
        onChange={(e) => {
          props.onUpdate({
            ...props.creature,
            currentHp: parseInt(e.target.value) || 0,
          });
        }}
      ></InitiativeItemInput>

      <Typography>/</Typography>

      <InitiativeItemInput
        value={props.creature.maxHp}
        size="sm"
        onChange={(e) => {
          props.onUpdate({
            ...props.creature,
            maxHp: parseInt(e.target.value) || 0,
          });
        }}
      ></InitiativeItemInput>
      <Divider orientation="vertical" variant="middle" flexItem />

      <InitiativeItemInput
        value={props.creature.tempHp ?? 0}
        size="sm"
        sx={{ width: "auto" }}
        onChange={(e) => {
          props.onUpdate({
            ...props.creature,
            tempHp: parseInt(e.target.value) || 0,
          });
        }}
      ></InitiativeItemInput>

      <Divider orientation="vertical" variant="middle" flexItem />
      <InitiativeItemInput
        value={props.creature.AC ?? 0}
        size="sm"
        sx={{ width: "auto" }}
        onChange={(e) => {
          props.onUpdate({
            ...props.creature,
            AC: parseInt(e.target.value),
          });
        }}
      ></InitiativeItemInput>
    </Card>
  );
}
