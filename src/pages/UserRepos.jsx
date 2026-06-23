import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getUserProfile, getRepos } from "../services/githubApi";
import useLocalStorage from "../hooks/useLocalStorage";
import RepoCard from "../components/RepoCard";
import GridSkeleton from "../components/SkeletonLoader";
import ThemeToggle from "../components/ThemeToggle";
import { 
  ArrowLeft, Search, AlertCircle, MapPin, LinkIcon, 
  BookOpen, Users, Bookmark, ChevronLeft, ChevronRight, X
} from "../components/Icons";

const PER_PAGE = 6;

const UserRepos = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active page state from URL query parameters
  const page = Number(searchParams.get("page")) || 1;

  // Profile and repos API states
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [error, setError] = useState("");

  // Search another user state
  const [searchUser, setSearchUser] = useState("");

  // Repository filter states
  const [repoQuery, setRepoQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [sortOption, setSortOption] = useState("updated"); // default sorting

  // View state: "all" or "bookmarks"
  const [viewMode, setViewMode] = useState("all");

  // Local storage for bookmarked repositories
  const [bookmarks, setBookmarks] = useLocalStorage("bookmarked_repos", []);

  // Copy toast notification state
  const [showCopyToast, setShowCopyToast] = useState(false);

  // Fetch user profile (only runs when username changes)
  useEffect(() => {
    if (!username) return;

    const fetchUserProfile = async () => {
      setLoadingProfile(true);
      setError("");
      try {
        const data = await getUserProfile(username);
        setProfile(data);
      } catch (err) {
        setProfile(null);
        setError(err.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
    // Reset view mode and filters when changing username
    setViewMode("all");
    setRepoQuery("");
    setSelectedLanguage("");
    setSortOption("updated");
  }, [username]);

  // Fetch repositories (runs when username or page changes)
  useEffect(() => {
    if (!username || viewMode === "bookmarks") return;

    const fetchUserRepos = async () => {
      setLoadingRepos(true);
      try {
        const data = await getRepos(username, page, PER_PAGE);
        setRepos(data);
      } catch (err) {
        setRepos([]);
      } finally {
        setLoadingRepos(false);
      }
    };

    fetchUserRepos();
  }, [username, page, viewMode]);

  // Handle header searching for another user
  const handleSearchAnotherUser = (e) => {
    if (e.key === "Enter" && searchUser.trim()) {
      navigate(`/user/${searchUser.trim()}?page=1`);
      setSearchUser("");
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  // Toggle bookmarked repo in localStorage
  const handleBookmarkToggle = (repoItem) => {
    setBookmarks((prev) => {
      const isBookmarked = prev.some((b) => b.id === repoItem.id);
      if (isBookmarked) {
        return prev.filter((b) => b.id !== repoItem.id);
      } else {
        return [...prev, repoItem];
      }
    });
  };

  // Get current active repositories list depending on viewMode
  const activeReposSource = viewMode === "bookmarks" 
    ? bookmarks.filter((r) => r.owner?.login?.toLowerCase() === username.toLowerCase())
    : repos;

  // Get dynamic unique languages list from repositories currently loaded
  const availableLanguages = Array.from(
    new Set(activeReposSource.map((r) => r.language).filter(Boolean))
  );

  // Apply client-side search, sort, and language filters
  const filteredAndSortedRepos = activeReposSource
    .filter((repo) => {
      // 1. Text filter
      const matchesSearch = repo.name.toLowerCase().includes(repoQuery.toLowerCase()) || 
        (repo.description && repo.description.toLowerCase().includes(repoQuery.toLowerCase()));
      
      // 2. Language filter
      const matchesLanguage = !selectedLanguage || repo.language === selectedLanguage;

      return matchesSearch && matchesLanguage;
    })
    .sort((a, b) => {
      // 3. Sorting options
      if (sortOption === "stars") {
        return b.stargazers_count - a.stargazers_count;
      }
      if (sortOption === "forks") {
        return b.forks_count - a.forks_count;
      }
      if (sortOption === "updated") {
        return new Date(b.updated_at) - new Date(a.updated_at);
      }
      return 0;
    });

  // Calculate total pages for API pagination
  const totalPages = profile ? Math.ceil(profile.public_repos / PER_PAGE) : 0;

  // Pagination renderer
  const renderPagination = () => {
    if (viewMode === "bookmarks" || totalPages <= 1) return null;

    const buttons = [];
    const maxNeighbours = 1;

    // First page
    buttons.push(
      <button
        key={1}
        className={`pagination-btn ${page === 1 ? "active" : ""}`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );

    let start = Math.max(2, page - maxNeighbours);
    let end = Math.min(totalPages - 1, page + maxNeighbours);

    if (start > 2) {
      buttons.push(<span key="dots-start" className="pagination-ellipsis">...</span>);
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          className={`pagination-btn ${page === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages - 1) {
      buttons.push(<span key="dots-end" className="pagination-ellipsis">...</span>);
    }

    // Last page
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          className={`pagination-btn ${page === totalPages ? "active" : ""}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="pagination-container">
        <button
          className="pagination-btn"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {buttons}
        <button
          className="pagination-btn"
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  return (
    <div style={{ background: "var(--page)", minHeight: "100vh" }}>
      {/* Sticky Top Header */}
      <header className="sticky-header">
        <div className="sticky-header-container">
          <div className="sticky-header-left">
            <button className="btn btn-secondary" onClick={() => navigate("/")} title="Back to Home" aria-label="Back to Home" style={{ padding: "8px 12px", height: "40px" }}>
              <ArrowLeft size={18} />
              <span style={{ display: "inline" }}>Home</span>
            </button>
          </div>

          <div className="sticky-header-center">
            {profile ? `@${profile.login}` : "Loading..."}
          </div>

          <div className="sticky-header-right">
            <div className="sticky-header-search-container">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search other user..."
                className="input-field"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                onKeyDown={handleSearchAnotherUser}
                aria-label="Search another GitHub user"
              />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="repo-page">
        {/* Error Screen */}
        {error && (
          <div className="state-container">
            <div className="state-icon-wrapper">
              <AlertCircle size={32} style={{ color: "var(--danger)" }} />
            </div>
            <h3>GitHub Profile Error</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>
        )}

        {/* Loading Profile Skeleton */}
        {loadingProfile && (
          <div className="profile-section-card skeleton-shimmer" style={{ height: "200px", border: "none" }}></div>
        )}

        {/* Profile Card Info Section */}
        {!loadingProfile && !error && profile && (
          <section className="profile-section-card">
            <div className="profile-avatar-wrapper">
              <img 
                src={profile.avatar_url} 
                alt={`${profile.name || profile.login} avatar`} 
                className="profile-avatar-large" 
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div className="profile-info-header">
                <h1 className="profile-username">{profile.name || profile.login}</h1>
                <a 
                  href={profile.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary profile-link-btn"
                  style={{ padding: "6px 12px", fontSize: "0.8rem", height: "32px" }}
                >
                  GitHub Profile
                </a>
              </div>

              <p className="profile-bio">
                {profile.bio || "No profile bio available for this developer."}
              </p>

              {/* Stats & Meta Badges */}
              <div className="profile-meta-pills">
                <span className="profile-meta-pill">
                  <BookOpen size={14} />
                  {profile.public_repos} Repos
                </span>
                <span className="profile-meta-pill">
                  <Users size={14} />
                  {profile.followers} Followers
                </span>
                <span className="profile-meta-pill">
                  <Users size={14} />
                  {profile.following} Following
                </span>
                {profile.location && (
                  <span className="profile-meta-pill">
                    <MapPin size={14} />
                    {profile.location}
                  </span>
                )}
                {profile.blog && (
                  <a 
                    href={profile.blog.startsWith("http") ? profile.blog : `https://${profile.blog}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="profile-meta-pill"
                    style={{ textDecoration: "none" }}
                  >
                    <LinkIcon size={14} />
                    Website
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Repositories Controls Section */}
        {!loadingProfile && !error && profile && (
          <>
            <section className="controls-toolbar">
              <div className="controls-toolbar-left">
                <div className="controls-toolbar-search">
                  <Search className="search-icon" size={16} />
                  <input
                    type="text"
                    placeholder="Search repositories..."
                    className="input-field"
                    value={repoQuery}
                    onChange={(e) => setRepoQuery(e.target.value)}
                    aria-label="Search repositories"
                  />
                </div>
              </div>

              <div className="controls-toolbar-right">
                {/* Language Filter Dropdown */}
                <div className="controls-select-wrapper">
                  <select
                    className="controls-select"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    aria-label="Filter by language"
                  >
                    <option value="">All Languages</option>
                    {availableLanguages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Option Dropdown */}
                <div className="controls-select-wrapper">
                  <select
                    className="controls-select"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    aria-label="Sort repositories"
                  >
                    <option value="updated">Last Updated</option>
                    <option value="stars">Stars</option>
                    <option value="forks">Forks</option>
                  </select>
                </div>

                {/* Bookmarks Toggle View Button */}
                <button
                  className={`view-toggle-btn ${viewMode === "bookmarks" ? "active" : ""}`}
                  onClick={() => {
                    setViewMode(viewMode === "all" ? "bookmarks" : "all");
                    setRepoQuery("");
                    setSelectedLanguage("");
                  }}
                  title={viewMode === "bookmarks" ? "Show All Repositories" : "Show Bookmarks"}
                >
                  <Bookmark size={16} />
                  <span>Bookmarks Only</span>
                </button>
              </div>
            </section>

            {/* Repos Grid Display */}
            {loadingRepos ? (
              <GridSkeleton type="repo" count={PER_PAGE} />
            ) : (
              <>
                {filteredAndSortedRepos.length === 0 ? (
                  <div className="state-container">
                    <div className="state-icon-wrapper">
                      <Bookmark size={28} />
                    </div>
                    <h3>No Repositories Found</h3>
                    <p>
                      {viewMode === "bookmarks"
                        ? "You haven't bookmarked any repositories for this user yet, or they don't match the current filters."
                        : "This user doesn't have any repositories matching the search query or language filter."}
                    </p>
                    {viewMode === "bookmarks" && (
                      <button className="btn btn-primary" onClick={() => setViewMode("all")}>
                        View All Repositories
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="repo-grid">
                    {filteredAndSortedRepos.map((repo) => (
                      <RepoCard
                        key={repo.id}
                        repo={repo}
                        isBookmarked={bookmarks.some((b) => b.id === repo.id)}
                        onBookmarkToggle={handleBookmarkToggle}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {renderPagination()}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default UserRepos;
