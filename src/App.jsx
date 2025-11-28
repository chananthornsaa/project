// src/App.jsx

import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CheckCircle, RotateCcw, FileText, ClipboardCheck } from 'lucide-react';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Checkwork from './pages/Supervisor/Checkwork.jsx';

import mockData from './data/Techsample.jsx'; 
const { sampleJobs } = mockData;

function App() {
  const [jobs, setJobs] = useState(() => {
    // โหลดข้อมูลจาก localStorage ถ้ามี ไม่งั้นใช้ sampleJobs
    const savedJobs = localStorage.getItem('jobsData');
    return savedJobs ? JSON.parse(savedJobs) : sampleJobs;
  });

  // เพิ่ม state สำหรับเก็บประวัติกิจกรรม
  const [activityLog, setActivityLog] = useState(() => {
    const savedLog = localStorage.getItem('activityLog');
    return savedLog ? JSON.parse(savedLog) : [];
  });

  // ========================================
  // ฟังก์ชันบันทึกประวัติกิจกรรม (Activity Log)
  // ใช้สำหรับบันทึกทุกการกระทำที่เกิดขึ้นในระบบ เช่น:
  // - อนุมัติงาน (approve)
  // - ตีกลับงาน (reject)
  // - มอบหมายงานให้ผู้รับผิดชอบ (assign)
  // - มอบหมายงานให้แผนก (assign_department)
  // 
  // Activity จะถูกเก็บใน state และ localStorage (เก็บสูงสุด 100 รายการ)
  // เมื่อมีการอัพเดท activity จะมี event 'storage' แจ้งให้ tab อื่นๆ รู้
  // ========================================
  const addActivity = (activity) => {
    const newActivity = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...activity
    };
    setActivityLog(prev => [newActivity, ...prev].slice(0, 100)); // เก็บแค่ 100 รายการล่าสุด
  };

  // บันทึก activityLog ลง localStorage
  useEffect(() => {
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
  }, [activityLog]);

  // 1. บันทึกข้อมูลลง localStorage ทุกครั้งที่ jobs เปลี่ยน (Data Persistence)
  useEffect(() => {
    localStorage.setItem('jobsData', JSON.stringify(jobs));
    console.log('💾 Saved jobs to localStorage:', jobs.length);
  }, [jobs]);

  // 2. Cross-Tab Sync - ฟัง storage event จากแท็บอื่น
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'jobsData' && e.newValue) {
        console.log('🔄 Storage event detected - syncing data from another tab');
        setJobs(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 3. Focus Reload - โหลดข้อมูลใหม่เมื่อกลับมาที่แท็บ
  useEffect(() => {
    const reloadFromStorage = () => {
      const savedJobs = localStorage.getItem('jobsData');
      if (savedJobs) {
        console.log('👁️ Tab focused - reloading data from localStorage');
        setJobs(JSON.parse(savedJobs));
      }
    };

    window.addEventListener('focus', reloadFromStorage);
    return () => window.removeEventListener('focus', reloadFromStorage);
  }, []);

  // ฟังก์ชันรีเซ็ตข้อมูลกลับค่าเริ่มต้น
  const resetData = () => {
    if (window.confirm('ต้องการรีเซ็ตข้อมูลกลับค่าเริ่มต้นหรือไม่?')) {
      localStorage.clear(); // ลบข้อมูลทั้งหมดใน localStorage
      setJobs(sampleJobs); // รีเซ็ต state กลับค่าเริ่มต้น
    }
  };

  // ฟังก์ชันสำหรับ Console - window.resetApp
  useEffect(() => {
    window.resetApp = () => {
      localStorage.clear();
      setJobs(sampleJobs);
      console.log('✅ รีเซ็ตข้อมูลเรียบร้อย');
    };
    return () => delete window.resetApp;
  }, []);

  // Keyboard shortcut: Ctrl+Shift+R เพื่อรีเซ็ต
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        resetData();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // ========================================
  // ฟังก์ชันอนุมัติงาน
  // เมื่อหัวหน้าช่างหรือ Admin อนุมัติงานว่าเสร็จสมบูรณ์
  // - เปลี่ยนสถานะงานเป็น "เสร็จสิ้น"
  // - บันทึกประวัติกิจกรรมพร้อมไอคอน CheckCircle (✓)
  // ========================================
  const approveJob = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'เสร็จสิ้น' } : job
    ));
    if (job) {
      addActivity({
        type: 'approve',
        jobId: jobId,
        jobName: job.name,
        message: `Admin อนุมัติงานใหม่ ${jobId}`,
        icon: 'CheckCircle' // ไอคอน: เครื่องหมายถูกในวงกลม
      });
    }
  };

  // ========================================
  // ฟังก์ชันตีกลับงาน
  // เมื่อหัวหน้าแผนกตรวจแล้วไม่พอใจ ให้แผนกกลับไปแก้ไข
  // - เปลี่ยนสถานะกลับเป็น "รอดำเนินการ"
  // - เพิ่ม flag rejected และเหตุผล
  // - บันทึกประวัติกิจกรรมพร้อมไอคอน RotateCcw (↻)
  // ========================================
  const rejectJob = (jobId, comment = '') => {
    const job = jobs.find(j => j.id === jobId);
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { 
        ...job, 
        status: 'รอดำเนินการ', 
        rejected: true,
        rejectionReason: comment,
        rejectedAt: new Date().toISOString()
      } : job
    ));
    if (job) {
      addActivity({
        type: 'reject',
        jobId: jobId,
        jobName: job.name,
        message: `ใบงาน ${jobId} ถูกตีกลับให้แก้ไข`,
        comment: comment,
        icon: 'RotateCcw' // ไอคอน: ลูกศรหมุนวนกลับ
      });
    }
  };

  // ========================================
  // ฟังก์ชันมอบหมายงานให้ผู้รับผิดชอบ
  // เมื่อหัวหน้าแผนกเลือกผู้รับผิดชอบคนใดคนหนึ่งให้รับงาน
  // - เปลี่ยนสถานะเป็น "รอดำเนินการ"
  // - ระบุชื่อผู้รับผิดชอบที่รับผิดชอบ
  // - บันทึกประวัติกิจกรรมพร้อมไอคอน FileText (📄)
  // ========================================
  const assignJob = (jobId, technicianName) => {
    console.log(`🎯 App.jsx: Assigning job ${jobId} to ${technicianName}`);
    const job = jobs.find(j => j.id === jobId);
    setJobs(prev => {
      const updated = prev.map(job =>
        job.id === jobId 
          ? { ...job, technician: technicianName, status: 'รอดำเนินการ' } 
          : job
      );
      console.log('✅ App.jsx: Jobs updated', updated.find(j => j.id === jobId));
      return updated;
    });
    if (job) {
      addActivity({
        type: 'assign',
        jobId: jobId,
        jobName: job.name,
        message: `หัวหน้าช่างมอบหมายงาน ${jobId} ให้ ${technicianName}`,
        technician: technicianName,
        icon: 'FileText' // ไอคอน: เอกสาร/ใบงาน
      });
    }
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
              setJobs={setJobs}
              pendingJobsCount={pendingJobs.length} 
              assignJob={assignJob}
              approveJob={approveJob}
              rejectJob={rejectJob}
              activityLog={activityLog}
              addActivity={addActivity}
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