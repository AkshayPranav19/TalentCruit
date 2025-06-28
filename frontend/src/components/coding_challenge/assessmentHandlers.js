import { ASSESSMENT_CONFIG } from './constants.js';

/**

 * @param {number} currentQuestion 
 * @param {function} setCurrentQuestion
 * @param {function} setRunResult
 * @param {function} setRunError
 */
export const handleNextQuestion = (currentQuestion, setCurrentQuestion, setRunResult, setRunError) => {
  setRunResult(null);
  setRunError(false);
  if (currentQuestion < ASSESSMENT_CONFIG.TOTAL_QUESTIONS) {
    setCurrentQuestion(prev => prev + 1);
  }
};

/**
 
 * @param {number} currentQuestion
 * @param {function} setCurrentQuestion
 * @param {function} setRunResult
 * @param {function} setRunError
 */
export const handlePrevQuestion = (currentQuestion, setCurrentQuestion, setRunResult, setRunError) => {
  setRunResult(null);
  setRunError(false);
  if (currentQuestion > 1) {
    setCurrentQuestion(prev => prev - 1);
  }
};

/**

 * @param {number} currentQuestion -
 * @returns {number} 
 */
export const calculateProgress = (currentQuestion) => {
  return (currentQuestion / ASSESSMENT_CONFIG.TOTAL_QUESTIONS) * 100;
};

/**

 * @param {string} difficulty 
 * @returns {string} 
 */
export const getDifficultyClass = (difficulty) => {
  return `difficulty ${difficulty}`;
};

/**

 * @param {string} difficulty 
 * @returns {string} 
 */
export const formatDifficulty = (difficulty) => {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
};