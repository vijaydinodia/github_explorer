import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../Custom_hooks/useDebounce";


const Home = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // debounce
  const debouncedQuery = useDebounce(query, 400);

  // fetch users
  useEffect(() => {
    if (!debouncedQuery) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.github.com/search/users?q=${debouncedQuery}`,
        );
        const data = await res.json();
        setUsers(data.items || []);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [debouncedQuery]);

  return (
    <div className="home-container">
      <h1 className="home-title">GitHub Explorer</h1>
      
      {/* search */}
      <div className="search-container">
        <input
          className="search"
          type="text"
          placeholder="Search GitHub users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

    {/*skeleton loading */}
      {loading && (
        <div className="grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="card skeleton" key={index}>
              <div className="skeleton-img"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-btn"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && !query && (
        <p className="empty-text">Start searching users...</p>
      )}

      {!loading && query && users.length === 0 && (
        <p className="empty-text">No users found</p>
      )}

      {!loading && users.length > 0 && (
        <div className="grid">
          {users.map((user) => (
            <div className="card" key={user.id}>
              <img src={user.avatar_url} alt={user.login} />
              <h3>{user.login}</h3>

              <button onClick={() => navigate(`/user/${user.login}`)}>
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
