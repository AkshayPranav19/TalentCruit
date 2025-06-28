import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoSrc from '../logo.png';
import './Login.css'; 
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

 
  const handleSubmit = async (event) => {
  event.preventDefault();
  setIsLoading(true);

  try {
  
    const loginRes = await axios.post(
      'http://localhost:3001/login',
      { email, password }
    );

    if (loginRes.data !== "Success") {
      alert('Incorrect password! Please try again.');
      return;
    }

    localStorage.setItem('userEmail', email);


    const { data: user } = await axios.get(
      `http://localhost:3001/get-user/${encodeURIComponent(email)}`
    );

    
    if (user.completed_resume && user.completed_coding) {
      navigate('/completed');
    } else if (user.completed_resume) {
      navigate('/coding');
    } else {
      navigate('/resume');
    }

  } catch (err) {
    console.error('Login or fetch-user failed:', err);
    alert('Login failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-section">
          <img src={logoSrc} className="logo" alt="Logo" />
          <h1 className="brand-name">TalentCruit AI</h1>
          <p className="tagline">Intelligent Talent Acquisition</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="register-btn"
          >
            Sign In
          </button>
        </form>

        <div className="register-section">
          <p className="register-text">Don't have an account?</p>
          <Link to="/register" className="login-btn">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;