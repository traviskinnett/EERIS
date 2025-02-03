import { ConfigProvider } from "antd";
import { HomePage } from "./components/Layout/Homepage";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {},
      }}
    >
      <HomePage />
    </ConfigProvider>
  );
}

export default App;
