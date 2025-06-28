import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import logoSrc from '../logo.png';
import './ResumeEvaluator.css';
import './ResultsPage.css';

import { EDU_MAP, JOB_MAP, relevanceIndex, updateUserScores } from './utils.js';


export default function ResumeEvaluator() {
  const userEmail = localStorage.getItem('userEmail') || '';

  const [experience, setExperience] = useState(0);
  const [salary, setSalary] = useState(40000);
  const [projects, setProjects] = useState(0);
  const [education, setEducation] = useState('B.Sc');
  const [hasCert, setHasCert] = useState(false);
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [skillList, setSkillList] = useState('');
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mlScore, setMlScore] = useState(null);
  const [llmScore, setLlmScore] = useState(null);
  const [llmPrompt, setLlmPrompt] = useState('');
  const [swot, setSwot] = useState('');
  
  const evaluateAll = async () => {
    if (!file) return alert('Please upload a PDF resume.');
    setLoading(true);
    setMlScore(null);
    setLlmScore(null);
    setLlmPrompt('');
    setSwot('');

    try {
        const mlPayload = {
        experience_years: Math.min(10, Math.max(0, experience)),
        salary_expectation: Math.min(150000, Math.max(0, salary)),
        projects_count: Math.min(10, Math.max(0, projects)),
        education_code: EDU_MAP[education],
        cert_count: hasCert ? 1 : 0,
        job_code: JOB_MAP[jobRole],
        skill_relevance: relevanceIndex(skillList, jobRole)
      };
      const mlRes = await axios.post('http://localhost:8003/evaluate', mlPayload);
      setMlScore(Math.round(mlRes.data.score));
      
      const form = new FormData();
      form.append('file', file);
      form.append('job_role', jobRole);
      const llmRes = await axios.post(
        'http://localhost:8000/analyze-resume',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setLlmScore(Math.round(llmRes.data.score));
      setLlmPrompt(llmRes.data.prompt); 
      setSwot(llmRes.data.swot);
      setShowResults(true);
      await updateUserScores(Math.round(mlRes.data.score), Math.round(llmRes.data.score), llmRes.data.swot);

    } catch (err) {
      console.error(err);
      
    } finally {
      setLoading(false);
    }
  };

    if (showResults) {
    return (
      <div className="results-page">
        <div className="results-container">
          <div className="results-header">
            <h1 className="results-title">Evaluation Results</h1>
            <p className="results-subtitle">Your comprehensive resume analysis</p>
          </div>

          <div className="scores-grid">
            <div className="score-card">
              <div className="score-icon">🔢</div>
              <div className="score-label">Job Matching Algorithm Score</div>
              <div className="score-value">{mlScore}</div>
            </div>
            <div className="score-card">
              <div className="score-icon">🤖</div>
              <div className="score-label">Resume Analysis Score</div>
              <div className="score-value">{llmScore}</div>
            </div>
          </div>

          <div className="details-section">
            <div className="detail-card">
              <h3 className="detail-title">🎯 SWOT Analysis</h3>
              <div className="detail-content swot-content">{swot}</div>
            </div>
          </div>

          <div className="button-group">
            <button onClick={() => navigate('/login')} className="back-button">
              ← Back to login page
            </button>
            <button onClick={() => navigate('/coding')} className="next-button">
              Continue to Coding Assessment →
            </button>
          </div>
        </div>
      </div>
    );
  }

return (
    <div className="resume-page">


      <div className="resume-container">
        <img src={logoSrc} className="logo" alt="Logo" />
        <h1 className="title">TalentCruit AI</h1>

        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">1) Years of Experience (0–10)</label>
            <select
              value={experience}
              onChange={e => setExperience(+e.target.value)}
              className="form-select"
            >
              {[...Array(11).keys()].map(y =>
                <option key={y} value={y}>{y}</option>
              )}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">2) Salary Expectation ($40k–$150k)</label>
            <input
              type="number"
              value={salary}
              min={40000}
              max={150000}
              step={1000}
              onChange={e => setSalary(+e.target.value)}
              className="form-input"
            />
          </div>


          <div className="form-field">
            <label className="form-label">3) Projects Completed (0–10)</label>
            <select
              value={projects}
              onChange={e => setProjects(+e.target.value)}
              className="form-select"
            >
              {[...Array(11).keys()].map(n =>
                <option key={n} value={n}>{n}</option>
              )}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">4) Highest Education</label>
            <select
              value={education}
              onChange={e => setEducation(e.target.value)}
              className="form-select"
            >
              {Object.keys(EDU_MAP).map(ed =>
                <option key={ed} value={ed}>{ed}</option>
              )}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">5) Certifications?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  className="radio-input"
                  checked={!hasCert}
                  onChange={() => setHasCert(false)}
                /> No
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  className="radio-input"
                  checked={hasCert}
                  onChange={() => setHasCert(true)}
                /> Yes
              </label>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">6) Job Role</label>
            <select
              value={jobRole}
              onChange={e => setJobRole(e.target.value)}
              className="form-select"
            >
              {Object.keys(JOB_MAP).map(role =>
                <option key={role} value={role}>{role}</option>
              )}
            </select>
          </div>

          <div className="form-field form-grid-full">
            <label className="form-label">7) Top Skills (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Python, SQL, React"
              value={skillList}
              onChange={e => setSkillList(e.target.value.toLowerCase())}
              className="form-input"
            />
          </div>

          <div className="form-field form-grid-full">
            <label className="form-label">8) Upload Resume (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={e => setFile(e.target.files[0])}
              className="file-input"
            />
            {file && (
              <p style={{color: 'white', marginTop: '0.5rem', fontSize: '0.9rem'}}>
                Selected: {file.name}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={evaluateAll}
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Evaluating…' : 'Submit All'}
        </button>
      </div>
    </div>
  );
}