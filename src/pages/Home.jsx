import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import useLocalStorage from "../hooks/useLocalStorage";
import { searchUsers } from "../services/githubApi";
import UserCard from "../components/UserCard";
import GridSkeleton from "../components/SkeletonLoader";
import SearchSuggestions from "../components/SearchSuggestions";
import RecentSearches from "../components/RecentSearches";
import TrendingDevelopers from "../components/TrendingDevelopers";
import ThemeToggle from "../components/ThemeToggle";
import { Search, AlertCircle, Sparkles } from "../components/Icons";
const heroImage = "https://github.com/fluidicon.png";

const Home = () => {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  // Local storage state for recent searches
  const [recentSearches, setRecentSearches] = useLocalStorage("recent_searches", []);
  


  const debouncedQuery = useDebounce(query, 300);

  // Handle clicking outside suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestionsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    const cleanQuery = debouncedQuery.trim();
    if (!cleanQuery) {
      setSuggestions([]);
      setSuggestionsVisible(false);
      return;
    }

    // Skip if search was just submitted (prevents redundant dropdown opening)
    if (searchSubmitted && query.trim() === cleanQuery) {
      setSuggestionsVisible(false);
      return;
    }

    const fetchSuggestions = async () => {
      setSuggestionsLoading(true);
      setSuggestionsVisible(true);
      try {
        const data = await searchUsers(cleanQuery);
        setSuggestions(data.items ? data.items.slice(0, 5) : []);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Main search action
  const handleSearch = async (searchVal) => {
    const cleanVal = searchVal.trim();
    if (!cleanVal) return;

    setLoading(true);
    setError("");
    setSearchSubmitted(true);
    setSuggestionsVisible(false);

    // Save to history
    const updated = [cleanVal, ...recentSearches.filter((item) => item.toLowerCase() !== cleanVal.toLowerCase())];
    setRecentSearches(updated.slice(0, 8));

    try {
      const data = await searchUsers(cleanVal);
      setSearchResults(data.items || []);
    } catch (err) {
      setSearchResults([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  const handleSelectSuggestion = (username) => {
    navigate(`/user/${username}?page=1`);
  };

  const handleSelectRecent = (term) => {
    setQuery(term);
    handleSearch(term);
  };

  const handleRemoveRecent = (term) => {
    setRecentSearches(recentSearches.filter((item) => item !== term));
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };



  return (
    <main className="home-page">
      {/* Floating Header Actions */}
      <div style={{ position: "absolute", top: "24px", right: "24px", zIndex: 100 }}>
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-eyebrow">Discover developers</span>
          <h1 className="gradient-title">GitHub Explorer</h1>
          <p className="hero-description">
            Search for developers, examine their public repositories, apply tags and custom sorts, and bookmark your favorites.
          </p>

          {/* Search Panel with Suggestions Dropdown */}
          <div className="search-container-wrapper" ref={wrapperRef}>
            <div className="search-box-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search username (e.g. torvalds, gaearon)..."
                className="input-field"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchSubmitted(false);
                }}
                onKeyDown={handleKeyDown}
                aria-label="Search GitHub users"
              />
              <button 
                className="btn btn-primary search-action-btn"
                disabled={!query.trim()}
                onClick={() => handleSearch(query)}
              >
                Search
              </button>
            </div>

            <SearchSuggestions
              suggestions={suggestions}
              loading={suggestionsLoading}
              onSelect={handleSelectSuggestion}
              visible={suggestionsVisible && query.trim().length > 0}
            />
          </div>

          {/* Recent Searches Panel */}
          <RecentSearches
            history={recentSearches}
            onSelect={handleSelectRecent}
            onRemove={handleRemoveRecent}
            onClear={handleClearRecent}
          />
        </div>

        <div className="hero-visual" aria-hidden="true">
          <img src={heroImage} alt="Premium GitHub Dashboard UI representation" />
        </div>
      </section>

      {/* Results Section or Trending Section */}
      <section className="results-section" style={{ borderTop: "1px solid var(--border)", paddingTop: "40px" }}>
        {searchSubmitted ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2>Search Results</h2>
              <button className="btn btn-secondary" onClick={() => { setSearchSubmitted(false); setQuery(""); setSearchResults([]); }}>
                Reset Search
              </button>
            </div>

            {loading && <GridSkeleton type="user" count={8} />}

            {error && (
              <div className="state-container">
                <div className="state-icon-wrapper">
                  <AlertCircle size={28} />
                </div>
                <h3>Error Loading Results</h3>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={() => handleSearch(query)}>
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && searchResults.length === 0 && (
              <div className="state-container">
                <div className="state-icon-wrapper">
                  <AlertCircle size={28} style={{ color: "var(--danger)" }} />
                </div>
                <h3>No Developers Found</h3>
                <p>We couldn't find any GitHub users matching "{query}". Check spelling or try a different search.</p>
              </div>
            )}

            {!loading && !error && searchResults.length > 0 && (
              <div className="user-grid">
                {searchResults.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </>
        ) : (
          <TrendingDevelopers onSelectDeveloper={handleSelectSuggestion} />
        )}
      </section>
    </main>
  );
};

export default Home;
