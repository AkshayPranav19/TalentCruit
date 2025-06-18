const mongoose = require('mongoose');

const FormDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  completed_resume:{type: Boolean, default: false},
  job_role:{type: String, default: 'software engineer'},
  completed_coding:{type: Boolean, default: false},
  mlScore: { type: Number, default: 0, min: 0, max: 100 },
  llmScore: { type: Number, default: 0, min: 0, max: 100 },
  codeScore: { type: Number, default: 0, min: 0, max: 100 },
  totalScore: { type: Number, default: 0, min: 0, max: 100 },
  gptFeedback: { type: String, default: '' },
  accepted: {
    type: String,
    enum: ['rejected', 'waitlist', 'accepted'],
    default: 'waitlist'
  }
}, {
  timestamps: true
});

const FormDataModel = mongoose.model('log_reg_form', FormDataSchema);
module.exports = FormDataModel;