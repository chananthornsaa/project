// ========================================
// Dashboard.jsx - หน้าหลักของระบบจ่ายงานช่าง
// ========================================

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/Sidebar';
import './Dashboard.css';

// ========================================
// ดึงข้อมูลตัวอย่าง - Import Mock Data
// ========================================
import sampleJobs from '../../data/Techsample.jsx';

// ========================================
// Dashboard Component - Component หลัก
// ========================================
function Dashboard() {
  // ========================================
  // State Management - จัดการสถานะต่างๆ
  // ========================================
  const [userRole, setUserRole] = useState('admin'); // บทบาทผู้ใช้: 'admin' หรือ 'supervisor'
  const [currentPage, setCurrentPage] = useState('dashboard'); // หน้าปัจจุบันที่แสดง
  const [searchText, setSearchText] = useState(''); // ข้อความค้นหา
  const [filterStatus, setFilterStatus] = useState('ทั้งหมด'); // ฟิลเตอร์สถานะงาน
  const [sidebarOpen, setSidebarOpen] = useState(true); // เปิด/ปิด Sidebar

  // ========================================
  // ฟังก์ชันกรองข้อมูลงาน
  // ========================================
  const filteredJobs = sampleJobs.filter(job => {
    // ตรวจสอบว่าตรงกับคำค้นหาหรือไม่ (ชื่องาน หรือ รหัสงาน)
    const matchSearch = job.name.includes(searchText) || job.id.includes(searchText);
    
    // ตรวจสอบว่าตรงกับฟิลเตอร์สถานะหรือไม่
    const matchFilter = filterStatus === 'ทั้งหมด' || job.status === filterStatus;
    
    return matchSearch && matchFilter;
  });

  // ========================================
  // ฟังก์ชันนับจำนวนงานตามสถานะ
  // ========================================
  const countByStatus = (status) => {
    return sampleJobs.filter(job => job.status === status).length;
  };

  // ========================================
  // ฟังก์ชันเปลี่ยนหน้า
  // ========================================
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ========================================
  // ฟังก์ชันสำหรับ CSS Class ของ Status Badge
  // ========================================
  const getStatusClass = (status) => {
    switch(status) {
      case 'รอดำเนินการ':
        return 'status-badge status-pending';
      case 'กำลังทำ':
        return 'status-badge status-in-progress';
      case 'เสร็จแล้ว':
        return 'status-badge status-completed';
      case 'รอตรวจสอบ':
        return 'status-badge status-review';
      default:
        return 'status-badge';
    }
  };

  // ========================================
  // Render - แสดงผล UI
  // ========================================
  return (
    <div className="app-container">
      {/* ========================================
          Navbar - แถบเมนูด้านบน
          ======================================== */}
      <Navbar 
        userRole={userRole} 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <div className="main-layout">
        {/* ========================================
            Sidebar - เมนูด้านซ้าย
            ======================================== */}
        {sidebarOpen && (
          <Sidebar 
            userRole={userRole}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onRoleChange={setUserRole}
          />
        )}

        {/* ========================================
            Content Area - พื้นที่เนื้อหาหลัก
            ======================================== */}
        <div className="content-area">
          
          {/* ========================================
              หน้า Dashboard
              ======================================== */}
          {currentPage === 'dashboard' && (
            <>
              {/* ========================================
                  Status Summary Cards - การ์ดสรุปสถานะงาน
                  ======================================== */}
              <div className="status-cards">
                {/* การ์ดงานทั้งหมด */}
                <div className="card">
                  <div className="card-label">งานทั้งหมด</div>
                  <div className="card-number">{sampleJobs.length}</div>
                </div>

                {/* การ์ดรอดำเนินการ */}
                <div className="card">
                  <div className="card-label">รอดำเนินการ</div>
                  <div className="card-number orange">
                    {countByStatus('รอดำเนินการ')}
                  </div>
                </div>

                {/* การ์ดกำลังทำ */}
                <div className="card">
                  <div className="card-label">กำลังทำ</div>
                  <div className="card-number blue">
                    {countByStatus('กำลังทำ')}
                  </div>
                </div>

                {/* การ์ดพิเศษ - แสดงต่างกันตาม role */}
                {userRole === 'supervisor' ? (
                  // หัวหน้าช่างจะเห็นการ์ด "รอตรวจสอบ" แบบเด่น
                  <div className="card highlight">
                    <div className="card-label">รอตรวจสอบ ⭐</div>
                    <div className="card-number yellow">
                      {countByStatus('รอตรวจสอบ')}
                    </div>
                  </div>
                ) : (
                  // Admin จะเห็นการ์ด "เสร็จแล้ว"
                  <div className="card">
                    <div className="card-label">เสร็จแล้ว</div>
                    <div className="card-number green">
                      {countByStatus('เสร็จแล้ว')}
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================
                  Search & Filter Box - ช่องค้นหาและฟิลเตอร์
                  ======================================== */}
              <div className="search-filter-box">
                {/* ช่องค้นหา */}
                <div className="search-container">
                  <Search className="search-icon" size={20} />
                  <input
                    type="text"
                    placeholder="ค้นหางาน (รหัส/ชื่องาน)"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="search-input"
                  />
                </div>

                {/* ฟิลเตอร์สถานะ */}
                <div className="filter-container">
                  <Filter size={20} />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option>ทั้งหมด</option>
                    <option>รอดำเนินการ</option>
                    <option>กำลังทำ</option>
                    <option>เสร็จแล้ว</option>
                    <option>รอตรวจสอบ</option>
                  </select>
                </div>
              </div>

              {/* ========================================
                  Job Table - ตารางแสดงรายการงาน
                  ======================================== */}
              <div className="table-container">
                <table className="job-table">
                  {/* Header ของตาราง */}
                  <thead>
                    <tr>
                      <th>รหัสงาน</th>
                      <th>ชื่องาน</th>
                      <th>วันที่รับ</th>
                      <th>ผู้รับงาน</th>
                      <th>สถานะ</th>
                      <th>จัดการ</th>
                    </tr>
                  </thead>

                  {/* เนื้อหาของตาราง */}
                  <tbody>
                    {filteredJobs.map((job) => (
                      <tr key={job.id}>
                        <td>{job.id}</td>
                        <td className="job-name">{job.name}</td>
                        <td>{job.date}</td>
                        <td>{job.technician}</td>
                        <td>
                          {/* Badge แสดงสถานะพร้อมสี */}
                          <span className={getStatusClass(job.status)}>
                            {job.status}
                          </span>
                        </td>
                        <td>
                          <button className="detail-btn">
                            ดูรายละเอียด
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ========================================
                  Urgent Jobs Box - กล่องงานที่ใกล้ครบกำหนด
                  ======================================== */}
              <div className="urgent-box">
                <h3 className="urgent-title">
                  🕐 งานที่กำลังจะถึงกำหนด
                </h3>
                <div className="urgent-list">
                  {/* งานเร่งด่วนระดับสูง (วันนี้) */}
                  <div className="urgent-item red">
                    <div className="urgent-job-name">
                      J004 - ซ่อมท่อประปา
                    </div>
                    <div className="urgent-date">ครบกำหนด: วันนี้</div>
                  </div>

                  {/* งานเร่งด่วนระดับปานกลาง (พรุ่งนี้) */}
                  <div className="urgent-item yellow">
                    <div className="urgent-job-name">
                      J001 - ซ่อมแอร์ห้อง 301
                    </div>
                    <div className="urgent-date">ครบกำหนด: พรุ่งนี้</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========================================
              หน้าอื่นๆ - Placeholder สำหรับหน้าที่เหลือ
              ======================================== */}
          
          {/* หน้าจัดการใบงาน */}
          {currentPage === 'jobs' && (
            <div className="page-content">
              <h2>📋 จัดการใบงาน</h2>
              <p>หน้าจัดการใบงาน - เพิ่ม/แก้ไข/ลบงาน</p>
            </div>
          )}

          {/* หน้าจัดการช่าง (เฉพาะ Admin) */}
          {currentPage === 'technicians' && (
            <div className="page-content">
              <h2>👷 จัดการช่าง</h2>
              <p>หน้าจัดการข้อมูลช่าง (เฉพาะ Admin)</p>
            </div>
          )}

          {/* หน้าตรวจงาน (เฉพาะหัวหน้าช่าง) */}
          {currentPage === 'review' && (
            <div className="page-content">
              <h2>✅ ตรวจงาน</h2>
              <p>หน้าตรวจสอบและอนุมัติงาน (เฉพาะหัวหน้าช่าง)</p>
            </div>
          )}

          {/* หน้ารายงานสรุป */}
          {currentPage === 'reports' && (
            <div className="page-content">
              <h2>📈 รายงานสรุป</h2>
              <p>หน้ารายงานสรุปผลการทำงาน</p>
            </div>
          )}

          {/* หน้าตั้งค่า */}
          {currentPage === 'settings' && (
            <div className="page-content">
              <h2>⚙️ ตั้งค่า</h2>
              <p>หน้าตั้งค่าระบบ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;