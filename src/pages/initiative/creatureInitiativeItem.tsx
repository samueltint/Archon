import { useEffect } from "react";
import { type Creature } from "../../types/creature";
import { Card, Divider, Typography } from "@mui/material";
import ControlledInput from "../../components/controlledInput";

export default function CreatureInitiativeItem(props: {
  creature: Creature;
  onUpdate: (creature: Creature) => void;
  onBlur: () => void;
  isActive: boolean;
}) {
  const { creature, onUpdate, onBlur, isActive } = props;

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
      <ControlledInput
        sx={{ width: "auto" }}
        value={(creature.initiative ?? 0) + (creature.initiativeModifier ?? 0)}
        size="sm"
        onBlur={onBlur}
        onChange={(e) => {
          const initiative = parseInt(e.target.value) || 0;
          const modifier = creature.initiativeModifier ?? 0;
          onUpdate({
            ...creature,
            initiative: initiative - modifier,
          });
        }}
      ></ControlledInput>

      <Divider orientation="vertical" variant="middle" flexItem />

      <ControlledInput
        size="sm"
        value={creature.name}
        sx={{
          flex: 1,
          fontWeight: "bold",
          color: creature.isPlayer ? "primary.main" : "text.primary",
        }}
        onBlur={onBlur}
        onChange={(e) => {
          onUpdate({ ...creature, name: e.target.value });
        }}
      ></ControlledInput>

      <Divider orientation="vertical" variant="middle" flexItem />

      <ControlledInput
        value={creature.currentHp ?? creature.maxHp ?? 0}
        size="sm"
        onBlur={onBlur}
        onChange={(e) => {
          onUpdate({
            ...creature,
            currentHp: parseInt(e.target.value) || 0,
          });
        }}
      ></ControlledInput>

      <Typography>/</Typography>

      <ControlledInput
        value={creature.maxHp}
        size="sm"
        onBlur={onBlur}
        onChange={(e) => {
          onUpdate({
            ...creature,
            maxHp: parseInt(e.target.value) || 0,
          });
        }}
      ></ControlledInput>
      <Divider orientation="vertical" variant="middle" flexItem />

      <ControlledInput
        value={creature.tempHp ?? 0}
        size="sm"
        sx={{ width: "auto" }}
        onBlur={onBlur}
        onChange={(e) => {
          onUpdate({
            ...creature,
            tempHp: parseInt(e.target.value) || 0,
          });
        }}
      ></ControlledInput>

      <Divider orientation="vertical" variant="middle" flexItem />
      <ControlledInput
        value={creature.ac ?? 0}
        size="sm"
        sx={{ width: "auto" }}
        onBlur={onBlur}
        onChange={(e) => {
          onUpdate({
            ...creature,
            ac: parseInt(e.target.value),
          });
        }}
      ></ControlledInput>
    </Card>
  );
}
