const BASE_URL = "https://api.github.com";

// Memory cache to avoid redundant hits and respect rate limits
const cache = new Map();

// Helper to configure headers (handles Personal Access Token if saved in localStorage)
const getHeaders = () => {
  const headers = {
    Accept: "application/vnd.github.v3+json",
  };
  const token = localStorage.getItem("github_token");
  if (token) {
    headers["Authorization"] = `token ${token}`;
  }
  return headers;
};

/**
 * Search users by query
 */
export const searchUsers = async (query) => {
  const cacheKey = `search_users_${query}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const res = await fetch(`${BASE_URL}/search/users?q=${query}&per_page=12`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Please configure a Personal Access Token in the developer options or wait a few minutes.");
    }
    throw new Error("Failed to search GitHub users");
  }

  const data = await res.json();
  cache.set(cacheKey, data);
  return data;
};

/**
 * Get detailed profile for a single user
 */
export const getUserProfile = async (username) => {
  const cacheKey = `user_profile_${username.toLowerCase()}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const res = await fetch(`${BASE_URL}/users/${username}`, {
    headers: getHeaders(),
  });

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("GitHub API rate limit exceeded.");
    }
    throw new Error(`Failed to load profile for "${username}"`);
  }

  const data = await res.json();
  cache.set(cacheKey, data);
  return data;
};

/**
 * Get repositories for a user with page and page size
 */
export const getRepos = async (username, page = 1, perPage = 6) => {
  const cacheKey = `user_repos_${username.toLowerCase()}_page_${page}_per_${perPage}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const res = await fetch(
    `${BASE_URL}/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated`,
    { headers: getHeaders() }
  );

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("GitHub API rate limit exceeded.");
    }
    throw new Error(`Failed to fetch repositories for "${username}"`);
  }

  const data = await res.json();
  cache.set(cacheKey, data);
  return data;
};
