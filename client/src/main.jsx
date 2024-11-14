import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { LocationContextProvider } from "./context/LocationContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LocationContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </LocationContextProvider>
  </React.StrictMode>
);
