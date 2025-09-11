import {
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, MenuProps, Space } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export const AvatarMenuDropdown = () => {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();

  const name = user?.name || user?.email || "User";
  const avatarUrl = user?.picture;

  const items: MenuProps["items"] = [
    {
      key: "profile",
      icon: <IdcardOutlined />,
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: () =>
        logout({
          logoutParams: { returnTo: window.location.origin },
        }),
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
      <a onClick={(e) => e.preventDefault()}>
        <div className="flex items-center pr-6 gap-x-3 cursor-pointer text-gray-600 hover:text-gray-900">
          <Space>
            {avatarUrl ? (
              <Avatar src={avatarUrl} alt={name} />
            ) : (
              <Avatar icon={<UserOutlined />} />
            )}
            <span>{name}</span>
            <DownOutlined />
          </Space>
        </div>
      </a>
    </Dropdown>
  );
};
