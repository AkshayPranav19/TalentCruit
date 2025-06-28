import { runCodeTests, updateUserScores } from './apiService.js';
import { LANGUAGE_TEMPLATES, ASSESSMENT_CONFIG } from './constants.js';

/**

 * @param {number} questionNum 
 * @param {function} setSolutionss
 */
export const handleResetCode = (questionNum, setSolutions) => {
  if (window.confirm("Are you sure you want to reset your code? This action cannot be undone.")) {
    const defaultCode = LANGUAGE_TEMPLATES[questionNum] || "";
    setSolutions(prev => ({
      ...prev,
      [questionNum]: defaultCode
    }));
  }
};

/**

 * @param {number} questionNum
 * @param {object} solutions
 * @param {function} setRunResult
 * @param {function} setRunError
 */
export const handleRunCode = async (questionNum, solutions, setRunResult, setRunError) => {
  setRunResult(null);
  setRunError(false);
  
  const code = solutions[questionNum] || LANGUAGE_TEMPLATES[questionNum] || "";

  if (!code.trim()) {
    setRunResult("Please write some code before running tests.");
    setRunError(true);
    return;
  }

  try {
    const { total, passed, results } = await runCodeTests(questionNum, code);
    setRunResult(`Question ${questionNum}: ${passed}/${total} tests passed.`);
    setRunError(passed !== total);
    console.table(results);
  } catch (error) {
    const errorMessage = error.message || "Could not connect to test server";
    
    let displayMessage;
    if (errorMessage.toLowerCase().includes('syntax') || 
        errorMessage.toLowerCase().includes('invalid syntax') ||
        errorMessage.toLowerCase().includes('indentation') ||
        errorMessage.toLowerCase().includes('parse')) {
      displayMessage = `Syntax Error: ${errorMessage}`;
    } else if (errorMessage.toLowerCase().includes('command failed') ||
               errorMessage.toLowerCase().includes('execution') ||
               errorMessage.toLowerCase().includes('runtime')) {
      displayMessage = `Execution Error: ${errorMessage}`;
    } else if (errorMessage.toLowerCase().includes('timeout')) {
      displayMessage = `Timeout Error: Code took too long to execute`;
    } else {
      displayMessage = `Error: ${errorMessage}`;
    }
    
    setRunResult(displayMessage);
    setRunError(true);
  }
};

/**

 * @param {object} solutions 
 * @param {string} userEmail
 * @param {function} setIsSubmitted
 * @param {function} setSubmitting
 * @param {function} setIsCompleted
 * @param {function} setSummary
 */
export const handleSubmitAssessment = async (
  solutions, 
  userEmail, 
  setIsSubmitted, 
  setSubmitting, 
  setIsCompleted, 
  setSummary
) => {
  setIsSubmitted(true);
  setSubmitting(true);
  setSummary(null);

  let sumPassed = 0;
  let sumTotal = 0;

  for (let q = 1; q <= ASSESSMENT_CONFIG.TOTAL_QUESTIONS; q++) {
    const code = solutions[q] || LANGUAGE_TEMPLATES[q] || "";

    if (!code.trim()) continue;

    try {
      const { passed, total } = await runCodeTests(q, code);
      sumPassed += passed;
      sumTotal += total;
    } catch (error) {
      console.error(`Error testing question ${q}:`, error);
    }
  }

  setSubmitting(false);
  setIsCompleted(true);
  
  const codeScore = sumTotal > 0 ? Math.round((sumPassed / sumTotal) * 100) : 0;
  
  try {
    await updateUserScores(userEmail, codeScore);
  } catch (error) {
    console.error('Error updating scores:', error);
  }
  
  const summaryText = sumTotal > 0
    ? `${sumPassed}/${sumTotal} total test cases passed.`
    : "No code to test.";

  setSummary(summaryText);
};