
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Home from "./Home.jsx";
import ResumeEvaluator from "./ResumeEvaluator.jsx";
import CodingAssessment from './CodingAssessment.jsx';
import HR from './HRDashboard.jsx';
import Completed from './Completed.jsx';


export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />


      <Route path="/register" element={<Register />} />


      <Route path="/login" element={<Login />} />


      <Route path="/home" element={<Home />} />


      <Route path="/resume" element={<ResumeEvaluator />} />



       <Route path="/coding" element={<CodingAssessment />} />  


      <Route path="/completed" element={<Completed />} />

      <Route path="/hr" element={<HR />} />


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
