import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

export const AvatarMenuDropdown = () => {
  return (
    <div className="flex items-center pr-6 gap-x-3">
      {
        //used gap instead of space-x-3 because the Avatar component has a margin 0 property by default
        //TODO add popover dropdown menu with settings button
      }

      <Avatar icon={<UserOutlined />} />
      <div>Travis Kinnett</div>
      <DownOutlined />
    </div>
  );
};
