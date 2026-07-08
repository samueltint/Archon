import { Divider, Stack, Typography } from "@mui/material";
import type { CreatureTraits } from "../../types/creature";
import ParsedEntry from "./ParsedEntry";

export default function EntryTable(props: {
  CreatureTraits: CreatureTraits;
  // onBlur: () => void;
  // onStatUpdate: (field: keyof CreatureStats, value: number) => void;
}) {
  const { CreatureTraits } = props;
  const titles = [
    "Actions",
    "Traits",
    "Bonus Actions",
    "Reactions",
    "Legendary Actions",
  ];
  return Object.entries(CreatureTraits).map(([key, value], i) => (
    <>
      <Stack key={key} sx={{ gap: 2 }}>
        <Typography variant="subtitle2">{titles[i]}</Typography>
        {value.map((entryBlock) => (
          <Typography
            key={entryBlock.name}
            variant="body2"
            sx={{ fontSize: ".9rem" }}
          >
            <Typography
              variant="inherit"
              component="span"
              sx={{ fontWeight: "900" }}
            >
              {entryBlock.name + " - "}
            </Typography>
            {ParsedEntry(entryBlock.entries ?? entryBlock.entry ?? "")}
          </Typography>
        ))}
      </Stack>
      <Divider sx={{ my: 2 }} />
    </>
  ));
}
