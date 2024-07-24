import React, { useState } from "react";
import "../changepassword/changepassword.css";
import { putData } from "../ApiHelper";
import { useNavigate } from "react-router-dom";

function Updatepassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    putData("http://localhost:4000/api/reset-password", {
        email: email,
        password: password,
      })
      .then((response) => {
        // Handle the response or perform any necessary actions
        console.log(response.data);
      })
      navigate("/home")
      .catch((error) => {
        // Handle the error
        alert("error" + error.message);
      });
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div className="password-reset-form">
      <div className="password-reset-form__container">
        <div className="password-reset-form__header">
          <h1 className="password-reset-form__title">Reset Your Password</h1>
        </div>
        <form className="password-reset-form-submit" >
          <div className="password-reset-form__input-group">
            <label className="password-reset-form__label" htmlFor="email">
              Enter Your Email
            </label>
            <input
              className="password-reset-form__input"
              id="email"
              type="email"
              placeholder="your email"
              name="email"
              value={email}
              onChange={handleEmailChange}
            />
            <label className="password-reset-form__label" htmlFor="password">
              Enter Your New Password
            </label>
            <input
              className="password-reset-form__input"
              id="password"
              type="password"
              placeholder="New Password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="password-reset-form__footer">
            <button className="password-reset-form__button" type="submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Updatepassword;