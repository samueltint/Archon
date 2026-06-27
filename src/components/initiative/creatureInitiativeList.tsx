import {
  Favorite,
  PriorityHigh,
  Shield,
  DoNotDisturb,
  Redo,
  Undo,
  Casino,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Dialog,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
  Container,
} from "@mui/material";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import TempHpIcon from "../TempHpIcon";
import CreatureInitiativeItem from "./creatureInitiativeItem";
import type { Creature, CreatureMetadata } from "../../types/creature";
import OBR, { isImage, type Item } from "@owlbear-rodeo/sdk";
import { getPluginId } from "../../util/getPluginId";
import { isPlainObject } from "../../util/isPlainObject";

type CreatureInitiativeListProps = {
  creatures: Creature[];
  setCreatures: Dispatch<SetStateAction<Creature[]>>;
};

function CreatureInitiativeList(props: CreatureInitiativeListProps) {
  const { creatures, setCreatures } = props;
  const [open, setOpen] = useState(false);
  const [activeCreatureId, setActiveCreatureId] = useState<
    Creature["id"] | null
  >(null);
  const [roundCount, setRoundCount] = useState(1);

  useEffect(() => {
    const handleItemsChange = async (items: Item[]) => {
      const creatures: Creature[] = [];
      for (const item of items) {
        if (isImage(item)) {
          const initiativeMetadata = item.metadata[
            getPluginId("initiative/metadata")
          ] as { initiative: number };
          const creatureMetadata = item.metadata[
            getPluginId("creature/metadata")
          ] as CreatureMetadata;
          if (isPlainObject(initiativeMetadata)) {
            creatures.push({
              id: item.id,
              name: item.text.plainText || item.name,
              initiative: initiativeMetadata.initiative,
              initiativeModifier: creatureMetadata?.initiativeModifier ?? 0,
              isPlayer: false,
              isVisible: item.visible,
              maxHp: creatureMetadata?.maxHp ?? 0,
              currentHp:
                creatureMetadata?.currentHp ?? creatureMetadata?.maxHp ?? 0,
              tempHp: creatureMetadata?.tempHp ?? 0,
              ac: creatureMetadata?.ac ?? 0,
            });
          }
        }
      }
      setCreatures(creatures);
    };

    void OBR.scene.items.getItems().then(handleItemsChange);
    return OBR.scene.items.onChange(handleItemsChange);
  }, [setCreatures]);

  const getCreatureInitiative = (creature: Creature | undefined) => {
    if (!creature) {
      return 0;
    }

    return (creature.initiative ?? 0) + (creature.initiativeModifier ?? 0);
  };

  const compareCreatureInitiatives = (a: Creature, b: Creature) => {
    const diff = getCreatureInitiative(b) - getCreatureInitiative(a);
    if (diff === 0) {
      return (b.initiativeModifier ?? 0) - (a.initiativeModifier ?? 0);
    }

    return diff;
  };

  const sortCreatures = (creatures: Creature[]) => {
    return [...creatures].sort(compareCreatureInitiatives);
  };

  const handleInitiativeBack = () => {
    const sortedCreatures = sortCreatures(creatures);
    if (!sortedCreatures.length) {
      return;
    }

    const activeIndex = sortedCreatures.findIndex(
      (creature) => creature.id === activeCreatureId,
    );
    const nextIndex =
      activeIndex === -1
        ? sortedCreatures.length - 1
        : (activeIndex - 1 + sortedCreatures.length) % sortedCreatures.length;

    setActiveCreatureId(sortedCreatures[nextIndex].id);
    setRoundCount(
      Math.max(
        roundCount - (activeIndex === -1 || nextIndex > activeIndex ? 1 : 0),
        0,
      ),
    );
  };

  const handleInitiativeNext = () => {
    const sortedCreatures = sortCreatures(creatures);
    if (!sortedCreatures.length) {
      return;
    }

    const activeIndex = sortedCreatures.findIndex(
      (creature) => creature.id === activeCreatureId,
    );
    const nextIndex =
      activeIndex === -1 ? 0 : (activeIndex + 1) % sortedCreatures.length;

    setActiveCreatureId(sortedCreatures[nextIndex].id);
    setRoundCount(
      roundCount + (activeIndex === -1 || nextIndex <= activeIndex ? 1 : 0),
    );
  };

  const handleRollInitiative = () => {
    const newCreatures = creatures.map((creature) => ({
      ...creature,
      initiative: creature.isPlayer
        ? creature.initiative
        : Math.floor(Math.random() * 20) + 1,
    }));

    setCreatures(newCreatures);
    setRoundCount(1);
    setActiveCreatureId(sortCreatures(newCreatures).at(0)?.id ?? null);
  };

  const handleClear = () => {
    OBR.scene.items.updateItems(isImage, (items) => {
      for (const item of items) {
        delete item.metadata[getPluginId("initiative/metadata")];
      }
    });
    setRoundCount(1);
    setActiveCreatureId(null);
    setOpen(false);
  };

  const onUpdate = (updatedCreature: Creature) => {
    setCreatures((prev) =>
      prev.map((c) => (c.id === updatedCreature.id ? updatedCreature : c)),
    );
  };

  const handleSaveMetadata = () => {
    OBR.scene.items.updateItems(isImage, (items) => {
      for (const item of items) {
        const creature = creatures.find((creature) => creature.id === item.id);

        if (creature == undefined) continue;
        if ((creature.currentHp ?? 0) > (creature.maxHp ?? 0)) {
          creature.currentHp = creature.maxHp;
        }
        item.name = creature.name;
        item.metadata[getPluginId("creature/metadata")] = {
          maxHp: creature.maxHp,
          currentHp: creature.currentHp,
          tempHp: creature.tempHp,
          ac: creature.ac,
          initiativeModifier: creature.initiativeModifier,
        };
        item.metadata[getPluginId("initiative/metadata")] = {
          initiative: creature.initiative,
        };
      }
    });
  };

  const activeCreature = creatures.find(
    (creature) => creature.id === activeCreatureId,
  );

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <Container
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
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
        <List
          sx={{
            width: "100%",
            gap: 1.5,
            display: "flex",
            flexDirection: "column",

            flex: 1,
            minHeight: 0, // critical for MUI flex layouts
            overflowY: "auto", // THIS makes only list scroll
          }}
        >
          <Divider />
          {creatures.length ? (
            sortCreatures(creatures).map((creature) => (
              <ListItem key={creature.id} sx={{ padding: 0 }}>
                <CreatureInitiativeItem
                  creature={creature}
                  onUpdate={onUpdate}
                  onBlur={handleSaveMetadata}
                  isActive={activeCreature?.id === creature.id}
                />
              </ListItem>
            ))
          ) : (
            <Typography align="center">No Creatures Added Yet</Typography>
          )}
        </List>
      </Container>
      <Divider flexItem />
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          justifyContent: "center",
          flexWrap: "wrap",
          py: 2,
        }}
      >
        <IconButton onClick={handleInitiativeBack}>
          <Undo />
        </IconButton>
        <Typography variant="h6" sx={{ alignSelf: "center" }}>
          Round {roundCount}
        </Typography>
        <IconButton onClick={handleInitiativeNext}>
          <Redo />
        </IconButton>
      </Stack>
      <Stack
        direction="row"
        spacing={1.5}
        useFlexGap
        sx={{
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<Casino />}
          onClick={handleRollInitiative}
        >
          Roll Initiative
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DoNotDisturb />}
          onClick={() => setOpen(true)}
        >
          Clear Initiative List
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <Typography variant="subtitle1" sx={{ p: 3 }}>
            Are you sure you want to clear all creatures?
          </Typography>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              justifyContent: "center",
              flexWrap: "wrap",
              padding: "0 0 10px",
            }}
          >
            <Button variant="outlined" color="error" onClick={handleClear}>
              Clear
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </Stack>
        </Dialog>
      </Stack>
    </Box>
  );
}

export default CreatureInitiativeList;
