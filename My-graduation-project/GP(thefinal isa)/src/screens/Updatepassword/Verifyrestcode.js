import React, { useState } from "react";
import "../changepassword/changepassword.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { postData } from "../ApiHelper";

function VerifyResetCode() {
  const [resetCode, setResetCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await postData("/auth/verifyResetCode");
      // Handle the response or perform any necessary actions
      console.log(response);
      navigate("/changepass");
    } catch (error) {
      // Handle the error
      console.error(error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="password-reset-form">
      <div className="password-reset-form__container">
        <div className="password-reset-form__header">
          <h1 className="password-reset-form__title">Verify Reset Code</h1>
        </div>
        <form className="password-reset-form-submit" >
          <div className="password-reset-form__input-group">
            <label className="password-reset-form__label" htmlFor="newPassword">
              Enter the Code
            </label>
            <input
              className="password-reset-form__input"
              id="verifycode"
              type="text"
              placeholder="verify code"
              name="reset code"
              // onChange={(e) => e.target.value}
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
            />
          </div>
          <div className="password-reset-form__footer">
            <button className="password-reset-form__button" type="submit" onClick={handleSubmit} > 
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyResetCode;



