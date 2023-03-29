import React from "react";
import ReactDOM from "react-dom/client";
import {ThemeProvider} from "styled-components";

import App from "./App";
import GlobalStyle from "./styles/GlobalStyle";
import {theme} from "./styles/Theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <App />
  </ThemeProvider>
);
