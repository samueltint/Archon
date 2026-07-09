import { useEffect } from "react";
import { type Creature } from "../../types/creature";
import { Card, Divider, IconButton, Typography } from "@mui/material";
import ControlledInput from "../../components/controlledInput";
import { Settings } from "@mui/icons-material";

export default function CreatureInitiativeItem(props: {
  creature: Creature;
  onUpdate: (creature: Creature) => void;
  handleCreatureMetadataUpdate: (creature: Creature) => void;
  handleInitiativeMetadataUpdate: (creature: Creature[]) => void;
  isActive: boolean;
  handleSettingsClick: () => void;
  userRole: "GM" | "PLAYER";
  userId: string;
}) {
  const {
    creature,
    onUpdate,
    handleCreatureMetadataUpdate,
    handleInitiativeMetadataUpdate,
    isActive,
    handleSettingsClick,
    userRole,
    userId,
  } = props;

  const onBlur = () => {
    handleCreatureMetadataUpdate(creature);
  };

  const onInitiativeBlur = () => {
    handleInitiativeMetadataUpdate([creature]);
  };

  useEffect(() => {
    if (creature.currentHp == null) {
      onUpdate({
        ...creature,
        currentHp: creature.maxHp || 0,
      });
    }
  }, [creature, onUpdate]);

  const canWrite =
    userRole == "GM" ||
    creature?.permissions?.find(
      (perm) => perm.userId == userId && perm.permission == "write",
    ) != undefined;

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
        disabled={!canWrite}
        sx={{ width: "auto" }}
        value={(creature.initiative ?? 0) + (creature.initiativeModifier ?? 0)}
        size="xs"
        onBlur={onInitiativeBlur}
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
        disabled={!canWrite}
        size="sm"
        value={creature.name}
        sx={{
          flex: 1,
          fontWeight: "bold",
          color:
            creature.role == "player"
              ? "primary.main"
              : creature.role == "ally"
                ? "secondary.main"
                : "secondary.primary",
        }}
        onBlur={onBlur}
        onChange={(e) => {
          onUpdate({ ...creature, name: e.target.value });
        }}
      ></ControlledInput>

      <Divider orientation="vertical" variant="middle" flexItem />

      <ControlledInput
        disabled={!canWrite}
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

      <Typography sx={{ fontSize: "1rem" }}>/</Typography>

      <ControlledInput
        disabled={!canWrite}
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
        disabled={!canWrite}
        value={creature.tempHp ?? 0}
        size="xs"
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
        disabled={!canWrite}
        value={creature.ac ?? 0}
        size="xs"
        sx={{ width: "auto" }}
        onBlur={onBlur}
        onChange={(e) => {
          onUpdate({
            ...creature,
            ac: parseInt(e.target.value),
          });
        }}
      ></ControlledInput>
      {canWrite && (
        <>
          <Divider orientation="vertical" variant="middle" flexItem />
          <IconButton sx={{ p: "4px" }} onClick={handleSettingsClick}>
            <Settings sx={{ fontSize: 15 }} />
          </IconButton>
        </>
      )}
    </Card>
  );
}
