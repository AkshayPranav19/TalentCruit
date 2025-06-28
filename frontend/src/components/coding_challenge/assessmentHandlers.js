// assessmentHandlers.js
import { testRunnerService, userService } from './apiService.js';
import { LANGUAGE_TEMPLATES, TOTAL_QUESTIONS } from './constants.js';

export const assessmentHandlers = {
  handleNextQuestion: (currentQuestion, setCurrentQuestion, setRunResult, setRunError) => {
    setRunResult(null);
    setRunError(false);
    if (currentQuestion < TOTAL_QUESTIONS) {
      setCurrentQuestion(prev => prev + 1);
    }
  },

  handlePrevQuestion: (currentQuestion, setCurrentQuestion, setRunResult, setRunError) => {
    setRunResult(null);
    setRunError(false);
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  },

  handleSubmitAssessment: async (
    isSubmitted,
    setIsSubmitted,
    setSubmitting,
    setSummary,
    setIsCompleted,
    solutions,
    userEmail
  ) => {
    if (isSubmitted) return;
    
    setIsSubmitted(true);
    setSubmitting(true);
    setSummary(null);

    let sumPassed = 0;
    let sumTotal = 0;

    // Test all questions
    for (let q = 1; q <= TOTAL_QUESTIONS; q++) {
      const code = solutions[q] || LANGUAGE_TEMPLATES[q] || "";

      if (!code.trim()) continue;

      try {
        const { passed, total } = await testRunnerService.runTests(q, code);
        sumPassed += passed;
        sumTotal += total;
      } catch (error) {
        console.error(`Error testing Q${q}:`, error);
      }
    }

    // Calculate final score and update user
    setSubmitting(false);
    setIsCompleted(true);
    const codeScore = Math.round((sumPassed / sumTotal) * 100);
    
    try {
      await userService.updateUserScores(userEmail, codeScore);
    } catch (error) {
      console.error('Failed to update user scores:', error);
    }

    const summaryText = sumTotal > 0
      ? `${sumPassed}/${sumTotal} total test cases passed.`
      : "No code to test.";

    setSummary(summaryText);
  }
};