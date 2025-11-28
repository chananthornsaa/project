import React, { useState, useMemo } from "react";
import {
  Search, Clock, FileText, CircleDot, CheckCircle,
  ClipboardList, Edit, Trash2, PlusCircle, X, Phone, Mail, Wrench, Filter, AlertTriangle,
  Zap, Droplet, Wind, Settings, Laptop
} from "lucide-react";
// FIX IMPORT: ต้องดึง sampleJobs ออกมาจาก Object
import mockData from "../../data/Techsample.jsx";
const { sampleJobs } = mockData;
import "./JobManagement.css";

// ----------------------------------------------------------------
// Data and Helper Functions
// ----------------------------------------------------------------
// ========================================
// รายการแผนกต่างๆ พร้อม React Icons
// - Zap: ไฟฟ้า (⚡)
// - Droplet: ประปา (💧)
// - Wrench: โครงสร้าง (🔧)
// - Laptop: IT/คอมพิวเตอร์ (💻)
// ========================================
const departmentList = [
  { id: 'ELEC', name: 'แผนกไฟฟ้า', description: 'ติดตั้งและซ่อมแซมระบบไฟฟ้า', icon: 'Zap', color: 'blue', staffCount: 5 },
  { id: 'PLUMB', name: 'แผนกประปา', description: 'ซ่อมแซมระบบประปาและสุขภัณฑ์', icon: 'Droplet', color: 'cyan', staffCount: 3 },
  { id: 'AC', name: 'แผนกโครงสร้าง', description: 'บำรุงรักษาและซ่อมแซมโครงสร้าง', icon: 'Wrench', color: 'sky', staffCount: 4 },
  { id: 'IT', name: 'แผนก IT', description: 'ซ่อมคอมพิวเตอร์และระบบเครือข่าย', icon: 'Laptop', color: 'purple', staffCount: 3 }
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
function JobManagement({ jobs = sampleJobs, setJobs, addActivity }) {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState('ทั้งหมด');
  const [filterPriority, setFilterPriority] = useState('ทั้งหมด');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [jobToAssign, setJobToAssign] = useState(null);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [newJobId, setNewJobId] = useState(''); // ID อัตโนมัติ

  const [formData, setFormData] = useState({
    jobName: "", priority: "ปานกลาง", jobType: "", date: "", location: "",
    customerName: "", phone: "", email: "", detail: "", note: "",
  });

  const onChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ========================================
  // ฟังก์ชันแสดง Icon ของแผนก
  // แปลงชื่อ icon จาก string เป็น React Component
  // ========================================
  const renderDepartmentIcon = (iconName) => {
    const iconProps = { size: 24 };
    switch(iconName) {
      case 'Zap': return <Zap {...iconProps} />;
      case 'Droplet': return <Droplet {...iconProps} />;
      case 'Wrench': return <Wrench {...iconProps} />;
      case 'Laptop': return <Laptop {...iconProps} />;
      default: return <span>{iconName}</span>;
    }
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
      technician: "ยังไม่มอบหมายแผนก",
      department: "ยังไม่มอบหมายแผนก",
      date: formData.date || new Date().toISOString().split("T")[0],
      location: formData.location || "ไม่ระบุ",
      status: "รอดำเนินการ",
      priority: formData.priority,
      jobType: formData.jobType || "ไม่ระบุ",
      detail: formData.detail || "",
      customerName: formData.customerName || "",
      phone: formData.phone || "",
      email: formData.email || "",
      note: formData.note || "",
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      creator: 'Admin'
    };

    if (setJobs) {
      setJobs(prevJobs => [newJob, ...prevJobs]);
    }
    setShowCreateModal(false);
  };

  const handleEditJob = (job) => {
    setJobToEdit(job);
    setFormData({
      jobName: job.name || "",
      priority: job.priority || "ปานกลาง",
      jobType: job.jobType || "",
      date: job.date || "",
      location: job.location || "",
      customerName: job.customerName || "",
      phone: job.phone || "",
      email: job.email || "",
      detail: job.detail || "",
      note: job.note || "",
    });
    setShowEditModal(true);
  };

  const saveEditJob = () => {
    if (!formData.jobName) {
      alert("กรุณากรอก ชื่องาน");
      return;
    }

    // เตือนถ้างานถูกมอบหมายไปแล้ว
    if (jobToEdit.department && jobToEdit.department !== 'ยังไม่มอบหมายแผนก') {
      const confirmEdit = window.confirm(
        `งานนี้ถูกส่งไปยังแผนก "${jobToEdit.department}" แล้ว\n` +
        `การแก้ไขจะส่งผลต่อข้อมูลที่แผนกและช่างเห็นอยู่\n\n` +
        `ต้องการดำเนินการต่อหรือไม่?`
      );
      if (!confirmEdit) return;
    }

    if (setJobs) {
      const updatedJobs = setJobs(prevJobs => prevJobs.map(job => {
        if (job.id === jobToEdit.id) {
          return {
            ...job,
            name: formData.jobName,
            priority: formData.priority,
            jobType: formData.jobType || "ไม่ระบุ",
            date: formData.date || job.date,
            location: formData.location || "ไม่ระบุ",
            customerName: formData.customerName || "",
            phone: formData.phone || "",
            email: formData.email || "",
            detail: formData.detail || "",
            note: formData.note || "",
            updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
          };
        }
        return job;
      }));

      // บังคับ sync ข้อมูลไปยัง localStorage ทันที
      const currentJobs = JSON.parse(localStorage.getItem('jobsData') || '[]');
      const syncedJobs = currentJobs.map(job => {
        if (job.id === jobToEdit.id) {
          return {
            ...job,
            name: formData.jobName,
            priority: formData.priority,
            jobType: formData.jobType || "ไม่ระบุ",
            date: formData.date || job.date,
            location: formData.location || "ไม่ระบุ",
            customerName: formData.customerName || "",
            phone: formData.phone || "",
            email: formData.email || "",
            detail: formData.detail || "",
            note: formData.note || "",
            updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
          };
        }
        return job;
      });
      localStorage.setItem('jobsData', JSON.stringify(syncedJobs));

      // Trigger storage event เพื่อให้ tab อื่นๆ อัพเดท
      window.dispatchEvent(new Event('storage'));
    }

    alert(`✅ แก้ไขงาน ${jobToEdit.id} เรียบร้อยแล้ว${jobToEdit.department !== 'ยังไม่มอบหมายแผนก' ? '\nข้อมูลได้ถูกส่งไปยังแผนกและช่างแล้ว' : ''}`);
    setShowEditModal(false);
    setJobToEdit(null);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ที่จะลบใบงานรหัส ${jobId}?`)) {
      if (setJobs) {
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      }
    }
  };

  const openAssignModal = (job) => { setJobToAssign(job); setShowAssignModal(true); };

  const handleAssignJob = (jobId, departmentName) => {
    console.log('🔍 handleAssignJob called:', { jobId, departmentName });
    const job = jobs.find(j => j.id === jobId);
    if (setJobs) {
      setJobs(prevJobs => {
        const updatedJobs = prevJobs.map(job => {
          if (job.id === jobId) {
            // ✅ ป้องกันการมอบหมายซ้ำถ้ามีบุคลากรแล้ว
            if (job.technician && job.technician !== 'ไม่มีช่าง' && job.technician !== 'ยังไม่มอบหมายแผนก') {
              console.log('⚠️ Job already has technician:', job.technician);
              return job; // ไม่เปลี่ยนแปลงอะไร
            }
            // ถ้ายังไม่มีบุคลากร ให้มอบหมายแผนกได้
            return { ...job, department: departmentName, technician: 'ไม่มีช่าง', status: 'รอดำเนินการ' };
          }
          return job;
        });
        console.log('✅ Updated jobs:', updatedJobs.find(j => j.id === jobId));
        return updatedJobs;
      });
    }
    // ========================================
    // บันทึกประวัติกิจกรรม: มอบหมายงานให้แผนก
    // เมื่อ Admin เลือกแผนกสำหรับงาน
    // - เปลี่ยนสถานะงานเป็น "รอดำเนินการ"
    // - กำหนดแผนก และรอหัวหน้าช่างมอบหมายช่าง
    // - บันทึกประวัติกิจกรรมพร้อมไอคอน ClipboardCheck (📋✓)
    // ========================================
    if (job && addActivity) {
      addActivity({
        type: 'assign_department',
        jobId: jobId,
        jobName: job.name,
        message: `Admin มอบหมายงาน ${jobId} ให้แผนก ${departmentName}`,
        department: departmentName,
        icon: 'ClipboardCheck' // ไอคอน: คลิปบอร์ดที่มีเครื่องหมายถูก
      });
    }
    setShowAssignModal(false);
    setJobToAssign(null);
  };

  // --- Helpers for UI ---
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "รอดำเนินการ": return "status-badge status-pending";
      case "กำลังดำเนินการ": return "status-badge status-in-progress";
      case "เสร็จสิ้น": case "ผ่านการตรวจสอบ": return "status-badge status-completed";
      case "รอตรวจสอบ": return "status-badge status-review";
      default: return "status-badge";
    }
  };

  const getStatusLabel = (status) => status;

  // ตัวเลือกแผนกแบบคงที่
  const departmentOptions = [
    'ทั้งหมด',
    'ยังไม่มอบหมาย',
    'แผนกไฟฟ้า',
    'แผนกประปา',
    'แผนกโครงสร้าง',
    'แผนก IT'
  ];

  // --- Filter Logic ---
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const status = job.status;
      const matchStatus = statusFilter === "all" ||
        (statusFilter === "urgent" && status === "รอดำเนินการ") ||
        (statusFilter === "in-progress" && (status === "กำลังทำ" || status === "กำลังดำเนินการ")) ||
        (statusFilter === "completed" && (status === "เสร็จสิ้น" || status === "ผ่านการตรวจสอบ")) ||
        (statusFilter === "review" && status === "รอตรวจสอบ");
      const matchSearch = job.name.toLowerCase().includes(searchText.toLowerCase()) || job.id.toLowerCase().includes(searchText.toLowerCase());
      const matchDept = filterDepartment === 'ทั้งหมด' || 
                        (filterDepartment === 'ยังไม่มอบหมาย' ? (!job.department || job.department === '') : job.department === filterDepartment);
      const matchPriority = filterPriority === 'ทั้งหมด' || job.priority === filterPriority;
      return matchStatus && matchSearch && matchDept && matchPriority;
    }).sort((a, b) => {
      // งานที่ยังไม่มอบหมายแผนก อยู่บนสุด
      const aUnassigned = !a.department || a.department === '';
      const bUnassigned = !b.department || b.department === '';
      if (aUnassigned && !bUnassigned) return -1;
      if (!aUnassigned && bUnassigned) return 1;
      // จัดเรียงตามวันที่
      return new Date(b.date) - new Date(a.date);
    });
  }, [jobs, searchText, statusFilter, filterDepartment, filterPriority]);

  // --- Counts ---
  const allJobsCount = jobs.length;
  const urgentCount = jobs.filter(job => job.status === 'รอดำเนินการ').length;
  const inProgressCount = jobs.filter(job => job.status === 'กำลังดำเนินการ').length;
  const completedCount = jobs.filter(job => job.status === 'เสร็จสิ้น' || job.status === 'ผ่านการตรวจสอบ').length;

  return (
    <div className="job-management-container">
      <h2>📋 จัดการรายการงานทั้งหมด</h2>
      <hr />

      {/* Status Cards (Display Only) */}
      <div className="status-cards-row">
        <div className="status-card-simple">
          <div className="card-label-simple">งานทั้งหมด</div>
          <div className="card-number-simple">{allJobsCount}</div>
        </div>
        <div className="status-card-simple">
          <div className="card-label-simple">รอดำเนินการ</div>
          <div className="card-number-simple blue">{urgentCount}</div>
        </div>
        <div className="status-card-simple">
          <div className="card-label-simple">กำลังดำเนินการ</div>
          <div className="card-number-simple orange">{inProgressCount}</div>
        </div>
        <div className="status-card-simple">
          <div className="card-label-simple">เสร็จสิ้น</div>
          <div className="card-number-simple green">{completedCount}</div>
        </div>
        <div className="status-card-simple highlight">
          <div className="card-label-simple">รอตรวจสอบ ⭐</div>
          <div className="card-number-simple yellow">{jobs.filter(j => j.status === 'รอตรวจสอบ').length}</div>
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
        <div className="filter-container">
          <Filter size={20} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filter-select">
            <option value="all">สถานะทั้งหมด</option>
            <option value="urgent">รอดำเนินการ</option>
            <option value="in-progress">กำลังดำเนินการ</option>
            <option value="completed">เสร็จสิ้น/ผ่านตรวจสอบ</option>
            <option value="review">รอตรวจสอบ</option>
          </select>
        </div>
        <div className="filter-container">
          <FileText size={20} />
          <select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)} className="filter-select">
            {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="filter-container">
          <AlertTriangle size={20} />
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="filter-select">
            <option>ทั้งหมด</option>
            <option>ด่วนมาก</option>
            <option>สูง</option>
            <option>ปานกลาง</option>
            <option>ต่ำ</option>
          </select>
        </div>
      </div>


      {/* Job Table */}
      <div className="table-container">
        <div className="table-header-controls">
          <h3 className="table-title">รายการงานทั้งหมด ({filteredJobs.length})</h3>
        </div>

        {filteredJobs.length > 0 ? (
          <table className="job-table">
            <thead>
              <tr>
                <th>รหัสงาน</th>
                <th>ชื่องาน</th>
                <th>แผนก</th>
                <th>สถานะ</th>
                <th>สถานที่</th>
                <th>วันที่</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td><strong>{job.id}</strong></td>
                  <td className="job-name">{job.name}</td>
                  <td>{job.department || 'ยังไม่มอบหมายแผนก'}</td>
                  <td>
                    <span className={getStatusBadgeClass(job.status)}>
                      {getStatusLabel(job.status)}
                    </span>
                  </td>
                  <td>{job.location || 'ไม่ระบุ'}</td>
                  <td>{job.date}</td>
                  <td>
                    <div className="job-actions-cell">
                      {(job.status === 'รอดำเนินการ' && 
                        (!job.department || job.department === 'ยังไม่มอบหมายแผนก') &&
                        (!job.technician || job.technician === 'ยังไม่มอบหมายแผนก' || job.technician === 'ไม่มีช่าง')) && (
                        <button className="assign-btn" onClick={() => openAssignModal(job)}>
                          <ClipboardList size={16} />มอบหมาย
                        </button>
                      )}
                      <button className="edit-btn" onClick={() => handleEditJob(job)}>
                        <Edit size={16} />แก้ไข
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteJob(job.id)}>
                        <Trash2 size={16} />ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-jobs-message">
            <h3>🎉 ไม่มีรายการงานที่ตรงกับเงื่อนไข</h3>
          </div>
        )}
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
                <div className="form-group">
                  <label>ประเภทงาน</label>
                  <select name="jobType" value={formData.jobType} onChange={onChangeForm}>
                    <option value="">เลือกประเภทงาน</option>
                    <option>ซ่อมบำรุง</option>
                    <option>ติดตั้ง</option>
                    <option>ตรวจสอบ</option>
                    <option>เปลี่ยนอะไหล่</option>
                    <option>อื่นๆ</option>
                  </select>
                </div>
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

      {/* ---------------- Modal Edit Job ---------------- */}
      {showEditModal && jobToEdit && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <X className="modal-close" onClick={() => setShowEditModal(false)} size={24} />
            <div className="modal-header">✏️ แก้ไขใบงาน {jobToEdit.id}</div>
            <div className="modal-body-content">
              <h3>ข้อมูลงาน 🛠️</h3>
              <div className="form-row">
                <div className="form-group"><label>ชื่องาน <span className="required">*</span></label><input name="jobName" value={formData.jobName} onChange={onChangeForm} placeholder="ชื่อเรียกงานสั้นๆ" /></div>
                <div className="form-group"><label>รหัสงาน</label><input type="text" value={jobToEdit.id} readOnly disabled className="read-only-input" /></div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ความสำคัญ</label>
                  <select name="priority" value={formData.priority} onChange={onChangeForm}>
                    {['ด่วนมาก', 'สูง', 'ปานกลาง', 'ต่ำ'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>ประเภทงาน</label>
                  <select name="jobType" value={formData.jobType} onChange={onChangeForm}>
                    <option value="">เลือกประเภทงาน</option>
                    <option>ซ่อมบำรุง</option>
                    <option>ติดตั้ง</option>
                    <option>ตรวจสอบ</option>
                    <option>เปลี่ยนอะไหล่</option>
                    <option>อื่นๆ</option>
                  </select>
                </div>
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
              <button className="cancel-btn" onClick={() => setShowEditModal(false)}>ยกเลิก</button>
              <button className="submit-btn" onClick={saveEditJob}>บันทึกการแก้ไข</button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Modal Assign Job ---------------- */}
      {showAssignModal && jobToAssign && (
        <div className="modal-backdrop">
          <div className="modal-container small-modal">
            <X className="modal-close" onClick={() => setShowAssignModal(false)} size={24} />
            <div className="modal-header">📋 มอบหมายงาน: {jobToAssign.name}</div>
            <p className="assign-job-title">เลือกแผนกสำหรับ: {jobToAssign.name}</p>
            <div className="department-list">
              {departmentList.map(dept => (
                <div key={dept.id} className="dept-card">
                  <div className={`dept-icon ${dept.color}`}>
                    {renderDepartmentIcon(dept.icon)}
                  </div>
                  <div className="dept-info">
                    <div className="dept-name">{dept.name}</div>
                    <div className="dept-description">{dept.description}</div>
                    <div className="dept-staff">👥 จำนวนเจ้าหน้าที่: {dept.staffCount} คน</div>
                  </div>
                  <button className="assign-dept-btn" onClick={() => handleAssignJob(jobToAssign.id, dept.name)}>
                    <ClipboardList size={18} /> มอบหมาย
                  </button>
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