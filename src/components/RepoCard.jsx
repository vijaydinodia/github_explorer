import React, { useState } from "react";
import { FolderGit2, Star, GitFork, Eye, Bookmark, BookmarkCheck, Copy, Check, ExternalLink } from "./Icons";

const LANGUAGE_COLORS = {
  javascript: "#f1e05a",
  typescript: "#3178c6",
  html: "#e34c26",
  css: "#563d7c",
  python: "#3572A5",
  ruby: "#701516",
  go: "#00ADD8",
  java: "#b07219",
  "c++": "#f34b7d",
  rust: "#dea584",
  shell: "#89e051",
  php: "#4F5D95",
  swift: "#f05138",
  kotlin: "#A97BFF",
};

const formatUpdatedDate = (dateStr) => {
  const updatedDate = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now - updatedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return "Updated today";
  if (diffDays === 2) return "Updated yesterday";
  if (diffDays <= 30) return `Updated ${diffDays} days ago`;
  
  return `Updated on ${updatedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
};

const RepoCard = ({ repo, isBookmarked, onBookmarkToggle }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(repo.html_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL", err);
    }
  };

  const lang = repo.language ? repo.language.toLowerCase() : "";
  const langColor = LANGUAGE_COLORS[lang] || "#8b949e";

  return (
    <article className="premium-repo-card">
      <div>
        <div className="repo-card-top">
          <div className="repo-card-icon-title">
            <div className="repo-icon-container">
              <FolderGit2 size={18} />
            </div>
            <h3 className="repo-card-title">{repo.name}</h3>
          </div>
          <button
            className={`repo-card-bookmark-btn ${isBookmarked ? "bookmarked" : ""}`}
            onClick={() => onBookmarkToggle(repo)}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Repository"}
            aria-label={isBookmarked ? "Bookmark Repository" : "Remove Bookmark"}
          >
            {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
        </div>

        <p className="repo-card-description">
          {repo.description || "No description provided for this repository."}
        </p>
      </div>

      <div className="repo-card-meta-bottom">
        <div className="repo-card-stats-row">
          {repo.language && (
            <span className="language-badge">
              <span className="language-color-dot" style={{ backgroundColor: langColor }}></span>
              {repo.language}
            </span>
          )}
          <div className="repo-card-stat" title={`${repo.stargazers_count} stars`}>
            <Star size={14} />
            <span>{repo.stargazers_count}</span>
          </div>
          <div className="repo-card-stat" title={`${repo.forks_count} forks`}>
            <GitFork size={14} />
            <span>{repo.forks_count}</span>
          </div>
          <div className="repo-card-stat" title={`${repo.watchers_count} watchers`}>
            <Eye size={14} />
            <span>{repo.watchers_count}</span>
          </div>
        </div>

        <div className="repo-card-actions-row">
          <span className="repo-card-updated">{formatUpdatedDate(repo.updated_at)}</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="btn btn-secondary btn-icon"
              onClick={copyToClipboard}
              title="Copy URL"
              aria-label="Copy URL"
            >
              {copied ? <Check size={16} style={{ color: "var(--success)" }} /> : <Copy size={16} />}
            </button>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-icon"
              title="Open GitHub Profile"
              aria-label="Open GitHub Profile"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default RepoCard;
