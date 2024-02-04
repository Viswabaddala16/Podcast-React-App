import React, { useState } from 'react';
import '../index.css';
import LoginForm from '../Components/SignupComponents/LoginForm/index.js'
import SignupForm from '../Components/SignupComponents/SignupForm.js';
import Header from '../Components/Common/Header/index.js';
import { Link } from 'react-router-dom';

function SignupPage() {
  const [flag, setFlag] = useState(false);
  console.log('Rendering SignupPage');

  const toggleFlag = () => {
    setFlag(!flag);
  };

  return (
    <div>
      <Header />
      <div className='input-wrapper'>
        {!flag ? <h1>Signup</h1> : <h1>Login</h1>}
        {flag ? <LoginForm /> : <SignupForm />}
        {!flag ? (
          
          <div style={{ cursor: 'pointer' }} onClick={toggleFlag} >
            <div>Already have an Account? Click here to Login.</div>
            
          </div>
        ) : (
          <div style={{ cursor: 'pointer' }} onClick={toggleFlag} className='login-flex'>
            <div>Don't have an account? Click to SignUp.</div>
            <div><Link to="/reset-password" className='link'>Forgot Password?</Link></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignupPage;
