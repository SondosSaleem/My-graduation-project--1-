import { useContext } from "react";
import { SidebarContext } from "./SidebarContext";
import { MdMenu } from "react-icons/md"; // import the icon you want to use

const SidebarToggleButton = () => {
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <button className="sidebar-open-btn" onClick={toggleSidebar}>
      <MdMenu size={24} color={"var(--font-color)"}/> {/* replace with your preferred icon */}
    </button>
  );
};

export default SidebarToggleButton;
