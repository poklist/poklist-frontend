import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, [navigate]);

  const loginUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.username.value);
    console.log(e.currentTarget.password.value);
    localStorage.setItem("token", "123");
    navigate("/home");
  };

  return (
    <form
      onSubmit={loginUser}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "200px",
        marginInline: "auto",
        gap: "1rem",
        padding: "20px",
        border: "1px solid #ccc",
        width: "500px",
      }}>
      <label>
        Username:
        <input type="text" name="username" />
      </label>
      <label>
        Password:
        <input type="password" name="password" />
      </label>
      <button
        type="submit"
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          cursor: "pointer",
        }}>
        Login in with Google
      </button>
    </form>
  );
}
