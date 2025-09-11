import { ConfigProvider } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const location = useLocation();

  const [emailNotVerified, setEmailNotVerified] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (
      error === "access_denied" &&
      errorDescription?.toLowerCase().includes("verify your email")
    ) {
      setEmailNotVerified(true);

      // Remove error params from URL without reloading
      params.delete("error");
      params.delete("error_description");

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Attempt login only if not blocked
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !emailNotVerified) {
      loginWithRedirect({
        appState: { returnTo: location.pathname },
      });
    }
  }, [
    isLoading,
    isAuthenticated,
    emailNotVerified,
    loginWithRedirect,
    location.pathname,
  ]);

  if (isLoading) return <div>Loading...</div>;

  if (emailNotVerified) {
    return (
      <div style={{ padding: 20, fontFamily: "Segoe UI" }}>
        <h2>Email Not Verified</h2>
        <p>
          Please check your inbox and click the verification link to continue.
        </p>
      </div>
    );
  }

  if (!isAuthenticated) return <div>Redirecting to login...</div>;

  return (
    <ConfigProvider theme={{ token: { fontFamily: "Segoe UI" } }}>
      <Outlet />
    </ConfigProvider>
  );
}

export default App;
