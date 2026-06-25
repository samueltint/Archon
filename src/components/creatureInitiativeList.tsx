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
} from "@mui/material";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import TempHpIcon from "./TempHpIcon";
import CreatureInitiativeItem from "./creatureInitiativeItem";
import type { Creature } from "../types/creature";
import OBR, { isImage, type Item } from "@owlbear-rodeo/sdk";
import { getPluginId } from "../util/getPluginId";
import { isPlainObject } from "../util/isPlainObject";

function isMetadata(
  metadata: unknown,
): metadata is { count: string; active: boolean } {
  return (
    isPlainObject(metadata) &&
    typeof metadata.count === "string" &&
    typeof metadata.active === "boolean"
  );
}

type CreatureInitiativeListProps = {
  creatures: Creature[];
  setCreatures: Dispatch<SetStateAction<Creature[]>>;
  sceneReady: boolean;
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
          const metadata = item.metadata[getPluginId("metadata")];
          if (isMetadata(metadata)) {
            creatures.push({
              id: item.id,
              name: item.text.plainText || item.name,
              isPlayer: false,
              isVisible: item.visible,
            });
          }
        }
      }
      setCreatures(creatures);
    };

    void OBR.scene.items.getItems().then(handleItemsChange);
    return OBR.scene.items.onChange(handleItemsChange);
  }, [setCreatures]);

  useEffect(() => {
    void OBR.contextMenu.create({
      icons: [
        {
          icon: "/plus.svg",
          label: "Add to Initiative",
          filter: {
            every: [
              { key: "layer", value: "CHARACTER", coordinator: "||" },
              { key: "layer", value: "MOUNT" },
              { key: "type", value: "IMAGE" },
              {
                key: ["metadata", getPluginId("metadata")],
                value: undefined,
              },
            ],
            permissions: ["UPDATE"],
          },
        },
        {
          icon: "/x.svg",
          label: "Remove from Initiative",
          filter: {
            every: [
              { key: "layer", value: "CHARACTER", coordinator: "||" },
              { key: "layer", value: "MOUNT" },
              { key: "type", value: "IMAGE" },
            ],
            permissions: ["UPDATE"],
          },
        },
      ],
      id: getPluginId("menu/toggle"),
      onClick(context) {
        OBR.scene.items.updateItems(context.items, (items) => {
          const addToInitiative = items.every(
            (item) => item.metadata[getPluginId("metadata")] === undefined,
          );
          let count = 0;
          for (const item of items) {
            if (addToInitiative) {
              item.metadata[getPluginId("metadata")] = {
                count: `${count}`,
                active: false,
              };
              count += 1;
            } else {
              delete item.metadata[getPluginId("metadata")];
            }
          }
        });
      },
    });
  }, []);

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
    props.setCreatures([]);
    setRoundCount(1);
    setActiveCreatureId(null);
    setOpen(false);
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
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 0,
        gap: 3,
      }}
    >
      <List
        sx={{
          width: "100%",
          gap: 1.5,
          display: "flex",
          flexDirection: "column",
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
        <Divider />
        {creatures.length ? (
          sortCreatures(creatures).map((creature) => (
            <ListItem key={creature.id} sx={{ padding: 0 }}>
              <CreatureInitiativeItem
                creature={creature}
                onUpdate={(updatedCreature) => {
                  setCreatures((prev) =>
                    prev.map((c) =>
                      c.id === updatedCreature.id ? updatedCreature : c,
                    ),
                  );
                }}
                isActive={activeCreature?.id === creature.id}
              />
            </ListItem>
          ))
        ) : (
          <Typography align="center">No Creatures Added Yet</Typography>
        )}
      </List>
      <Box sx={{ flex: 1 }} />

      <Divider sx={{ my: 2 }} />
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          justifyContent: "center",
          flexWrap: "wrap",
          paddingBottom: 2,
        }}
      >
        <IconButton onClick={handleInitiativeBack}>
          <Undo />
        </IconButton>
        <Typography variant="subtitle1" sx={{ alignSelf: "center" }}>
          Round {roundCount}
        </Typography>
        <IconButton onClick={handleInitiativeNext}>
          <Redo />
        </IconButton>
      </Stack>
      <Stack
        direction="row"
        spacing={1.5}
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
          color="primary"
          startIcon={<DoNotDisturb />}
          onClick={() => setOpen(true)}
        >
          Clear
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
