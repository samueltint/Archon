import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { PluginGate } from "./util/PluginGate";
import { PluginThemeProvider } from "./util/PluginThemeProvider";
import App from "./App";
import PopoverBase from "./components/popoverBase";
import StatblockSearchList from "./pages/statblockSearch/statblockSearchList";
import StatblockView from "./pages/statblockView/statblockView";
import CreatureSettings from "./pages/creatureSettings/CreatureSettings";

const getPage = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("panel");
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PluginGate>
      <PluginThemeProvider>
        {getPage() == "searchStatblocks" ? (
          <PopoverBase popoverId="archon/statblock" title="Search Statblock">
            <StatblockSearchList />
          </PopoverBase>
        ) : getPage() == "viewStatblock" ? (
          <PopoverBase popoverId="archon/statblock" title="View Statblock">
            <StatblockView />
          </PopoverBase>
        ) : getPage() == "creatureSettings" ? (
            <CreatureSettings />
        ) : (
          <App />
        )}
      </PluginThemeProvider>
    </PluginGate>
  </React.StrictMode>,
);
