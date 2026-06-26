import {
  Box,
  IconButton,
  List,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import bestiaryJson from "../../util/bestiary.json";
import { useState } from "react";
import { Search } from "@mui/icons-material";
import type { CreaturePreview } from "../../types/creature";
import query from "../../util/query";
import type { Monster } from "../../types/5eToolsMonster";
import StatblockPreview from "./statblockPreview";

function monsterToCreaturePreview(monster: Monster) {
  return {
    name: monster.name,
    slug: monster.slug,
    maxHp: monster.hp.average,
    ac: parseSimpleValue(monster.ac),
    cr: parseSimpleValue(monster.cr),
    stats: {
      str: monster.str,
      dex: monster.dex,
      con: monster.con,
      int: monster.int,
      wis: monster.wis,
      cha: monster.cha,
    },
  };
}

function parseSimpleValue(value: unknown): number {
  if (value == null) return 0;

  if (typeof value === "number") return value;

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (Array.isArray(value)) {
    return parseSimpleValue(value[0]);
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;

    const direct = obj.value ?? obj.ac ?? obj.cr;

    return parseSimpleValue(direct);
  }

  return 0;
}
function StatblockList() {
  const [searchValue, setSearchValue] = useState("");
  const [filteredCreatures, setFilteredCreatures] = useState<CreaturePreview[]>(
    [],
  );

  const [creature, setCreature] = useState<CreaturePreview>();

  function searchNames() {
    setFilteredCreatures([]);
    const output = query<Monster[]>(
      bestiaryJson,
      `filter(regex(.name, "${searchValue}", "i")) `,
    );

    const newCreatures = output.map((c: Monster) => {
      return monsterToCreaturePreview(c);
    });

    setFilteredCreatures(newCreatures ?? []);
  }

  function handleClick(creature: CreaturePreview) {
    setCreature(creature);
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        height: "100%",
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "center",
          py: 2,
        }}
      >
        <TextField
          sx={{ flex: 1 }}
          value={searchValue}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              searchNames();
            }
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchValue(event.target.value);
          }}
        />
        <IconButton onClick={searchNames}>
          <Search />
        </IconButton>
      </Stack>
      {/* <Typography>{JSON.stringify(creature)}</Typography> */}
      <Typography variant="h6">{filteredCreatures.length} Results</Typography>

      <Typography>{JSON.stringify(creature)}</Typography>
      <Typography>{searchValue}</Typography>
      <List
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          mt: 2,
        }}
      >
        {filteredCreatures.map((c: CreaturePreview) => {
          return <StatblockPreview creaturePreview={c} onClick={handleClick} />;
        })}
      </List>
    </Box>
  );
}
export default StatblockList;
