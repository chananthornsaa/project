// ========================================
// SupervisorDashboard.jsx - DASHBOARD สำหรับหัวหน้าช่าง
// ========================================

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Clock, Briefcase, AlertTriangle } from 'lucide-react';
// IMPORT FIX: นำเข้าข้อมูลและ Helper ที่จำเป็นทั้งหมด
import mockData from '../../data/Techsample.jsx';
const { sampleJobs, ACTIVITIES } = mockData;

// Constants & Helpers (คัดลอกและปรับปรุงจาก AdminDashboard.jsx)
const ALL_STATUSES_FOR_CARDS = ['รออนุมัติ', 'รอดำเนินการ', 'กำลังทำ', 'รอตรวจสอบ'];
const SUPERVISOR_DEPT = 'ไฟฟ้า'; // หัวหน้าช่างคนนี้ดูแลแผนกไฟฟ้า
const priorityOrder = {'ด่วนมาก': 1, 'สูง': 2, 'ปานกลาง': 3, 'ต่ำ': 4,};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString || dateTimeString === 'ไม่มี') return 'N/A';
  const [datePart, timePart] = dateTimeString.split(' ');
  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const [year, month, day] = datePart.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  return `${day} ${thaiMonths[monthIndex]} ${timePart}`;
};
const getPriorityClass = (priority) => {
  switch(priority) {
    case 'ด่วนมาก': return 'priority-badge priority-urgent';
    case 'สูง': return 'priority-badge priority-high';
    case 'ปานกลาง': return 'priority-badge priority-medium';
    case 'ต่ำ': return 'priority-badge priority-low';
    default: return 'priority-badge';
  }
};
const getDepartmentClass = (department) => {
  switch(department) {
    case 'ไฟฟ้า': return 'dept-badge dept-electrical';
    case 'ประปา': return 'dept-badge dept-plumbing';
    case 'โครงสร้าง': return 'dept-badge dept-structure';
    default: return 'dept-badge';
  }
};
const getStatusClass = (status) => {
  switch(status) {
    case 'รออนุมัติ': return 'status-badge status-unassigned';
    case 'รอดำเนินการ': return 'status-badge status-pending';
    case 'กำลังทำ': return 'status-badge status-in-progress';
    case 'รอตรวจสอบ': return 'status-badge status-review';
    case 'ผ่านการตรวจสอบ': return 'status-badge status-approved';
    default: return 'status-badge';
  }
};
const getStatusDotClass = (status) => {
  switch(status) {
    case 'รออนุมัติ': return 'job-name-status-dot status-dot-unassigned';
    case 'รอดำเนินการ': return 'job-name-status-dot status-dot-pending';
    case 'กำลังทำ': return 'job-name-status-dot status-dot-in-progress';
    case 'รอตรวจสอบ': return 'job-name-status-dot status-dot-review';
    case 'ผ่านการตรวจสอบ': return 'job-name-status-dot status-dot-approved';
    default: return 'job-name-status-dot';
  }
};


function SupervisorDashboard({ currentPage, handlePageChange }) {
    const userRole = 'supervisor'; // Role ถูกล็อคสำหรับ Component นี้
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
    const [filterPriority, setFilterPriority] = useState('ทั้งหมด');
    const [jobsPerPage, setJobsPerPage] = useState(5);
    const [currentPageIndex, setCurrentPageIndex] = useState(1);

    const uniqueDepartments = [SUPERVISOR_DEPT, 'ทั้งหมด']; 

    // Logic: กรองงานตาม Role (Supervisor เห็นเฉพาะแผนก) และ Apply Default Sort
    const jobsByRole = useMemo(() => {
        let jobs = sampleJobs.filter(job => job.department === SUPERVISOR_DEPT); // Filtered by dept
        jobs.sort((a, b) => (priorityOrder[a.priority] || 5) - (priorityOrder[b.priority] || 5));
        return jobs;
    }, []); 

    const filteredJobs = jobsByRole.filter(job => {
        const lowerSearchText = searchText.toLowerCase();
        const matchSearch = job.name.toLowerCase().includes(lowerSearchText) || job.id.toLowerCase().includes(lowerSearchText);
        const matchFilterStatus = filterStatus === 'ทั้งหมด' || job.status === filterStatus;
        const matchFilterPriority = filterPriority === 'ทั้งหมด' || job.priority === filterPriority;
        
        return matchSearch && matchFilterStatus && matchFilterPriority;
    });

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const paginatedJobs = useMemo(() => {
        const startIndex = (currentPageIndex - 1) * jobsPerPage;
        const endIndex = startIndex + jobsPerPage;
        return filteredJobs.slice(startIndex, endIndex);
    }, [filteredJobs, currentPageIndex, jobsPerPage]);

    useEffect(() => {
        if (currentPageIndex > totalPages && totalPages > 0) setCurrentPageIndex(totalPages);
        else if (currentPageIndex < 1 && totalPages > 0) setCurrentPageIndex(1);
        else if (totalPages === 0 && currentPageIndex !== 1) setCurrentPageIndex(1);
    }, [filteredJobs.length, jobsPerPage, totalPages, currentPageIndex]);

    const countByStatus = (status) => jobsByRole.filter(job => job.status === status).length;
    const totalWIPJobs = ALL_STATUSES_FOR_CARDS.reduce((total, status) => total + countByStatus(status), 0);
    
    // NEW: กรอง Activity Log ให้แสดงเฉพาะของแผนกตัวเอง
    const filteredActivities = ACTIVITIES.filter(activity => activity.department === SUPERVISOR_DEPT).slice(0, 5);


    // Mock Urgent Jobs Data - กรองตาม SUPERVISOR_DEPT ('ไฟฟ้า')
    const mockUrgentJobs = [
        { id: 'J004', name: 'ซ่อมท่อประปา', dept: 'ประปา', priority: 'red', deadline: 'วันนี้' },
        { id: 'J001', name: 'ซ่อมแอร์ห้อง 301', dept: 'ไฟฟ้า', priority: 'yellow', deadline: 'พรุ่งนี้' }
    ];
    const filteredUrgentJobs = mockUrgentJobs.filter(job => job.dept === SUPERVISOR_DEPT);


    return (
        <>
        {currentPage === 'dashboard' && (
            <>
                {/* 1. Status Summary Cards */}
                <div className="status-cards">
                    <div className="card"><div className="card-label">งานทั้งหมด (ต้องจัดการ)</div><div className="card-number">{totalWIPJobs}</div></div>
                    <div className="card"><div className="card-label">รออนุมัติ</div><div className="card-number blue">{countByStatus('รออนุมัติ')}</div></div>
                    <div className="card"><div className="card-label">รอดำเนินการ</div><div className="card-number orange">{countByStatus('รอดำเนินการ')}</div></div>
                    <div className="card"><div className="card-label">กำลังทำ</div><div className="card-number blue">{countByStatus('กำลังทำ')}</div></div>
                    <div className="card highlight"><div className="card-label">รอตรวจสอบ ⭐</div><div className="card-number yellow">{countByStatus('รอตรวจสอบ')}</div></div>
                </div>

                {/* 3. Search & Smart Filter Box */}
                <div className="search-filter-box">
                    <div className="search-container"><Search className="search-icon" size={20} /><input type="text" placeholder="ค้นหางาน (รหัส/ชื่องาน)" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="search-input" /></div>
                    <div className="filter-container"><Filter size={20} /><select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
                        <option value="ทั้งหมด">ทั้งหมด (สถานะ)</option><option value="รออนุมัติ">รออนุมัติ</option><option value="รอดำเนินการ">รอดำเนินการ</option><option value="กำลังทำ">กำลังทำ</option><option value="รอตรวจสอบ">รอตรวจสอบ</option><option value="ผ่านการตรวจสอบ">ผ่านการตรวจสอบ</option>
                    </select></div>
                    {/* Priority Filter */}
                    <div className="filter-container"><AlertTriangle size={20} /><select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="filter-select" title="กรองตามความสำคัญ">
                        <option value="ทั้งหมด">ทั้งหมด (ความสำคัญ)</option><option value="ด่วนมาก">ด่วนมาก</option><option value="สูง">สูง</option><option value="ปานกลาง">ปานกลาง</option><option value="ต่ำ">ต่ำ</option>
                    </select></div>
                </div>
                
                {/* 2. Job Table */}
                <div className="table-container">
                    <div className="table-header-controls">
                        <div className="table-header-left">
                            <h3 className="urgent-title">📋 รายการงานที่แสดง ({filteredJobs.length} งาน)</h3>
                        </div>
                        <div className="filter-container" style={{ gap: '4px' }}>
                            <label className="role-label" style={{ marginBottom: 0, marginRight: '8px' }}>งานต่อหน้า:</label>
                            <select value={jobsPerPage} onChange={(e) => { setJobsPerPage(Number(e.target.value)); setCurrentPageIndex(1); }}
                                className="filter-select" style={{ padding: '4px 8px', fontSize: '14px' }}>
                                <option value={5}>5 งาน</option><option value={10}>10 งาน</option><option value={15}>15 งาน</option>
                            </select>
                        </div>
                    </div>

                    <table className="job-table">
                        <thead>
                            <tr>
                                <th>รหัสงาน</th>
                                <th>ชื่องาน</th>
                                <th>ช่างที่ถูกมอบหมาย</th>
                                <th>ความสำคัญ</th>
                                <th>สถานะ</th>
                                <th>กำหนดส่งงาน</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedJobs.length > 0 ? (
                                paginatedJobs.map((job) => {
                                    const showApproveAssign = job.status === 'รออนุมัติ'; 
                                    return (
                                    <tr key={job.id}>
                                        <td>{job.id}</td>
                                        <td className="job-name job-name-cell"><span className={getStatusDotClass(job.status)}></span>{job.name}</td>
                                        <td>{job.technician}</td> {/* แสดงชื่อช่างแทนแผนก */}
                                        <td><span className={getPriorityClass(job.priority)}>{job.priority}</span></td>
                                        <td><span className={getStatusClass(job.status)}>{job.status}</span></td>
                                        <td>{formatDateTime(job.updatedAt)}</td>
                                        <td className="job-actions-cell">
                                            {showApproveAssign ? (
                                                <button className="approve-assign-btn" onClick={() => alert(`จำลอง: อนุมัติและมอบหมายงาน ${job.id} ให้ช่าง`)}>
                                                    อนุมัติ/มอบหมาย
                                                </button>
                                            ) : (
                                                <button className="detail-btn">ดูรายละเอียด</button>
                                            )}
                                        </td>
                                    </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '16px' }}>ไม่พบรายการงานที่ตรงกับตัวกรอง</td></tr>
                            )}
                        </tbody>
                    </table>
                    
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
                    {/* Activity Log (Filtered) */}
                    <div className="activity-log-box"> 
                        <div className="activity-log-title"><Clock size={18} style={{ marginRight: '8px' }} />บันทึกกิจกรรมล่าสุด</div>
                        <div className="activity-list">
                            {/* ใช้ filteredActivities */}
                            {filteredActivities.map((activity) => (<div key={activity.id} className="activity-item"><span>{activity.text}</span><span className="activity-timestamp">{activity.timestamp}</span></div>))}
                        </div>
                    </div>

                    {/* Urgent Jobs Box (Filtered) */}
                    <div className="urgent-box"> 
                        <h3 className="urgent-title">🕐 งานที่กำลังจะถึงกำหนด</h3>
                        <div className="urgent-list">
                            {/* กรองรายการเร่งด่วนตาม Supervisor Dept */}
                            {filteredUrgentJobs.length > 0 ? (
                                filteredUrgentJobs.map(job => (
                                    <div key={job.id} className={`urgent-item ${job.priority}`}>
                                        <div className="urgent-job-name">{job.id} - {job.name}</div>
                                        <div className="urgent-date">ครบกำหนด: {job.deadline}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="urgent-item" style={{ borderLeft: '4px solid #9ca3af' }}>
                                    <div className="urgent-job-name">ไม่มีงานเร่งด่วนในแผนก {SUPERVISOR_DEPT}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div> 
            </>
          )}

          {/* Page Placeholders (Supervisor-specific pages) */}
          {currentPage === 'jobs' && (<div className="page-content"><h2>📋 จัดการใบงาน (Supervisor)</h2><p>หน้านี้อาจมีสิทธิ์แก้ไขงานเฉพาะในแผนกของตน</p></div>)}
          {currentPage === 'review' && (<div className="page-content"><h2>✅ ตรวจงาน</h2><p>หน้าตรวจสอบและอนุมัติงาน</p></div>)}
          {currentPage === 'reports' && (<div className="page-content"><h2>📈 รายงานสรุป</h2><p>หน้ารายงานสรุปผลการทำงาน</p></div>)}
          {currentPage === 'settings' && (<div className="page-content"><h2>⚙️ ตั้งค่า</h2><p>หน้าตั้งค่าระบบ</p></div>)}
        </>
    );
}

export default SupervisorDashboard;