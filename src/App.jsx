// src/App.jsx

import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Checkwork from './pages/Supervisor/Checkwork.jsx';

import mockData from './data/Techsample.jsx'; 
const { sampleJobs } = mockData;

function App() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    setJobs(sampleJobs);
  }, []);

  // ✅ ฟังก์ชันอนุมัติงาน
  const approveJob = (jobId) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'เสร็จสิ้น' } : job
    ));
  };

  // ✅ ฟังก์ชันตีกลับงาน
  const rejectJob = (jobId) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'กำลังทำ' } : job
    ));
  };

  // ✅ ฟังก์ชันมอบหมายงาน
  const assignJob = (jobId, technicianName) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId 
        ? { ...job, technician: technicianName, status: 'รอดำเนินการ' } 
        : job
    ));
  };

  const pendingJobs = jobs.filter(job => job.status === 'รอตรวจสอบ');

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/dashboard/*" 
          element={
            <Dashboard 
              jobs={jobs} 
              pendingJobsCount={pendingJobs.length} 
              assignJob={assignJob} 
            />
          } 
        />
        
        <Route 
          path="/checkwork" 
          element={
            <Checkwork 
              pendingJobs={pendingJobs} 
              approveJob={approveJob} 
              rejectJob={rejectJob} 
            />
          } 
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;