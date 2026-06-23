import React from "react";
import { AlertCircle } from "./Icons";

const SearchSuggestions = ({ suggestions, loading, onSelect, visible }) => {
  if (!visible) return null;

  return (
    <div className="suggestions-dropdown">
      {loading && <div className="suggestions-loading">Searching users...</div>}
      
      {!loading && suggestions.length === 0 && (
        <div className="suggestions-empty">
          <AlertCircle size={16} style={{ marginRight: "6px", display: "inline", verticalAlign: "text-bottom" }} />
          No developers found
        </div>
      )}
      
      {!loading && suggestions.map((user) => (
        <div
          key={user.id}
          className="suggestion-item"
          onClick={() => onSelect(user.login)}
        >
          <img src={user.avatar_url} alt={user.login} />
          <span className="suggestion-login">{user.login}</span>
          <span className="suggestion-type">{user.type}</span>
        </div>
      ))}
    </div>
  );
};

export default SearchSuggestions;
