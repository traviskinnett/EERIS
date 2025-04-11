import { ConfigProvider } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectedFromAuth0 = useRef(false);

  // Redirect to Auth0 if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: location.pathname },
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, location.pathname]);

  // Manual fallback: if on root ("/") after login and not coming back from Auth0
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("code") && params.has("state")) {
      redirectedFromAuth0.current = true;
    }
  }, [isAuthenticated, isLoading, location, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Redirecting to login...</div>;

  return (
    <ConfigProvider theme={{ token: { fontFamily: "Mulish" } }}>
      <Outlet />
    </ConfigProvider>
  );
}

export default App;
