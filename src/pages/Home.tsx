import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div>
      <h1>Home</h1>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
