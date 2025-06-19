// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppRouter from "./Router"; // 👈 Use the router instead

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);