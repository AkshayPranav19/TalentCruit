export const EDU_MAP = { 
  'B.Sc': 0, 
  'B.Tech': 1, 
  'M.Tech': 2, 
  'MBA': 3, 
  'PhD': 4 
};

export const JOB_MAP = {
  'AI Researcher': 0,
  'Cybersecurity Analyst': 1,
  'Data Scientist': 2,
  'Software Engineer': 3
};

export const ROLE_SKILLS = {
  'Cybersecurity Analyst': new Set(['linux', 'networking', 'ethical hacking', 'cybersecurity']),
  'Data Scientist': new Set(['deep learning', 'machine learning', 'sql', 'python']),
  'AI Researcher': new Set(['nlp', 'tensorflow', 'pytorch', 'python']),
  'Software Engineer': new Set(['sql', 'react', 'java', 'c++'])
};

export function relevanceIndex(skillsStr, role) {
  const have = skillsStr
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  const want = ROLE_SKILLS[role] || new Set();
  return want.size
    ? Math.round(have.filter(s => want.has(s)).length / want.size * 100)
    : 0;
}

export const updateUserScores = async (userEmail, jobRole, mlScoreValue, llmScoreValue, llmPromptValue) => {
  try {
    console.log('Updating user scores:', {
      email: userEmail,
      job_role: jobRole,
      mlScore: mlScoreValue,
      llmScore: llmScoreValue,
      gptFeedback: llmPromptValue
    });

    const response = await fetch('http://localhost:3001/update-user-by-email', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        job_role: jobRole,
        completed_resume: true,
        mlScore: mlScoreValue,
        llmScore: llmScoreValue,
        gptFeedback: llmPromptValue
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('User scores updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error updating user scores:', error.message);
    throw error; 
  }
};
