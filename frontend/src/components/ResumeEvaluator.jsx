import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
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

  const EDU_MAP = { 'B.Sc': 0, 'B.Tech': 1, 'M.Tech': 2, 'MBA': 3, 'PhD': 4 };
  const JOB_MAP = {
    'AI Researcher': 0,
    'Cybersecurity Analyst': 1,
    'Data Scientist': 2,
    'Software Engineer': 3
  };
  const ROLE_SKILLS = {
    'Cybersecurity Analyst': new Set(['linux', 'networking', 'ethical hacking', 'cybersecurity']),
    'Data Scientist': new Set(['deep learning', 'machine learning', 'sql', 'python']),
    'AI Researcher': new Set(['nlp', 'tensorflow', 'pytorch', 'python']),
    'Software Engineer': new Set(['sql', 'react', 'java', 'c++'])
  };
  

  function relevanceIndex(skillsStr, role) {
    const have = skillsStr
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);
    const want = ROLE_SKILLS[role] || new Set();
    return want.size
      ? Math.round(have.filter(s => want.has(s)).length / want.size * 100)
      : 0;
  }

const updateUserScores = async (mlScoreValue, llmScoreValue, llmPromptValue) => {
  try {
    console.log('Updating user scores:', {
      email: userEmail,
      mlScore: mlScoreValue,
      llmScore: llmScoreValue,
      gptFeedback: llmPromptValue
    });

    const response = await axios.put('http://localhost:3001/update-user-by-email', {
      email: userEmail,
      completed_resume: true,
      mlScore: mlScoreValue,
      llmScore: llmScoreValue,
      gptFeedback: llmPromptValue
    });
    
    console.log('User scores updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user scores:', error.response?.data || error.message);
    throw error; 
  }
};



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

      
      const swotRes = await axios.post(
        'http://localhost:8001/swot',
        { score: llmRes.data.score, prompt: llmRes.data.prompt }
      );
      setSwot(swotRes.data.swot);
      setShowResults(true);

       await updateUserScores(Math.round(mlRes.data.score), Math.round(llmRes.data.score), swotRes.data.swot);
 

    } catch (err) {
      console.error(err);
      
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setShowResults(false);
    setMlScore(null);
    setLlmScore(null);
    setLlmPrompt('');
    setSwot('');
  };

  const goToNext = () => {
    alert('Navigating to coding assessment...');
    
  };

  if (showResults) {
    return (
      <div className="results-page">
        <style jsx>{`
          .results-page {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4a90e2 100%);
            min-height: 100vh;
            padding: 2rem;
          }
          
          .bg-animation {
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: 0;
            overflow: hidden;
            top: 0;
            left: 0;
          }
          
          .floating-shape {
            position: absolute;
            opacity: 0.1;
            animation: float 6s ease-in-out infinite;
          }
          
          .shape1 {
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 50%;
            top: 20%;
            left: 10%;
          }
          
          .shape2 {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 30%;
            top: 60%;
            right: 15%;
            animation-delay: 2s;
          }
          
          .shape3 {
            width: 100px;
            height: 100px;
            background: white;
            border-radius: 20%;
            bottom: 20%;
            left: 20%;
            animation-delay: 4s;
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0);
            }
            50% {
              transform: translateY(-20px) rotate(10deg);
            }
          }
          
          .results-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 3rem 2.5rem;
            max-width: 900px;
            margin: 0 auto;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            z-index: 1;
          }
          
          .results-header {
            text-align: center;
            margin-bottom: 3rem;
          }
          
          .results-title {
            color: white;
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            letter-spacing: -0.02em;
          }
          
          .results-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.3rem;
            font-weight: 500;
          }
          
          .scores-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 3rem;
          }
          
          @media (max-width: 768px) {
            .scores-grid {
              grid-template-columns: 1fr;
            }
          }
          
          .score-card {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            padding: 2.5rem;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }
          
          .score-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
          }
          
          .score-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          
          .score-label {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.1rem;
            margin-bottom: 1rem;
            font-weight: 600;
          }
          
          .score-value {
            color: white;
            font-size: 2.5rem;
            font-weight: 800;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
          
          .details-section {
            margin-bottom: 3rem;
          }
          
          .detail-card {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            padding: 2.5rem;
            margin-bottom: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
          }
          
          .detail-title {
            color: white;
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .detail-content {
            background: rgba(255, 255, 255, 0.95);
            padding: 2rem;
            border-radius: 12px;
            color: #333;
            line-height: 1.8;
            font-size: 1.05rem;
            white-space: pre-wrap;
            max-height: 400px;
            overflow-y: auto;
          }
          
          .swot-content {
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 0.95rem;
          }
          
          .button-group {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            margin-top: 3rem;
            flex-wrap: wrap;
          }
          
          .back-button {
            padding: 1.25rem 2.5rem;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.4);
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 150px;
          }
          
          .back-button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          }
          
          .next-button {
            padding: 1.25rem 2.5rem;
            background: linear-gradient(45deg, #28a745, #34d058);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
            min-width: 200px;
          }
          
          .next-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
            background: linear-gradient(45deg, #218838, #28a745);
          }
        `}</style>

        <div className="bg-animation">
          <div className="floating-shape shape1" />
          <div className="floating-shape shape2" />
          <div className="floating-shape shape3" />
        </div>

        <div className="results-container">
          <div className="results-header">
            <h1 className="results-title">Evaluation Results</h1>
            <p className="results-subtitle">Your comprehensive resume analysis</p>
          </div>

          <div className="scores-grid">
            <div className="score-card">
              <div className="score-icon">🔢</div>
              <div className="score-label">ML Algorithm Score</div>
              <div className="score-value">{mlScore}</div>
            </div>
            <div className="score-card">
              <div className="score-icon">🤖</div>
              <div className="score-label">AI Analysis Score</div>
              <div className="score-value">{llmScore}</div>
            </div>
          </div>

          <div className="details-section">
            <div className="detail-card">
              <h3 className="detail-title">📝 Analysis Prompt</h3>
              <div className="detail-content">{llmPrompt}</div>
            </div>

            <div className="detail-card">
              <h3 className="detail-title">🎯 SWOT Analysis</h3>
              <div className="detail-content swot-content">{swot}</div>
            </div>
          </div>

          <div className="button-group">
            <button onClick={goBack} className="back-button">
              ← Back to Form
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
      <style jsx>{`
        .resume-page {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4a90e2 100%);
          min-height: 100vh;
          padding: 2rem;
        }
        
        .bg-animation {
          position: fixed;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
          top: 0;
          left: 0;
        }
        
        .floating-shape {
          position: absolute;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }
        
        .shape1 {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          top: 20%;
          left: 10%;
        }
        
        .shape2 {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 30%;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }
        
        .shape3 {
          width: 100px;
          height: 100px;
          background: white;
          border-radius: 20%;
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        
        .resume-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          max-width: 800px;
          margin: 0 auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          z-index: 1;
        }
        
        .title {
          text-align: center;
          color: white;
          font-size: 2.8rem;
          font-weight: 700;
          margin-bottom: 3rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          letter-spacing: -0.02em;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .form-grid-full {
          grid-column: 1 / -1;
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
        
        .form-field {
          margin-bottom: 0;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: white;
          font-size: 1.1rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .form-input,
        .form-select {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          color: #333;
          transition: all 0.3s ease;
          box-sizing: border-box;
          min-height: 56px;
        }
        
        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
        }
        
        .radio-group {
          display: flex;
          gap: 1.5rem;
          margin-top: 0.5rem;
        }
        
        .radio-label {
          display: flex;
          align-items: center;
          color: white;
          font-weight: 500;
          cursor: pointer;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .radio-input {
          margin-right: 0.5rem;
          transform: scale(1.2);
        }
        
        .file-input {
          width: 100%;
          padding: 1.25rem;
          border: 2px dashed rgba(255, 255, 255, 0.4);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        
        .file-input:hover {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.15);
        }
        
        .submit-button {
          width: 100%;
          padding: 1.25rem;
          background: linear-gradient(45deg, #ffffff, #f0f8ff);
          color: #1e3c72;
          border: none;
          border-radius: 12px;
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 3rem 0 2rem 0;
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
          min-height: 60px;
        }
        
        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>

      <div className="bg-animation">
        <div className="floating-shape shape1" />
        <div className="floating-shape shape2" />
        <div className="floating-shape shape3" />
      </div>

      <div className="resume-container">
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