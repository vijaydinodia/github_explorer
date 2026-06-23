const Repositorie = ({ repo }) => {
  return (
    <div className="repo-card">
      <h2>{repo.name}</h2>
      <p>{repo.description || "No description available."}</p>

      <div className="repo-meta">
        <span>{repo.stargazers_count} stars</span>
        <span>{repo.forks_count} forks</span>
      </div>

      <a href={repo.html_url} target="_blank" rel="noreferrer">
        View repository
      </a>
    </div>
  );
};

export default Repositorie;
