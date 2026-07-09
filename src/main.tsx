import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { PluginGate } from "./util/PluginGate";
import { PluginThemeProvider } from "./util/PluginThemeProvider";
import App from "./App";
import PopoverBase from "./components/popoverBase";
import StatblockSearchList from "./pages/statblockSearch/statblockSearchList";
import StatblockView from "./pages/statblockView/statblockView";
import SetRoles from "./pages/setRoles/setRoles";
import OBR from "@owlbear-rodeo/sdk";
import { Typography } from "@mui/material";

const getPage = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("panel");
};

export function Root() {
  const page = getPage();
  const [userRole, setUserRole] = useState<"GM" | "PLAYER" | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    OBR.onReady(async () => {
      const role = await OBR.player.getRole();
      const id = await OBR.player.getId();
      if (isMounted) {
        setUserRole(role);
        setUserId(id);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (userRole === null || userId === null) {
    return <Typography>Loading...</Typography>;
  }

  switch (page) {
    case "searchStatblocks":
      return (
        <PopoverBase popoverId="archon/statblock" title="Search Statblock">
          {userRole == "GM" ? (
            <StatblockSearchList />
          ) : (
            <Typography sx={{ p: 3 }}>GM Permission Required</Typography>
          )}
        </PopoverBase>
      );
    case "viewStatblock":
      return (
        <PopoverBase popoverId="archon/statblock" title="View Statblock">
          <StatblockView userRole={userRole} userId={userId} />
        </PopoverBase>
      );
    case "setRoles":
      if (userRole == "GM") return <SetRoles />;
      else return <Typography sx={{ p: 3 }}>GM Permission Required</Typography>;

    default:
      return <App userRole={userRole} />;
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PluginGate>
      <PluginThemeProvider>
        <Root />
      </PluginThemeProvider>
    </PluginGate>
  </React.StrictMode>,
);
