import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  MdOutlineGridView,
  MdOutlineMessage,
  MdOutlineSettings,
  MdOutlineLogout,
  MdOutlineClose,
} from "react-icons/md";
import { GoTasklist } from "react-icons/go";
import { AiOutlineTeam } from "react-icons/ai";
import { SlCalender } from "react-icons/sl";
import { CgProfile } from "react-icons/cg";
import { ThemeContext } from "../../context/ThemeContext";
import { SidebarContext } from "../../context/SidebarContext";
import SidebarToggleButton from "../../context/SidebarToggleButton";
import SmallLogoNexa from "../../assets/images/SmallLogoNexa.svg";
import BigLogoNexa from "../../assets/images/BigLogoNexa.svg";
import "./Sidebar.css";
import { LIGHT_THEME } from "../../constants/themeConstants";
import { getAuthUser, removeAuthUser } from "../../helper/Storage";
import { getData } from "../../ApiHelper";

const Sidebar = ({ selectedButton, setSelectedButton }) => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const [memberId, setMemberId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [logoSrc, setLogoSrc] = useState(BigLogoNexa);
  const [logoWidth, setLogoWidth] = useState("150px");

  useEffect(() => {
    const user = getAuthUser();
    if (user && user._id) {
      setMemberId(user._id);
      console.log("ID is " + user._id);
    }
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await getData("/users/getMe");
      if (response && response.data.role) {
        setUserRole(response.data.role);
        console.log("User role: ", response.data.role);
      } else {
        console.error(
          "Response data or role not found in the response:",
          response
        );
      }
    } catch (error) {
      console.error(
        "Error fetching user role:",
        error.response?.data || error.message
      );
    }
  };

  const handleClick = (buttonId) => {
    setSelectedButton(buttonId);
  };

  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-oepn-btn"
    ) {
      closeSidebar();
    }
  };

  const logout = () => {
    removeAuthUser();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setLogoSrc(BigLogoNexa);
        setLogoWidth("150px");
      } else if (window.innerWidth <= 1200) {
        setLogoSrc(SmallLogoNexa);
        setLogoWidth("30px");
      } else {
        setLogoSrc(isSidebarOpen ? SmallLogoNexa : BigLogoNexa);
        setLogoWidth(isSidebarOpen ? "30px" : "150px");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSidebarOpen]);

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={logoSrc} alt="Logo Nexa" style={{ width: logoWidth }} />
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <Link
                to="/dashboard"
                className={`menu-link ${selectedButton === 1 ? "active" : ""}`}
                onClick={() => handleClick(1)}
              >
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </Link>
            </li>
            {userRole !== "manger" && (
              <li className="menu-item">
                <Link
                  to="/tasks"
                  className={`menu-link ${
                    selectedButton === 2 ? "active" : ""
                  }`}
                  onClick={() => handleClick(2)}
                >
                  <span className="menu-link-icon">
                    <GoTasklist size={22} />
                  </span>
                  <span className="menu-link-text">Tasks</span>
                </Link>
              </li>
            )}
            {userRole !== "manger" && (
              <li className="menu-item">
                <Link
                  to="/team"
                  className={`menu-link ${
                    selectedButton === 3 ? "active" : ""
                  }`}
                  onClick={() => handleClick(3)}
                >
                  <span className="menu-link-icon">
                    <AiOutlineTeam size={22} />
                  </span>
                  <span className="menu-link-text">Team</span>
                </Link>
              </li>
            )}
            {userRole !== "manger" && (
              <li className="menu-item">
                <Link
                  to="/calender"
                  className={`menu-link ${
                    selectedButton === 6 ? "active" : ""
                  }`}
                  onClick={() => handleClick(6)}
                >
                  <span className="menu-link-icon">
                    <SlCalender size={17} />
                  </span>
                  <span className="menu-link-text">Calender</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/profile" className="menu-link">
                <span className="menu-link-icon">
                  <CgProfile size={20} />
                </span>
                <span className="menu-link-text">Profile</span>
              </Link>
            </li>
            <li className="menu-item" onClick={logout}>
              <Link to="/" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                <span className="menu-link-text">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
