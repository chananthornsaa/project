// src/pages/Dashboard/SupervisorDashboard.jsx

import React, { useState } from 'react';
// ✅ 1. เพิ่ม Import ไอคอน Filter และ AlertTriangle
import { Search, Filter, AlertTriangle } from 'lucide-react';
import './Dashboard.css';

const MY_DEPARTMENT = 'ช่างไฟฟ้า';

function SupervisorDashboard({ jobs = [], pendingJobsCount = 0, assignJob }) {
    // ✅ 2. เพิ่ม State สำหรับ Priority
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
    const [filterPriority, setFilterPriority] = useState('ทั้งหมด');

    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedTechnician, setSelectedTechnician] = useState('');

    // ==========================================
    // แยกข้อมูล (Data Partitioning)
    // ==========================================

    // งานรอมอบหมาย
    const pendingAssignJobs = jobs.filter(job =>
        job.department === MY_DEPARTMENT &&
        (job.technician === 'ไม่มีช่าง' || job.technician === null) &&
        job.status !== 'เสร็จสิ้น'
    );

    // งานที่มีช่างแล้ว (สำหรับตารางล่าง)
    const assignedJobs = jobs.filter(job =>
        job.department === MY_DEPARTMENT &&
        job.technician &&
        job.technician !== 'ไม่มีช่าง' &&
        job.status !== 'เสร็จสิ้น'
    );

    // สถิติ Card
    const deptJobs = jobs.filter(j => j.department === MY_DEPARTMENT);
    const totalJobs = deptJobs.length;
    const pendingCount = deptJobs.filter(j => j.status === 'รออนุมัติ' || j.status === 'รอดำเนินการ').length;
    const inProgressCount = deptJobs.filter(j => j.status === 'กำลังทำ').length;
    const reviewCount = deptJobs.filter(j => j.status === 'รอตรวจสอบ').length;
    const completedCount = deptJobs.filter(j => j.status === 'เสร็จสิ้น').length;

    // ==========================================
    // ✅ 3. Logic การกรองข้อมูล (รวม Search + Status + Priority)
    // ==========================================
    const filteredAssignedJobs = assignedJobs.filter(job => {
        // 1. ค้นหาจาก Text
        const lowerSearch = searchText.toLowerCase();
        const matchesSearch =
            job.id.toLowerCase().includes(lowerSearch) ||
            job.name.toLowerCase().includes(lowerSearch) ||
            (job.technician && job.technician.toLowerCase().includes(lowerSearch));

        // 2. กรองสถานะ
        const matchesStatus = filterStatus === 'ทั้งหมด' || job.status === filterStatus;

        // 3. กรองความสำคัญ (Priority)
        // (เช็ค job.priority ถ้าไม่มีข้อมูลให้ถือว่าผ่าน หรือกำหนด default)
        const jobPriority = job.priority || 'ปกติ';
        const matchesPriority = filterPriority === 'ทั้งหมด' || jobPriority === filterPriority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    // Helper: สีสถานะ
    const getStatusClass = (status) => {
        switch (status) {
            case 'รออนุมัติ': return 'status-badge status-unassigned';
            case 'รอดำเนินการ': return 'status-badge status-pending';
            case 'กำลังทำ': return 'status-badge status-in-progress';
            case 'รอตรวจสอบ': return 'status-badge status-review';
            case 'เสร็จสิ้น': return 'status-badge status-completed';
            default: return 'status-badge';
        }
    };

    // Helper: สีความสำคัญ
    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'ด่วนมาก': return 'priority-badge priority-urgent';
            case 'สูง': return 'priority-badge priority-high';
            case 'ปานกลาง': return 'priority-badge priority-medium';
            case 'ต่ำ': return 'priority-badge priority-low';
            default: return 'priority-badge';        // สีเขียว/เทา
        }
    };

    const handleAssign = () => {
        if (!selectedTechnician) return alert('กรุณาเลือกช่าง');
        if (assignJob) {
            assignJob(selectedJob.id, selectedTechnician);
        } else {
            alert('⚠️ ระบบขัดข้อง: ไม่พบฟังก์ชันมอบหมายงาน');
        }
        setSelectedJob(null);
        setSelectedTechnician('');
    };

    return (
        <>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '28px', color: '#1e40af', fontWeight: 'bold' }}>
                    แผนก{MY_DEPARTMENT}
                </h2>
            </div>

            {/* Status Cards */}
            <div className="status-cards">
                <div className="card"><div className="card-label">งานทั้งหมด</div><div className="card-number">{totalJobs}</div></div>
                <div className="card"><div className="card-label">รอดำเนินการ</div><div className="card-number orange">{pendingCount}</div></div>
                <div className="card"><div className="card-label">กำลังทำ</div><div className="card-number blue">{inProgressCount}</div></div>
                <div className="card highlight"><div className="card-label">รอตรวจสอบ ⭐</div><div className="card-number yellow">{reviewCount}</div></div>
                <div className="card"><div className="card-label">เสร็จสิ้น</div><div className="card-number green">{completedCount}</div></div>
            </div>

            {/* ตารางงานรอมอบหมาย */}
            {pendingAssignJobs.length > 0 && (
                <div className="page-content" style={{ margin: '40px 0' }}>
                    <h2 style={{ fontSize: '24px', color: '#1e40af', fontWeight: 'bold', marginBottom: '20px' }}>
                        📋 งานที่รอมอบหมาย ({pendingAssignJobs.length})
                    </h2>
                    <div className="table-container">
                        <table className="job-table">
                            <thead>
                                <tr>
                                    <th>รหัสงาน</th>
                                    <th>ชื่องาน</th>
                                    <th>วันที่รับ</th>
                                    <th>ผู้รับงาน</th>
                                    <th>ความสำคัญ</th> {/* ✅ 1. เพิ่มหัวข้อตรงนี้ */}
                                    <th>สถานะ</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingAssignJobs.map(job => (
                                    <tr key={job.id}>
                                        <td>{job.id}</td>
                                        <td className="job-name">{job.name}</td>
                                        <td>{job.date}</td>
                                        <td>-</td>

                                        {/* ✅ 2. เพิ่มข้อมูลความสำคัญตรงนี้ */}
                                        <td>
                                            <span className={getPriorityClass(job.priority)}>
                                                {job.priority || 'ปกติ'}
                                            </span>
                                        </td>

                                        <td>
                                            <span className={getStatusClass(job.status)}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button onClick={() => setSelectedJob(job)} className="approve-assign-btn">
                                                รายละเอียด/มอบหมาย
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ส่วนติดตามงาน */}
            <div className="page-content" style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '24px', color: '#1e40af', fontWeight: 'bold', marginBottom: '20px' }}>
                    🔍 งานที่ต้องติดตาม ({assignedJobs.length})
                </h2>

                {/* ✅ 4. ใส่ UI Filters ใหม่ตรงนี้ */}
                <div className="search-filter-box">
                    <div className="search-container">
                        <Search size={20} className="search-icon" />
                        <input
                            placeholder="ค้นหา (รหัส/ชื่อ/ช่าง)..."
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-container">
                        <Filter size={20} />
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="ทั้งหมด">สถานะ: ทั้งหมด</option>
                            <option value="กำลังทำ">กำลังทำ</option>
                            <option value="รอตรวจสอบ">รอตรวจสอบ</option>
                        </select>
                    </div>

                    <div className="filter-container">
                        <AlertTriangle size={20} />
                        <select
                            value={filterPriority}
                            onChange={e => setFilterPriority(e.target.value)}
                            className="filter-select"
                        >
                            <option value="ทั้งหมด">ความสำคัญ: ทั้งหมด</option>
                            <option value="ด่วนมาก">ด่วนมาก</option>
                            <option value="สูง">สูง</option>
                            <option value="ปานกลาง">ปานกลาง</option>
                            <option value="ต่ำ">ต่ำ</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                {filteredAssignedJobs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: '#f9fafb', borderRadius: '12px', color: '#9ca3af' }}>
                        ไม่พบงานที่ตรงกับเงื่อนไข
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="job-table">
                            <thead>
                                <tr>
                                    <th>รหัสงาน</th>
                                    <th>ชื่องาน</th>
                                    <th>วันที่รับ</th>
                                    <th>ผู้รับงาน</th>
                                    <th>สถานะ</th>
                                    <th>ความสำคัญ</th> {/* เพิ่มคอลัมน์นี้ */}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssignedJobs.map(job => (
                                    <tr key={job.id}>
                                        <td>{job.id}</td>
                                        <td className="job-name">{job.name}</td>
                                        <td>{job.date}</td>
                                        <td>{job.technician}</td>
                                        <td><span className={getStatusClass(job.status)}>{job.status}</span></td>
                                        <td>
                                            {/* แสดง Badge ความสำคัญ */}
                                            <span className={getPriorityClass(job.priority)}>
                                                {job.priority || 'ปกติ'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedJob && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setSelectedJob(null)}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ margin: '0 0 20px', color: '#1e40af', fontSize: '24px', fontWeight: 'bold' }}>มอบหมายงาน {selectedJob.id}</h3>
                        <div style={{ marginBottom: '24px', lineHeight: '1.8' }}>
                            <p><strong>ชื่องาน:</strong> {selectedJob.name}</p>
                            <p><strong>แผนก:</strong> {selectedJob.department}</p>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <p style={{ fontWeight: 'bold' }}>เลือกช่าง:</p>
                            {['สมชาย ใจดี', 'สมศักดิ์ ขยัน', 'สมหญิง รักงาน'].map(name => (
                                <label key={name} style={{ display: 'block', margin: '12px 0' }}>
                                    <input type="radio" name="tech" value={name} checked={selectedTechnician === name} onChange={(e) => setSelectedTechnician(e.target.value)} style={{ marginRight: '12px' }} />
                                    {name}
                                </label>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={() => setSelectedJob(null)} style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>ยกเลิก</button>
                            <button onClick={handleAssign} disabled={!selectedTechnician} style={{ padding: '12px 32px', background: selectedTechnician ? '#10b981' : '#94a3b8', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>ยืนยัน</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SupervisorDashboard;