import axios from 'axios';
import { API_ENDPOINTS, SCORING_WEIGHTS, PASS_THRESHOLD } from './constants.js';

/**
 
 * @param {string} email
 * @returns {Promise<object>} 
 */
export const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(API_ENDPOINTS.GET_USER(email));
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error.response?.data || error.message);
    throw error;
  }
};

/**
 
 * @param {string} userEmail
 * @param {number} codeScore
 * @returns {Promise<object>} 
 */
export const updateUserScores = async (userEmail, codeScore) => {
  try {
    const userData = await getUserByEmail(userEmail);
    
    if (userData === "User not found") {
      throw new Error("User not found in database");
    }
    
    const mlScore = userData.mlScore || 0;
    const llmScore = userData.llmScore || 0;
    const totalScore = Math.round(
      SCORING_WEIGHTS.ML_SCORE * mlScore + 
      SCORING_WEIGHTS.LLM_SCORE * llmScore + 
      SCORING_WEIGHTS.CODE_SCORE * codeScore
    );
    const accepted = totalScore < PASS_THRESHOLD ? 'rejected' : 'waitlist';
    
    console.log('Calculating scores:', {
      email: userEmail,
      mlScore,
      llmScore,
      codeScore,
      totalScore,
      accepted
    });

    const response = await axios.put(API_ENDPOINTS.UPDATE_USER, {
      email: userEmail,
      completed_coding: true,
      codeScore,
      totalScore,
      accepted
    });

    console.log('User scores updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user scores:', error.response?.data || error.message);
    throw error;
  }
};

/**
 
 * @param {number} questionId
 * @param {string} code
 * @returns {Promise<object>} 
 */
export const runCodeTests = async (questionId, code) => {
  try {
    const response = await fetch(API_ENDPOINTS.RUN_TESTS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, code })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Error running tests:', error);
    throw error;
  }
};