import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoSrc from '../logo.png';
import './Register.css'; 
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords don't match! Please try again.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await axios.post('http://localhost:3001/register', { name, email, password });
      if (result.data === "Already registered") {
        alert("E-mail already registered! Please Login to proceed.");
        navigate('/login');
      } else {
        alert("Registered successfully! Please Login to proceed.");
        navigate('/login');
      }
    } catch (err) {
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

return (
    <div className="register-page">
      <div className="register-container">
        <div className="logo-section">
          <img src={logoSrc} className="logo" alt="Logo" />
          <h1 className="brand-name">TalentCruit AI</h1>
          <p className="tagline">Join Our Talent Network</p>
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="form-input"
              placeholder="Enter your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

          </div>
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
              placeholder="Create a secure password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-input ${
                confirmPassword && password 
                  ? password === confirmPassword 
                    ? 'password-match' 
                    : 'password-mismatch'
                  : ''
              }`}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            {confirmPassword && (
              <div className={`password-hint ${
                password === confirmPassword ? 'success' : 'error'
              }`}>
                {password === confirmPassword 
                  ? '✓ Passwords match' 
                  : 'x Passwords do not match'
                }
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="register-btn"
            disabled={isLoading || (confirmPassword && password !== confirmPassword)}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="login-section">
          <p className="login-text">Already have an account?</p>
          <Link to="/login" className="login-btn">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;



