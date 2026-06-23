import { useState } from "react";
import { type Creature } from "../types/creature";
import { Card, TextField, Typography } from "@mui/material";
import { Input } from "./input";

interface Props extends Creature {
  id: number;
}

export default function CreatureInitiativeItem(props: Props) {
  const [currentHp, setCurrentHp] = useState(props.maxHp || 0);
  const [temporaryHp, setTemporaryHp] = useState(0);

  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1,
        borderRadius: 1,
      }}
      color={props.isPlayer ? "primary.main" : "grey.300"}
      variant="outlined"
    >
      <Input
        size="sm"
        sx={{ width: "auto" }}
        defaultValue={
          props.initiative !== undefined &&
          props.initiativeModifier !== undefined
            ? props.initiative + props.initiativeModifier
            : 0
        }
      ></Input>

      <Input
        size="sm"
        defaultValue={props.name}
        expand={true}
        sx={{ flex: 1 }}
        fontWeight={props.isPlayer ? "bold" : "normal"}
      ></Input>

      <Input defaultValue={currentHp} size="sm" sx={{ width: "auto" }}></Input>
      <Typography>/</Typography>
      <Input
        defaultValue={props.maxHp}
        size="sm"
        sx={{ width: "auto" }}
      ></Input>

      <Input
        defaultValue={temporaryHp}
        size="sm"
        sx={{ width: "auto" }}
      ></Input>
    </Card>
  );
}
