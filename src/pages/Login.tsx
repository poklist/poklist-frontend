import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, [navigate]);

  const baseURL = "http://localhost:7777"
  const loginURL = "http://localhost:7777/login"
  const helloURL = "http://localhost:7777/hello"
  let token: string;
  
  // const hello = async () => {
  //   const response = await fetch(`${baseURL}/hello`, {
  //     method: "GET", 
  //     headers: {
  //       "Authorization": `Bearer ${token}`
  //     },
  //     credentials: "include"
  //   });
  //   console.log(response);
  // };

  const login7777 = async () => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", loginURL, true);
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log(xhr.responseText);
        } else {
          console.error(xhr.statusText);
        }
      }
    };
    xhr.onerror = () => {
      console.error(xhr.statusText);
    };
    xhr.send(null);

  };

  const callHello = async () => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", helloURL, true);
    xhr.onload = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log(xhr.responseText);
        } else {
          console.error(xhr.statusText);
        }
      }
    };
    xhr.onerror = () => {
      console.error(xhr.statusText);
    };
    xhr.send(null);

  };

  return (
    <>
      <form
        action={loginURL}
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "200px",
          marginInline: "auto",
          gap: "1rem",
          width: "500px",
        }}>
        <button
          type="submit"
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            cursor: "pointer",
          }}>
          Login in
        </button>
      </form>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          marginTop: "50px",
        }}>
        {/* <button onClick={login7777}>🚀 Login? 🚀</button> */}
        <button onClick={callHello}>🚀 Hello 🚀</button>
      </div>
    </>
  );
}
