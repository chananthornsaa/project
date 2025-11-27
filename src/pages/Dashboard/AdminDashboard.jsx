// ========================================
// AdminDashboard.jsx - หน้าภาพรวมสำหรับ Admin
// (แก้ไข: เพิ่มการตัดช่องว่าง (trim) ให้กับค่า filterDepartment ก่อนเปรียบเทียบ)
// ========================================
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Clock, Briefcase, PlusSquare, AlertTriangle } from 'lucide-react';
import mockData from '../../data/Techsample.jsx';
const { sampleJobs, ACTIVITIES } = mockData;

// Constants & Helpers
const priorityOrder = { 'ด่วนมาก': 1, 'สูง': 2, 'ปานกลาง': 3, 'ต่ำ': 4 };

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString || dateTimeString === 'ไม่มี') return 'N/A';
  const [datePart, timePart] = dateTimeString.split(' ');
  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const [year, month, day] = datePart.split('-');
  return `${day} ${thaiMonths[parseInt(month, 10) - 1]} ${timePart}`;
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

const getStatusClass = (status) => {
    switch(status) {
      case 'รออนุมัติ': return 'status-badge status-unassigned';
      case 'รอดำเนินการ': return 'status-badge status-pending';
      case 'กำลังทำ': return 'status-badge status-in-progress';
      case 'รอตรวจสอบ': return 'status-badge status-review';
      case 'เสร็จสิ้น': return 'status-badge status-completed';
      default: return 'status-badge';
    }
};

function AdminDashboard({ handlePageChange }) {
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
    const [filterDepartment, setFilterDepartment] = useState('ทั้งหมด');
    const [filterPriority, setFilterPriority] = useState('ทั้งหมด');
    const [jobsPerPage, setJobsPerPage] = useState(5);
    const [currentPageIndex, setCurrentPageIndex] = useState(1);

    // Logic กรองและเรียงลำดับ
    const uniqueDepartments = useMemo(() => {
        // FIX: Normalize department names (trim) สำหรับรายการ dropdown 
        const departments = sampleJobs.map(j => (j.department || '').trim()).filter(Boolean);
        return ['ทั้งหมด', ...new Set(departments)];
    }, [sampleJobs]); 
    
    const filteredJobs = useMemo(() => {
        // --- เริ่มต้นการแก้ไข ---
        const normalizedFilterDept = filterDepartment.trim(); // <--- NEW: ตัดช่องว่างของค่าฟิลเตอร์ที่ถูกเลือก
        // --- สิ้นสุดการแก้ไข ---
        
        let jobs = sampleJobs.filter(job => {
            const matchSearch = job.name.toLowerCase().includes(searchText.toLowerCase()) || job.id.toLowerCase().includes(searchText.toLowerCase());
            const matchStatus = filterStatus === 'ทั้งหมด' || job.status === filterStatus;
            
            // Normalize job department (เดิม)
            const normalizedJobDept = (job.department || '').trim();
            
            // เปรียบเทียบกับค่าฟิลเตอร์ที่ถูก Normalize แล้ว
            const matchDept = normalizedFilterDept === 'ทั้งหมด' || normalizedJobDept === normalizedFilterDept;
            
            const matchPriority = filterPriority === 'ทั้งหมด' || job.priority === filterPriority;
            return matchSearch && matchStatus && matchDept && matchPriority;
        });
        return jobs.sort((a, b) => (priorityOrder[a.priority] || 5) - (priorityOrder[b.priority] || 5));
    }, [searchText, filterStatus, filterDepartment, filterPriority, sampleJobs]);

    const countByStatus = (status) => sampleJobs.filter(j => j.status === status).length;
    const activityLog = ACTIVITIES.slice(0, 5);

    // PAGINATION LOGIC
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


    return (
        <>
            {/* 1. Cards */}
            <div className="status-cards">
                <div className="card"><div className="card-label">งานทั้งหมด</div><div className="card-number">{sampleJobs.length}</div></div>
                <div className="card"><div className="card-label">รออนุมัติ</div><div className="card-number blue">{countByStatus('รออนุมัติ')}</div></div>
                <div className="card"><div className="card-label">รอดำเนินการ</div><div className="card-number orange">{countByStatus('รอดำเนินการ')}</div></div>
                <div className="card"><div className="card-label">กำลังทำ</div><div className="card-number blue">{countByStatus('กำลังทำ')}</div></div>
                <div className="card highlight"><div className="card-label">รอตรวจสอบ ⭐</div><div className="card-number yellow">{countByStatus('รอตรวจสอบ')}</div></div>
            </div>

            {/* 2. Filters */}
            <div className="search-filter-box">
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input type="text" placeholder="ค้นหางาน..." value={searchText} onChange={e => setSearchText(e.target.value)} className="search-input" />
                </div>
                <div className="filter-container"><Filter size={20} /><select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select"><option>ทั้งหมด</option><option>รออนุมัติ</option><option>รอดำเนินการ</option><option>กำลังทำ</option><option>รอตรวจสอบ</option></select></div>
                
                {/* Department Filter - ใช้ uniqueDepartments ที่ถูกปรับปรุงแล้ว */}
                <div className="filter-container">
                    <Briefcase size={20} />
                    <select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)} className="filter-select">
                        {uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                
                <div className="filter-container"><AlertTriangle size={20} /><select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="filter-select"><option>ทั้งหมด</option><option>ด่วนมาก</option><option>สูง</option><option>ปานกลาง</option><option>ต่ำ</option></select></div>
            </div>

            {/* 3. Job Table */}
            <div className="table-container">
                <div className="table-header-controls">
                    <div className="table-header-left">
                        <button className="approve-assign-btn" onClick={() => handlePageChange('jobs')}>
                            <PlusSquare size={16} style={{ marginRight: '8px' }} />สร้างใบงานใหม่
                        </button>
                        <h3 className="urgent-title" style={{ marginBottom: 0 }}>ภาพรวมงานล่าสุด ({filteredJobs.length})</h3>
                    </div>
                    
                    <div className="filter-container" style={{ gap: '4px' }}>
                        <label className="role-label">งานต่อหน้า:</label>
                        <select value={jobsPerPage} onChange={(e) => { setJobsPerPage(Number(e.target.value)); setCurrentPageIndex(1); }} className="filter-select">
                            <option value={5}>5 งาน</option>
                            <option value={10}>10 งาน</option>
                            <option value={15}>15 งาน</option>
                        </select>
                    </div>
                </div>
                <table className="job-table">
                    <thead>
                        <tr><th>รหัสงาน</th><th>ชื่องาน</th><th>แผนก</th><th>ความสำคัญ</th><th>สถานะ</th><th>กำหนดส่ง</th><th>จัดการ</th></tr>
                    </thead>
                    <tbody>
                        {paginatedJobs.map(job => (
                            <tr key={job.id}>
                                <td>{job.id}</td>
                                <td className="job-name">{job.name}</td>
                                <td><span className="dept-badge">{job.department}</span></td>
                                <td><span className={getPriorityClass(job.priority)}>{job.priority}</span></td>
                                <td><span className={getStatusClass(job.status)}>{job.status}</span></td>
                                <td>{formatDateTime(job.updatedAt)}</td>
                                <td><button className="detail-btn">ดูรายละเอียด</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button onClick={() => setCurrentPageIndex(prev => Math.max(prev - 1, 1))} disabled={currentPageIndex === 1} className="page-btn">ก่อนหน้า</button>
                        <span className="page-info">หน้า {currentPageIndex} จาก {totalPages}</span>
                        <button onClick={() => setCurrentPageIndex(prev => Math.min(prev + 1, totalPages))} disabled={currentPageIndex === totalPages} className="page-btn">ถัดไป</button>
                    </div>
                )}
            </div>

            {/* 4. Bottom */}
            {/* <div className="dashboard-bottom-row">
                <div className="activity-log-box">
                    <div className="activity-log-title"><Clock size={18} style={{marginRight:'8px'}}/> บันทึกกิจกรรมล่าสุด</div>
                    <div className="activity-list">{activityLog.map(act => (<div key={act.id} className="activity-item"><span>{act.text}</span><span className="activity-timestamp">...</span></div>))}</div>
                </div>
            </div> */}
        </>
    );
}

export default AdminDashboard;