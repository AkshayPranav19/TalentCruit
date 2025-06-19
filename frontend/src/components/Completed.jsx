import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          navigate('/login'); 
          return;
        }

        setLoading(true);
        const response = await axios.get(`http://localhost:3001/get-user/${userEmail}`);
        
        if (response.data === "User not found") {
          setError('User not found');
        } else {
          setUserData(response.data);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <div className="text-center p-8">Loading user data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  if (!userData) {
    return <div className="text-center p-8">No user data available</div>;
  }


  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'linear-gradient(135deg, #10b981, #059669)';
      case 'rejected':
        return 'linear-gradient(135deg, #ef4444, #dc2626)';
      case 'waitlist':
        return 'linear-gradient(135deg, #f59e0b, #d97706)';
      default:
        return 'linear-gradient(135deg, #6b7280, #4b5563)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return '✓';
      case 'rejected':
        return '✗';
      case 'waitlist':
        return '⏳';
      default:
        return '?';
    }
  };

  if (loading) {
    return (
      <>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #3b4a7a 0%, #2d3561 50%, #1e2347 100%);
            min-height: 100vh;
            color: #ffffff;
          }
          .loading-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid #4dabf7;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div className="loading-container">
          <div>
            <div className="spinner"></div>
            <p>Loading your results...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #3b4a7a 0%, #2d3561 50%, #1e2347 100%);
            min-height: 100vh;
            color: #ffffff;
          }
          .error-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
          }
          .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 25px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            background: linear-gradient(135deg, #4dabf7, #3b82f6);
            color: white;
            margin-top: 20px;
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(77, 171, 247, 0.3);
          }
        `}</style>
        <div className="error-container">
          <div>
            <p style={{ color: '#ef4444', fontSize: '1.2rem', marginBottom: '20px' }}>{error}</p>
            <button className="btn" onClick={() => navigate('/login')}>
              Back to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #3b4a7a 0%, #2d3561 50%, #1e2347 100%);
          min-height: 100vh;
          color: #ffffff;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #4dabf7, #74c0fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .header p {
          font-size: 1.1rem;
          opacity: 0.9;
        }
        .status-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          margin-bottom: 40px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 15px 30px;
          border-radius: 50px;
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
          min-width: 200px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        .status-icon {
          font-size: 1.5rem;
          margin-right: 10px;
        }
        .scores-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .score-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 30px;
          text-align: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        .score-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .score-value {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #4dabf7, #74c0fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .score-label {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 5px;
        }
        .score-description {
          font-size: 0.9rem;
          opacity: 0.7;
        }
        .feedback-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 40px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .feedback-card h3 {
          font-size: 1.3rem;
          margin-bottom: 20px;
          color: #74c0fc;
        }
        .feedback-content {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        padding: 20px;
        line-height: 1.6;
        font-size: 1rem;
        max-height: 300px; /* You can adjust this height */
        overflow-y: auto;
        }

        .feedback-content::-webkit-scrollbar {
        width: 6px;
        }

        .feedback-content::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
        }
        .progress-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 40px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .progress-card h3 {
          font-size: 1.3rem;
          margin-bottom: 20px;
          color: #74c0fc;
        }
        .progress-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .progress-item:last-child {
          border-bottom: none;
        }
        .progress-status {
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .progress-status.completed {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }
        .progress-status.pending {
          background: rgba(255, 255, 255, 0.2);
          color: #d1d5db;
        }
        .breakdown-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 40px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .breakdown-card h3 {
          font-size: 1.3rem;
          margin-bottom: 20px;
          color: #74c0fc;
        }
        .formula {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-bottom: 20px;
          font-style: italic;
        }
        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .breakdown-item:last-child {
          border-bottom: none;
          border-top: 2px solid rgba(255, 255, 255, 0.3);
          padding-top: 20px;
          margin-top: 10px;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          background: linear-gradient(135deg, #4dabf7, #3b82f6);
          color: white;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(77, 171, 247, 0.3);
        }
        .text-center {
          text-align: center;
        }
        .total-score {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>Assessment Results</h1>
          <p>Welcome back, {userData?.name || 'User'}</p>
        </div>

        {/* Application Status Card */}
        <div className="status-card">
          <h2 style={{ marginBottom: '30px', fontSize: '1.5rem' }}>Application Status</h2>
          <div 
            className="status-badge" 
            style={{ background: getStatusColor(userData?.accepted) }}
          >
            <span className="status-icon">{getStatusIcon(userData?.accepted)}</span>
            {userData?.accepted?.toUpperCase() || 'PENDING'}
          </div>
        </div>

        {/* Scores Grid */}
        <div className="scores-grid">
          {/* Total Score */}
          <div className="score-card">
            <div className="score-value total-score">
              {userData?.total || userData?.totalScore || 'N/A'}
            </div>
            <div className="score-label">Total Score</div>
            <div className="score-description">Overall Assessment</div>
          </div>

          {/* ML Score */}
          <div className="score-card">
            <div className="score-value">
              {userData?.mlScore || 'N/A'}
            </div>
            <div className="score-label">ML Score</div>
            <div className="score-description">Machine Learning Model</div>
          </div>

          {/* LLM Score */}
          <div className="score-card">
            <div className="score-value">
              {userData?.llmScore || 'N/A'}
            </div>
            <div className="score-label">LLM Score</div>
            <div className="score-description">Resume Analysis</div>
          </div>

          {/* Coding Score */}
          <div className="score-card">
            <div className="score-value">
              {userData?.codeScore || 0}
            </div>
            <div className="score-label">Coding Score</div>
            <div className="score-description">Technical Assessment</div>
          </div>
        </div>

        {/* GPT Feedback Section */}
        {userData?.gptFeedback && (
          <div className="feedback-card">
            <h3>Detailed Feedback</h3>
            <div className="feedback-content">
              {userData.gptFeedback}
            </div>
          </div>
        )}

        {/* Assessment Progress */}
        <div className="progress-card">
          <h3>Assessment Progress</h3>
          <div className="progress-item">
            <span>Resume Evaluation</span>
            <span className={`progress-status ${userData?.completed_resume ? 'completed' : 'pending'}`}>
              {userData?.completed_resume ? '✓ Completed' : '⏳ Pending'}
            </span>
          </div>
          <div className="progress-item">
            <span>Coding Assessment</span>
            <span className={`progress-status ${userData?.completed_coding ? 'completed' : 'pending'}`}>
              {userData?.completed_coding ? '✓ Completed' : '⏳ Pending'}
            </span>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="breakdown-card">
          <h3>Score Breakdown</h3>
          <div className="formula">
            Total Score = (ML Score × 0.2) + (LLM Score × 0.4) + (Coding Score × 0.4)
          </div>
          <div className="breakdown-item">
            <span>ML Score (20%)</span>
            <span>{userData?.mlScore || 0} × 0.2 = {userData?.mlScore ? Math.round(userData.mlScore * 0.2) : 0}</span>
          </div>
          <div className="breakdown-item">
            <span>LLM Score (40%)</span>
            <span>{userData?.llmScore || 0} × 0.4 = {userData?.llmScore ? Math.round(userData.llmScore * 0.4) : 0}</span>
          </div>
          <div className="breakdown-item">
            <span>Coding Score (40%)</span>
            <span>{userData?.codeScore || 0} × 0.4 = {userData?.codeScore ? Math.round(userData.codeScore * 0.4) : 0}</span>
          </div>
          <div className="breakdown-item">
            <span>Total Score</span>
            <span>{userData?.total || userData?.totalScore || 0}</span>
          </div>
        </div>

        {/* Logout Button */}
        <div className="text-center">
          <button
            className="btn"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    </>
  );
}