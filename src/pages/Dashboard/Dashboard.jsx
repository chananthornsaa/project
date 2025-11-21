// ========================================
// Dashboard.jsx - หน้าหลักของระบบจ่ายงานช่าง
// ========================================

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, Briefcase } from 'lucide-react';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/Sidebar';
import './Dashboard.css';

// ดึงข้อมูลตัวอย่าง
import mockData from '../../data/Techsample.jsx';
const { sampleJobs, ACTIVITIES } = mockData;

// ค่าคงที่
const ALL_STATUSES_FOR_CARDS = ['รออนุมัติ', 'รอดำเนินการ', 'กำลังทำ', 'รอตรวจสอบ']; // UPDATED
const SUPERVISOR_DEPT = 'ไฟฟ้า'; 

// Helper: คำนวณช่วงวันที่สำหรับ Filter (วัน/สัปดาห์/เดือน)
const getFilterDateRange = (filterType) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (filterType === 'วัน') return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (filterType === 'สัปดาห์') {
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    return sevenDaysAgo;
  }
  if (filterType === 'เดือน') return new Date(today.getFullYear(), today.getMonth(), 1);
  
  return null;
};

// ========================================
// Dashboard Component
// ========================================
function Dashboard() {
  // State Management
  const [userRole, setUserRole] = useState('admin');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [searchText, setSearchText] = useState('');
  
  // Smart Filters
  const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
  const [filterDepartment, setFilterDepartment] = useState('ทั้งหมด');
  const [filterDate, setFilterDate] = useState('ทั้งหมด');
  
  // Pagination States
  const [jobsPerPage, setJobsPerPage] = useState(5);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Logic: ดึงรายการแผนกที่มี
  const uniqueDepartments = useMemo(() => {
    const depts = new Set(sampleJobs.map(job => job.department).filter(Boolean));
    return ['ทั้งหมด', ...Array.from(depts)];
  }, []);
  
  // Logic: กรองงานตาม Role (Admin เห็นทั้งหมด, Supervisor เห็นเฉพาะแผนก)
  const jobsByRole = useMemo(() => {
    return userRole === 'admin' ? sampleJobs : sampleJobs.filter(job => job.department === SUPERVISOR_DEPT);
  }, [userRole]);
  
  // Logic: กรองงานด้วย Smart Filters
  const filteredJobs = jobsByRole.filter(job => {
    const lowerSearchText = searchText.toLowerCase();
    const matchSearch = job.name.toLowerCase().includes(lowerSearchText) || job.id.toLowerCase().includes(lowerSearchText);
    const matchFilterStatus = filterStatus === 'ทั้งหมด' || job.status === filterStatus;
    const matchFilterDepartment = filterDepartment === 'ทั้งหมด' || job.department === filterDepartment;
    
    const filterRangeDate = getFilterDateRange(filterDate);
    let matchFilterDate = filterDate === 'ทั้งหมด';

    if (filterRangeDate) {
      const jobDate = new Date(job.date);
      jobDate.setHours(0, 0, 0, 0);

      if (filterDate === 'วัน') matchFilterDate = jobDate.toDateString() === filterRangeDate.toDateString();
      else if (filterDate === 'เดือน') matchFilterDate = jobDate.getFullYear() === filterRangeDate.getFullYear() && jobDate.getMonth() === filterRangeDate.getMonth();
      else if (filterDate === 'สัปดาห์') matchFilterDate = jobDate >= filterRangeDate;
    }
    
    return matchSearch && matchFilterStatus && matchFilterDepartment && matchFilterDate;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPageIndex - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs, currentPageIndex, jobsPerPage]);

  // Effect: Reset หน้าเมื่อ Filter หรือ Page Size เปลี่ยน
  useEffect(() => {
    if (currentPageIndex > totalPages && totalPages > 0) setCurrentPageIndex(totalPages);
    else if (currentPageIndex < 1 && totalPages > 0) setCurrentPageIndex(1);
    else if (totalPages === 0 && currentPageIndex !== 1) setCurrentPageIndex(1);
  }, [filteredJobs.length, jobsPerPage, totalPages, currentPageIndex]);


  // Count Functions
  const countByStatus = (status) => jobsByRole.filter(job => job.status === status).length;
  const totalWIPJobs = ALL_STATUSES_FOR_CARDS.reduce((total, status) => total + countByStatus(status), 0);
  
  const activityLog = ACTIVITIES.slice(0, 5);

  const handlePageChange = (page) => setCurrentPage(page);

  // Helper: Class สำหรับ Badge สถานะ (UPDATED: 'รอมอบหมาย' -> 'รออนุมัติ')
  const getStatusClass = (status) => {
    switch(status) {
      case 'รออนุมัติ': return 'status-badge status-unassigned'; // UPDATED
      case 'รอดำเนินการ': return 'status-badge status-pending';
      case 'กำลังทำ': return 'status-badge status-in-progress';
      case 'รอตรวจสอบ': return 'status-badge status-review';
      case 'ผ่านการตรวจสอบ': return 'status-badge status-approved';
      default: return 'status-badge';
    }
  };
  
  // Helper: Class สำหรับ Status Dot (หน้าชื่องาน) (UPDATED: 'รอมอบหมาย' -> 'รออนุมัติ')
  const getStatusDotClass = (status) => {
    switch(status) {
      case 'รออนุมัติ': return 'job-name-status-dot status-dot-unassigned'; // UPDATED
      case 'รอดำเนินการ': return 'job-name-status-dot status-dot-pending';
      case 'กำลังทำ': return 'job-name-status-dot status-dot-in-progress';
      case 'รอตรวจสอบ': return 'job-name-status-dot status-dot-review';
      case 'ผ่านการตรวจสอบ': return 'job-name-status-dot status-dot-approved';
      default: return 'job-name-status-dot';
    }
  };

  // Helper: Class สำหรับ Department Badge
  const getDepartmentClass = (department) => {
    switch(department) {
      case 'ไฟฟ้า': return 'dept-badge dept-electrical';
      case 'ประปา': return 'dept-badge dept-plumbing';
      case 'โครงสร้าง': return 'dept-badge dept-structure';
      default: return 'dept-badge';
    }
  };

  // ========================================
  // Render
  // ========================================
  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar userRole={userRole} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <div className="main-layout">
        {/* Sidebar */}
        {sidebarOpen && <Sidebar userRole={userRole} currentPage={currentPage} onPageChange={handlePageChange} onRoleChange={setUserRole} />}

        <div className="content-area">
          
          {currentPage === 'dashboard' && (
            <>
              {/* 1. Status Summary Cards */}
              <div className="status-cards">
                <div className="card"><div className="card-label">งานทั้งหมด (ต้องจัดการ)</div><div className="card-number">{totalWIPJobs}</div></div>
                <div className="card">
                  {/* UPDATED: 'รอมอบหมาย' -> 'รออนุมัติ' */}
                  <div className="card-label">รออนุมัติ</div>
                  <div className="card-number blue">{countByStatus('รออนุมัติ')}</div>
                </div>
                <div className="card">
                  <div className="card-label">รอดำเนินการ</div>
                  <div className="card-number orange">{countByStatus('รอดำเนินการ')}</div>
                </div>
                <div className="card">
                  <div className="card-label">กำลังทำ</div>
                  <div className="card-number blue">{countByStatus('กำลังทำ')}</div>
                </div>
                <div className="card highlight">
                  <div className="card-label">รอตรวจสอบ ⭐</div>
                  <div className="card-number yellow">{countByStatus('รอตรวจสอบ')}</div>
                </div>
              </div>

              {/* 3. Search & Smart Filter Box */}
              <div className="search-filter-box">
                <div className="search-container">
                  <Search className="search-icon" size={20} />
                  <input type="text" placeholder="ค้นหางาน (รหัส/ชื่องาน)" value={searchText}
                    onChange={(e) => setSearchText(e.target.value)} className="search-input" />
                </div>

                <div className="filter-container">
                  <Filter size={20} />
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
                    <option value="ทั้งหมด">ทั้งหมด (สถานะ)</option>
                    {/* UPDATED: 'รอมอบหมาย' -> 'รออนุมัติ' */}
                    <option value="รออนุมัติ">รออนุมัติ</option>
                    <option value="รอดำเนินการ">รอดำเนินการ</option>
                    <option value="กำลังทำ">กำลังทำ</option>
                    <option value="รอตรวจสอบ">รอตรวจสอบ</option>
                    <option value="ผ่านการตรวจสอบ">ผ่านการตรวจสอบ</option>
                  </select>
                </div>
                
                <div className="filter-container">
                  <Briefcase size={20} />
                  <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="filter-select">
                    <option value="ทั้งหมด">ทั้งหมด (แผนก)</option>
                    {uniqueDepartments.filter(d => d !== 'ทั้งหมด').map(dept => (<option key={dept} value={dept}>{dept}</option>))}
                  </select>
                </div>

                <div className="filter-container">
                  <Calendar size={20} />
                  <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="filter-select" title="กรองตามช่วงเวลา">
                    <option value="ทั้งหมด">ทั้งหมด (เวลา)</option>
                    <option value="วัน">วันนี้</option>
                    <option value="สัปดาห์">สัปดาห์นี้</option>
                    <option value="เดือน">เดือนนี้</option>
                  </select>
                </div>
              </div>
              
              {/* 2. Job Table (with Pagination) */}
              <div className="table-container">
                <div className="table-header-controls">
                    <h3 className="urgent-title" style={{ marginBottom: 0 }}>📋 รายการงานที่แสดง ({filteredJobs.length} งาน)</h3>
                    <div className="filter-container" style={{ gap: '4px' }}>
                        <label className="role-label" style={{ marginBottom: 0, marginRight: '8px' }}>งานต่อหน้า:</label>
                        <select value={jobsPerPage} onChange={(e) => { setJobsPerPage(Number(e.target.value)); setCurrentPageIndex(1); }}
                            className="filter-select" style={{ padding: '4px 8px', fontSize: '14px' }}>
                            <option value={5}>5 งาน</option><option value={10}>10 งาน</option><option value={20}>20 งาน</option>
                        </select>
                    </div>
                </div>

                <table className="job-table">
                  <thead>
                    <tr><th>รหัสงาน</th><th>ชื่องาน</th><th>แผนก</th><th>ช่างที่ถูกมอบหมาย</th><th>สถานะ</th><th>วันที่อัปเดตล่าสุด</th><th>จัดการ</th></tr>
                  </thead>

                  <tbody>
                    {paginatedJobs.length > 0 ? (
                        paginatedJobs.map((job) => (
                            <tr key={job.id}>
                                <td>{job.id}</td>
                                <td className="job-name job-name-cell">
                                  <span className={getStatusDotClass(job.status)}></span>{job.name}
                                </td>
                                <td><span className={getDepartmentClass(job.department)}>{job.department}</span></td>
                                <td>{job.technician}</td>
                                <td><span className={getStatusClass(job.status)}>{job.status}</span></td>
                                <td>{job.updatedAt}</td>
                                <td className="job-actions-cell">
                                  {/* Supervisor เห็นปุ่ม "อนุมัติ/มอบหมาย" เมื่อสถานะเป็น 'รออนุมัติ' */}
                                  {userRole === 'supervisor' && job.status === 'รออนุมัติ' && (
                                    <button 
                                      className="approve-assign-btn" 
                                      onClick={() => alert(`อนุมัติและมอบหมายงาน ${job.id}`)} // Mock Action
                                    >
                                      อนุมัติ/มอบหมาย
                                    </button>
                                  )}
                                  <button className="detail-btn">ดูรายละเอียด</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '16px' }}>ไม่พบรายการงานที่ตรงกับตัวกรอง</td></tr>
                    )}
                  </tbody>
                </table>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button onClick={() => setCurrentPageIndex(prev => prev - 1)} disabled={currentPageIndex === 1} className="page-btn">ก่อนหน้า</button>
                        <span className="page-info">หน้า {currentPageIndex} จาก {totalPages}</span>
                        <button onClick={() => setCurrentPageIndex(prev => prev + 1)} disabled={currentPageIndex === totalPages} className="page-btn">ถัดไป</button>
                    </div>
                )}
              </div>
              
              {/* Bottom Row: Activity Log & Urgent Jobs */}
              <div className="dashboard-bottom-row"> 
                  <div className="activity-log-box"> 
                    <div className="activity-log-title">
                      <Clock size={18} style={{ marginRight: '8px' }} />บันทึกกิจกรรมล่าสุด
                    </div>
                    <div className="activity-list">
                      {activityLog.map((activity) => (
                        <div key={activity.id} className="activity-item">
                          <span>{activity.text}</span>
                          <span className="activity-timestamp">{activity.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="urgent-box"> 
                    <h3 className="urgent-title">
                      🕐 งานที่กำลังจะถึงกำหนด
                    </h3>
                    <div className="urgent-list">
                      <div className="urgent-item red"><div className="urgent-job-name">J004 - ซ่อมท่อประปา</div><div className="urgent-date">ครบกำหนด: วันนี้</div></div>
                      <div className="urgent-item yellow"><div className="urgent-job-name">J001 - ซ่อมแอร์ห้อง 301</div><div className="urgent-date">ครบกำหนด: พรุ่งนี้</div></div>
                    </div>
                  </div>
              </div> 
            </>
          )}

          {/* Page Placeholders */}
          {currentPage === 'jobs' && (<div className="page-content"><h2>📋 จัดการใบงาน</h2><p>หน้าจัดการใบงาน - เพิ่ม/แก้ไข/ลบงาน</p></div>)}
          {currentPage === 'technicians' && (<div className="page-content"><h2>👷 จัดการช่าง</h2><p>หน้าจัดการข้อมูลช่าง (เฉพาะ Admin)</p></div>)}
          {currentPage === 'review' && (<div className="page-content"><h2>✅ ตรวจงาน</h2><p>หน้าตรวจสอบและอนุมัติงาน (เฉพาะหัวหน้าช่าง)</p></div>)}
          {currentPage === 'reports' && (<div className="page-content"><h2>📈 รายงานสรุป</h2><p>หน้ารายงานสรุปผลการทำงาน</p></div>)}
          {currentPage === 'settings' && (<div className="page-content"><h2>⚙️ ตั้งค่า</h2><p>หน้าตั้งค่าระบบ</p></div>)}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;