// ========================================
// Dashboard.jsx - Main Router
// (UPDATED: เพิ่มการรองรับ TechnicianDashboard ที่มีอยู่แล้ว)
// ========================================
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/Sidebar';
import './Dashboard.css';

// Import Pages
import AdminDashboard from './AdminDashboard';
import SupervisorDashboard from './SupervisorDashboard';
// ✅ IMPORT TechnicianDashboard ที่มีอยู่แล้ว
import TechnicianDashboard from '../Technician/TechnicianDashboard';

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
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [jobs, setJobs] = useState(sampleJobs);

  const handlePageChange = (page) => setCurrentPage(page);

  // ฟังก์ชันมอบหมายงาน
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

            // ✅ เพิ่ม: ถ้าเป็น technician ให้แสดง TechnicianDashboard
            if (userRole === 'technician') {
                return <TechnicianDashboard jobs={jobs} updateJobStatus={assignJob} />; // ส่ง jobs และ function ไปด้วย
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
             if (userRole === 'admin') {
                return <ReportManagement />; 
             }
             return (
                <div className="page-content">
                    <h2>📈 รายงานสรุป (หัวหน้าช่าง)</h2>
                    <p>พื้นที่สำหรับดูรายงานสรุปในส่วนของหัวหน้าช่าง (รอการออกแบบ)</p>
                </div>
             );

        case 'settings': 
            return <div className="page-content"><h2>⚙️ ตั้งค่า</h2><p>หน้าตั้งค่าระบบ</p></div>;
        
        case 'review':
             if (userRole === 'supervisor') {
                return <Checkwork 
                  pendingJobs={jobs} 
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