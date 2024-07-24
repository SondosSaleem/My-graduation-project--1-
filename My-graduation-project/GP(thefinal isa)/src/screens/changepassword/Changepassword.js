import React,{useState} from 'react'
import { useNavigate } from "react-router-dom";
import "../changepassword/changepassword.css";
import axios from 'axios';

function Changepassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          await axios.post('http://localhost:4000/api/v1/auth/forgotPassword', { email });
          alert('Reset code sent to email');
          navigate("/verifyreset")
        } catch (error) {
          alert("error" );
        }
      };
  return (
    <div className="password-reset-form">
      <div className="password-reset-form__container">
        <div className="password-reset-form__header">
          <h1 className="password-reset-form__title">Reset your Password </h1>
          <p className="password-reset-form__description">Forgot Password?</p>
        </div>
        <form className='password-reset-form-submit'  >
          <div className="password-reset-form__input-group">
            <label className="password-reset-form__label" htmlFor="email">Enter Your e-mail address</label>
            <input className="password-reset-form__input" id="email" type="email" onChange={(event) => setEmail(event.target.value)}  placeholder=" email" />
          </div>
          <div className="password-reset-form__footer">
            <div className="password-reset-form__button" type="submit" onClick={handleSubmit} >Send Rest Code</div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Changepassword

