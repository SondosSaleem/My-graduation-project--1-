
// import { useContext, useEffect } from "react";
// import "./App.scss";
// import { ThemeContext } from "./context/ThemeContext";
// import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import MoonIcon from "./assets/icons/moon.svg";
// import SunIcon from "./assets/icons/sun.svg";
// import BaseLayout from "./layout/BaseLayout"; // Import BaseLayout
// import { Dashboard, PageNotFound } from "./screens";
// import Tasks from "./screens/tasks/pages/Boards";
// import Calender from "./screens/Calender/index";
// import { SidebarProvider } from "./context/SidebarContext";
// import Team from "./screens/teams/Team";
// import Profile from "./screens/edit_profile/Profile";
// import Home from "./screens/home/home";
// import SignupLogin from "./screens/Signup&login/Signup&Login";
// // import Chat from "./screens/chat/Chat";
// // import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute

// function App() {
//   const { theme, toggleTheme } = useContext(ThemeContext);

//   // adding dark-mode class if the dark mode is set on to the body tag
//   useEffect(() => {
//     if (theme === DARK_THEME) {
//       document.body.classList.add("dark-mode");
//     } else {
//       document.body.classList.remove("dark-mode");
//     }
//   }, [theme]);

//   return (
//     <SidebarProvider>
//       <Router>
//         <MainRoutes theme={theme} toggleTheme={toggleTheme} />
//       </Router>
//     </SidebarProvider>
//   );
// }

// function MainRoutes({ theme, toggleTheme }) {
//   const location = useLocation();

//   return (
//     <>
//       <Routes>
//         {/* Route without BaseLayout */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<SignupLogin />} />

//         {/* Route with BaseLayout */}
//         <Route element={<BaseLayout />}>
//           {/* Protected Routes inside BaseLayout */}
//           <Route path="/dashboard" element={ <Dashboard />} />
//           <Route path="/tasks" element={<Tasks /> } />
//           <Route path="/calender" element={<Calender />} />
//           <Route path="/team" element={<Team />} />
//           <Route path="/profile" element={<Profile />} />
//           {/* <Route path="/chat" element={<Chat />} /> */}
//           <Route path="*" element={< PageNotFound />} />
//         </Route>
//       </Routes>

//       {/* Conditionally render theme toggle button */}
//       {location.pathname !== "/" && location.pathname !== "/login" && (
//         <button
//           type="button"
//           className="theme-toggle-btn"
//           onClick={toggleTheme}
//         >
//           <img
//             className="theme-icon"
//             src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
//           />
//         </button>
//       )}
//     </>
//   );
// }

// export default App;

// components/PrivateRoute.js
import React from "react";
import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, PageNotFound } from "./screens";
import Tasks from "./screens/tasks/pages/Boards";
import Calender from "./screens/Calender/index";
import { SidebarProvider } from "./context/SidebarContext";
import Team from "./screens/teams/Team";
import Profile from "./screens/edit_profile/Profile";
import Home from "./screens/home/home";
import SignupLogin from "./screens/Signup&login/Signup&Login";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute
import { useAuth } from "./hooks/useAuth";

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // adding dark-mode class if the dark mode is set on to the body tag
  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <SidebarProvider>
      <Router>
        <MainRoutes theme={theme} toggleTheme={toggleTheme} />
      </Router>
    </SidebarProvider>
  );
}

function MainRoutes({ theme, toggleTheme }) {
  const location = useLocation();

  return (
    <>
      <Routes>
        {/* Route without BaseLayout */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignupLogin />} />

        {/* Route with BaseLayout */}
        <Route element={<BaseLayout />}>
          {/* Protected Routes inside BaseLayout */}
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/tasks" element={<PrivateRoute element={<Tasks />} />} />
          <Route path="/calender" element={<PrivateRoute element={<Calender />} />} />
          <Route path="/team" element={<PrivateRoute element={<Team />} />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          {/* <Route path="/chat" element={<PrivateRoute element={<Chat />} />} /> */}
          <Route path="*" element={<PrivateRoute element={<PageNotFound />}/>} />
        </Route>
      </Routes>

      {/* Conditionally render theme toggle button */}
      {location.pathname !== "/" && location.pathname !== "/login" && (
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          <img
            className="theme-icon"
            src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
          />
        </button>
      )}
    </>
  );
}

export default App;
