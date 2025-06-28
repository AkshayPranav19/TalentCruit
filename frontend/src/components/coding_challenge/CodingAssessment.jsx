import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useNavigate } from 'react-router-dom';
import logoSrc from '../logo.png';
import './coding.css'

import { 
  ASSESSMENT_CONFIG, 
  LANGUAGE_TEMPLATES, 
  QUESTIONS 
} from './constants.js';
import { formatTime } from './timerUtils.js';
import { handleResetCode, handleRunCode, handleSubmitAssessment } from './codeHandlers.js';
import { 
  handleNextQuestion, 
  handlePrevQuestion, 
  calculateProgress, 
  getDifficultyClass, 
  formatDifficulty 
} from './assessmentHandlers.js';

export default function CodingAssessment() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || '';
  
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(ASSESSMENT_CONFIG.TOTAL_TIME);
  const [solutions, setSolutions] = useState({});
  const [runResult, setRunResult] = useState(null);
  const [runError, setRunError] = useState(false);
  const [summary, setSummary] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isSubmitted) return;
    
    const timerInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1 && !isSubmitted) {
          handleSubmitAssessment(
            solutions, 
            userEmail, 
            setIsSubmitted, 
            setSubmitting, 
            setIsCompleted, 
            setSummary
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isSubmitted, solutions, userEmail]);

  const onResetCode = (questionNum) => handleResetCode(questionNum, setSolutions);
  
  const onRunCode = (questionNum) => handleRunCode(questionNum, solutions, setRunResult, setRunError);
  
  const onNextQuestion = () => handleNextQuestion(currentQuestion, setCurrentQuestion, setRunResult, setRunError);
  
  const onPrevQuestion = () => handlePrevQuestion(currentQuestion, setCurrentQuestion, setRunResult, setRunError);
  
  const onSubmitAssessment = () => handleSubmitAssessment(
    solutions, 
    userEmail, 
    setIsSubmitted, 
    setSubmitting, 
    setIsCompleted, 
    setSummary
  );

  if (isCompleted) {
    return (
      <div className="container_completed">
        <div className="completion-screen_completed">
          <div className="completion-icon_completed">✓</div>
          <h2>Assessment Completed!</h2>
          <p>Thank you for completing the TalentCruit AI coding assessment. Your solutions have been submitted for review.</p>
          <button className="btn_completed" onClick={() => navigate('/login')}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = QUESTIONS[currentQuestion - 1];
  const progress = calculateProgress(currentQuestion);

  return (
    <div className="container">
      <div className="header">
        <img src={logoSrc} className="logo" alt="Logo" />
        <h1>TalentCruit AI</h1>
        <p>Coding Assessment Challenge</p>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="question-container">
        <div className="question-header">
          <span className="question-number">
            Question {currentQuestion} of {ASSESSMENT_CONFIG.TOTAL_QUESTIONS}
          </span>
          <div className={getDifficultyClass(currentQuestionData.difficulty)}>
            {formatDifficulty(currentQuestionData.difficulty)}
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
              <label>Language: {ASSESSMENT_CONFIG.LANGUAGE.charAt(0).toUpperCase() + ASSESSMENT_CONFIG.LANGUAGE.slice(1)}</label>
            </div>
            <div className="editor-actions">
              <button
                className="btn btn-secondary btn-small"
                onClick={() => onResetCode(currentQuestion)}
              >
                Reset
              </button>
              <button
                className="btn btn-secondary btn-small"
                onClick={() => onRunCode(currentQuestion)}
              >
                Run
              </button>
            </div>
          </div>
          
          <Editor
            key={`editor-${currentQuestion}`}
            height="350px"
            language={ASSESSMENT_CONFIG.LANGUAGE}
            value={solutions[currentQuestion] || LANGUAGE_TEMPLATES[currentQuestion] || ""}
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
              setSolutions(prev => ({
                ...prev,
                [currentQuestion]: value
              }));
            }}
          />

          {runResult && (
            <div className={runError ? "run-message error" : "run-message success"}>
              {runResult}
            </div>
          )}
        </div>
        
        <div className="controls">
          {currentQuestion > 1 && (
            <button className="btn btn-secondary" onClick={onPrevQuestion}>
              Previous
            </button>
          )}
          {currentQuestion === 1 && <div></div>}
          
          <div className="timer">{formatTime(timeRemaining)}</div>
          
          {currentQuestion < ASSESSMENT_CONFIG.TOTAL_QUESTIONS ? (
            <button className="btn btn-primary" onClick={onNextQuestion}>
              Next Question
            </button>
          ) : (
            <button className="btn btn-success" onClick={onSubmitAssessment}>
              Submit Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}