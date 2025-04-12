import { useState } from "react";

export const LoginRegister = ({ setUser }) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const containerStyle = {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "2rem",
  };

  const boxStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "1.5rem",
    width: "300px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    margin: "0.5rem 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2>Login</h2>
        <label>
          Email:
          <input
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            style={inputStyle}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            style={inputStyle}
          />
        </label>
        <br />
        <button
          onClick={() => {
            fetch("/api/login", {
              method: "POST",
              body: JSON.stringify({
                email: loginEmail,
                password: loginPassword,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => {
                if (response.status !== 200) {
                  throw new Error("Login Failed!");
                }

                return response.json().then((data) => setUser(data));
              })
              .catch((error) => {
                console.error("Login failed:", error);
                alert("Login failed.");
              });
          }}
        >
          Login
        </button>
      </div>

      <div style={boxStyle}>
        <h2>Register</h2>
        <label>
          Name:
          <input
            type="text"
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
            style={inputStyle}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            style={inputStyle}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            style={inputStyle}
          />
        </label>
        <br />
        <button
          onClick={() => {
            fetch("/api/register", {
              method: "POST",
              body: JSON.stringify({
                name: registerName,
                email: registerEmail,
                password: registerPassword,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => {
                if (response.status !== 200) {
                  throw new Error("Register not valid");
                }

                alert("Registration successful!");

                setRegisterName("");
                setRegisterEmail("");
                setRegisterPassword("");
              })
              .catch((error) => {
                console.error("Registration failed:", error);
                alert("Registration failed.");
              });
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
};