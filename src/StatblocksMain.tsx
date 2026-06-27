import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { PluginGate } from "./util/PluginGate";
import { PluginThemeProvider } from "./util/PluginThemeProvider";
import StatblocksApp from "./StatblocksApp";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PluginGate>
      <PluginThemeProvider>
        <StatblocksApp/>
      </PluginThemeProvider>
    </PluginGate>
  </React.StrictMode>,
);
