import React, { useState, useMemo } from "react";
import {
  Search, Clock, FileText, CircleDot, CheckCircle,
  ClipboardList, Edit, Trash2, PlusCircle, X, Phone, Mail, Wrench
} from "lucide-react";
// FIX IMPORT: ต้องดึง sampleJobs ออกมาจาก Object
import mockData from "../../data/Techsample.jsx";
const { sampleJobs } = mockData;
import "./JobManagement.css";

// ----------------------------------------------------------------
// Data and Helper Functions
// ----------------------------------------------------------------
const technicianList = [
  { id: 'SM', name: 'สมศักดิ์ ขยัน', phone: '0812345678', email: 'som@example.com', skills: 'ไฟฟ้า, แอร์, ประปา (10 ปี)', color: 'green' },
  { id: 'YG', name: 'สมหญิง รักงาน', phone: '0890001111', email: 'ying@example.com', skills: 'เครื่องกล, โครงสร้าง (3 ปี)', color: 'red' },
  { id: 'SY', name: 'สมชาย ใจดี', phone: '0927778888', email: 'shy@example.com', skills: 'ระบบเครือข่าย, IT (5 ปี)', color: 'orange' }
];

// Helper: Logic สร้างรหัสงานอัตโนมัติ (J001, J002, ...)
const generateNewJobId = (currentJobs) => {
    // ดึงตัวเลขสูงสุดจาก ID งานปัจจุบัน
    const existingIds = currentJobs.map(job => {
        const match = job.id.match(/J(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    });
    const maxId = Math.max(...existingIds, 0);
    const nextIdNumber = maxId + 1;
    return `J${nextIdNumber.toString().padStart(3, '0')}`;
};

// ----------------------------------------------------------------
// Component Logic
// ----------------------------------------------------------------
function JobManagement() {
  const [jobs, setJobs] = useState(sampleJobs);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [jobToAssign, setJobToAssign] = useState(null);
  const [newJobId, setNewJobId] = useState(''); // ID อัตโนมัติ

  const [formData, setFormData] = useState({
    jobName: "", priority: "ปานกลาง", jobType: "", date: "", location: "",
    customerName: "", phone: "", email: "", detail: "", note: "",
  });

  const onChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Handlers ---
  const handleCreateNewJob = () => {
    setNewJobId(generateNewJobId(jobs)); // สร้าง ID อัตโนมัติ
    setFormData({ jobName: "", priority: "ปานกลาง", jobType: "", date: "", location: "", customerName: "", phone: "", email: "", detail: "", note: "" });
    setShowCreateModal(true);
  };

  const saveJob = () => {
    if (!formData.jobName) {
      alert("กรุณากรอก ชื่องาน");
      return;
    }
    
    const finalJobId = newJobId; // ใช้ ID ที่สร้างอัตโนมัติ
    const newJob = {
      id: finalJobId, 
      name: formData.jobName,
      technician: "ไม่มีช่าง",
      date: formData.date || new Date().toISOString().split("T")[0],
      location: formData.location || "ไม่ระบุ",
      status: "รออนุมัติ", 
      department: "ไม่ระบุ", 
      priority: formData.priority, 
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      creator: 'Admin'
    };

    setJobs([newJob, ...jobs]);
    setShowCreateModal(false);
    alert(`✅ สร้างใบงาน ${finalJobId} เรียบร้อย!`);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ที่จะลบใบงานรหัส ${jobId}?`)) {
      setJobs(jobs.filter(job => job.id !== jobId));
      alert(`🗑️ ใบงาน ${jobId} ถูกลบแล้ว`);
    }
  };

  const openAssignModal = (job) => { setJobToAssign(job); setShowAssignModal(true); };

  const handleAssignJob = (jobId, technicianName) => {
    setJobs(jobs.map(job => job.id === jobId ? { ...job, technician: technicianName, status: 'กำลังทำ' } : job ));
    setShowAssignModal(false);
    setJobToAssign(null);
    alert(`🧑‍🔧 มอบหมายงาน ${jobId} ให้กับ ${technicianName} แล้ว!`);
  };

  // --- Helpers for UI ---
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "รออนุมัติ": case "รอดำเนินการ": return "job-badge job-badge-urgent";
      case "กำลังทำ": case "กำลังดำเนินการ": return "job-badge job-badge-progress";
      case "เสร็จสิ้น": case "ผ่านการตรวจสอบ": return "job-badge job-badge-completed";
      case "รอตรวจสอบ": return "job-badge job-badge-review";
      default: return "job-badge";
    }
  };
  const getStatusLabel = (status) => status;


  // --- Filter Logic ---
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const status = job.status;
      const matchStatus = statusFilter === "all" ||
        (statusFilter === "urgent" && (status === "รออนุมัติ" || status === "รอดำเนินการ")) ||
        (statusFilter === "in-progress" && (status === "กำลังทำ" || status === "กำลังดำเนินการ")) ||
        (statusFilter === "completed" && (status === "เสร็จสิ้น" || status === "ผ่านการตรวจสอบ"));
      const matchSearch = job.name.toLowerCase().includes(searchText.toLowerCase()) || job.id.toLowerCase().includes(searchText.toLowerCase());
      return matchStatus && matchSearch;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [jobs, searchText, statusFilter]);
  
  // --- Counts ---
  const allJobsCount = jobs.length;
  const urgentCount = jobs.filter(job => job.status === 'รออนุมัติ' || job.status === 'รอดำเนินการ').length;
  const inProgressCount = jobs.filter(job => job.status === 'กำลังทำ' || job.status === 'กำลังดำเนินการ').length;
  const completedCount = jobs.filter(job => job.status === 'เสร็จสิ้น' || job.status === 'ผ่านการตรวจสอบ').length;

  return (
    <div className="job-management-container">
      <h2>📋 จัดการรายการงานทั้งหมด</h2>
      <hr />

      {/* Status Cards (Header Filter) */}
      <div className="status-cards-row">
        <div className={`status-card ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>
          <FileText size={20} /><div><div className="card-label">งานทั้งหมด</div><div className="card-number">{allJobsCount}</div></div>
        </div>
        <div className={`status-card ${statusFilter === 'completed' ? 'active' : ''}`} onClick={() => setStatusFilter('completed')}>
          <CheckCircle size={20} /><div><div className="card-label">เสร็จสิ้น/ผ่านตรวจสอบ</div><div className="card-number">{completedCount}</div></div>
        </div>
        <div className={`status-card ${statusFilter === 'in-progress' ? 'active' : ''}`} onClick={() => setStatusFilter('in-progress')}>
          <CircleDot size={20} /><div><div className="card-label">กำลังดำเนินการ</div><div className="card-number">{inProgressCount}</div></div>
        </div>
        <div className={`status-card ${statusFilter === 'urgent' ? 'active' : ''}`} onClick={() => setStatusFilter('urgent')}>
          <Clock size={20} /><div><div className="card-label">รออนุมัติ/รอดำเนินการ</div><div className="card-number">{urgentCount}</div></div>
        </div>
      </div>

      {/* Search & Create Section */}
      <div className="search-filter-box">
        <button className="create-job-btn" onClick={handleCreateNewJob}>
          <PlusCircle size={18} /><span>สร้างใบงานใหม่</span>
        </button>
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="ค้นหารายการงาน, รหัสงาน, ชื่องาน..." value={searchText} onChange={(e) => setSearchText(e.target.value)} className="search-input" />
        </div>
      </div>


      {/* Job Cards */}
      <div className="job-list">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-info">
                <div className="job-header">
                  <span className="job-id">{job.id}</span>
                  <span className="job-name">{job.name}</span>
                </div>
                <div className="job-detail">ช่าง: {job.technician || 'ยังไม่มอบหมาย'}</div>
                <div className="job-detail">วันที่แจ้ง: {job.date}</div>
                <div className="job-detail">ตำแหน่ง: {job.location || 'ไม่ระบุ'}</div>
              </div>

              <div className={getStatusBadgeClass(job.status)}>{getStatusLabel(job.status)}</div>

              <div className="action-buttons">
                {(job.status === 'รออนุมัติ' || job.status === 'รอดำเนินการ') && (
                  <button className="assign-btn" onClick={() => openAssignModal(job)}>
                    <ClipboardList size={18} /><span>มอบหมายงาน</span>
                  </button>
                )}
                <button className="edit-btn"><Edit size={18} /><span>แก้ไข</span></button>
                <button className="delete-btn" onClick={() => handleDeleteJob(job.id)}><Trash2 size={18} /><span>ลบ</span></button>
              </div>
            </div>
          ))
        ) : (<div className="no-jobs-message"><h3>🎉 ไม่มีรายการงานที่ตรงกับเงื่อนไข</h3></div>)}
      </div>

      {/* ---------------- Modal Create Job ---------------- */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <X className="modal-close" onClick={() => setShowCreateModal(false)} size={24} />
            <div className="modal-header">📄 สร้างใบงานใหม่</div>
            <div className="modal-body-content">
              <h3>ข้อมูลงาน 🛠️</h3>
              <div className="form-row">
                <div className="form-group"><label>ชื่องาน <span className="required">*</span></label><input name="jobName" value={formData.jobName} onChange={onChangeForm} placeholder="ชื่อเรียกงานสั้นๆ" /></div>
                {/* ช่องรหัสงานเป็น Read-Only */}
                <div className="form-group"><label>รหัสงาน</label><input type="text" value={newJobId} readOnly disabled className="read-only-input" /></div>
              </div>
              <div className="form-row">
                {/* ช่องเลือกความสำคัญ */}
                <div className="form-group">
                    <label>ความสำคัญ</label>
                    <select name="priority" value={formData.priority} onChange={onChangeForm}>
                        {['ด่วนมาก', 'สูง', 'ปานกลาง', 'ต่ำ'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div className="form-group"><label>ประเภทงาน</label><select name="jobType" value={formData.jobType} onChange={onChangeForm}><option value="">เลือกประเภทงาน</option><option>ซ่อมบำรุง</option><option>ติดตั้ง</option></select></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>วันที่แจ้ง</label><input type="date" name="date" value={formData.date} onChange={onChangeForm} /></div>
                <div className="form-group"><label>สถานที่</label><input name="location" value={formData.location} onChange={onChangeForm} placeholder="อาคาร/ชั้น/ห้อง" /></div>
              </div>
              <div className="form-group full"><label>รายละเอียดงาน</label><textarea name="detail" value={formData.detail} onChange={onChangeForm} rows="3" placeholder="อธิบายปัญหาหรือรายละเอียดงานที่ต้องทำอย่างละเอียด"></textarea></div>
              <hr className="modal-divider" />
              <h3>ข้อมูลผู้ติดต่อ 👤</h3>
              <div className="form-row">
                <div className="form-group"><label>ชื่อผู้ติดต่อ</label><input name="customerName" value={formData.customerName} onChange={onChangeForm} /></div>
                <div className="form-group"><label>เบอร์โทร</label><input name="phone" value={formData.phone} onChange={onChangeForm} /></div>
                <div className="form-group"><label>อีเมล</label><input name="email" value={formData.email} onChange={onChangeForm} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowCreateModal(false)}>ยกเลิก</button>
              <button className="submit-btn" onClick={saveJob}>บันทึกงาน</button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Modal Assign Job ---------------- */}
      {showAssignModal && jobToAssign && (
        <div className="modal-backdrop">
          <div className="modal-container small-modal"> 
            <X className="modal-close" onClick={() => setShowAssignModal(false)} size={24} />
            <div className="modal-header">🧑‍🔧 มอบหมายงาน: {jobToAssign.name}</div>
            <p className="assign-job-title">เลือกช่างสำหรับ: {jobToAssign.name}</p>
            <div className="technician-list">
              {technicianList.map(tech => (
                <div key={tech.id} className="tech-card">
                  <div className={`tech-avatar ${tech.color}`}>{tech.id}</div>
                  <div className="tech-info"><div className="tech-name">{tech.name}</div><div className="tech-skills"><Wrench size={14} /> {tech.skills}</div></div>
                  <button className="assign-tech-btn" onClick={() => handleAssignJob(jobToAssign.id, tech.name)}><ClipboardList size={18} /> มอบหมายงาน</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobManagement;