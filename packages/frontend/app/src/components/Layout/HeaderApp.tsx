import logo from "../../assets/logo.png";
import { AvatarMenuDropdown } from "./AvatarMenuDropdown";
export const HeaderApp = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="h-full w-min-[300px] px-5.5">
        <img src={logo} />
      </div>
      <AvatarMenuDropdown />
    </div>
  );
};
