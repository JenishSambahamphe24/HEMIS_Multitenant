import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Helmet } from "react-helmet";
import { createTheme, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import "../src/index.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Toaster } from "react-hot-toast";
import { AlumniProvider } from "./context/AlumniContext";

const theme = createTheme({
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: { color: "red" },
      },
    },
  },
});
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Helmet bodyAttributes={{ style: "background-color : #E2E4E8" }} />
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <Toaster />
              <MantineProvider withNormalizeCSS>
                <AlumniProvider>
                  <App />
                </AlumniProvider>
                
              </MantineProvider>
            </BrowserRouter>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
