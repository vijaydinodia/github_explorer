import { Link } from "react-router-dom";

const ProfileCard = ({ user }) => {
  return (
    <Link to={`/user/${user.login}?page=1`} className="user-card">
      <img src={user.avatar_url} alt={user.login} />
      <h3>{user.login}</h3>
      <span>View repos</span>
    </Link>
  );
};

export default ProfileCard;
