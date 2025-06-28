// codeHandlers.js
import { testRunnerService } from './apiService.js';
import { LANGUAGE_TEMPLATES } from './constants.js';

export const codeHandlers = {
  handleResetCode: (questionNum, setSolutions) => {
    if (window.confirm("Are you sure you want to reset your code? This action cannot be undone.")) {
      const defaultCode = LANGUAGE_TEMPLATES[questionNum] || "";
      setSolutions(prev => ({
        ...prev,
        [questionNum]: defaultCode
      }));
    }
  },

  handleRunCode: async (questionNum, solutions, setRunResult, setRunError) => {
    setRunResult(null);
    setRunError(false);
    
    const code = solutions[questionNum] || LANGUAGE_TEMPLATES[questionNum] || "";

    if (!code.trim()) {
      setRunResult("Please write some code before running tests.");
      setRunError(true);
      return;
    }

    try {
      const { total, passed, results } = await testRunnerService.runTests(questionNum, code);
      setRunResult(`Question ${questionNum}: ${passed}/${total} tests passed.`);
      setRunError(passed !== total);
      console.table(results);
    } catch (error) {
      const errorMessage = error.message;
      
      if (errorMessage.toLowerCase().includes('syntax') || 
          errorMessage.toLowerCase().includes('invalid syntax') ||
          errorMessage.toLowerCase().includes('indentation') ||
          errorMessage.toLowerCase().includes('parse')) {
        setRunResult(`Syntax Error: ${errorMessage}`);
      } else if (errorMessage.toLowerCase().includes('command failed') ||
                 errorMessage.toLowerCase().includes('execution') ||
                 errorMessage.toLowerCase().includes('runtime')) {
        setRunResult(`Execution Error: ${errorMessage}`);
      } else if (errorMessage.toLowerCase().includes('timeout')) {
        setRunResult(`Timeout Error: Code took too long to execute`);
      } else {
        setRunResult(`Error: ${errorMessage}`);
      }
      setRunError(true);
    }
  }
};