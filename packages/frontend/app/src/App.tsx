import { ConfigProvider } from "antd";
import { LoginPage } from "./components/Login/LoginPage";
import { useState } from "react";
import { HomePage } from "./components/Layout/Homepage";

function App() {
  const [sessionExists, setSessionExists] = useState<boolean>(false);
  return (
    <ConfigProvider
      theme={{
        token: { fontFamily: "Mulish" },
      }}
    >
      {sessionExists ? (
        <HomePage />
      ) : (
        <LoginPage setSessionExists={setSessionExists} />
      )}
    </ConfigProvider>
  );
}

export default App;
