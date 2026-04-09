const BASE_URL = "https://api.github.com";

export const searchUsers = async (query) => {
  const res = await fetch(`${BASE_URL}/search/users?q=${query}`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const getRepos = async (username, page = 1) => {
  const res = await fetch(
    `${BASE_URL}/users/${username}/repos?page=${page}&per_page=6`,
  );

  if (!res.ok) throw new Error("Failed to fetch repos");

  return res.json();
};
