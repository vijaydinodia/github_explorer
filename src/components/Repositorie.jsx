import { useState, useEffect } from "react";

import "../css/repo.css";

const Repositorie = ({ repo }) => {
  return (
    <div className="repo-card">
      <h3>{repo.name}</h3>
      <p>{repo.description || "No description"}</p>

      <div>
        ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}
      </div>

      <p>{repo.language || "N/A"}</p>

      <a href={repo.html_url} target="_blank" rel="noreferrer">
        View Repo
      </a>
    </div>
  );
};

export default Repositorie;
