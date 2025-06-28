import axios from 'axios';
export const getStatusColor = (status) => {
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

export const getStatusIcon = (status) => {
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

export const calculateScoreBreakdown = (userData) => {
  const mlScore = userData?.mlScore || 0;
  const llmScore = userData?.llmScore || 0;
  const codeScore = userData?.codeScore || 0;
  
  return {
    mlContribution: Math.round(mlScore * 0.2),
    llmContribution: Math.round(llmScore * 0.4),
    codeContribution: Math.round(codeScore * 0.4),
    total: userData?.total || userData?.totalScore || 0
  };
};

export const fetchUserData = async (userEmail) => {
  const response = await fetch(`http://localhost:3001/get-user/${userEmail}`);
  const data = await response.text();
  
  if (data === "User not found") {
    throw new Error('User not found');
  }
  
  return JSON.parse(data);
};