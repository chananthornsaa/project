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
import JobManagement from '../Admin/JobManagement';
import TechnicianManagement from '../Admin/TechnicianManagement';
import ReportManagement from '../Admin/ReportManagement';

function Dashboard() {
  const location = useLocation();
  const userRole = location.state?.userRole || 'admin'; 
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handlePageChange = (page) => setCurrentPage(page);

  const renderContent = () => {
    switch(currentPage) {
        case 'dashboard':
            if (userRole === 'admin') return <AdminDashboard handlePageChange={handlePageChange} />;
            if (userRole === 'supervisor') return <SupervisorDashboard handlePageChange={handlePageChange} />;
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
            return <div className="page-content"><h2>⚙️ ตั้งค่า</h2><p>หน้าตั้งค่าระบบ</p></div>;
        
        case 'review':
             if (userRole === 'supervisor') return <div className="page-content"><h2>✅ ตรวจงาน</h2><p>หน้าตรวจสอบและอนุมัติงาน</p></div>;
             return <div>Unauthorized</div>;

        default: 
            return <div className="page-content"><h2>404 Not Found</h2></div>;
    }
  };

  return (
    <div className="app-container">
      <Navbar userRole={userRole} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
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