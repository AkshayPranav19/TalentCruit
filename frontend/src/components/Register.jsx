import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoSrc from './logo.png';

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
      console.log(result);
      
      if (result.data === "Already registered") {
        alert("E-mail already registered! Please Login to proceed.");
        navigate('/login');
      } else {
        alert("Registered successfully! Please Login to proceed.");
        navigate('/login');
      }
    } catch (err) {
      console.log(err);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          height: 100%;
          overflow-x: hidden;
        }

        .register-page {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4a90e2 100%);
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          top: 0;
          left: 0;
          overflow-y: auto;
          padding: 20px 0;
        }

        /* Animated background elements */
        .bg-animation {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .floating-shape {
          position: absolute;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }

        .shape1 {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape2 {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 30%;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .shape3 {
          width: 100px;
          height: 100px;
          background: white;
          border-radius: 20%;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        /* Glass morphism container */
        .register-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 48px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          z-index: 1;
          animation: slideUp 0.8s ease-out;
          margin: auto;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Logo and header */
        .logo-section {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo {
          width: 84px;
          height: 84px;
          margin: 0 auto 16px;
          background: linear-gradient(135deg, #1e88e5 0%, #3f51b5 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .brand-name {
          color: white;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .tagline {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 400;
        }

        /* Form styles */
        .register-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          position: relative;
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .form-group:nth-child(1) { animation-delay: 0.2s; }
        .form-group:nth-child(2) { animation-delay: 0.3s; }
        .form-group:nth-child(3) { animation-delay: 0.4s; }
        .form-group:nth-child(4) { animation-delay: 0.5s; }

        .form-label {
          display: block;
          color: white;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .form-input {
          width: 100%;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid transparent;
          border-radius: 12px;
          font-size: 16px;
          color: #333;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input:focus {
          border-color: #1e88e5;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 0 4px rgba(30, 136, 229, 0.2);
          transform: translateY(-2px);
        }

        .form-input::placeholder {
          color: #999;
        }

        /* Password validation styling */
        .password-match {
          border-color: #4caf50 !important;
        }

        .password-mismatch {
          border-color: #f44336 !important;
        }

        .password-hint {
          font-size: 12px;
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.7);
        }

        .password-hint.error {
          color: #ff6b6b;
        }

        .password-hint.success {
          color: #4caf50;
        }

        /* Register button */
        .register-btn {
          background: linear-gradient(135deg, #1e88e5 0%, #3f51b5 100%);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          overflow: hidden;
          animation: fadeInUp 0.6s ease-out forwards;
          animation-delay: 0.6s;
          opacity: 0;
        }

        .register-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(30, 136, 229, 0.4);
        }

        .register-btn:active {
          transform: translateY(0);
        }

        .register-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .register-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .register-btn:hover:not(:disabled)::before {
          width: 300px;
          height: 300px;
        }

        /* Login section */
        .login-section {
          text-align: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          animation: fadeInUp 0.6s ease-out forwards;
          animation-delay: 0.8s;
          opacity: 0;
        }

        .login-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          margin-bottom: 12px;
        }

        .login-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .login-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-1px);
          color: white;
          text-decoration: none;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .register-container {
            margin: 20px;
            padding: 32px 24px;
          }
          
          .brand-name {
            font-size: 24px;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="bg-animation">
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
      </div>

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
                  : '✗ Passwords do not match'
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