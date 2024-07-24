/* import { Outlet } from "react-router";
import Sidebar from "../../../components/sidebar/Sidebar";
import React, { useState } from 'react';
import './styles.css';

const Layout = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [selectedButton, setSelectedButton] = useState("");

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode', !darkMode);
    };

    return (
        <div className="layout">
            <Sidebar selectedButton={selectedButton} setSelectedButton={setSelectedButton} />
            <button onClick={toggleDarkMode}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <div className="content">
                <Outlet context={{ darkMode }} />
            </div>
        </div>
    );
};

export default Layout;
 */

import { Outlet } from "react-router";
import Sidebar from "../../../components/sidebar/Sidebar";
import React, { useState } from 'react';
import './styles.css';

const Layout = ({ userId }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [selectedButton, setSelectedButton] = useState("");

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode', !darkMode);
    };

    return (
        <div className="layout-container">
            <Sidebar selectedButton={selectedButton} setSelectedButton={setSelectedButton} />
            <div className="header">
                <button onClick={toggleDarkMode} className="theme-toggle-button">
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
            <div className="layout-content">
                <Outlet context={{ darkMode }} />
            </div>
        </div>
    );
};

export default Layout;
