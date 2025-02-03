import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import ReactDOM from "react-dom/client";
import React from "react";
import { Dashboard } from "./components/Dashboard/Dashboard";
import "./index.css";
import { ExpensesOverview } from "./components/Expenses/ExpensesOverview";
import { ExpensesManagement } from "./components/Expenses/ExpensesManagement";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "overview",
        element: <ExpensesOverview />,
      },
      {
        path: "management",
        element: <ExpensesManagement />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
