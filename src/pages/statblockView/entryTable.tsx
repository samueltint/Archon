import { Divider, Stack, Typography } from "@mui/material";
import type { EntryBlock } from "../../types/5eToolsMonster";
import type { CreatureTraits } from "../../types/creature";
import ParseTags from "../../util/ParseTags";

export default function EntryTable(props: {
  CreatureTraits: CreatureTraits;
  // onBlur: () => void;
  // onStatUpdate: (field: keyof CreatureStats, value: number) => void;
}) {
  const { CreatureTraits } = props;
  const titles = [
    "Traits",
    "Actions",
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
              {entryBlock.name}
            </Typography>{" "}
            - {ParseTags(entryBlock.entries)}
          </Typography>
        ))}
      </Stack>
      <Divider sx={{ my: 2 }} />
    </>
  ));
}
