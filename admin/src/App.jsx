import React from 'react'
import './index.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Metrics from './pages/Metrics';
import Questions from './pages/Questions';
import Applicants from './pages/Applicants';

const App = () => {
  return (
    <div>
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/metrics' element={<Metrics />} />
          <Route path='/questions' element={<Questions />} />
          <Route path='/applicants' element={<Applicants />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App