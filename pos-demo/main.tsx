import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// Import the CSS from the SDK
import "../dist/cursor-sprint-templates.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
