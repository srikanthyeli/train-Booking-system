import { Component } from "react";
import axios from "axios";
import {Link} from "react-router-dom"

import "./Register.css";

class Register extends Component {
  state = {
    username: "",
    password: "",
    email: "",
    showSubmitError: false,
    errorMsg: "",
  };

  onChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  };

  onChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  onChangeEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  onSubmitSuccess = () => {
    // Clear form and show success message
    this.setState({
      username: "",
      password: "",
      email: "",
      showSubmitError: false,
    });
    alert("Registration successful!");
  };

  onSubmitFailure = (errorMsg) => {
    // Display error message
    this.setState({ showSubmitError: true, errorMsg });
  };

  submitForm = async (event) => {
    event.preventDefault();
    const { username, password, email } = this.state;
    const userDetails = {
      Email: email,
      UserName: username,
      Password: password,
    };

    try {
      const url = "http://localhost:3002/register/";
      const response = await axios.post(url, userDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        this.onSubmitSuccess();
      }
    } catch (error) {
      console.error(error);
      this.onSubmitFailure(
        "An error occurred while registering. Please try again."
      );
    }
  };

  renderEmailField = () => {
    const { email } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="email">
          EMAIL
        </label>
        <input
          type="text"
          id="email"
          className="password-input-field"
          value={email}
          onChange={this.onChangeEmail}
        />
      </>
    );
  };

  renderPasswordField = () => {
    const { password } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
        />
      </>
    );
  };

  renderUsernameField = () => {
    const { username } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
        />
      </>
    );
  };

  render() {
    const { showSubmitError, errorMsg } = this.state;
    return (
      <div className="app-container">
        <div className="login-form-container">
          <form className="form-container" onSubmit={this.submitForm}>
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
            <div className="input-container">{this.renderUsernameField()}</div>
            <div className="input-container">{this.renderEmailField()}</div>
            <div className="input-container">{this.renderPasswordField()}</div>
            <button type="submit" className="login-button">
              Register
            </button>
            <div className="bottom-container">
              <p>Already we have account?</p>
              <Link to={"/login"}>
                <button className="login-button">LOGIN</button>
              </Link>
            </div>
            

            {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
