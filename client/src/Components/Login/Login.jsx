import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import "./Login.scss";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const onChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, {
      expires: 30,
    });
    navigate("/");
  };

  const onSubmitFailure = (errorMsg) => {
    setShowSubmitError(true);
    setErrorMsg(errorMsg);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const userDetails = {
      UserName: username,
      Password: password,
    };

    try {
      const url = "http://localhost:3002/login/";
      const response = await axios.post(url, userDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        onSubmitSuccess(response.data.jwtToken);
      } else {
        onSubmitFailure("Login failed. Please check your credentials.");
      }
    } catch (error) {
      onSubmitFailure(
        "An error occurred while logging in. Please try again."
      );
    }
  };

  return (
    <div className="app-container">
      <div className="login-form-container">
        <form className="form-container" onSubmit={submitForm}>
          <img
            src="https://static.vecteezy.com/system/resources/previews/000/523/845/original/train-railway-icon-isolated-on-white-background-vector.jpg"
            className="login-website-logo-mobile-image"
            alt="website logo"
          />
          <img
            src="https://static.vecteezy.com/system/resources/previews/000/523/845/original/train-railway-icon-isolated-on-white-background-vector.jpg"
            className="login-website-logo-desktop-image"
            alt="website logo"
          />
          <div className="input-container">
            <label className="input-label" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              className="username-input-field"
              value={username}
              onChange={onChangeUsername}
            />
          </div>
          <div className="input-container">
            <label className="input-label" htmlFor="password">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className="password-input-field"
              value={password}
              onChange={onChangePassword}
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          <div className="footDiv flex">
            <span className="text">Don't have an account?</span>
            <Link to="/register">
              <button className="btn">Sign up</button>
            </Link>
          </div>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
