import "bootstrap/dist/css/bootstrap.min.css";
import "./dark_theme.css"; // Correctly import custom dark theme CSS

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
