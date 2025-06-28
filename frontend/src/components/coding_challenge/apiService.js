// apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';
const TEST_RUNNER_URL = 'http://localhost:5002';

export const userService = {
  async getUser(email) {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-user/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async updateUserScores(email, codeScore) {
    try {
      const getUserResponse = await axios.get(`${API_BASE_URL}/get-user/${email}`);
      const userData = getUserResponse.data;
      
      if (userData === "User not found") {
        throw new Error("User not found in database");
      }
      
      const mlScore = userData.mlScore || 0;
      const llmScore = userData.llmScore || 0;
      const totalScore = Math.round(0.2 * mlScore + 0.4 * llmScore + 0.4 * codeScore);
      const accepted = totalScore < 60 ? 'rejected' : 'waitlist';
      
      console.log('Calculating scores:', {
        email,
        mlScore,
        llmScore,
        codeScore,
        totalScore,
        accepted
      });

      const response = await axios.put(`${API_BASE_URL}/update-user-by-email`, {
        email,
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
  }
};

export const testRunnerService = {
  async runTests(questionId, code) {
    try {
      const response = await fetch(`${TEST_RUNNER_URL}/run-tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, code })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || response.statusText);
      }

      return await response.json();
    } catch (error) {
      console.error('Test runner error:', error);
      throw error;
    }
  }
};