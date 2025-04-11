import { DashboardOutlined, FileDoneOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { ItemType } from "antd/es/menu/interface";
import { HeaderApp } from "./HeaderApp";
import "./Homepage.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth0();

  // Send user info to backend on first login
  useEffect(() => {
    if (isAuthenticated && user) {
      fetch("http://localhost:3000/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: user.sub,
          email: user.email,
          name: user.name,
        }),
      }).catch((err) => console.error("❌ Failed to sync user:", err));
    }
  }, [isAuthenticated, user]);

  // Get current route to set selected menu key
  const getSelectedKey = (pathname: string) => {
    if (pathname.startsWith("/overview")) return "expense overview";
    if (pathname.startsWith("/management")) return "expense management";
    if (pathname.startsWith("/dashboard")) return "dashboard";
    return "";
  };

  const items: ItemType[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <DashboardOutlined />,
      onClick: () => navigate("/dashboard"),
    },
    {
      key: "expense",
      label: "Expenses",
      icon: <FileDoneOutlined />,
      children: [
        {
          key: "expense overview",
          label: "Overview",
          onClick: () => navigate("/overview"),
        },
        {
          key: "expense management",
          label: "Management",
          onClick: () => navigate("/management"),
        },
      ],
    },
  ];

  return (
    <Layout className="h-screen">
      <Header className="layout-header border-b-1 border-gray-200">
        <HeaderApp />
      </Header>
      <Layout hasSider>
        <Sider className="layout-sider border-r-1 border-gray-200" collapsible>
          <div className="flex flex-col h-full justify-between">
            <Menu
              mode="inline"
              selectedKeys={[getSelectedKey(location.pathname)]}
              items={items}
            />
            <div className="text-center pb-2">Software Engineering 2025</div>
          </div>
        </Sider>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
