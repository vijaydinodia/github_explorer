import React, { useEffect, useState } from "react";
import { Sparkles } from "./Icons";
import { getUserProfile } from "../services/githubApi";

const TRENDING_USERNAMES = ["torvalds", "gaearon", "yyx990803", "tj"];

const TrendingDevelopers = ({ onSelectDeveloper }) => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const profiles = await Promise.all(
          TRENDING_USERNAMES.map((username) => getUserProfile(username))
        );
        if (active) {
          setDevelopers(profiles);
        }
      } catch (err) {
        if (active) {
          setDevelopers([
            { login: "torvalds", name: "Linus Torvalds", bio: "Creator of Linux & Git", avatar_url: "https://avatars.githubusercontent.com/u/10242?v=4" },
            { login: "gaearon", name: "Dan Abramov", bio: "Co-creator of Redux & React Core", avatar_url: "https://avatars.githubusercontent.com/u/810438?v=4" },
            { login: "yyx990803", name: "Evan You", bio: "Creator of Vue.js & Vite", avatar_url: "https://avatars.githubusercontent.com/u/499550?v=4" },
            { login: "tj", name: "TJ Holowaychuk", bio: "Prolific open source creator (Express)", avatar_url: "https://avatars.githubusercontent.com/u/25254?v=4" },
          ]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchTrending();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="trending-section">
      <div className="trending-header">
        <Sparkles size={20} style={{ color: "var(--accent)" }} />
        <h3>Trending Developers</h3>
      </div>
      <div className="trending-grid">
        {loading && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="trending-card skeleton-shimmer" style={{ height: "82px", border: "none" }}></div>
        ))}
        {!loading && developers.map((dev) => (
          <div
            key={dev.login}
            className="trending-card"
            onClick={() => onSelectDeveloper(dev.login)}
          >
            <img src={dev.avatar_url} alt={dev.login} />
            <div className="trending-info">
              <h4>{dev.name || dev.login}</h4>
              <p style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {dev.bio ? dev.bio : `@${dev.login}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingDevelopers;
