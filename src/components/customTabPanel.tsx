import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{
        flex: 1,
        display: value === index ? "flex" : "none",
        flexDirection: "column",
        minHeight: 0,
      }}
      {...other}
    >
      <Box
        sx={{
          py: 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {children}
      </Box>
    </div>
  );
}

export default CustomTabPanel;
