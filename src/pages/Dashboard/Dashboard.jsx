// ========================================
// Dashboard.jsx - ROUTER หลัก (ถูกเปลี่ยนบทบาทเป็นตัวจัดการการแสดงผล)
// ========================================

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/Sidebar';
// ต้องสร้างไฟล์ AdminDashboard.jsx และ SupervisorDashboard.jsx ใน Folder เดียวกันนี้
import AdminDashboard from './AdminDashboard'; 
import SupervisorDashboard from './SupervisorDashboard'; 
import './Dashboard.css';

function Dashboard() {
  const location = useLocation();
  // กำหนด Role จาก Login หรือ Default เป็น 'admin'
  const userRole = location.state?.userRole || 'admin';
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const handlePageChange = (page) => setCurrentPage(page);

  const renderDashboardContent = () => {
    // แยก Render ตาม Role
    if (userRole === 'admin') {
      return <AdminDashboard currentPage={currentPage} handlePageChange={handlePageChange} />;
    }
    if (userRole === 'supervisor') {
      return <SupervisorDashboard currentPage={currentPage} handlePageChange={handlePageChange} />;
    }
    
    // สำหรับ Role ที่ไม่รองรับ (เช่น Technician)
    return (
      <div className="page-content">
        <h2>❌ ไม่ได้รับอนุญาต</h2>
        <p>บทบาท "{userRole}" ยังไม่มีหน้า Dashboard</p>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Navbar ใช้ Role จาก Login */}
      <Navbar userRole={userRole} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <div className="main-layout">
        {/* Sidebar ใช้ Role จาก Login */}
        {sidebarOpen && <Sidebar userRole={userRole} currentPage={currentPage} onPageChange={handlePageChange} />}

        <div className="content-area">
          {renderDashboardContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;