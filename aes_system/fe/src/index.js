// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate
import { store, persistor } from "./store"; // Nhập store và persistor
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createTheme } from "@mui/material/styles";

// Tạo theme mặc định
const theme = createTheme({
  palette: {
    mode: "light", // hoặc 'dark' nếu bạn muốn chế độ tối
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="1075065952870-p9bthto4iv3ibuufv5gesgrjk8p9f25q.apps.googleusercontent.com">
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
);
