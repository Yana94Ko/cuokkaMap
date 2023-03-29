import React from "react";
import ReactDOM from "react-dom/client";
import {ThemeProvider} from "styled-components";

import App from "./App";
import GlobalStyle from "./styles/GlobalStyle";
import {theme} from "./styles/Theme";
import {Provider} from "react-redux";
import {createStore} from "redux";
import rootReducer from "./modules";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const store = createStore(rootReducer);

root.render(
    <ThemeProvider theme={theme}>
        <GlobalStyle/>
        <Provider store={store}>
            <App/>
        </Provider>
    </ThemeProvider>
);
