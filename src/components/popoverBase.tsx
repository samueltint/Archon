import "../index.css";
import {
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import OBR from "@owlbear-rodeo/sdk";
import type { ReactNode } from "react";

interface PopoverBaseProps {
  children?: ReactNode;
  popoverId: string;
  title: string;
}

function PopoverBase(props: PopoverBaseProps) {
  const { children, popoverId, title } = props;
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        py: 1,
      }}
    >
      <Stack direction="row" sx={{ alignItems: "center" }}>
        <Typography sx={{ flex: 1 }}>{title}</Typography>

        <IconButton
          color="error"
          onClick={() => OBR.popover.close(popoverId)}
          size="small"
        >
          <Close sx={{ fontSize: "1.5rem" }} />
        </IconButton>
      </Stack>
      <Divider sx={{ my: 1 }} />
      {children}
    </Container>
  );
}

export default PopoverBase;
