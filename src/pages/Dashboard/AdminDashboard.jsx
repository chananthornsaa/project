// ========================================
// AdminDashboard.jsx - หน้าภาพรวมสำหรับ Admin
// (UPDATED: กู้คืน Job Per Page Selector และ Pagination Logic)
// ========================================
import React, { useState, useMemo, useEffect } from 'react'; // ADDED useEffect
import { 
  Search, Filter, Clock, Briefcase, PlusSquare, AlertTriangle,
  CheckCircle, RotateCcw, FileText, ClipboardCheck // เพิ่ม Icons สำหรับ Activity Log
} from 'lucide-react';
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
      case 'รอดำเนินการ': return 'status-badge status-pending';
      case 'กำลังดำเนินการ': return 'status-badge status-in-progress';
      case 'รอตรวจสอบ': return 'status-badge status-review';
      case 'เสร็จสิ้น': return 'status-badge status-completed';
      default: return 'status-badge';
    }
};

function AdminDashboard({ jobs = sampleJobs, handlePageChange, activityLog = [] }) {
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
    const [filterDepartment, setFilterDepartment] = useState('ทั้งหมด');
    const [filterPriority, setFilterPriority] = useState('ทั้งหมด');
    // RESTORED STATE
    const [jobsPerPage, setJobsPerPage] = useState(5);
    const [currentPageIndex, setCurrentPageIndex] = useState(1);
    const [liveActivityLog, setLiveActivityLog] = useState(activityLog);

    // Real-time sync - อัพเดท activityLog จาก localStorage
    useEffect(() => {
        setLiveActivityLog(activityLog);
    }, [activityLog]);

    // ฟังการเปลี่ยนแปลงจาก localStorage (cross-tab sync)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'activityLog' && e.newValue) {
                setLiveActivityLog(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Reload เมื่อ focus กลับมาที่ tab
    useEffect(() => {
        const reloadActivityLog = () => {
            const saved = localStorage.getItem('activityLog');
            if (saved) {
                setLiveActivityLog(JSON.parse(saved));
            }
        };
        window.addEventListener('focus', reloadActivityLog);
        return () => window.removeEventListener('focus', reloadActivityLog);
    }, []);

    // Logic กรองและเรียงลำดับ
    const departmentOptions = [
        'ทั้งหมด',
        'แผนกไฟฟ้า',
        'ผู้ใช้ที่มอบหมายแผนก',
        'ยังไม่ได้รับงาน',
        'แผนกประปา',
        'แผนกเครื่องปรับอากาศ',
        'แผนกโครงสร้าง',
        'แผนก IT'
    ];
    
    const filteredJobs = useMemo(() => {
        let filteredList = jobs.filter(job => {
            const matchSearch = job.name.toLowerCase().includes(searchText.toLowerCase()) || job.id.toLowerCase().includes(searchText.toLowerCase());
            const matchStatus = filterStatus === 'ทั้งหมด' || job.status === filterStatus;
            
            // ปรับการกรองแผนกตามตัวเลือกใหม่
            let matchDept = true;
            if (filterDepartment === 'ทั้งหมด') {
                matchDept = true;
            } else if (filterDepartment === 'ยังไม่ได้รับงาน') {
                matchDept = !job.department || job.department === 'ยังไม่มอบหมายแผนก';
            } else if (filterDepartment === 'ผู้ใช้ที่มอบหมายแผนก') {
                matchDept = job.department && job.department !== 'ยังไม่มอบหมายแผนก' && (!job.technician || job.technician === 'ไม่มีช่าง');
            } else {
                // รองรับทั้งชื่อเก่า (ช่างไฟฟ้า) และชื่อใหม่ (แผนกไฟฟ้า)
                const deptMapping = {
                    'แผนกไฟฟ้า': ['ช่างไฟฟ้า', 'แผนกไฟฟ้า'],
                    'แผนกประปา': ['ช่างประปา', 'แผนกประปา'],
                    'แผนกเครื่องปรับอากาศ': ['ช่างเครื่องปรับอากาศ', 'แผนกเครื่องปรับอากาศ'],
                    'แผนกโครงสร้าง': ['ช่างโครงสร้าง', 'แผนกโครงสร้าง'],
                    'แผนก IT': ['ช่าง IT', 'แผนก IT']
                };
                const matchNames = deptMapping[filterDepartment] || [filterDepartment];
                matchDept = matchNames.includes(job.department);
            }
            
            const matchPriority = filterPriority === 'ทั้งหมด' || job.priority === filterPriority;
            return matchSearch && matchStatus && matchDept && matchPriority;
        });
        return filteredList.sort((a, b) => (priorityOrder[a.priority] || 5) - (priorityOrder[b.priority] || 5));
    }, [searchText, filterStatus, filterDepartment, filterPriority, jobs]);

    const countByStatus = (status) => jobs.filter(j => j.status === status).length;
    
    // แสดงกิจกรรมล่าสุด 5 รายการ
    const recentActivities = liveActivityLog.slice(0, 5);

    // ========================================
    // ฟังก์ชันแสดงไอคอนสำหรับ Activity Log
    // แปลงชื่อ icon จาก string เป็น React Component
    // - CheckCircle: อนุมัติงาน (✓)
    // - RotateCcw: ตีกลับงาน (↻)
    // - FileText: มอบหมายงานให้ช่าง (📄)
    // - ClipboardCheck: มอบหมายงานให้แผนก (📋)
    // ========================================
    const renderActivityIcon = (iconName) => {
        const iconProps = { size: 16, style: { marginRight: '6px' } };
        switch(iconName) {
            case 'CheckCircle': return <CheckCircle {...iconProps} color="#10b981" />;
            case 'RotateCcw': return <RotateCcw {...iconProps} color="#f59e0b" />;
            case 'FileText': return <FileText {...iconProps} color="#3b82f6" />;
            case 'ClipboardCheck': return <ClipboardCheck {...iconProps} color="#8b5cf6" />;
            default: return <span style={{ marginRight: '6px' }}>{iconName}</span>; // fallback สำหรับ emoji เก่า
        }
    };

    // RESTORED PAGINATION LOGIC
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const paginatedJobs = useMemo(() => {
        const startIndex = (currentPageIndex - 1) * jobsPerPage;
        const endIndex = startIndex + jobsPerPage;
        return filteredJobs.slice(startIndex, endIndex);
    }, [filteredJobs, currentPageIndex, jobsPerPage]);

    // RESTORED useEffect for page reset
    useEffect(() => {
        if (currentPageIndex > totalPages && totalPages > 0) setCurrentPageIndex(totalPages);
        else if (currentPageIndex < 1 && totalPages > 0) setCurrentPageIndex(1);
        else if (totalPages === 0 && currentPageIndex !== 1) setCurrentPageIndex(1);
    }, [filteredJobs.length, jobsPerPage, totalPages, currentPageIndex]);
    // END RESTORED PAGINATION LOGIC


    return (
        <>
            {/* 1. Cards */}
            <div className="status-cards">
                <div className="card"><div className="card-label">งานทั้งหมด</div><div className="card-number">{jobs.length}</div></div>
                <div className="card"><div className="card-label">รอดำเนินการ</div><div className="card-number orange">{countByStatus('รอดำเนินการ')}</div></div>
                <div className="card"><div className="card-label">กำลังดำเนินการ</div><div className="card-number blue">{countByStatus('กำลังดำเนินการ')}</div></div>
                <div className="card highlight"><div className="card-label">รอตรวจสอบ ⭐</div><div className="card-number yellow">{countByStatus('รอตรวจสอบ')}</div></div>
            </div>

            {/* 2. Filters */}
            <div className="search-filter-box">
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input type="text" placeholder="ค้นหางาน..." value={searchText} onChange={e => setSearchText(e.target.value)} className="search-input" />
                </div>
                <div className="filter-container"><Filter size={20} /><select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select"><option>ทั้งหมด</option><option>รอดำเนินการ</option><option>กำลังดำเนินการ</option><option>รอตรวจสอบ</option></select></div>
                <div className="filter-container"><Briefcase size={20} /><select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)} className="filter-select">{departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
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
                    
                    {/* RESTORED: งานต่อหน้า Selector */}
                    <div className="filter-container" style={{ gap: '4px' }}>
                        <label className="role-label">งานต่อหน้า:</label>
                        <select value={jobsPerPage} onChange={(e) => { setJobsPerPage(Number(e.target.value)); setCurrentPageIndex(1); }} className="filter-select">
                            <option value={5}>5 งาน</option>
                            <option value={10}>10 งาน</option>
                            <option value={15}>15 งาน</option>
                        </select>
                    </div>
                    {/* END RESTORED */}
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
                                <td><span className="dept-badge">{job.department || 'ยังไม่มอบหมายแผนก'}</span></td>
                                <td><span className={getPriorityClass(job.priority)}>{job.priority}</span></td>
                                <td><span className={getStatusClass(job.status)}>{job.status}</span></td>
                                <td>{formatDateTime(job.updatedAt)}</td>
                                <td><button className="detail-btn">ดูรายละเอียด</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {/* RESTORED: Pagination Controls */}
                 {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button onClick={() => setCurrentPageIndex(prev => Math.max(prev - 1, 1))} disabled={currentPageIndex === 1} className="page-btn">ก่อนหน้า</button>
                        <span className="page-info">หน้า {currentPageIndex} จาก {totalPages}</span>
                        <button onClick={() => setCurrentPageIndex(prev => Math.min(prev + 1, totalPages))} disabled={currentPageIndex === totalPages} className="page-btn">ถัดไป</button>
                    </div>
                )}
            </div>

            {/* 4. Bottom */}
            <div className="dashboard-bottom-row">
                <div className="activity-log-box">
                    <div className="activity-log-title"><Clock size={18} style={{marginRight:'8px'}}/> บันทึกกิจกรรมล่าสุด</div>
                    <div className="activity-list">
                        {recentActivities.length > 0 ? (
                            recentActivities.map(act => (
                                <div key={act.id} className="activity-item">
                                    <span>
                                        {renderActivityIcon(act.icon)}
                                        {act.message}
                                    </span>
                                    <span className="activity-timestamp">{new Date(act.timestamp).toLocaleString('th-TH', { 
                                        month: 'short', 
                                        day: 'numeric', 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}</span>
                                </div>
                            ))
                        ) : (
                            <div className="activity-item" style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                                <span>ยังไม่มีกิจกรรม</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;