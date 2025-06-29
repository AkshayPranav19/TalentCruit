
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)


MODEL_PATH = os.path.join(os.path.dirname(__file__), 'resume_score_model.pkl')
with open(MODEL_PATH, 'rb') as f:
    model = pickle.load(f)


@app.route('/evaluate', methods=['POST'])
def evaluate():
    """
    Expects JSON:
    {
      "experience_years":   5,
      "salary_expectation": 80000,
      "projects_count":     3,
      "education_code":     2,
      "cert_count":         1,
      "job_code":           0,
      "skill_relevance":    75
    }
    Returns { "score": 87.2 }
    """
    data = request.get_json()
   
    feature_order = [
      'experience_years',
      'salary_expectation',
      'projects_count',
      'education_code',
      'cert_count',
      'job_code',
      'skill_relevance'
    ]

    try:
        x = [ float(data[field]) for field in feature_order ]
    except KeyError as e:
        return jsonify({ 'error': f'missing field {e}' }), 400

   
    x_arr = np.array(x).reshape(1, -1)
 
    pred = model.predict(x_arr)[0]
    
    score = float(max(0, min(100, pred)))

    return jsonify({ 'score': score })


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8003))
    app.run(host='0.0.0.0', port=port, debug=True)
