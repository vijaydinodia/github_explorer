import { BrowserRouter, Routes, Route } from "react-router-dom";
import useDarkMode from "./Custom_hooks/useDarkMode";

import Home from "./pages/Home";
import UserRepos from "./pages/UserRepos";

import "./css/global.css";
import "./css/home.css";
import "./css/repo.css";
import "./css/controls.css";
import "./css/loader.css";
import "./App.css";

const App = () => {
  const { dark, toggleTheme } = useDarkMode();

  return (
    <BrowserRouter>
      <button className="theme-btn" onClick={toggleTheme}>
        {dark ? "☀️ Light" : "🌙 Dark"}
      </button>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:username" element={<UserRepos />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
