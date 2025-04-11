import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";

import { HomePage } from "./components/Layout/Homepage";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { ExpensesOverview } from "./components/Expenses/ExpensesOverview";
import { ExpensesManagement } from "./components/Expenses/ExpensesManagement";
import { ProfilePage } from "./components/Profile/ProfilePage";
import { PrivateRoute } from "./components/Auth/PrivateRoute";

import "./index.css";

// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // wraps everything, handles auth
    children: [
      {
        element: <HomePage />, // shared layout (sidebar/header)
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: (
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            ),
          },
          {
            path: "overview",
            element: (
              <PrivateRoute>
                <ExpensesOverview />
              </PrivateRoute>
            ),
          },
          {
            path: "management",
            element: (
              <PrivateRoute>
                <ExpensesManagement />
              </PrivateRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            ),
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-wv05a8zx44flxczt.us.auth0.com"
      clientId="iiQ4eKaMTGFYWOFsm27kVDlPH9ziZthn"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      onRedirectCallback={(appState) => {
        // 👇 Only change path if coming back from Auth0 login
        const url = new URL(window.location.href);
        const isReturningFromAuth0 = url.searchParams.has("code") && url.searchParams.has("state");

        if (isReturningFromAuth0 && appState?.returnTo) {
          window.history.replaceState({}, document.title, appState.returnTo);
        }
      }}
    >
      <RouterProvider router={router} />
    </Auth0Provider>
  </React.StrictMode>
);
