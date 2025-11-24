// ========================================
// Dashboard.jsx - หน้าหลักของระบบจ่ายงานช่าง
// ========================================

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import TechnicianManagement from './TechnicianManagement.jsx'
import JobManagement from './JobManagement.jsx'
import ReportManagement from './ReportManagement.jsx'
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
  // const [showAllJobs, setShowAllJobs] = useState(false); // ลบ state นี้ออกตามต้องการ

  // ========================================
  // ฟังก์ชันกรองและเตรียมข้อมูลงาน (สำหรับตาราง)
  // ========================================
  const allFilteredJobs = sampleJobs.filter(job => {
    // ตรวจสอบว่าตรงกับคำค้นหาหรือไม่ (ชื่องาน หรือ รหัสงาน)
    const matchSearch = job.name.includes(searchText) || job.id.includes(searchText);

    // ตรวจสอบว่าตรงกับฟิลเตอร์สถานะหรือไม่ (ใช้ 'ทั้งหมด' เป็นค่าเริ่มต้น/รวมทั้งหมด)
    const matchFilter = filterStatus === 'ทั้งหมด' || job.status === filterStatus;

    return matchSearch && matchFilter;
  });

  // 1. เรียงลำดับตามวันที่จาก 'ล่าสุดไปเก่าสุด'
  const sortedFilteredJobs = allFilteredJobs.sort((a, b) => {
    // แปลงวันที่เป็นวัตถุ Date เพื่อเปรียบเทียบ: New Date (b) - New Date (a) = ล่าสุดไปเก่าสุด
    return new Date(b.date) - new Date(a.date);
  });

  // 2. ตัดเอาเฉพาะ 5 รายการแรกสำหรับแสดงบน Dashboard
  const displayedJobs = sortedFilteredJobs.slice(0, 5);


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

  // ฟังก์ชันสำหรับปุ่ม "ดูทั้งหมด"
  const handleViewAllJobs = () => {
    setCurrentPage('jobs'); // เปลี่ยนไปหน้า JobManagement
  };

  // ========================================
  // ฟังก์ชันสำหรับ CSS Class ของ Status Badge
  // ========================================
  const getStatusClass = (status) => {
    switch (status) {
      case 'รอดำเนินการ':
        return 'status-badge status-pending';
      case 'กำลังดำเนินการ':
        return 'status-badge status-in-progress';
      case 'เสร็จสิ้น':
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
                {/* Admin จะเห็นการ์ด เสร็จสิ้น */}
                <div className="card">
                  <div className="card-label">เสร็จสิ้น</div>
                  <div className="card-number green">
                    {countByStatus('เสร็จสิ้น')}
                  </div>
                </div>

                {/* การ์ดกำลังทำ */}
                <div className="card">
                  <div className="card-label">กำลังดำเนินการ</div>
                  <div className="card-number blue">
                    {countByStatus('กำลังดำเนินการ')}
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
                  /* การ์ดรอดำเนินการ */
                  <div className="card">
                    <div className="card-label">รอดำเนินการ</div>
                    <div className="card-number orange">
                      {countByStatus('รอดำเนินการ')}
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
              </div>

              {/* ========================================
                  Job Table - ตารางแสดงรายการงาน (5 ล่าสุด)
                  ======================================== */}
              <div className="table-container">
                <h3 className="table-title">🕒 งาน 5 รายการล่าสุด</h3>
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

                  {/* เนื้อหาของตาราง - แสดงแค่ 5 รายการล่าสุด */}
                  <tbody>
                    {displayedJobs.map((job) => (
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
                            รายละเอียด
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ปุ่ม "ดูงานทั้งหมด" - แสดงเมื่อมีงานมากกว่า 5 รายการ */}
              <div className="view-all-container">
                {sortedFilteredJobs.length > 5 && (
                  <button
                    className="view-all-btn"
                    onClick={handleViewAllJobs}
                  >
                    ดูงานทั้งหมด ({sortedFilteredJobs.length} รายการ)
                  </button>
                )}
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
                      J006 - ซ่อมแซมพื้นกระเบื้องชั้น 5
                    </div>
                    <div className="urgent-date">ครบกำหนด: วันนี้</div>
                  </div>

                  {/* งานเร่งด่วนระดับปานกลาง (พรุ่งนี้) */}
                  <div className="urgent-item yellow">
                    <div className="urgent-job-name">
                      J005 - ทาสีผนังโซนสำนักงาน
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
            <JobManagement />
          )}

          {/* หน้าจัดการช่าง (เฉพาะ Admin) */}
          {currentPage === 'technicians' && (
            <TechnicianManagement />
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
            <ReportManagement />
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