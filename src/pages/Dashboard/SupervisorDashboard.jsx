// ========================================
// SupervisorDashboard.jsx
// ========================================
import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, AlertTriangle } from 'lucide-react';
import mockData from '../../data/Techsample.jsx';
const { sampleJobs, ACTIVITIES } = mockData;

// Constants & Helpers
const SUPERVISOR_DEPT = 'ไฟฟ้า'; 
const priorityOrder = {'ด่วนมาก': 1, 'สูง': 2, 'ปานกลาง': 3, 'ต่ำ': 4};

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

function SupervisorDashboard() {
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
    const [filterPriority, setFilterPriority] = useState('ทั้งหมด');
    const [jobsPerPage, setJobsPerPage] = useState(5);
    const [currentPageIndex, setCurrentPageIndex] = useState(1);

    // Filter Logic
    const filteredJobs = useMemo(() => {
        let jobs = sampleJobs.filter(job => job.department === SUPERVISOR_DEPT);
        jobs = jobs.filter(job => {
            const matchSearch = job.name.toLowerCase().includes(searchText.toLowerCase()) || job.id.toLowerCase().includes(searchText.toLowerCase());
            const matchStatus = filterStatus === 'ทั้งหมด' || job.status === filterStatus;
            const matchPriority = filterPriority === 'ทั้งหมด' || job.priority === filterPriority;
            return matchSearch && matchStatus && matchPriority;
        });
        return jobs.sort((a, b) => (priorityOrder[a.priority] || 5) - (priorityOrder[b.priority] || 5));
    }, [searchText, filterStatus, filterPriority]);

    const deptJobs = sampleJobs.filter(j => j.department === SUPERVISOR_DEPT);
    const countByStatus = (s) => deptJobs.filter(j => j.status === s).length;
    const deptActivities = ACTIVITIES.filter(a => a.department === SUPERVISOR_DEPT).slice(0, 5);

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const paginatedJobs = filteredJobs.slice((currentPageIndex - 1) * jobsPerPage, currentPageIndex * jobsPerPage);

    return (
        <>
             {/* 1. Cards */}
             <div className="status-cards">
                <div className="card"><div className="card-label">งานในแผนก</div><div className="card-number">{deptJobs.length}</div></div>
                <div className="card"><div className="card-label">รออนุมัติ</div><div className="card-number blue">{countByStatus('รออนุมัติ')}</div></div>
                <div className="card"><div className="card-label">รอดำเนินการ</div><div className="card-number orange">{countByStatus('รอดำเนินการ')}</div></div>
                <div className="card"><div className="card-label">กำลังทำ</div><div className="card-number blue">{countByStatus('กำลังทำ')}</div></div>
                <div className="card highlight"><div className="card-label">รอตรวจสอบ ⭐</div><div className="card-number yellow">{countByStatus('รอตรวจสอบ')}</div></div>
            </div>

            {/* 2. Filters */}
            <div className="search-filter-box">
                <div className="search-container"><Search size={20} className="search-icon"/><input placeholder="ค้นหางาน..." value={searchText} onChange={e => setSearchText(e.target.value)} className="search-input" /></div>
                <div className="filter-container"><Filter size={20} /><select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select"><option>ทั้งหมด</option><option>รออนุมัติ</option><option>รอดำเนินการ</option></select></div>
                <div className="filter-container"><AlertTriangle size={20} /><select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="filter-select"><option>ทั้งหมด</option><option>ด่วนมาก</option><option>สูง</option></select></div>
            </div>

            {/* 3. Table */}
            <div className="table-container">
                <div className="table-header-controls">
                    <h3 className="urgent-title">📋 รายการงาน ({filteredJobs.length})</h3>
                    <div className="filter-container"><select value={jobsPerPage} onChange={e => setJobsPerPage(Number(e.target.value))} className="filter-select"><option value={5}>5</option><option value={10}>10</option></select></div>
                </div>
                <table className="job-table">
                    <thead>
                        <tr><th>รหัสงาน</th><th>ชื่องาน</th><th>ช่างที่ถูกมอบหมาย</th><th>ความสำคัญ</th><th>สถานะ</th><th>กำหนดส่ง</th><th>จัดการ</th></tr>
                    </thead>
                    <tbody>
                        {paginatedJobs.map(job => (
                            <tr key={job.id}>
                                <td>{job.id}</td>
                                <td className="job-name">{job.name}</td>
                                <td>{job.technician}</td>
                                <td><span className={getPriorityClass(job.priority)}>{job.priority}</span></td>
                                <td><span className={getStatusClass(job.status)}>{job.status}</span></td>
                                <td>{formatDateTime(job.updatedAt)}</td>
                                <td className="job-actions-cell">
                                    {job.status === 'รออนุมัติ' ? 
                                        <button className="approve-assign-btn" onClick={() => alert(`อนุมัติ ${job.id}`)}>อนุมัติ/มอบหมาย</button> 
                                        : <button className="detail-btn">รายละเอียด</button>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* 4. Activity Log */}
            <div className="dashboard-bottom-row">
                <div className="activity-log-box">
                    <div className="activity-log-title"><Clock size={18} style={{marginRight:'8px'}}/> บันทึกกิจกรรม (แผนกไฟฟ้า)</div>
                    <div className="activity-list">
                        {deptActivities.map(act => (<div key={act.id} className="activity-item"><span>{act.text}</span><span className="activity-timestamp">{act.timestamp}</span></div>))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SupervisorDashboard;