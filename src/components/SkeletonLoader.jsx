import React from "react";

export const UserCardSkeleton = () => {
  return (
    <div className="skeleton-user-card">
      <div className="skeleton-avatar skeleton-shimmer"></div>
      <div className="skeleton-title-bar skeleton-shimmer"></div>
      <div className="skeleton-text-bar skeleton-shimmer"></div>
      <div className="skeleton-line skeleton-shimmer"></div>
      <div className="skeleton-button-bar skeleton-shimmer"></div>
    </div>
  );
};

export const RepoCardSkeleton = () => {
  return (
    <div className="skeleton-repo-card">
      <div className="repo-card-top">
        <div style={{ display: "flex", gap: "12px", width: "100%" }}>
          <div className="skeleton-shimmer" style={{ width: "36px", height: "36px", borderRadius: "8px" }}></div>
          <div className="skeleton-repo-title skeleton-shimmer"></div>
        </div>
      </div>
      <div className="skeleton-repo-desc1 skeleton-shimmer"></div>
      <div className="skeleton-repo-desc2 skeleton-shimmer"></div>
      <div className="skeleton-repo-footer skeleton-shimmer" style={{ marginTop: "20px" }}></div>
    </div>
  );
};

export const GridSkeleton = ({ type = "user", count = 6 }) => {
  const skeletons = Array.from({ length: count });
  return (
    <div className={type === "user" ? "user-grid" : "repo-grid"}>
      {skeletons.map((_, i) => (
        type === "user" ? <UserCardSkeleton key={i} /> : <RepoCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default GridSkeleton;
