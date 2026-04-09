import { useState, useEffect } from "react";
import { getRepos } from "../services/githubApi";

const useRepos = (username, page) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;

    const fetchRepos = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getRepos(username, page);
        setRepos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username, page]);

  return { repos, loading, error };
};

export default useRepos;
