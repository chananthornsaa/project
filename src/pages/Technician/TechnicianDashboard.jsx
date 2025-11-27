// src/pages/Technician/TechnicianDashboard.jsx
import React, { useState } from 'react';
import { 
    Search, Filter, Upload, X, 
    MapPin, Calendar, Clock, User, 
    Briefcase, AlertCircle, FileText, 
    Image, CheckCircle, Tag, Wrench,
    ClipboardList, HourglassIcon, CheckCircle2
} from 'lucide-react';
import '../Dashboard/Dashboard.css';

function TechnicianDashboard({ 
    jobs = [], 
    currentTechnician = { id: 'tech1', name: 'สมชาย ใจดี' },
    updateJobStatus 
}) {
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
    const [selectedJob, setSelectedJob] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [reportComment, setReportComment] = useState('');
    const [uploadedImages, setUploadedImages] = useState([]);

    // ==========================================
    // กรองเฉพาะงานของช่างคนนี้
    // ==========================================
    const myJobs = jobs.filter(job => 
        job.technicianId === currentTechnician.id ||
        job.technician === currentTechnician.name
    );

    // แยกงานตามสถานะ
    const pendingJobs = myJobs.filter(job => job.status === 'รอดำเนินการ');
    const inProgressJobs = myJobs.filter(job => job.status === 'กำลังทำ');
    const reviewJobs = myJobs.filter(job => job.status === 'รอตรวจสอบ');
    const completedJobs = myJobs.filter(job => job.status === 'เสร็จสิ้น');

    // ==========================================
    // กรองงานตาม search & filter
    // ==========================================
    const getFilteredJobs = (jobsList) => {
        return jobsList.filter(job => {
            const lowerSearch = searchText.toLowerCase();
            const matchesSearch = 
                job.id.toLowerCase().includes(lowerSearch) ||
                job.name.toLowerCase().includes(lowerSearch) ||
                (job.location && job.location.toLowerCase().includes(lowerSearch));

            const matchesStatus = filterStatus === 'ทั้งหมด' || job.status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    };

    // ==========================================
    // Helper Functions
    // ==========================================
    const getStatusClass = (status) => {
        switch (status) {
            case 'รอดำเนินการ': return 'status-badge status-pending';
            case 'กำลังทำ': return 'status-badge status-in-progress';
            case 'รอตรวจสอบ': return 'status-badge status-review';
            case 'เสร็จสิ้น': return 'status-badge status-approved';
            default: return 'status-badge';
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'ด่วนมาก': return 'priority-badge priority-urgent';
            case 'สูง': return 'priority-badge priority-high';
            case 'ปานกลาง': return 'priority-badge priority-medium';
            case 'ต่ำ': return 'priority-badge priority-low';
            default: return 'priority-badge priority-medium';
        }
    };

    // ==========================================
    // Action Handlers
    // ==========================================
    const handleStatusChange = (jobId, newStatus) => {
        if (newStatus === 'รอตรวจสอบ') {
            // ต้องกรอกรายงานก่อน
            const job = myJobs.find(j => j.id === jobId);
            setSelectedJob(job);
            setShowReportModal(true);
        } else {
            // เปลี่ยนสถานะธรรมดา
            if (updateJobStatus) {
                updateJobStatus(jobId, newStatus);
            }
        }
    };

    const handleSubmitReport = () => {
        if (!reportComment.trim()) {
            alert('กรุณากรอกข้อความรายงาน');
            return;
        }

        if (updateJobStatus) {
            updateJobStatus(selectedJob.id, 'รอตรวจสอบ', {
                comment: reportComment,
                images: uploadedImages
            });
        }

        // Reset
        setShowReportModal(false);
        setSelectedJob(null);
        setReportComment('');
        setUploadedImages([]);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setUploadedImages(prev => [...prev, ...imageUrls]);
    };

    const removeImage = (index) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    // ==========================================
    // Render Action Button
    // ==========================================
    const renderActionButton = (job) => {
        switch (job.status) {
            case 'รอดำเนินการ':
                return (
                    <button 
                        onClick={() => handleStatusChange(job.id, 'กำลังทำ')}
                        className="approve-assign-btn"
                        style={{ backgroundColor: '#2563eb' }}
                    >
                        รับงาน
                    </button>
                );
            case 'กำลังทำ':
                return (
                    <button 
                        onClick={() => handleStatusChange(job.id, 'รอตรวจสอบ')}
                        className="approve-assign-btn"
                        style={{ backgroundColor: '#10b981' }}
                    >
                        เสร็จสิ้น
                    </button>
                );
            case 'รอตรวจสอบ':
                return (
                    <span style={{ color: '#6b7280', fontSize: '13px' }}>
                        รอหัวหน้าตรวจสอบ
                    </span>
                );
            case 'เสร็จสิ้น':
                return (
                    <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '500' }}>
                        ✓ เสร็จสมบูรณ์
                    </span>
                );
            default:
                return null;
        }
    };

    // ==========================================
    // Render Job Table
    // ==========================================
    const renderJobTable = (jobsList, title, emptyMessage) => {
        const filtered = getFilteredJobs(jobsList);

        if (filtered.length === 0) {
            return (
                <div style={{ textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: '12px', color: '#9ca3af' }}>
                    {emptyMessage}
                </div>
            );
        }

        return (
            <div className="table-container">
                <table className="job-table">
                    <thead>
                        <tr>
                            <th><Tag size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />รหัสงาน</th>
                            <th><FileText size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />ชื่องาน</th>
                            <th><MapPin size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />สถานที่</th>
                            <th><Calendar size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />วันที่รับ</th>
                            <th><AlertCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />ความสำคัญ</th>
                            <th><CheckCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />สถานะ</th>
                            <th><Briefcase size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(job => (
                            <tr key={job.id}>
                                <td style={{ fontWeight: '600', color: '#2563eb' }}>{job.id}</td>
                                <td className="job-name">{job.name}</td>
                                <td>{job.location || '-'}</td>
                                <td>{job.date}</td>
                                <td>
                                    <span className={getPriorityClass(job.priority)}>
                                        {job.priority || 'ปานกลาง'}
                                    </span>
                                </td>
                                <td>
                                    <span className={getStatusClass(job.status)}>
                                        {job.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        {renderActionButton(job)}
                                        <button 
                                            onClick={() => {
                                                setSelectedJob(job);
                                                setShowDetailModal(true);
                                            }}
                                            className="detail-btn"
                                        >
                                            รายละเอียด
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <>
            {/* Header */}
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '28px', color: '#1e40af', fontWeight: 'bold' }}>
                    งานของฉัน - {currentTechnician.name}
                </h2>
            </div>

            {/* Status Cards */}
            <div className="status-cards">
                <div className="card">
                    <div className="card-label">งานทั้งหมด</div>
                    <div className="card-number">{myJobs.length}</div>
                </div>
                <div className="card">
                    <div className="card-label">รอดำเนินการ</div>
                    <div className="card-number orange">{pendingJobs.length}</div>
                </div>
                <div className="card">
                    <div className="card-label">กำลังทำ</div>
                    <div className="card-number blue">{inProgressJobs.length}</div>
                </div>
                <div className="card highlight">
                    <div className="card-label">รอตรวจสอบ ⭐</div>
                    <div className="card-number yellow">{reviewJobs.length}</div>
                </div>
                <div className="card">
                    <div className="card-label">เสร็จสิ้น</div>
                    <div className="card-number green">{completedJobs.length}</div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="search-filter-box">
                <div className="search-container">
                    <Search size={20} className="search-icon" />
                    <input
                        placeholder="ค้นหา (รหัส/ชื่องาน/สถานที่)..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* งานรอดำเนินการ */}
            <div className="page-content" style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', color: '#f97316', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClipboardList size={24} /> งานรอดำเนินการ ({pendingJobs.length})
                </h2>
                {renderJobTable(pendingJobs, 'งานรอดำเนินการ', 'ไม่มีงานรอดำเนินการ')}
            </div>

            {/* งานที่กำลังทำ */}
            <div className="page-content" style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', color: '#3b82f6', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Wrench size={24} /> งานที่กำลังทำ ({inProgressJobs.length})
                </h2>
                {renderJobTable(inProgressJobs, 'งานที่กำลังทำ', 'ไม่มีงานที่กำลังทำ')}
            </div>

            {/* งานรอตรวจสอบ */}
            <div className="page-content" style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', color: '#eab308', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HourglassIcon size={24} /> งานรอตรวจสอบ ({reviewJobs.length})
                </h2>
                {renderJobTable(reviewJobs, 'งานรอตรวจสอบ', 'ไม่มีงานรอตรวจสอบ')}
            </div>

            {/* งานเสร็จสิ้น */}
            <div className="page-content">
                <h2 style={{ fontSize: '20px', color: '#10b981', fontWeight: 'bold', marginBottom: '16px' }}>
                    ✓ งานเสร็จสิ้น ({completedJobs.length})
                </h2>
                {renderJobTable(completedJobs, 'งานเสร็จสิ้น', 'ยังไม่มีงานที่เสร็จสิ้น')}
            </div>

            {/* Modal รายงานผลการทำงาน */}
            {showReportModal && selectedJob && (
                <div 
                    className="modal-backdrop"
                    onClick={() => {
                        setShowReportModal(false);
                        setSelectedJob(null);
                        setReportComment('');
                        setUploadedImages([]);
                    }}
                >
                    <div 
                        className="modal-container"
                        onClick={e => e.stopPropagation()}
                        style={{ maxWidth: '600px' }}
                    >
                        <div className="modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FileText size={24} color="#10b981" />
                                <h3>รายงานผลการทำงาน - {selectedJob.id}</h3>
                            </div>
                            <X 
                                className="modal-close" 
                                size={24}
                                onClick={() => {
                                    setShowReportModal(false);
                                    setSelectedJob(null);
                                    setReportComment('');
                                    setUploadedImages([]);
                                }}
                            />
                        </div>

                        <div className="modal-body-content">
                            <div style={{ 
                                marginBottom: '24px',
                                padding: '16px',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                borderRadius: '12px',
                                color: 'white'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <Briefcase size={18} />
                                    <span style={{ fontSize: '13px', opacity: 0.9 }}>ชื่องาน</span>
                                </div>
                                <p style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{selectedJob.name}</p>
                            </div>

                            <div className="form-group full">
                                <label style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '10px'
                                }}>
                                    <FileText size={18} />
                                    รายละเอียดการทำงาน <span className="required">*</span>
                                </label>
                                <textarea
                                    value={reportComment}
                                    onChange={e => setReportComment(e.target.value)}
                                    placeholder="กรอกรายละเอียดการทำงาน ปัญหาที่พบ และวิธีแก้ไข..."
                                    style={{
                                        minHeight: '140px',
                                        resize: 'vertical',
                                        borderRadius: '10px',
                                        border: '2px solid #e5e7eb',
                                        padding: '14px',
                                        fontSize: '14px',
                                        lineHeight: '1.6',
                                        transition: 'border-color 0.2s',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#10b981'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>

                            <div className="form-group full" style={{ marginTop: '24px' }}>
                                <label style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#374151',
                                    marginBottom: '12px'
                                }}>
                                    <Image size={18} />
                                    อัปโหลดรูปภาพ (ถ้ามี)
                                </label>
                                <div style={{
                                    position: 'relative',
                                    border: '2px dashed #d1d5db',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    textAlign: 'center',
                                    background: '#f9fafb',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                    e.currentTarget.style.background = '#eff6ff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#d1d5db';
                                    e.currentTarget.style.background = '#f9fafb';
                                }}
                                >
                                    <input 
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ 
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0,
                                            cursor: 'pointer'
                                        }}
                                    />
                                    <Upload size={32} color="#9ca3af" style={{ marginBottom: '8px' }} />
                                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                                        คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
                                    </p>
                                    <p style={{ margin: '4px 0 0 0', color: '#9ca3af', fontSize: '12px' }}>
                                        รองรับไฟล์: JPG, PNG, GIF
                                    </p>
                                </div>
                                
                                {uploadedImages.length > 0 && (
                                    <div style={{ 
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                        gap: '12px',
                                        marginTop: '16px'
                                    }}>
                                        {uploadedImages.map((img, idx) => (
                                            <div key={idx} style={{ 
                                                position: 'relative',
                                                borderRadius: '10px',
                                                overflow: 'hidden',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                transition: 'transform 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                <img 
                                                    src={img}
                                                    alt={`อัปโหลด ${idx + 1}`}
                                                    style={{ 
                                                        width: '100%', 
                                                        height: '100px', 
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <button
                                                    onClick={() => removeImage(idx)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '6px',
                                                        right: '6px',
                                                        width: '28px',
                                                        height: '28px',
                                                        borderRadius: '50%',
                                                        background: '#ef4444',
                                                        color: 'white',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        padding: 0,
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = '#dc2626';
                                                        e.currentTarget.style.transform = 'scale(1.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = '#ef4444';
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button 
                                className="cancel-btn"
                                onClick={() => {
                                    setShowReportModal(false);
                                    setSelectedJob(null);
                                    setReportComment('');
                                    setUploadedImages([]);
                                }}
                            >
                                ยกเลิก
                            </button>
                            <button 
                                className="submit-btn"
                                onClick={handleSubmitReport}
                                disabled={!reportComment.trim()}
                                style={{ 
                                    backgroundColor: !reportComment.trim() ? '#9ca3af' : '#10b981',
                                    cursor: !reportComment.trim() ? 'not-allowed' : 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    if (reportComment.trim()) {
                                        e.currentTarget.style.backgroundColor = '#059669';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (reportComment.trim()) {
                                        e.currentTarget.style.backgroundColor = '#10b981';
                                    }
                                }}
                            >
                                ส่งรายงาน
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal รายละเอียดงาน */}
            {showDetailModal && selectedJob && (
                <div 
                    className="modal-backdrop"
                    onClick={() => {
                        setShowDetailModal(false);
                        setSelectedJob(null);
                    }}
                >
                    <div 
                        className="modal-container"
                        onClick={e => e.stopPropagation()}
                        style={{ maxWidth: '700px' }}
                    >
                        <div className="modal-header">
                            <h3>รายละเอียดงาน - {selectedJob.id}</h3>
                            <X 
                                className="modal-close" 
                                size={24}
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedJob(null);
                                }}
                            />
                        </div>

                        <div className="modal-body-content">
                            {/* ข้อมูลพื้นฐาน */}
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1fr', 
                                gap: '20px',
                                marginBottom: '24px',
                                padding: '20px',
                                background: '#f9fafb',
                                borderRadius: '12px'
                            }}>
                                <div>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        color: '#6b7280',
                                        fontSize: '14px',
                                        marginBottom: '6px'
                                    }}>
                                        <Briefcase size={16} />
                                        <span>ชื่องาน</span>
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                                        {selectedJob.name}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        color: '#6b7280',
                                        fontSize: '14px',
                                        marginBottom: '6px'
                                    }}>
                                        <Tag size={16} />
                                        <span>รหัสงาน</span>
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#2563eb' }}>
                                        {selectedJob.id}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        color: '#6b7280',
                                        fontSize: '14px',
                                        marginBottom: '6px'
                                    }}>
                                        <MapPin size={16} />
                                        <span>สถานที่</span>
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#111827' }}>
                                        {selectedJob.location || '-'}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        color: '#6b7280',
                                        fontSize: '14px',
                                        marginBottom: '6px'
                                    }}>
                                        <Calendar size={16} />
                                        <span>วันที่รับงาน</span>
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#111827' }}>
                                        {selectedJob.date}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        color: '#6b7280',
                                        fontSize: '14px',
                                        marginBottom: '6px'
                                    }}>
                                        <AlertCircle size={16} />
                                        <span>ความสำคัญ</span>
                                    </div>
                                    <span className={getPriorityClass(selectedJob.priority)}>
                                        {selectedJob.priority || 'ปานกลาง'}
                                    </span>
                                </div>

                                <div>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        color: '#6b7280',
                                        fontSize: '14px',
                                        marginBottom: '6px'
                                    }}>
                                        <CheckCircle size={16} />
                                        <span>สถานะ</span>
                                    </div>
                                    <span className={getStatusClass(selectedJob.status)}>
                                        {selectedJob.status}
                                    </span>
                                </div>
                            </div>

                            {/* รายละเอียดเพิ่มเติม */}
                            {selectedJob.description && (
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        color: '#374151',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        marginBottom: '10px'
                                    }}>
                                        <FileText size={18} />
                                        <span>รายละเอียดงาน</span>
                                    </div>
                                    <div style={{ 
                                        padding: '16px',
                                        background: '#f9fafb',
                                        borderRadius: '8px',
                                        color: '#4b5563',
                                        fontSize: '14px',
                                        lineHeight: '1.6'
                                    }}>
                                        {selectedJob.description}
                                    </div>
                                </div>
                            )}

                            {/* หมายเหตุ/ความคิดเห็น */}
                            {selectedJob.comment && (
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        color: '#374151',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        marginBottom: '10px'
                                    }}>
                                        <FileText size={18} />
                                        <span>รายงานผลการทำงาน</span>
                                    </div>
                                    <div style={{ 
                                        padding: '16px',
                                        background: '#fef3c7',
                                        borderRadius: '8px',
                                        color: '#92400e',
                                        fontSize: '14px',
                                        lineHeight: '1.6',
                                        border: '1px solid #fde68a'
                                    }}>
                                        {selectedJob.comment}
                                    </div>
                                </div>
                            )}

                            {/* รูปภาพที่อัปโหลด */}
                            {((selectedJob.images && selectedJob.images.length > 0) || 
                              (selectedJob.imageUrls && selectedJob.imageUrls.length > 0)) && (
                                <div>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        color: '#374151',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        marginBottom: '10px'
                                    }}>
                                        <Image size={18} />
                                        <span>รูปภาพประกอบ ({(selectedJob.images || selectedJob.imageUrls)?.length || 0})</span>
                                    </div>
                                    <div style={{ 
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                        gap: '12px'
                                    }}>
                                        {(selectedJob.images || selectedJob.imageUrls)?.map((img, idx) => (
                                            <div key={idx} style={{ position: 'relative' }}>
                                                <img 
                                                    src={img}
                                                    alt={`รูปภาพ ${idx + 1}`}
                                                    style={{ 
                                                        width: '100%',
                                                        height: '120px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                        border: '2px solid #e5e7eb',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => window.open(img, '_blank')}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button 
                                className="cancel-btn"
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedJob(null);
                                }}
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TechnicianDashboard;
