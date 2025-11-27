// ========================================
// Dashboard.jsx - Main Router
// (UPDATED: ปรับปรุงสิทธิ์การเข้าถึงหน้ารายงานสรุป)
// ========================================
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/Sidebar';
import './Dashboard.css';

// Import Pages
import AdminDashboard from './AdminDashboard';
import SupervisorDashboard from './SupervisorDashboard';
import TechnicianDashboard from '../Technician/TechnicianDashboard';
import TechnicianSettings from '../Technician/TechnicianSettings';
import JobManagement from '../Admin/JobManagement';
import TechnicianManagement from '../Admin/TechnicianManagement';
import ReportManagement from '../Admin/ReportManagement';
import Checkwork from '../Supervisor/Checkwork.jsx';

// Import mock data
import mockData from '../../data/Techsample.jsx';
const { sampleJobs } = mockData;

function Dashboard() {
  const location = useLocation();
  const userRole = location.state?.userRole || 'admin';
  const userId = location.state?.userId || 'tech1';
  const userName = location.state?.userName || 'ช่าง';
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [jobs, setJobs] = useState(sampleJobs);

  const handlePageChange = (page) => setCurrentPage(page);

  // ✅ เพิ่ม: Function สำหรับมอบหมายงาน (จำเป็นสำหรับ SupervisorDashboard)
// ✅ ฟังก์ชันมอบหมายงาน
  const assignJob = (jobId, technicianName) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId 
          ? { ...job, technician: technicianName, status: 'กำลังทำ' } 
          : job
      )
    );
  };

  // Function สำหรับอนุมัติงาน
  const approveJob = (jobId) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId ? { ...job, status: 'เสร็จสิ้น' } : job
      )
    );
    alert(`✅ อนุมัติงาน ${jobId} เรียบร้อย`);
  };

  // Function สำหรับตีกลับงาน
  const rejectJob = (jobId) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId ? { ...job, status: 'กำลังทำ' } : job
      )
    );
    alert(`🔄 ตีกลับงาน ${jobId} ให้ช่างแก้ไข`);
  };

  // ✅ ฟังก์ชันอัปเดตสถานะงาน (สำหรับ Technician)
  const updateJobStatus = (jobId, newStatus, additionalData = {}) => {
    setJobs(prevJobs => 
      prevJobs.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            ...additionalData
          };
        }
        return job;
      })
    );
    
    if (newStatus === 'กำลังทำ') {
      alert(`✅ รับงาน ${jobId} เรียบร้อย`);
    } else if (newStatus === 'รอตรวจสอบ') {
      alert(`✅ ส่งงาน ${jobId} ให้หัวหน้าตรวจสอบเรียบร้อย`);
    }
  };

  // นับงานรอตรวจสอบ
  const pendingJobsCount = jobs.filter(job => job.status === 'รอตรวจสอบ').length;

  const renderContent = () => {
    switch(currentPage) {
        case 'dashboard':
            if (userRole === 'admin') return <AdminDashboard handlePageChange={handlePageChange} />;
            
            if (userRole === 'supervisor') {
                return (
                    <SupervisorDashboard 
                        jobs={jobs}
                        assignJob={assignJob}
                        pendingJobsCount={pendingJobsCount}
                        handlePageChange={handlePageChange} 
                    />
                );
            }

            // ✅ เพิ่ม Technician Dashboard
            if (userRole === 'technician') {
                return (
                    <TechnicianDashboard 
                        jobs={jobs}
                        currentTechnician={{ id: userId, name: userName }}
                        updateJobStatus={updateJobStatus}
                    />
                );
            }
            
            return <div>Unauthorized</div>;
        
        case 'jobs': 
            // Admin: เห็นหน้าจัดการงานตัวเต็ม (JobManagement)
            if (userRole === 'admin') {
                return <JobManagement />;
            } 
            // Supervisor: เห็นหน้า Placeholder (ไว้สำหรับจัดการใบงาน)
            return (
                <div className="page-content">
                    <h2>📋 จัดการใบงาน (หัวหน้าช่าง)</h2>
                    <p>พื้นที่สำหรับจัดการใบงานในส่วนของหัวหน้าช่าง (รอการออกแบบ)</p>
                </div>
            );

        case 'technicians': 
             if (userRole === 'admin') return <TechnicianManagement />;
             return <div>Unauthorized</div>;

        case 'reports': 
             // UPDATED: ใช้ Logic เดียวกับหน้า jobs
             // Admin: เห็นหน้ารายงานตัวเต็ม
             if (userRole === 'admin') {
                return <ReportManagement />; 
             }
             // Supervisor: เห็นหน้า Placeholder (ไว้สำหรับดูรายงาน)
             return (
                <div className="page-content">
                    <h2>📈 รายงานสรุป (หัวหน้าช่าง)</h2>
                    <p>พื้นที่สำหรับดูรายงานสรุปในส่วนของหัวหน้าช่าง (รอการออกแบบ)</p>
                </div>
             );

        case 'settings': 
            if (userRole === 'technician') {
                return <TechnicianSettings 
                    currentTechnician={{ 
                        id: userId, 
                        name: userName,
                        phone: '081-234-5678',
                        email: 'technician@example.com',
                        department: 'ไฟฟ้า'
                    }}
                />;
            }
            return <div className="page-content"><h2>⚙️ ตั้งค่า</h2><p>หน้าตั้งค่าระบบ</p></div>;
        
        case 'review':
             if (userRole === 'supervisor') {
                return <Checkwork 
                  pendingJobs={jobs} // ส่ง jobs ทั้งหมดไปกรองใน Checkwork หรือส่งเฉพาะที่กรองแล้วก็ได้
                  approveJob={approveJob} 
                  rejectJob={rejectJob} 
                  pendingJobsCount={pendingJobsCount}
                />;
             }
             return <div>Unauthorized</div>;

        default: 
            return <div className="page-content"><h2>404 Not Found</h2></div>;
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        userRole={userRole}
        userName={userName}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen}
        pendingJobsCount={pendingJobsCount}
      />
      <div className="main-layout">
        {sidebarOpen && <Sidebar userRole={userRole} currentPage={currentPage} onPageChange={handlePageChange} />}
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;