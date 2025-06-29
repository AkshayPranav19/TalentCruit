import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login_page/Login.jsx";
import Register from "./Register_page/Register.jsx";
import ResumeEvaluator from "./Resume_Evaluation/ResumeEvaluator.jsx";
import CodingAssessment from './coding_challenge/CodingAssessment.jsx';
//import HR from './HRDashboard.jsx';
import Completed from './candidate_page/Completed.jsx';
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/resume" element={<ResumeEvaluator />} />
      <Route path="/coding" element={<CodingAssessment />} />  
      <Route path="/completed" element={<Completed />} />
      {/* <Route path="/hr" element={<HR />} /> */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}