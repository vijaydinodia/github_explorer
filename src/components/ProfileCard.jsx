import { Link } from "react-router-dom";

const ProfileCard = ({ user }) => {
  return (
    <Link to={`/user/${user.login}`} className="card">
      <img src={user.avatar_url} alt={user.login} />
      <p>{user.login}</p>
    </Link>
  );
};

export default ProfileCard;
