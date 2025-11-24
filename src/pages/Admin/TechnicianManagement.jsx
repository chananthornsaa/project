import React, { useState } from 'react';
import { Phone, Mail, MapPin, Edit, Trash2, UserPlus, X } from 'lucide-react';

// ========================================
// ข้อมูลช่างตัวอย่าง
// ========================================
const initialTechnicians = [
  {
    id: 1,
    name: 'สมศักดิ์ ขยัน',
    initials: 'SM',
    color: '#10b981',
    phone: '0812345678',
    email: 'som@example.com',
    location: 'ไฟฟ้า, แอร์, ประปา (10 ปี)'
  },
  {
    id: 2,
    name: 'สมหญิง รักงาน',
    initials: 'YG',
    color: '#dc2626',
    phone: '0890001111',
    email: 'ying@example.com',
    location: 'เครื่องกล, โครงสร้าง (3 ปี)'
  },
  {
    id: 3,
    name: 'สมชาย ใจดี',
    initials: 'SY',
    color: '#f59e0b',
    phone: '0927778888',
    email: 'shy@example.com',
    location: 'ระบบเครือข่าย, IT (5 ปี)'
  }
];

// ========================================
// Main Component
// ========================================
function TechnicianManagement() {
  const [technicians, setTechnicians] = useState(initialTechnicians);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTech, setNewTech] = useState({
    name: '',
    email: '',
    phone: '',
    skill: '', 
    experience: '' // ปีของประสบการณ์
  });

  // จัดการการเปลี่ยนแปลงของฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTech(prev => ({ ...prev, [name]: value }));
  };

  // ฟังก์ชันสร้างช่างใหม่
  const handleAddTechnician = () => {
    if (!newTech.name || !newTech.email || !newTech.phone || !newTech.skill || !newTech.experience) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // สร้างข้อมูลช่างใหม่
    const newId = technicians.length > 0 ? Math.max(...technicians.map(t => t.id)) + 1 : 1;
    
    // สร้างตัวย่อจากชื่อ (แบบง่าย)
    const getInitials = (name) => {
      try {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      } catch {
        return name.substring(0, 2);
      }
    };

    const newTechnician = {
      id: newId,
      name: newTech.name,
      initials: getInitials(newTech.name),
      color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`, // Random color
      phone: newTech.phone,
      email: newTech.email,
      // รวมความถนัดและประสบการณ์ในช่อง Location (แทน)
      location: `${newTech.skill} (${newTech.experience} ปี)` 
    };

    setTechnicians([...technicians, newTechnician]);
    // รีเซ็ตฟอร์ม
    setNewTech({ name: '', email: '', phone: '', skill: '', experience: '' });
    setShowAddModal(false);
    alert(`เพิ่มช่าง ${newTechnician.name} สำเร็จ!`);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>👷 จัดการทีมช่าง</h2>
        
        {/* Add Button (ย้ายมาไว้ข้างบนเพื่อความโดดเด่น) */}  
        <button 
          style={{...styles.addButton, width: 'auto'}}
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus size={24} />
          <span>เพิ่มช่างใหม่</span>
        </button>
      </div>
      
      

      {/* Technician Cards */}
      <div style={styles.cardContainer}>
        {technicians.map((tech) => (
          <div key={tech.id} style={styles.card}>
            {/* Left: Avatar & Info */}
            <div style={styles.leftSection}>
              <div style={{...styles.avatar, backgroundColor: tech.color}}>
                {tech.initials}
              </div>
              
              <div style={styles.info}>
                <h3 style={styles.techName}>{tech.name}</h3>
                
                <div style={styles.contactRow}>
                  <Phone size={18} color="#6b7280" />
                  <span style={styles.contactText}>{tech.phone}</span>
                </div>
                
                <div style={styles.contactRow}>
                  <Mail size={18} color="#6b7280" />
                  <span style={styles.contactText}>{tech.email}</span>
                </div>
                
                <div style={styles.contactRow}>
                  <MapPin size={18} color="#6b7280" />
                  <span style={styles.contactText}>{tech.location}</span>
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div style={styles.actions}>
              <button style={styles.editBtn}>
                <Edit size={20} />
                <span>จัดการ</span>
              </button> 
    
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal (Full form with center display) */}
      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>👤 เพิ่มช่างเทคนิคใหม่</h3>
              <button style={styles.modalCloseBtn} onClick={() => setShowAddModal(false)}>
                <X size={24} color="#6b7280" />
              </button>
            </div>

            <div style={styles.formGrid}>
              {/* ชื่อ-นามสกุล */}
              <div style={styles.formGroup}>
                <label style={styles.label}>ชื่อ-นามสกุล:</label>
                <input 
                  type="text"
                  name="name"
                  value={newTech.name}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="เช่น สมศักดิ์ ขยัน"
                />
              </div>

              {/* อีเมล */}
              <div style={styles.formGroup}>
                <label style={styles.label}>อีเมล:</label>
                <input 
                  type="email"
                  name="email"
                  value={newTech.email}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="someone@example.com"
                />
              </div>

              {/* เบอร์โทรศัพท์ */}
              <div style={styles.formGroup}>
                <label style={styles.label}>เบอร์โทรศัพท์:</label>
                <input 
                  type="text"
                  name="phone"
                  value={newTech.phone}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="0XX-XXX-XXXX"
                />
              </div>

              {/* ความถนัด */}
              <div style={styles.formGroup}>
                <label style={styles.label}>ความถนัด/สายงานหลัก:</label>
                <input 
                  type="text"
                  name="skill"
                  value={newTech.skill}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="เช่น ไฟฟ้า, ประปา, ช่างแอร์"
                />
              </div>
              
              {/* ประสบการณ์ */}
              <div style={styles.formGroup}>
                <label style={styles.label}>ประสบการณ์ (ปี):</label>
                <input 
                  type="number"
                  name="experience"
                  value={newTech.experience}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="จำนวนปี"
                  min="0"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.modalActions}>
              <button 
                style={styles.cancelBtn}
                onClick={() => setShowAddModal(false)}
              >
                ยกเลิก
              </button>
              <button 
                style={styles.createBtn}
                onClick={handleAddTechnician}
              >
                <UserPlus size={20} />
                สร้างช่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================
// Styles (ปรับขนาดให้ใหญ่ขึ้น)
// ========================================
const styles = {
  container: {
    padding: '32px', // เพิ่ม Padding
    maxWidth: '1000px', // เพิ่ม Max Width
    margin: '0 auto',
    backgroundColor: '#f9fafb'
  },
  header: {
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '32px', // เพิ่มขนาดหัวข้อ
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px', // เพิ่มระยะห่างระหว่างการ์ด
    marginBottom: '32px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px', // เพิ่มความโค้ง
    padding: '28px', // เพิ่ม Padding ของการ์ด
    boxShadow: '0 4px 6px rgba(0,0,0,0.08)', // เพิ่มเงา
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px'
  },
  leftSection: {
    display: 'flex',
    gap: '24px', // เพิ่มระยะห่าง
    flex: 1
  },
  avatar: {
    width: '72px', // ใหญ่ขึ้น
    height: '72px', // ใหญ่ขึ้น
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '28px', // ใหญ่ขึ้น
    fontWeight: 'bold',
    flexShrink: 0
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px' // เพิ่มระยะห่าง
  },
  techName: {
    fontSize: '24px', // ใหญ่ขึ้น
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
    marginBottom: '8px'
  },
  contactRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px' // เพิ่มระยะห่าง
  },
  contactText: {
    fontSize: '16px', // ใหญ่ขึ้น
    color: '#4b5563'
  },
  actions: {
    display: 'flex',
    gap: '12px', // เพิ่มระยะห่าง
    flexShrink: 0
  },
  editBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px', // ใหญ่ขึ้น
    backgroundColor: '#fbbf24',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px', // ใหญ่ขึ้น
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    outline: 'none'
  },
  deleteBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px', // ใหญ่ขึ้น
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px', // ใหญ่ขึ้น
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    outline: 'none'
  },
  addButton: {
    // ถูกย้ายไปไว้ใน Header
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '12px 24px', // ใหญ่ขึ้น
    backgroundColor: '#f97316',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px', // ใหญ่ขึ้น
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  
  /* ========================================
     Modal Styles
    ======================================== */
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(3px)'
  },
  modal: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '16px',
    maxWidth: '600px', // ขยาย Modal
    width: '90%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '16px'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
    color: '#1f2937'
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    outline: 'none'
  },
  
  /* Form Specific Styles */
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    padding: '12px', // ใหญ่ขึ้น
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px', // ใหญ่ขึ้น
    transition: 'border-color 0.2s',
    outline: 'none'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb'
  },
  cancelBtn: {
    padding: '12px 24px',
    backgroundColor: '#e5e7eb',
    color: '#4b5563',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600'
  },
  createBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600'
  }
};

export default TechnicianManagement;