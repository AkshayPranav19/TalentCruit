import React, { useState, useEffect, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python }     from "@codemirror/lang-python";
import { oneDark }  from "@codemirror/theme-one-dark";
import { useNavigate } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import axios from 'axios';

export default function CodingAssessment() {
   const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || '';
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); 
  const [solutions, setSolutions] = useState({});
  const [runResult, setRunResult] = useState(null);
  const [runError, setRunError] = useState(false);
  const [summary, setSummary] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState({
    1: "python",
    2: "python", 
    3: "python",
    4: "python",
  });

  const [isCompleted, setIsCompleted] = useState(false);

  const totalQuestions = 4;

  const languageTemplates = {
    python: {
      1: `def two_sum(nums, target):
    # Write your solution here
    pass`,
      2: `def add_two_numbers(l1, l2):
    # Definition for singly-linked list
    # class ListNode:
    #     def __init__(self, val=0, next=None):
    #         self.val = val
    #         self.next = next
    
    # Write your solution here
    pass`,
      3: `def length_of_longest_substring(s):
    # Write your solution here
    pass`,
      4: `def find_median_sorted_arrays(nums1, nums2):
    # Write your solution here
    pass`
    }
  };



const updateUserScores = async (code_score) => {
  try {

    const getUserResponse = await axios.get(`http://localhost:3001/get-user/${userEmail}`);
    const userData = getUserResponse.data;
    

    if (userData === "User not found") {
      throw new Error("User not found in database");
    }
    
    const mlScore = userData.mlScore || 0;
    const llmScore = userData.llmScore || 0;
    
    
    const totalScore = Math.round(0.2 * mlScore + 0.4 * llmScore + 0.4 * code_score);
    
  
    const accepted = totalScore < 60 ? 'rejected' : 'waitlist';
    
    console.log('Current user data:', userData);
    console.log('Calculating scores:', {
      email: userEmail,
      mlScore: mlScore,
      llmScore: llmScore,
      codeScore: code_score,
      totalScore: totalScore,
      accepted: accepted
    });


    const response = await axios.put('http://localhost:3001/update-user-by-email', {
      email: userEmail,
      completed_coding: true,
      codeScore: code_score,
      totalScore: totalScore,
      accepted: accepted
    });

    console.log('User scores updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user scores:', error.response?.data || error.message);
    throw error;
  }
};



useEffect(() => {
  if (isSubmitted) return; 
  
  const timerInterval = setInterval(() => {
    setTimeRemaining(prev => {
      if (prev <= 1 && !isSubmitted) {
        handleSubmitAssessment();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timerInterval);
}, [isSubmitted]); 

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

  const handleLanguageChange = (questionNum, language) => {

    const currentCode = document.getElementById(`code${questionNum}`)?.value || "";
    setSolutions(prev => ({
      ...prev,
      [`question${questionNum}`]: {
        ...prev[`question${questionNum}`],
        [selectedLanguages[questionNum]]: currentCode
      }
    }));


    setSelectedLanguages(prev => ({
      ...prev,
      [questionNum]: language
    }));

  
    setTimeout(() => {
      const editor = document.getElementById(`code${questionNum}`);
      if (editor) {
        const savedCode = solutions[`question${questionNum}`]?.[language];
        editor.value = savedCode || languageTemplates[language]?.[questionNum] || "";
      }
    }, 0);
  };

const handleResetCode = (questionNum) => {
  if (window.confirm("Are you sure you want to reset your code? This action cannot be undone.")) {
    const selectedLang = selectedLanguages[questionNum];
    const defaultCode = languageTemplates[selectedLang]?.[questionNum] || "";

    setSolutions((prev) => ({
      ...prev,
      [`question${questionNum}`]: {
        ...prev[`question${questionNum}`],
        [selectedLang]: defaultCode,
      },
    }));
  }
};



const handleRunCode = async (questionNum) => {
  setRunResult(null);
  setRunError(false);
  const q = questions.find(q => q.id === questionNum);
  if (!q) {
    setRunResult("Internal error: question not found.");
    setRunError(true);
    return;
  }
  const questionId = q.id;
  const lang = selectedLanguages[questionNum];
  const savedCode = solutions[`question${questionNum}`]?.[lang];
  const starter   = languageTemplates[lang]?.[questionNum] || "";
  const code      = (savedCode && savedCode.trim()) ? savedCode : starter;

  if (!code.trim()) {
    setRunResult("Please write some code before running tests.");
    setRunError(true);
    return;
  }


  try {
    const res = await fetch("http://localhost:5002/run-tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, code })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const errorMessage = err.error || res.statusText;
      

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
      return;
    }

    const { total, passed, results } = await res.json();
    setRunResult(`Question ${questionNum}: ${passed}/${total} tests passed.`);
    setRunError(passed !== total);
    console.table(results);

  } catch (err) {
    console.error(err);
    setRunResult(`Network Error: ${err.message || "Could not connect to test server"}`);
    setRunError(true);
  }
};

const handleNextQuestion = () => {
  setRunResult(null);
  setRunError(false);
  if (currentQuestion < totalQuestions) {
    setCurrentQuestion((prev) => prev + 1);
  }
};

const handlePrevQuestion = () => {
  setRunResult(null);
  setRunError(false);
  if (currentQuestion > 1) {
    setCurrentQuestion((prev) => prev - 1);
  }
};


const handleSubmitAssessment = async () => {
  if (isSubmitted) return; 
  
  setIsSubmitted(true);
  setSubmitting(true);
  setSummary(null);

  let sumPassed = 0;
  let sumTotal  = 0;

  for (let q = 1; q <= totalQuestions; q++) {
    const lang      = selectedLanguages[q];
    const saved     = solutions[`question${q}`]?.[lang] || "";
    const starter   = languageTemplates[lang]?.[q] || "";
    const code      = saved.trim() ? saved : starter;


    if (!code.trim()) continue;

    try {
      const res = await fetch("http://localhost:5002/run-tests", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ questionId: q, code })
      });

      if (!res.ok) {
        console.error(`Runner error Q${q}`, await res.text());
        continue;
      }

      const { passed, total } = await res.json();
      sumPassed += passed;
      sumTotal  += total;
    } catch (err) {
      console.error("Network error Q" + q, err);
    }
  }

  setSubmitting(false);
  setIsCompleted(true);
  const code_score = Math.round((sumPassed / sumTotal) * 100);
  await updateUserScores(code_score);
  const summaryText = sumTotal > 0
    ? `${sumPassed}/${sumTotal} total test cases passed.`
    : "No code to test.";

  setSummary(summaryText);
};






  const questions = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "easy",
      description: (
        <>
          <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to target.</p>
          <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
          <p>You can return the answer in any order.</p>
        </>
      ),
      examples: [
        {
          title: "Example 1:",
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        },
        {
          title: "Example 2:",
          input: "nums = [3,2,4], target = 6", 
          output: "[1,2]"
        }
      ]
    },
    {
      id: 2,
      title: "Add Two Numbers",
      difficulty: "medium",
      description: (
        <>
          <p>You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.</p>
          <p>You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>
        </>
      ),
      examples: [
        {
          title: "Example 1:",
          input: "l1 = [2,4,3], l2 = [5,6,4]",
          output: "[7,0,8]",
          explanation: "342 + 465 = 807."
        },
        {
          title: "Example 2:",
          input: "l1 = [0], l2 = [0]",
          output: "[0]"
        }
      ]
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "medium",
      description: (
        <>
          <p>Given a string <code>s</code>, find the length of the longest substring without repeating characters.</p>
        </>
      ),
      examples: [
        {
          title: "Example 1:",
          input: 's = "abcabcbb"',
          output: "3",
          explanation: 'The answer is "abc", with the length of 3.'
        },
        {
          title: "Example 2:",
          input: 's = "bbbbb"',
          output: "1",
          explanation: 'The answer is "b", with the length of 1.'
        },
        {
          title: "Example 3:",
          input: 's = "pwwkew"',
          output: "3",
          explanation: 'The answer is "wke", with the length of 3.'
        }
      ]
    },
    {
      id: 4,
      title: "Median of Two Sorted Arrays",
      difficulty: "hard",
      description: (
        <>
          <p>Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return the median of the two sorted arrays.</p>
          <p>The overall run time complexity should be <code>O(log (m+n))</code>.</p>
        </>
      ),
      examples: [
        {
          title: "Example 1:",
          input: "nums1 = [1,3], nums2 = [2]",
          output: "2.00000",
          explanation: "merged array = [1,2,3] and median is 2."
        },
        {
          title: "Example 2:",
          input: "nums1 = [1,2], nums2 = [3,4]",
          output: "2.50000",
          explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
        }
      ]
    }
  ];

  if (isCompleted) {
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
          .completion-screen {
            text-align: center;
            padding: 60px 20px;
          }
          .completion-icon {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            margin: 0 auto 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
          }
          .btn {
          margin-top: 20px;
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
          .run-message.success {
            display: block;
            max-width: 700px;
            margin: 2rem auto 0;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            background-color: #E6FFED;   /* very light green */
            color:            #2E7D32;   /* rich dark green */
            font-weight:      600;
            font-size:        1.125rem;  /* a bit larger for emphasis */
            text-align:       center;
            box-shadow:       0 4px 12px rgba(0, 0, 0, 0.08);
            border:           1px solid #A5D6A7;
            animation:        fadeIn 0.4s ease-out;
          }

          /* Optional subtle pop-in */
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
        <div className="container">
          <div className="completion-screen">
            <div className="completion-icon">✓</div>
            <h2>Assessment Completed!</h2>
            <p>Thank you for completing the TalentCruit AI coding assessment. Your solutions have been submitted for review.</p>
        { <button className="btn" onClick={() => navigate('/login')}>
              Logout
            </button> }
          </div>
        </div>
      </>
    );
  }

  const currentQuestionData = questions[currentQuestion - 1];
  const progress = (currentQuestion / totalQuestions) * 100;

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
          padding: 20px 0;
        }
        .logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #ff6b9d, #4dabf7);
          border-radius: 50%;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
        }
        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #ffffff, #a8b3ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .header p {
          color: #a8b3ff;
          font-size: 1.1rem;
        }
        .progress-bar {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          height: 8px;
          margin: 30px 0;
          overflow: hidden;
        }
        .progress-fill {
          background: linear-gradient(135deg, #ff6b9d, #4dabf7);
          height: 100%;
          border-radius: 10px;
          transition: width 0.3s ease;
        }
        .question-container {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }
        .question-number {
          font-size: 1.2rem;
          color: #a8b3ff;
        }
        .difficulty {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .difficulty.easy {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
        }
        .difficulty.medium {
          background: rgba(255, 152, 0, 0.2);
          color: #ff9800;
        }
        .difficulty.hard {
          background: rgba(244, 67, 54, 0.2);
          color: #f44336;
        }
        .question-title {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: #ffffff;
        }
        .question-description {
          line-height: 1.6;
          color: #d1d9ff;
          margin-bottom: 20px;
        }
        .examples {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          font-family: 'Courier New', monospace;
        }
        .example {
          margin-bottom: 15px;
        }
        .example:last-child {
          margin-bottom: 0;
        }
        .code-section {
          margin-top: 30px;
        }
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .language-selector {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .language-selector label {
          color: #a8b3ff;
          font-weight: 600;
        }
        .language-dropdown {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 8px 12px;
          color: #ffffff;
          font-size: 14px;
          cursor: pointer;
        }
        .language-dropdown:focus {
          outline: none;
          border-color: #4dabf7;
          box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.2);
        }
        .language-dropdown option {
          background: #2d3561;
          color: #ffffff;
        }
        .editor-actions {
          display: flex;
          gap: 10px;
        }
        .btn-small {
          padding: 6px 12px;
          font-size: 0.9rem;
          border-radius: 6px;
        }
        .code-editor {
          background: #1e1e1e;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          padding: 20px;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.5;
          color: #ffffff;
          min-height: 350px;
          resize: vertical; 
          width: 100%;
          tab-size: 4;
        }
        .code-editor:focus {
          outline: none;
          border-color: #4dabf7;
          box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.2);
        }
        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }
        .btn-primary {
          background: linear-gradient(135deg, #4dabf7, #3b82f6);
          color: white;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(77, 171, 247, 0.3);
        }
        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .btn-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }
        .btn-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }
        .timer {
          background: rgba(255, 107, 157, 0.2);
          color: #ff6b9d;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
        }
        @media (max-width: 768px) {
          .container {
            padding: 10px;
          }
          .question-container {
            padding: 20px;
          }
          .controls {
            flex-direction: column;
            gap: 15px;
          }
          .header h1 {
            font-size: 2rem;
          }
        }

      .run-message.success {
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
        background-color: #e6ffed;
        color:            #2e7d32;
        }
      .run-message.error {
        marginTop: "1rem",
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        background-color: #fdecea;
        color:            #b71c1c;
      }
      `}</style>

      <div className="container">
        <div className="header">
          <div className="logo">TC</div>
          <h1>TalentCruit AI</h1>
          <p>Coding Assessment Challenge</p>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="question-container">
          <div className="question-header">
            <span className="question-number">Question {currentQuestion} of {totalQuestions}</span>
            <div className={`difficulty ${currentQuestionData.difficulty}`}>
              {currentQuestionData.difficulty.charAt(0).toUpperCase() + currentQuestionData.difficulty.slice(1)}
            </div>
          </div>
          
          <h2 className="question-title">{currentQuestionData.title}</h2>
          
          <div className="question-description">
            {currentQuestionData.description}
          </div>
          
          <div className="examples">
            {currentQuestionData.examples.map((example, index) => (
              <div key={index} className="example">
                <strong>{example.title}</strong><br />
                Input: {example.input}<br />
                Output: {example.output}
                {example.explanation && (
                  <>
                    <br />
                    Explanation: {example.explanation}
                  </>
                )}
              </div>
            ))}
          </div>
          
          <div className="code-section">
            <div className="editor-header">
              <div className="language-selector">
                <label htmlFor={`lang${currentQuestion}`}>Language:</label>
                <select
                  className="language-dropdown"
                  id={`lang${currentQuestion}`}
                  value={selectedLanguages[currentQuestion]}
                  onChange={(e) => handleLanguageChange(currentQuestion, e.target.value)}
                >
                  <option value="python">Python</option>
                </select>
              </div>
              <div className="editor-actions">
                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => handleResetCode(currentQuestion)}
                >
                  Reset
                </button>
                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => handleRunCode(currentQuestion)}
                >
                  Run
                </button>
              </div>
            </div>
            

          <Editor
            key={`editor-${currentQuestion}-${selectedLanguages[currentQuestion]}`}
            height="350px"
            language={selectedLanguages[currentQuestion]}
            value={
              solutions[`question${currentQuestion}`]?.[selectedLanguages[currentQuestion]] ||
              languageTemplates[selectedLanguages[currentQuestion]]?.[currentQuestion] ||
              ""
            }
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: 'Fira Code',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
            onChange={(value) => {
              if (value === undefined) return;
              setSolutions((prev) => ({
                ...prev,
                [`question${currentQuestion}`]: {
                  ...prev[`question${currentQuestion}`],
                  [selectedLanguages[currentQuestion]]: value,
                },
              }));
            }}
          />

            {/* ← INSERT RUN-RESULT MESSAGE HERE */}
          {runResult && (
            <div
              className={runError ? "run-message error" : "run-message success"}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                backgroundColor: runError ? "#fdecea" : "#e6ffed",
                color: runError ? "#b71c1c" : "#2e7d32",
                fontWeight: 500,
              }}
            >
              {runResult}
            </div>
          )}
          </div>
          
          <div className="controls">
            {currentQuestion > 1 && (
              <button className="btn btn-secondary" onClick={handlePrevQuestion}>
                Previous
              </button>
            )}
            {currentQuestion === 1 && <div></div>}
            
            <div className="timer">{formatTime(timeRemaining)}</div>
            
            {currentQuestion < totalQuestions ? (
              <button className="btn btn-primary" onClick={handleNextQuestion}>
                Next Question
              </button>
            ) : (
              <button className="btn btn-success" onClick={handleSubmitAssessment}>
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


