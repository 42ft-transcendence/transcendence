import ReactDOM from "react-dom/client";
import "./index.css";
import Router from "./router";
import { RouterProvider } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={Router} />,
);
