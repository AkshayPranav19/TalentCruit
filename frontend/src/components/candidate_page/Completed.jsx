import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getStatusColor, getStatusIcon, calculateScoreBreakdown } from './dashboardUtils.js';
import './Dashboard.css';

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
    return (
      <div className="dashboard dashboard-body">
        <div className="dashboard-loading-container">
          <div>
            <div className="dashboard-spinner"></div>
            <p>Loading your results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard dashboard-body">
        <div className="dashboard-error-container">
          <div>
            <p className="dashboard-error-text">{error}</p>
            <button className="dashboard-btn" onClick={() => navigate('/login')}>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="dashboard dashboard-body">
        <div className="dashboard-text-center" style={{ padding: '8rem 0' }}>
          No user data available
        </div>
      </div>
    );
  }

  const scoreBreakdown = calculateScoreBreakdown(userData);

  return (
    <div className="dashboard dashboard-body">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Assessment Results</h1>
          <p>Welcome back, {userData?.name || 'User'}</p>
        </div>
        
        <div className="dashboard-status-card">
          <h2 className="dashboard-status-title">Application Status</h2>
          <div 
            className="dashboard-status-badge" 
            style={{ background: getStatusColor(userData?.accepted) }}
          >
            <span className="dashboard-status-icon">{getStatusIcon(userData?.accepted)}</span>
            {userData?.accepted?.toUpperCase() || 'PENDING'}
          </div>
        </div>

        <div className="dashboard-scores-grid">
          <div className="dashboard-score-card">
            <div className="dashboard-score-value total-score">
              {userData?.total || userData?.totalScore || 'N/A'}
            </div>
            <div className="dashboard-score-label">Total Score</div>
            <div className="dashboard-score-description">Overall Assessment</div>
          </div>

          <div className="dashboard-score-card">
            <div className="dashboard-score-value">
              {userData?.mlScore || 'N/A'}
            </div>
            <div className="dashboard-score-label">ML Score</div>
            <div className="dashboard-score-description">Machine Learning Model</div>
          </div>

          <div className="dashboard-score-card">
            <div className="dashboard-score-value">
              {userData?.llmScore || 'N/A'}
            </div>
            <div className="dashboard-score-label">LLM Score</div>
            <div className="dashboard-score-description">Resume Analysis</div>
          </div>

          <div className="dashboard-score-card">
            <div className="dashboard-score-value">
              {userData?.codeScore || 0}
            </div>
            <div className="dashboard-score-label">Coding Score</div>
            <div className="dashboard-score-description">Technical Assessment</div>
          </div>
        </div>

        {userData?.gptFeedback && (
          <div className="dashboard-feedback-card">
            <h3>Detailed Feedback</h3>
            <div className="dashboard-feedback-content">
              {userData.gptFeedback}
            </div>
          </div>
        )}

        <div className="dashboard-progress-card">
          <h3>Assessment Progress</h3>
          <div className="dashboard-progress-item">
            <span>Resume Evaluation</span>
            <span className={`dashboard-progress-status ${userData?.completed_resume ? 'completed' : 'pending'}`}>
              {userData?.completed_resume ? '✓ Completed' : '⏳ Pending'}
            </span>
          </div>
          <div className="dashboard-progress-item">
            <span>Coding Assessment</span>
            <span className={`dashboard-progress-status ${userData?.completed_coding ? 'completed' : 'pending'}`}>
              {userData?.completed_coding ? '✓ Completed' : '⏳ Pending'}
            </span>
          </div>
        </div>

        <div className="dashboard-breakdown-card">
          <h3>Score Breakdown</h3>
          <div className="dashboard-formula">
            Total Score = (ML Score × 0.2) + (LLM Score × 0.4) + (Coding Score × 0.4)
          </div>
          <div className="dashboard-breakdown-item">
            <span>ML Score (20%)</span>
            <span>{userData?.mlScore || 0} × 0.2 = {scoreBreakdown.mlContribution}</span>
          </div>
          <div className="dashboard-breakdown-item">
            <span>LLM Score (40%)</span>
            <span>{userData?.llmScore || 0} × 0.4 = {scoreBreakdown.llmContribution}</span>
          </div>
          <div className="dashboard-breakdown-item">
            <span>Coding Score (40%)</span>
            <span>{userData?.codeScore || 0} × 0.4 = {scoreBreakdown.codeContribution}</span>
          </div>
          <div className="dashboard-breakdown-item">
            <span>Total Score</span>
            <span>{scoreBreakdown.total}</span>
          </div>
        </div>

        <div className="dashboard-text-center">
          <button
            className="dashboard-btn"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}