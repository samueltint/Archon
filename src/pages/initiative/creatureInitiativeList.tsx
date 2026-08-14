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
import TempHpIcon from "../../components/TempHpIcon";
import CreatureInitiativeItem from "./creatureInitiativeItem";
import type { Creature } from "../../types/creature";
import OBR, { isImage, type Item } from "@owlbear-rodeo/sdk";
import { getPluginId } from "../../util/getPluginId";
import { CreatureToItem, ItemToCreature } from "../../util/itemToCreature";
import { isPlainObject } from "../../util/isPlainObject";
import CreatureSettingsDialog from "./creatureSettingsDialog";
import { Scrollbar } from "react-scrollbars-custom";

type InitiativeMetadata = {
  roundCount?: number;
  activeCreature?: Creature | null;
};

type CreatureInitiativeListProps = {
  creatures: Creature[];
  setCreatures: Dispatch<SetStateAction<Creature[]>>;
  userRole: "GM" | "PLAYER";
  userId: string;
};

function CreatureInitiativeList(props: CreatureInitiativeListProps) {
  const { creatures, setCreatures, userRole, userId } = props;
  const [open, setOpen] = useState(false);
  const [roundCount, setRoundCount] = useState(1);
  const [initiativeMetadata, setInitiativeMetadata] = useState<
    InitiativeMetadata | undefined
  >();

  const [settingsId, setSettingsId] = useState<string>();
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const handleItemsChange = async (items: Item[]) => {
      const creatures: Creature[] = [];
      for (const item of items) {
        const initiativeMetadata = item.metadata[
          getPluginId("initiative/metadata")
        ] as { initiative: number };
        if (isPlainObject(initiativeMetadata) && isImage(item)) {
          const creature = ItemToCreature(item, initiativeMetadata.initiative);
          if (creature) {
            creatures.push(creature);
          }
        }
      }
      setCreatures(creatures);
    };

    void OBR.scene.items.getItems().then(handleItemsChange);
    return OBR.scene.items.onChange(handleItemsChange);
  }, [setCreatures]);

  useEffect(() => {
    const handleMetadataChange = async (metadata: Record<string, unknown>) => {
      const metadataValue = metadata[getPluginId("initiative/metadata")];
      if (isPlainObject(metadataValue)) {
        const initiativeMetadata = metadataValue as InitiativeMetadata;
        setInitiativeMetadata(initiativeMetadata);
        setRoundCount(initiativeMetadata.roundCount ?? 1);
      } else {
        setInitiativeMetadata(undefined);
        setRoundCount(1);
      }
    };

    void OBR.scene.getMetadata().then(handleMetadataChange);
    return OBR.scene.onMetadataChange(handleMetadataChange);
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
    const sorted = [...creatures].sort(compareCreatureInitiatives);
    return sorted;
  };

  const filterCreatures = (creatures: Creature[]) => {
    return creatures.filter((creature) => creature.isVisible);
  };

  const handleInitiativeBack = () => {
    const visibleCreatures = filterCreatures(creatures);
    const sortedCreatures = sortCreatures(visibleCreatures);
    if (!sortedCreatures.length) {
      return;
    }

    const activeIndex = sortedCreatures.findIndex(
      (creature) => creature.id === activeCreature?.id,
    );
    const nextIndex =
      activeIndex === -1
        ? sortedCreatures.length - 1
        : (activeIndex - 1 + sortedCreatures.length) % sortedCreatures.length;

    const nextRoundCount = Math.max(
      roundCount - (activeIndex === -1 || nextIndex > activeIndex ? 1 : 0),
      0,
    );

    setRoundCount(nextRoundCount);
    OBR.scene.setMetadata({
      [getPluginId("initiative/metadata")]: {
        roundCount: nextRoundCount,
        activeCreature: sortedCreatures[nextIndex],
      },
    });
  };

  const handleInitiativeNext = () => {
    const visibleCreatures = filterCreatures(creatures);
    const sortedCreatures = sortCreatures(visibleCreatures);
    if (!sortedCreatures.length) {
      return;
    }

    const activeIndex = sortedCreatures.findIndex(
      (creature) => creature.id === activeCreature?.id,
    );
    const nextIndex =
      activeIndex === -1 ? 0 : (activeIndex + 1) % sortedCreatures.length;

    const nextRoundCount =
      roundCount + (activeIndex === -1 || nextIndex <= activeIndex ? 1 : 0);

    setRoundCount(nextRoundCount);
    OBR.scene.setMetadata({
      [getPluginId("initiative/metadata")]: {
        roundCount: nextRoundCount,
        activeCreature: sortedCreatures[nextIndex],
      },
    });
  };

  const handleRollInitiative = () => {
    const newCreatures = creatures.map((creature) => ({
      ...creature,
      initiative:
        creature.role == "player"
          ? creature.initiative
          : Math.floor(Math.random() * 20) + 1,
    }));

    const visibleCreatures = filterCreatures(newCreatures);
    const newActive = sortCreatures(visibleCreatures).at(0);
    setCreatures(newCreatures);
    setRoundCount(1);
    handleInitiativeMetadataUpdate(newCreatures, newActive);
    OBR.scene.setMetadata({
      [getPluginId("initiative/metadata")]: {
        roundCount: 1,
        activeCreature: newActive,
      },
    });
  };

  const handleClear = () => {
    OBR.scene.items.updateItems(isImage, (items) => {
      for (const item of items) {
        delete item.metadata[getPluginId("initiative/metadata")];
      }
    });
    setRoundCount(1);
    OBR.scene.setMetadata({
      [getPluginId("initiative/metadata")]: {
        roundCount: 1,
        activeCreature: null,
      },
    });
    setOpen(false);
  };

  const onUpdate = (updatedCreature: Creature) => {
    setCreatures((prev) =>
      prev.map((c) => (c.id === updatedCreature.id ? updatedCreature : c)),
    );
  };

  const handleCreatureMetadataUpdate = (creature: Creature) => {
    OBR.scene.items.updateItems(isImage, (items) => {
      for (const item of items) {
        if (item.id !== creature.id) continue;
        CreatureToItem(item, creature, true);
      }
    });
  };

  const handleInitiativeMetadataUpdate = (
    creatures?: Creature[],
    newActiveCreature?: Creature,
  ) => {
    if (creatures) {
      creatures.map((creature) => {
        if (creature.id) {
          OBR.scene.items.updateItems([creature.id], (items) => {
            for (const item of items) {
              item.metadata[getPluginId("initiative/metadata")] = {
                initiative: creature.initiative,
              };
            }
          });
        }
      });
    }
    OBR.scene.setMetadata({
      [getPluginId("initiative/metadata")]: {
        roundCount: roundCount,
        activeCreature: newActiveCreature ?? activeCreature ?? null,
      },
    });
  };

  const handleSettingsClick = (id: string | undefined) => {
    setSettingsId(id);
    setSettingsOpen(true);
  };

  const activeCreature =
    creatures.find(
      (creature) => creature.id === initiativeMetadata?.activeCreature?.id,
    ) ??
    initiativeMetadata?.activeCreature ??
    undefined;

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
          px: 1,
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
                width: "25px",
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
                width: "25px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TempHpIcon fontSize="small" color="primary" />
            </Box>

            <Divider orientation="vertical" flexItem />
            <Box
              sx={{
                width: "25px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Shield fontSize="small" color="primary" />
            </Box>
            {userRole == "GM" && (
              <>
                <Divider orientation="vertical" flexItem />
                <Box
                  sx={{
                    width: "24px",
                  }}
                ></Box>
              </>
            )}
            {/* <Box
              sx={{
                width: "10px",
              }}
            ></Box> */}
          </Box>
        </ListItem>
        <Scrollbar>
          <List
            sx={{
              width: "100%",
              gap: 1.5,
              display: "flex",
              flexDirection: "column",

              flex: 1,
              minHeight: 0,
            }}
          >
            <Divider />
            {creatures.length ? (
              sortCreatures(creatures).map((creature) => {
                return (
                  !(userRole == "PLAYER" && !creature.isVisible) && (
                    <ListItem key={creature.id} sx={{ padding: 0 }}>
                      <CreatureInitiativeItem
                        creature={creature}
                        onUpdate={onUpdate}
                        handleCreatureMetadataUpdate={
                          handleCreatureMetadataUpdate
                        }
                        handleInitiativeMetadataUpdate={
                          handleInitiativeMetadataUpdate
                        }
                        isActive={activeCreature?.id === creature.id}
                        handleSettingsClick={() =>
                          handleSettingsClick(creature.id)
                        }
                        userRole={userRole}
                        userId={userId}
                      />
                    </ListItem>
                  )
                );
              })
            ) : (
              <Typography align="center">No Creatures Added Yet</Typography>
            )}
          </List>
        </Scrollbar>
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
        {userRole == "GM" && (
          <IconButton onClick={handleInitiativeBack}>
            <Undo />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ alignSelf: "center" }}>
          Round {roundCount}
        </Typography>
        {userRole == "GM" && (
          <IconButton onClick={handleInitiativeNext}>
            <Redo />
          </IconButton>
        )}
      </Stack>
      {userRole == "GM" && (
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
      )}
      <Dialog
        fullWidth
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      >
        <CreatureSettingsDialog itemId={settingsId} />
      </Dialog>
    </Box>
  );
}

export default CreatureInitiativeList;
