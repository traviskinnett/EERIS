import { DashboardOutlined, FileDoneOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { ItemType } from "antd/es/menu/interface";
import { HeaderApp } from "./HeaderApp";
import "./Homepage.css";
import { Outlet, useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

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
    <>
      <Layout className="h-screen">
        <Header className="layout-header border-b-1 border-gray-200">
          <HeaderApp />
        </Header>
        <Layout hasSider>
          <Sider
            className="layout-sider border-r-1 border-gray-200"
            collapsible
          >
            <div className="flex flex-col h-full justify-between">
              <Menu
                className=""
                defaultSelectedKeys={["dashboard"]}
                mode="inline"
                items={items}
              />
              <div className="text-center pb-2">Software Engineering 2025</div>
            </div>
          </Sider>
          <Content>
            <Outlet></Outlet>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
