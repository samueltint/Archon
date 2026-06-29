import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { PluginGate } from "./util/PluginGate";
import { PluginThemeProvider } from "./util/PluginThemeProvider";
import App from "./App";
import PopoverBase from "./components/popoverBase";
import StatblockSearchList from "./pages/statblockSearch/statblockSearchList";
import StatblockView from "./pages/statblockView/statblockView";

const getPage = () => {
  const params = new URLSearchParams(window.location.search);
  const panel = params.get("panel");
  return !panel ? 0 : panel === "searchStatblocks" ? 1 : 2;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PluginGate>
      <PluginThemeProvider>
        {getPage() == 0 ? (
          <App />
        ) : getPage() == 1 ? (
          <PopoverBase popoverId="archon/statblock" title="Search Statblock">
            <StatblockSearchList />
          </PopoverBase>
        ) : (
          <PopoverBase popoverId="archon/statblock" title="View Statblock">
            <StatblockView />
          </PopoverBase>
        )}
      </PluginThemeProvider>
    </PluginGate>
  </React.StrictMode>,
);
