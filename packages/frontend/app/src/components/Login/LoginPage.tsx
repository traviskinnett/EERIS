import { Card, Tabs, TabsProps } from "antd";
import borderedLogo from "../../assets/BorderedLogo.png";
import LoginBackground from "../../assets/LoginBackground.png";
import { LoginLayout } from "./LoginLayout";
import { SignUpLayout } from "./SignUpLayout";

interface LoginPageProps {
  setSessionExists: (bool: boolean) => void;
}

export const LoginPage = ({ setSessionExists }: LoginPageProps) => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: <div className="text-[#1677ff]">LOG IN</div>,
      children: <LoginLayout setSessionExists={setSessionExists} />,
    },
    {
      key: "2",
      label: <div className="text-[#1677ff]">SIGN UP</div>,
      children: <SignUpLayout />,
    },
  ];

  return (
    <div className="h-screen  flex justify-center items-center relative">
      <img
        src={LoginBackground}
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      <Card className="relative z-10 w-108 !bg-white shadow-2xl">
        <div>
          <div className="h-full w-[380px] flex justify-center">
            <img src={borderedLogo} alt="Logo" />
          </div>
          <Tabs defaultActiveKey="1" items={items} centered tabBarGutter={55} />
        </div>
      </Card>
    </div>
  );
};
