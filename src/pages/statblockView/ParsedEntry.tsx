/* eslint-disable no-fallthrough */

import { Stack, Typography } from "@mui/material";
import type { EntryBlock } from "../../types/5eToolsMonster";
import type { ReactNode } from "react";

type TagHandler = (
  tagName: string,
  args: string[],
) => { text: string; bold: boolean; italic: boolean };

const TAG_RE = /\{@(\w+)(?:\s+([^{}]*))?\}/g;

function renderEntryBlock(entryBlock: EntryBlock, key: React.Key): ReactNode {
  if (entryBlock.type === "list" && entryBlock.items?.length) {
    return (
      <Stack key={key} component="div" sx={{ pl: 2, gap: 0.5 }}>
        {entryBlock.items.map((item, index) =>
          renderEntryBlock(item, `${String(key)}-${index}`),
        )}
      </Stack>
    );
  }

  return (
    <Typography key={key} variant="body2" sx={{ fontSize: ".9rem" }}>
      <Typography variant="inherit" component="span" sx={{ fontWeight: "900" }}>
        {entryBlock.name + " - "}
      </Typography>
      {ParsedEntry(entryBlock.entries ?? entryBlock.entry ?? "")}
    </Typography>
  );
}

function parseTags(input: string, handler: TagHandler): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  // reset lastIndex since TAG_RE is a shared/global regex instance
  TAG_RE.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = TAG_RE.exec(input)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(input.slice(lastIndex, match.index));
    }

    const tagName = match[1];
    const argStr = match[2];
    const args = argStr ? argStr.split("|") : [];
    const { text, bold, italic } = handler(tagName, args);
    nodes.push(
      <Typography
        variant="inherit"
        component="span"
        sx={{
          fontWeight: bold ? "600" : "500",
          fontStyle: italic ? "italic" : "inherit",
        }}
      >
        {text}
      </Typography>,
    );

    lastIndex = TAG_RE.lastIndex;
  }

  if (lastIndex < input.length) {
    nodes.push(input.slice(lastIndex));
  }

  return nodes;
}

const handler: TagHandler = (tag, args) => {
  switch (tag.toLowerCase()) {
    // find-replace
    case "h":
      return { text: "Hit: ", bold: false, italic: true };
    case "trigger":
      return { text: "Trigger: ", bold: false, italic: true };
    case "response":
      return { text: "Response: ", bold: false, italic: true };
    case "hit":
      return { text: `+${args[0]}`, bold: true, italic: false };
    case "dc":
      return { text: `DC${args[0]}`, bold: true, italic: false };
    case "dice":
      return { text: `[${args[0]}]`, bold: false, italic: false };
    case "chance":
      return { text: `${args[0]}%`, bold: false, italic: false };
    case "actsave":
      return { text: args[0].toUpperCase(), bold: false, italic: false };
    case "actsavefailby":
      return {
        text: `If the target fails by ${args[0]} or more`,
        bold: false,
        italic: false,
      };

    case "i":
      return { text: args[0], bold: false, italic: true };

    // skillCheck animal_handling 5
    case "skillcheck":
      return { text: args[1], bold: false, italic: false };

    // multiple variations for melee or ranged attacks
    case "atk":
    case "atkr": {
      let range = "";
      let weapon = "";
      if (args[0].indexOf("m") >= 0) {
        if (args[0].indexOf("r") >= 0) {
          range = "melee or ranged ";
        } else {
          range = "melee ";
        }
      } else if (args[0].indexOf("r") >= 0) {
        range = "ranged ";
      }
      if (args[0].indexOf("w") >= 0) {
        weapon = "weapon ";
      } else if (args[0].indexOf("s") >= 0) {
        weapon = "spell ";
      }
      return { text: `${range + weapon}attack`, bold: false, italic: false };
    }

    // missing arg implies one failure level, int arg implies multiple
    case "actsavefail":
      switch (args[0]) {
        case "1":
          return { text: "On the first failure:", bold: false, italic: true };
        case "2":
          return { text: "On the second failure:", bold: false, italic: true };
        case "3":
          return { text: "On the third failure:", bold: false, italic: true };
        default:
          return { text: "On a failure:", bold: false, italic: true };
      }

    case "actSaveSuccess":
      return { text: "On a success:", bold: false, italic: true };

    // {@recharge 4} -> Recharge 4-6, missing arg implies recharge 6
    case "recharge":
      return {
        text: args[0] == undefined ? "(Recharge 6)" : `(Recharge ${args[0]}-6)`,
        bold: true,
        italic: false,
      };

    // Lycanthropes|MM|lycanthropy => rule name | source | display as
    case "condition":
    case "status":
    case "variantrule":
    case "hazard":
    case "skill":
    case "action":
    case "creature":
      return {
        text: args.length > 2 ? args[2] : args[0],
        bold: false,
        italic: true,
      };

    case "spell":
    case "item":
      return {
        text: args.length > 2 ? args[2] : args[0],
        bold: false,
        italic: true,
      };

    // Cover||3||total cover => quickref is double separated for some reason
    case "quickref":
      return {
        text: args.length > 4 ? args[4] : args[0],
        bold: false,
        italic: false,
      };

    // return argument as is
    case "damage":
    case "hityourspellattack":
    case "feat":
    case "disease":
    case "table":
    case "adventure":
    case "sense":
    case "note":
    // supernatural charm|rewards|type=charm => display text | table | filter
    case "filter":
    // Dungeon Master's Guide|dmg|8|madness
    case "book":
    default:
      return { text: args[0] ?? "", bold: false, italic: false };
  }
};

export default function ParsedEntry(
  entry: string | (string | EntryBlock)[],
): ReactNode[] {
  const input = typeof entry === "string" ? [entry] : entry;

  return input.map((item, index) =>
    typeof item === "string" ? (
      <span key={index}>{parseTags(item, handler)}</span>
    ) : (
      renderEntryBlock(item, `${item.name}-${index}`)
    ),
  );
}
