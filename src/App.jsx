import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useDarkMode from "./hooks/useDarkMode";
import Home from "./pages/Home";
import UserRepos from "./pages/UserRepos";
import "./css/global.css";

const App = () => {
  // Invoking useDarkMode ensures the correct class (dark/light) is set on body/html on startup
  useDarkMode();

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/:username" element={<UserRepos />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
