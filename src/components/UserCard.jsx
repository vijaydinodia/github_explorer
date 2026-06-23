import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserProfile } from "../services/githubApi";

const UserCard = ({ user }) => {
  const [followers, setFollowers] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile(user.login);
        if (active) {
          setFollowers(profile.followers);
        }
      } catch (err) {
        if (active) setFollowers("N/A");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchFollowers();
    return () => {
      active = false;
    };
  }, [user.login]);

  return (
    <div className="premium-user-card">
      <img src={user.avatar_url} alt={user.login} className="user-card-avatar" />
      <h3 className="user-card-name">{user.login}</h3>
      <span className="user-card-type">{user.type}</span>
      
      <div className="user-card-stats">
        <div className="user-card-stat">
          <span className="user-card-stat-num">
            {loading ? "..." : followers !== null ? followers : "—"}
          </span>
          <span className="user-card-stat-label">Followers</span>
        </div>
      </div>

      <div className="user-card-action">
        <Link to={`/user/${user.login}?page=1`} className="btn btn-primary" style={{ width: "100%" }}>
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
