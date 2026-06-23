import React from "react";
import { X, History } from "./Icons";

const RecentSearches = ({ history, onSelect, onRemove, onClear }) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="recent-searches-container">
      <div className="recent-searches-header">
        <h4 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <History size={14} />
          Recent Searches
        </h4>
        <button className="clear-history-btn" onClick={onClear}>
          Clear All
        </button>
      </div>
      <div className="recent-pills">
        {history.map((term, index) => (
          <span key={index} className="recent-pill" onClick={() => onSelect(term)}>
            {term}
            <span
              className="remove-pill"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(term);
              }}
              aria-label={`Remove ${term} from history`}
            >
              <X size={12} />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
