import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { PluginGate } from "./util/PluginGate";
import { PluginThemeProvider } from "./util/PluginThemeProvider";
import App from "./App";
import StatblocksApp from "./pages/statblocks/StatblocksApp";

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
          <StatblocksApp />
        ) : (
          <StatblocksApp />
        )}
      </PluginThemeProvider>
    </PluginGate>
  </React.StrictMode>,
);
