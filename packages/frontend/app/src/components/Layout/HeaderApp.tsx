import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { AvatarMenuDropdown } from "./AvatarMenuDropdown";
export const HeaderApp = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center">
      <div
        className="h-full w-min-[300px] px-5.5 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <img src={logo} />
      </div>
      <AvatarMenuDropdown />
    </div>
  );
};
