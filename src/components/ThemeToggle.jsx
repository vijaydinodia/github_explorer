import React from "react";
import { ThemeIcon } from "./Icons";
import useDarkMode from "../hooks/useDarkMode";

const ThemeToggle = () => {
  const { dark, toggleTheme } = useDarkMode();

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <ThemeIcon size={20} />
    </button>
  );
};

export default ThemeToggle;
