import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/repo.css";
import "../css/controls.css";

const UserRepos = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const [language, setLanguage] = useState("");

  const perPage = 8;

  // ✅ FETCH REPOS
  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`,
        );
        const data = await res.json();
        setRepos(data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchRepos();
  }, [username, page]);

  // ✅ SORT + FILTER
  let filteredRepos = repos
    .filter((repo) =>
      language
        ? repo.language?.toLowerCase().includes(language.toLowerCase())
        : true,
    )
    .sort((a, b) => {
      if (sort === "stars") return b.stargazers_count - a.stargazers_count;
      if (sort === "forks") return b.forks_count - a.forks_count;
      return 0;
    });

  // ✅ REAL PAGINATION
  const getVisiblePages = () => {
    const pages = [];
    if (page > 1) pages.push(page - 1);
    pages.push(page);
    if (repos.length === perPage) pages.push(page + 1);
    return pages;
  };

  return (
    <div className="container">
      {/* 🔙 HEADER */}
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>{username}'s Repositories</h2>
      </div>

      {/* 🔥 CONTROLS */}
      <div className="controls">
        <select
          className="control-select"
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort</option>
          <option value="stars">⭐ Stars</option>
          <option value="forks">🍴 Forks</option>
        </select>

        <input
          className="control-input"
          type="text"
          placeholder="🔍 Filter by language"
          onChange={(e) => setLanguage(e.target.value)}
        />
      </div>

      {/* 🧠 SKELETON LOADING */}
      {loading ? (
        <div className="repo-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="repo-card skeleton" key={index}>
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text small"></div>
              <div className="skeleton-btn"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* 📦 REPOS */}
          <div className="repo-grid">
            {filteredRepos.map((repo) => (
              <div className="repo-card" key={repo.id}>
                <h3>{repo.name}</h3>
                <p>{repo.description || "No description"}</p>

                <p>
                  ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}
                </p>

                <p>{repo.language || "N/A"}</p>

                <a href={repo.html_url} target="_blank" rel="noreferrer">
                  View Repo
                </a>
              </div>
            ))}
          </div>

          {/* 📌 PAGINATION */}
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>

            {getVisiblePages().map((p) => (
              <button
                key={p}
                className={page === p ? "active" : ""}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}

            <button
              disabled={repos.length < perPage}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserRepos;
