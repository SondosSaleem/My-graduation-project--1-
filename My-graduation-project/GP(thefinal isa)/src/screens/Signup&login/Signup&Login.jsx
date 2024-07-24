import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import LockSharpIcon from "@mui/icons-material/LockSharp";
import Alert from "@mui/material/Alert";
import "./SignupLogin.css";
import { postData } from "../../ApiHelper";
import { setAuthUser } from "../../helper/Storage";

function SignupLogin() {
  const [action, setAction] = useState("Sign Up");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    name: "",
    passwordConfirmation: "",
  });
  const [error, setError] = useState("");

  async function handleLogin(response) {
    setLoading(true);
    setError("");
    try {
      let params = { email: loginForm.email, password: loginForm.password };
      const response = await postData("/auth/login", params);
      console.log(response);
      if (response.error) {
        setError(response.error);
      } else {
        setAuthUser(response);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    setLoading(true);
    setError("");
    try {
      if (loginForm.password !== loginForm.passwordConfirmation) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
      const response = await postData("/auth/signup", loginForm);
      console.log(response);
      if (response.error) {
        setError(response.error);
      } else {
        setAuthUser(response);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      {error && (
        <Alert severity="error" className="error-message">
          {error}
        </Alert>
      )}
      <div className="inputs">
        {action === "Login" ? (
          <div></div>
        ) : (
          <div className="input">
            <PersonIcon className="icons" />
            <input
              type="text"
              placeholder="Name"
              value={loginForm.name}
              onChange={(event) => {
                setLoginForm({ ...loginForm, name: event.target.value });
              }}
            />
          </div>
        )}
        <div className="input">
          <MailIcon className="icons" />
          <input
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(event) => {
              setLoginForm({ ...loginForm, email: event.target.value });
            }}
          />
        </div>
        <div className="input">
          <LockSharpIcon className="icons" />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(event) => {
              setLoginForm({ ...loginForm, password: event.target.value });
            }}
          />
        </div>
        {action === "Sign Up" && (
          <div className="input">
            <LockSharpIcon className="icons" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={loginForm.passwordConfirmation}
              onChange={(event) => {
                setLoginForm({
                  ...loginForm,
                  passwordConfirmation: event.target.value,
                });
              }}
            />
          </div>
        )}
      </div>
      {action === "Login" && (
        <div className="forgot-password">
          Forgot password? <span>Click here!</span>
        </div>
      )}
      {action === "Sign Up" && (
        <div className="forgot-password">
          Have an account?{" "}
          <span
            onClick={() => {
              setAction("Login");
            }}
          >
            Log in
          </span>
        </div>
      )}
      <div className="submit-container">
        <div
          className={action === "Login" ? "submit gray" : "submit"}
          onClick={() => {
            if (action === "Sign Up") {
              handleSignUp();
            } else {
              setAction("Sign Up");
            }
          }}
        >
          Sign Up
        </div>
        <div
          className={action === "Sign Up" ? "submit gray" : "submit"}
          onClick={() => {
            if (action === "Login") {
              handleLogin();
            } else {
              setAction("Login");
            }
          }}
        >
          Login
        </div>
      </div>
      {loading && <div className="loading">Loading...</div>}
    </div>
  );
}

export default SignupLogin;
