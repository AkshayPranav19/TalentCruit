import React from 'react'
import './index.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Interviews from './pages/Interviews';
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
          <Route path='/' element={<></>} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/interviews' element={<Interviews />} />
          <Route path='/metrics' element={<Metrics />} />
          <Route path='/questions' element={<Questions />} />
          <Route path='/applicants' element={<Applicants />} />
        </Routes>
      </div>
    </div>
  )
}

export default App